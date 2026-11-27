import 'dotenv/config';
import express, { type NextFunction, type Request, type Response } from 'express';
import crypto from 'crypto';
import fs from 'fs';
import os from 'os';
import path from 'path';

interface InstagramGraphTagNode {
  id?: string;
  caption?: string;
  media_type?: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  timestamp?: string;
  username?: string;
  like_count?: number;
  comments_count?: number;
}

export interface InstagramMentionItem {
  id: string;
  caption: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  mediaUrl: string;
  permalink: string;
  timestamp: string;
  username: string;
  likeCount?: number;
  commentsCount?: number;
}

interface InstagramMentionsPayload {
  configured: boolean;
  handle: string;
  fetchedAt: string;
  cached: boolean;
  posts: InstagramMentionItem[];
  error?: string;
}

export type AtelierOrderStatus =
  | 'queued'
  | 'molding'
  | 'batching'
  | 'curing'
  | 'packing'
  | 'shipped';

export type PaymentStatus = 'paid' | 'pending' | 'cod' | 'refunded';

export interface ServerAtelierOrderItem {
  cartKey: string;
  editionId: string;
  name: string;
  scentName: string;
  priceUsd: number;
  quantity: number;
  giftNote?: string;
  imageUrl?: string;
}

export interface ServerAtelierOrder {
  orderNumber: string;
  accountId?: string;
  customerUid?: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  gpsLabel?: string;
  engravingNote?: string;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  paidAtMs?: number;
  paymentReference?: string;
  trackingCode?: string;
  carrier?: string;
  items: ServerAtelierOrderItem[];
  subtotalThb: number;
  shippingThb: number;
  totalThb: number;
  status: AtelierOrderStatus;
  completedSteps: string[];
  createdAtMs: number;
  updatedAtMs: number;
}

const PORT = Number(process.env.PORT || 3000);
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const CACHE_TTL_MS = 5 * 60 * 1000;
const SESSION_TTL_MS = 4 * 60 * 60 * 1000;
const ORDERS_STORE_PATH = path.join(os.tmpdir(), 'gentlebubble_atelier_orders_v2.json');

// Ephemeral HMAC key if env var not supplied (never written to client or disk)
const SESSION_SIGNING_KEY =
  process.env.ATELIER_SESSION_SECRET?.trim() || crypto.randomBytes(32).toString('hex');

// Claimed fallback hash (only used when process.env.ATELIER_ADMIN_PIN is unset)
let claimedPinRecord: { saltHex: string; hashHex: string } | null = null;

// Sliding-window rate limiting on admin PIN attempts (max 8 attempts / 15 minutes per IP)
const pinAttemptsByIp = new Map<string, { count: number; resetAtMs: number }>();
const PIN_RATE_WINDOW_MS = 15 * 60 * 1000;
const PIN_MAX_ATTEMPTS = 8;

const ALLOWED_STATUSES: ReadonlyArray<AtelierOrderStatus> = [
  'queued',
  'molding',
  'batching',
  'curing',
  'packing',
  'shipped',
];
const ALLOWED_PAYMENT_STATUSES: ReadonlyArray<PaymentStatus> = [
  'paid',
  'pending',
  'cod',
  'refunded',
];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SAFE_ID_REGEX = /^[a-zA-Z0-9_-]{3,40}$/;

let cachedMentions: { expiresAt: number; payload: InstagramMentionsPayload } | null = null;

function getClientIp(req: Request): string {
  const cfIp = req.headers['cf-connecting-ip'];
  if (typeof cfIp === 'string' && cfIp.trim()) return cfIp.trim().slice(0, 64);
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim().slice(0, 64);
  }
  return (req.ip || req.socket?.remoteAddress || 'unknown').slice(0, 64);
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = pinAttemptsByIp.get(ip);
  if (!entry || now > entry.resetAtMs) {
    return false;
  }
  return entry.count >= PIN_MAX_ATTEMPTS;
}

function recordFailedPinAttempt(ip: string): void {
  const now = Date.now();
  const entry = pinAttemptsByIp.get(ip);
  if (!entry || now > entry.resetAtMs) {
    pinAttemptsByIp.set(ip, { count: 1, resetAtMs: now + PIN_RATE_WINDOW_MS });
  } else {
    entry.count += 1;
  }
}

function clearPinAttempts(ip: string): void {
  pinAttemptsByIp.delete(ip);
}

function getEnvAdminPin(): string {
  return (process.env.ATELIER_ADMIN_PIN || '').trim();
}

function getPinAuthMode(): 'env' | 'claimed' | 'needs_setup' {
  if (getEnvAdminPin()) return 'env';
  if (claimedPinRecord) return 'claimed';
  return 'needs_setup';
}

function hashPinWithSalt(pin: string, saltHex: string): Buffer {
  return crypto.scryptSync(pin.trim(), saltHex, 32);
}

function verifyCandidatePin(candidate: string): boolean {
  const clean = candidate.trim();
  if (!/^\d{4,12}$/.test(clean)) return false;

  const envPin = getEnvAdminPin();
  if (envPin) {
    // Env secret always takes precedence over any claimed fallback
    const ephemeralSalt = 'env-compare-salt';
    const digestCandidate = hashPinWithSalt(clean, ephemeralSalt);
    const digestExpected = hashPinWithSalt(envPin, ephemeralSalt);
    return crypto.timingSafeEqual(digestCandidate, digestExpected);
  }

  if (!claimedPinRecord) return false;
  const digestCandidate = hashPinWithSalt(clean, claimedPinRecord.saltHex);
  const digestExpected = Buffer.from(claimedPinRecord.hashHex, 'hex');
  if (digestCandidate.length !== digestExpected.length) return false;
  return crypto.timingSafeEqual(digestCandidate, digestExpected);
}

function issueAdminSessionToken(): { token: string; expiresAtMs: number } {
  const expiresAtMs = Date.now() + SESSION_TTL_MS;
  const payload = JSON.stringify({ role: 'atelier_admin', exp: expiresAtMs, jti: crypto.randomUUID() });
  const encodedPayload = Buffer.from(payload, 'utf8').toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SIGNING_KEY)
    .update(encodedPayload)
    .digest('base64url');
  return { token: `${encodedPayload}.${signature}`, expiresAtMs };
}

function verifyAdminBearerToken(authHeader: string | undefined): boolean {
  if (typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  const token = authHeader.slice(7).trim();
  const dotIdx = token.indexOf('.');
  if (dotIdx <= 0) return false;
  const encodedPayload = token.slice(0, dotIdx);
  const signature = token.slice(dotIdx + 1);
  if (!encodedPayload || !signature) return false;

  const expectedSig = crypto
    .createHmac('sha256', SESSION_SIGNING_KEY)
    .update(encodedPayload)
    .digest('base64url');

  const bufActual = Buffer.from(signature, 'utf8');
  const bufExpected = Buffer.from(expectedSig, 'utf8');
  if (bufActual.length !== bufExpected.length || !crypto.timingSafeEqual(bufActual, bufExpected)) {
    return false;
  }

  try {
    const decoded = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8')) as {
      role?: string;
      exp?: number;
    };
    return decoded.role === 'atelier_admin' && typeof decoded.exp === 'number' && Date.now() < decoded.exp;
  } catch {
    return false;
  }
}

function readServerOrders(): ServerAtelierOrder[] {
  try {
    if (!fs.existsSync(ORDERS_STORE_PATH)) return [];
    const raw = fs.readFileSync(ORDERS_STORE_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ServerAtelierOrder[]) : [];
  } catch {
    return [];
  }
}

function writeServerOrders(orders: ServerAtelierOrder[]): void {
  try {
    fs.writeFileSync(ORDERS_STORE_PATH, JSON.stringify(orders.slice(0, 120)), 'utf8');
  } catch {
    // Ignore ephemeral disk write constraints
  }
}

function isSafeHttpsUrl(value: unknown): value is string {
  return typeof value === 'string' && value.startsWith('https://');
}

function normalizeTagNode(node: InstagramGraphTagNode): InstagramMentionItem | null {
  const id = typeof node.id === 'string' ? node.id : '';
  const mediaCandidate =
    node.media_type === 'VIDEO' ? node.thumbnail_url || node.media_url : node.media_url;
  if (!id || !isSafeHttpsUrl(mediaCandidate) || !isSafeHttpsUrl(node.permalink)) {
    return null;
  }

  return {
    id,
    caption: typeof node.caption === 'string' ? node.caption.trim() : '',
    mediaType:
      node.media_type === 'VIDEO' || node.media_type === 'CAROUSEL_ALBUM'
        ? node.media_type
        : 'IMAGE',
    mediaUrl: mediaCandidate,
    permalink: node.permalink,
    timestamp: typeof node.timestamp === 'string' ? node.timestamp : new Date().toISOString(),
    username: typeof node.username === 'string' ? node.username.replace(/^@/, '') : 'collector',
    likeCount: typeof node.like_count === 'number' ? node.like_count : undefined,
    commentsCount: typeof node.comments_count === 'number' ? node.comments_count : undefined,
  };
}

async function fetchInstagramTaggedMentions(forceRefresh: boolean): Promise<InstagramMentionsPayload> {
  const handle = process.env.INSTAGRAM_BRAND_HANDLE?.trim() || '@gentlebubble.ar';
  const accessToken = process.env.INSTAGRAM_GRAPH_ACCESS_TOKEN?.trim();
  const businessAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID?.trim();

  if (!accessToken || !businessAccountId) {
    return {
      configured: false,
      handle,
      fetchedAt: new Date().toISOString(),
      cached: false,
      posts: [],
    };
  }

  if (!forceRefresh && cachedMentions && Date.now() < cachedMentions.expiresAt) {
    return {
      ...cachedMentions.payload,
      cached: true,
    };
  }

  const fields = [
    'id',
    'caption',
    'media_type',
    'media_url',
    'thumbnail_url',
    'permalink',
    'timestamp',
    'username',
    'like_count',
    'comments_count',
  ].join(',');

  const endpoint = new URL(
    `https://graph.facebook.com/v22.0/${encodeURIComponent(businessAccountId)}/tags`,
  );
  endpoint.searchParams.set('fields', fields);
  endpoint.searchParams.set('limit', '6');
  endpoint.searchParams.set('access_token', accessToken);

  const response = await fetch(endpoint.toString(), {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new Error(
      `Instagram Graph API returned ${response.status}${errorBody ? `: ${errorBody.slice(0, 180)}` : ''}`,
    );
  }

  const json = (await response.json()) as { data?: InstagramGraphTagNode[] };
  const posts = Array.isArray(json.data)
    ? json.data
        .map(normalizeTagNode)
        .filter((item): item is InstagramMentionItem => item !== null)
        .slice(0, 6)
    : [];

  const payload: InstagramMentionsPayload = {
    configured: true,
    handle,
    fetchedAt: new Date().toISOString(),
    cached: false,
    posts,
  };

  cachedMentions = {
    expiresAt: Date.now() + CACHE_TTL_MS,
    payload,
  };

  return payload;
}

function clampFiniteInt(value: unknown, min: number, max: number, fallback: number): number {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.max(min, Math.min(max, Math.round(num)));
}

async function createAppServer() {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '512kb' }));

  // Baseline security headers (avoid X-Frame-Options to preserve iframe compatibility)
  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)');
    next();
  });

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ ok: true });
  });

  // Return whether admin PIN is pre-configured, claimed, or awaits first-run claim
  app.get('/api/admin/status', (_req: Request, res: Response) => {
    const mode = getPinAuthMode();
    res.json({
      configured: mode !== 'needs_setup',
      mode,
    });
  });

  // First-run atomic setup for preview environments without ATELIER_ADMIN_PIN configured
  app.post('/api/admin/setup-pin', (req: Request, res: Response) => {
    const clientIp = getClientIp(req);
    if (isRateLimited(clientIp)) {
      res.status(429).json({ ok: false, error: 'Too many PIN attempts. Please try again later.' });
      return;
    }

    if (getPinAuthMode() !== 'needs_setup') {
      res.status(409).json({ ok: false, error: 'Atelier PIN is already configured.' });
      return;
    }

    const pin = typeof req.body?.pin === 'string' ? req.body.pin.trim() : '';
    if (!/^\d{4,12}$/.test(pin)) {
      recordFailedPinAttempt(clientIp);
      res.status(400).json({ ok: false, error: 'PIN must be 4 to 12 numeric digits.' });
      return;
    }

    const saltHex = crypto.randomBytes(16).toString('hex');
    const hashHex = hashPinWithSalt(pin, saltHex).toString('hex');
    claimedPinRecord = { saltHex, hashHex };
    clearPinAttempts(clientIp);

    const session = issueAdminSessionToken();
    res.status(201).json({ ok: true, token: session.token, expiresAtMs: session.expiresAtMs });
  });

  // Verify Atelier Admin PIN code on server and issue short-lived Bearer session token
  app.post('/api/admin/verify-pin', (req: Request, res: Response) => {
    const clientIp = getClientIp(req);
    if (isRateLimited(clientIp)) {
      res.status(429).json({ ok: false, error: 'Too many PIN attempts. Please try again shortly.' });
      return;
    }

    if (getPinAuthMode() === 'needs_setup') {
      res.status(428).json({ ok: false, needsSetup: true, error: 'Initial Atelier PIN setup required.' });
      return;
    }

    const pin = typeof req.body?.pin === 'string' ? req.body.pin : '';
    if (!pin || !verifyCandidatePin(pin)) {
      recordFailedPinAttempt(clientIp);
      res.status(401).json({ ok: false, error: 'Invalid atelier PIN code.' });
      return;
    }

    clearPinAttempts(clientIp);
    const session = issueAdminSessionToken();
    res.json({ ok: true, token: session.token, expiresAtMs: session.expiresAtMs });
  });

  // Persist customer order into server atelier queue with validated payment & tracking baseline
  app.post('/api/orders', (req: Request, res: Response) => {
    const body = req.body as Partial<ServerAtelierOrder> | undefined;
    if (
      !body ||
      typeof body.orderNumber !== 'string' ||
      !SAFE_ID_REGEX.test(body.orderNumber.trim()) ||
      !Array.isArray(body.items) ||
      body.items.length === 0 ||
      body.items.length > 30
    ) {
      res.status(400).json({ ok: false, error: 'Invalid order payload.' });
      return;
    }

    const rawEmail = typeof body.customerEmail === 'string' ? body.customerEmail.trim().toLowerCase() : '';
    if (!EMAIL_REGEX.test(rawEmail) || rawEmail.length > 160) {
      res.status(400).json({ ok: false, error: 'Valid customer email is required.' });
      return;
    }

    const sanitizedItems: ServerAtelierOrderItem[] = [];
    for (const rawItem of body.items.slice(0, 30)) {
      if (!rawItem || typeof rawItem !== 'object') {
        res.status(400).json({ ok: false, error: 'Invalid order item entry.' });
        return;
      }
      sanitizedItems.push({
        cartKey: String(rawItem.cartKey || '').slice(0, 180),
        editionId: String(rawItem.editionId || '').slice(0, 128),
        name: String(rawItem.name || '').slice(0, 160),
        scentName: String(rawItem.scentName || '').slice(0, 200),
        priceUsd: clampFiniteInt(rawItem.priceUsd, 0, 500000, 0),
        quantity: clampFiniteInt(rawItem.quantity, 1, 99, 1),
        ...(typeof rawItem.giftNote === 'string' && rawItem.giftNote.trim()
          ? { giftNote: rawItem.giftNote.trim().slice(0, 80) }
          : {}),
        ...(typeof rawItem.imageUrl === 'string' && rawItem.imageUrl.length <= 500
          ? { imageUrl: rawItem.imageUrl }
          : {}),
      });
    }

    const now = Date.now();
    const orderNumber = body.orderNumber.trim().slice(0, 32);
    const paymentMethod = String(body.paymentMethod || 'Card (Stripe)').slice(0, 64);
    const requestedPayStatus = body.paymentStatus;
    const safePayStatus: PaymentStatus =
      requestedPayStatus && ALLOWED_PAYMENT_STATUSES.includes(requestedPayStatus) && requestedPayStatus !== 'refunded'
        ? requestedPayStatus
        : paymentMethod === 'PromptPay QR'
          ? 'pending'
          : 'paid';

    const safeOrder: ServerAtelierOrder = {
      orderNumber,
      ...(typeof body.accountId === 'string' && SAFE_ID_REGEX.test(body.accountId.trim())
        ? { accountId: body.accountId.trim().slice(0, 128) }
        : {}),
      ...(typeof body.customerUid === 'string' && /^[a-zA-Z0-9_-]{3,128}$/.test(body.customerUid.trim())
        ? { customerUid: body.customerUid.trim().slice(0, 128) }
        : {}),
      customerName: String(body.customerName || 'Maison Guest').trim().slice(0, 120) || 'Maison Guest',
      customerEmail: rawEmail,
      shippingAddress: String(body.shippingAddress || 'Atelier Collection Pickup').trim().slice(0, 300),
      ...(typeof body.gpsLabel === 'string' && body.gpsLabel.trim()
        ? { gpsLabel: body.gpsLabel.trim().slice(0, 64) }
        : {}),
      ...(typeof body.engravingNote === 'string' && body.engravingNote.trim()
        ? { engravingNote: body.engravingNote.trim().slice(0, 80) }
        : {}),
      paymentMethod,
      paymentStatus: safePayStatus,
      ...(safePayStatus === 'paid' ? { paidAtMs: now } : {}),
      ...(typeof body.paymentReference === 'string' && body.paymentReference.trim()
        ? { paymentReference: body.paymentReference.trim().slice(0, 80) }
        : { paymentReference: `REF-${orderNumber}-${String(now).slice(-4)}` }),
      items: sanitizedItems,
      subtotalThb: clampFiniteInt(body.subtotalThb, 0, 2000000, 0),
      shippingThb: clampFiniteInt(body.shippingThb, 0, 50000, 0),
      totalThb: clampFiniteInt(body.totalThb, 0, 2050000, 0),
      status: 'queued',
      completedSteps: [],
      createdAtMs: now,
      updatedAtMs: now,
    };

    const existing = readServerOrders().filter((o) => o.orderNumber !== safeOrder.orderNumber);
    writeServerOrders([safeOrder, ...existing]);
    res.status(201).json({ ok: true, order: safeOrder });
  });

  // Preview parity for Cloudflare Worker /api/auth/sync (verifies Firebase Bearer JWT shape & issuer/aud + returns matching orders)
  app.post('/api/auth/sync', async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ ok: false, error: 'Authorization Bearer token required.' });
      return;
    }
    const token = authHeader.slice(7).trim();
    const parts = token.split('.');
    if (parts.length !== 3) {
      res.status(401).json({ ok: false, error: 'Malformed token.' });
      return;
    }

    try {
      const payloadJson = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8')) as {
        aud?: string;
        iss?: string;
        sub?: string;
        exp?: number;
        email?: string;
        email_verified?: boolean;
        name?: string;
      };
      const expectedProject = (process.env.FIREBASE_PROJECT_ID || 'gentlebubblebyar').trim();
      const nowSec = Math.floor(Date.now() / 1000);
      if (
        payloadJson.aud !== expectedProject ||
        payloadJson.iss !== `https://securetoken.google.com/${expectedProject}` ||
        typeof payloadJson.sub !== 'string' ||
        typeof payloadJson.exp !== 'number' ||
        payloadJson.exp <= nowSec
      ) {
        res.status(401).json({ ok: false, error: 'Token claims do not match project.' });
        return;
      }

      const email =
        typeof payloadJson.email === 'string' && EMAIL_REGEX.test(payloadJson.email)
          ? payloadJson.email.trim().toLowerCase()
          : `${payloadJson.sub}@collector.gentlebubblebyar.com`;

      const matchingOrders = readServerOrders().filter(
        (o) =>
          o.customerEmail.toLowerCase() === email ||
          (o.customerUid && o.customerUid === payloadJson.sub),
      );

      res.json({
        ok: true,
        collector: {
          accountId: `acct_${email.split('@')[0].replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 18)}`,
          email,
          displayName: (payloadJson.name || email.split('@')[0]).slice(0, 120),
          linkedGoogleUid: payloadJson.sub,
          emailVerified: Boolean(payloadJson.email_verified),
          lastActiveAtMs: Date.now(),
        },
        orders: matchingOrders,
        history: [],
      });
    } catch {
      res.status(401).json({ ok: false, error: 'Invalid token.' });
    }
  });

  app.post('/api/collector/history', (_req: Request, res: Response) => {
    res.json({ ok: true });
  });

  app.post('/api/ai/concierge', (req: Request, res: Response) => {
    const topic = typeof req.body?.topic === 'string' ? req.body.topic.trim().slice(0, 80) : '';
    const notes: Record<string, string> = {
      soaps: 'Pair Alphonso Saffron Vit-C (GB-C) with Abyssal Dead Sea Kelp & Valrhona Noir (GB-M) for balanced clarity.',
      'bath-bombs': 'Follow Garnet Fragaria BHA (GB-S) prep with a mineral wine-kelp soak and marble coffret resting.',
      'fruit-duos': 'Combine Bright Alphonso Mango, Dark Strawberry BHA, and Dead Sea Seaweed Gelée across your daily ritual.',
      'category-2': 'Explore archive botanical bars alongside Nocturne Sargassum Dark Choco (GB-SM) evening rituals.',
    };
    res.json({
      ok: true,
      source: 'atelier-concierge',
      note:
        notes[topic] ||
        'Alphonso Saffron Vit-C (GB-C) paired with Abyssal Dead Sea Mud & Kelp Dark Choco (GB-M).',
    });
  });

  // Safe customer tracking lookup requiring matching orderNumber + customerEmail
  app.get('/api/orders/:orderNumber/tracking', (req: Request, res: Response) => {
    const orderNumber = String(req.params.orderNumber || '').trim();
    const emailQuery = String(req.query.email || '').trim().toLowerCase();
    if (!SAFE_ID_REGEX.test(orderNumber) || !EMAIL_REGEX.test(emailQuery)) {
      res.status(400).json({ ok: false, error: 'Order number and matching email are required.' });
      return;
    }

    const match = readServerOrders().find(
      (o) => o.orderNumber === orderNumber && o.customerEmail.toLowerCase() === emailQuery,
    );
    if (!match) {
      res.status(404).json({ ok: false, error: 'Order tracking record not found.' });
      return;
    }

    res.json({
      ok: true,
      tracking: {
        orderNumber: match.orderNumber,
        status: match.status,
        paymentStatus: match.paymentStatus,
        paidAtMs: match.paidAtMs,
        paymentReference: match.paymentReference,
        trackingCode: match.trackingCode,
        carrier: match.carrier,
        updatedAtMs: match.updatedAtMs,
      },
    });
  });

  // List queued customer orders for Bearer-authenticated Atelier Admin
  app.get('/api/admin/orders', (req: Request, res: Response) => {
    if (!verifyAdminBearerToken(req.headers.authorization)) {
      res.status(401).json({ ok: false, error: 'Unauthorized' });
      return;
    }
    res.json({ ok: true, orders: readServerOrders() });
  });

  // Update order production stage, paid state, and tracking details for authenticated Atelier Admin
  app.patch('/api/admin/orders/:orderNumber', (req: Request, res: Response) => {
    if (!verifyAdminBearerToken(req.headers.authorization)) {
      res.status(401).json({ ok: false, error: 'Unauthorized' });
      return;
    }

    const orderNumber = String(req.params.orderNumber || '').trim();
    if (!SAFE_ID_REGEX.test(orderNumber)) {
      res.status(400).json({ ok: false, error: 'Invalid order number.' });
      return;
    }

    const orders = readServerOrders();
    const targetIdx = orders.findIndex((o) => o.orderNumber === orderNumber);
    if (targetIdx === -1) {
      res.status(404).json({ ok: false, error: 'Order not found' });
      return;
    }

    const current = orders[targetIdx];
    const nextStatus = ALLOWED_STATUSES.includes(req.body?.status)
      ? (req.body.status as AtelierOrderStatus)
      : current.status;
    const nextSteps = Array.isArray(req.body?.completedSteps)
      ? req.body.completedSteps.filter((s: unknown): s is string => typeof s === 'string').slice(0, 200)
      : current.completedSteps;
    const nextPaymentStatus = ALLOWED_PAYMENT_STATUSES.includes(req.body?.paymentStatus)
      ? (req.body.paymentStatus as PaymentStatus)
      : current.paymentStatus;
    const nextPaidAtMs =
      nextPaymentStatus === 'paid'
        ? typeof req.body?.paidAtMs === 'number' && Number.isFinite(req.body.paidAtMs)
          ? req.body.paidAtMs
          : current.paidAtMs || Date.now()
        : nextPaymentStatus === 'pending' || nextPaymentStatus === 'cod'
          ? undefined
          : current.paidAtMs;

    const rawTracking =
      typeof req.body?.trackingCode === 'string' ? req.body.trackingCode.trim().slice(0, 48) : undefined;
    const rawCarrier =
      typeof req.body?.carrier === 'string' ? req.body.carrier.trim().slice(0, 64) : undefined;
    const rawPayRef =
      typeof req.body?.paymentReference === 'string'
        ? req.body.paymentReference.trim().slice(0, 80)
        : undefined;

    const updated: ServerAtelierOrder = {
      ...current,
      status: nextStatus,
      completedSteps: nextSteps,
      paymentStatus: nextPaymentStatus,
      ...(nextPaidAtMs ? { paidAtMs: nextPaidAtMs } : { paidAtMs: undefined }),
      ...(rawTracking !== undefined
        ? rawTracking
          ? { trackingCode: rawTracking }
          : { trackingCode: undefined }
        : {}),
      ...(rawCarrier !== undefined
        ? rawCarrier
          ? { carrier: rawCarrier }
          : { carrier: undefined }
        : {}),
      ...(rawPayRef !== undefined
        ? rawPayRef
          ? { paymentReference: rawPayRef }
          : {}
        : {}),
      updatedAtMs: Date.now(),
    };
    orders[targetIdx] = updated;
    writeServerOrders(orders);
    res.json({ ok: true, order: updated });
  });

  app.get('/api/instagram/mentions', async (req: Request, res: Response) => {
    const forceRefresh = req.query.refresh === '1' || req.query.refresh === 'true';
    try {
      const payload = await fetchInstagramTaggedMentions(forceRefresh);
      res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=240');
      res.json(payload);
    } catch (err) {
      const handle = process.env.INSTAGRAM_BRAND_HANDLE?.trim() || '@gentlebubble.ar';
      const message = err instanceof Error ? err.message : 'Unable to fetch Instagram mentions';
      res.status(502).json({
        configured: true,
        handle,
        fetchedAt: new Date().toISOString(),
        cached: false,
        posts: [],
        error: message,
      });
    }
  });

  if (!IS_PRODUCTION) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(import.meta.dirname, 'dist');
    app.use(express.static(distDir, { maxAge: '1y', index: false }));
    app.get('*', (_req: Request, res: Response) => {
      const indexFile = path.join(distDir, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Application build not found.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GentleBubble atelier server running on http://0.0.0.0:${PORT}`);
  });
}

void createAppServer();

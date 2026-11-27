/**
 * Cloudflare Worker entry point for Gentle Bubble Atelier (gentlebubblebyar.com).
 *
 * Production capabilities & safeguards:
 * - Enforces HTTPS & canonical apex domain routing (www / .run.app -> gentlebubblebyar.com 301).
 * - Serves Edge-optimized dynamic /sitemap.xml & /robots.txt + immutable caching on /assets/*.
 * - Verifies Firebase Auth (Google Login) RS256 ID tokens via cached Google JWKS WebCrypto
 *   and synchronizes collector profiles, browsing history, paid status, and order tracking
 *   into Cloudflare D1 (parameterized prepared queries).
 * - Exposes bounded Workers AI concierge pairing recommendations via [ai] binding.
 * - Verifies Admin PIN exclusively via Worker secret ATELIER_ADMIN_PIN and short-lived HMAC tokens.
 */

export interface AssetsBinding {
  fetch(input: Request | string, init?: RequestInit): Promise<Response>;
}

export interface ExecutionContextLike {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

export interface D1PreparedStatementLike {
  bind(...values: Array<string | number | null>): D1PreparedStatementLike;
  first<T = Record<string, unknown>>(colName?: string): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<{ results: T[] }>;
  run(): Promise<{ success: boolean }>;
}

export interface D1DatabaseLike {
  prepare(query: string): D1PreparedStatementLike;
}

export interface WorkersAiBindingLike {
  run(
    model: string,
    input: { messages: Array<{ role: 'system' | 'user'; content: string }>; max_tokens?: number },
  ): Promise<{ response?: string }>;
}

export interface WorkerEnv {
  ASSETS?: AssetsBinding;
  DB?: D1DatabaseLike;
  AI?: WorkersAiBindingLike;
  PRIMARY_DOMAIN?: string;
  FIREBASE_PROJECT_ID?: string;
  ALLOWED_ORIGINS?: string;
  ORIGIN_HOST?: string;
  ATELIER_ADMIN_PIN?: string;
  ATELIER_SESSION_SECRET?: string;
  INSTAGRAM_BRAND_HANDLE?: string;
  INSTAGRAM_GRAPH_ACCESS_TOKEN?: string;
  INSTAGRAM_BUSINESS_ACCOUNT_ID?: string;
}

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

interface MentionsPayload {
  configured: boolean;
  handle: string;
  fetchedAt: string;
  cached: boolean;
  posts: Array<{
    id: string;
    caption: string;
    mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
    mediaUrl: string;
    permalink: string;
    timestamp: string;
    username: string;
    likeCount?: number;
    commentsCount?: number;
  }>;
}

interface VerifiedFirebaseIdentity {
  uid: string;
  email: string;
  displayName: string;
  emailVerified: boolean;
}

const DEFAULT_PRIMARY_DOMAIN = 'gentlebubblebyar.com';
const DEFAULT_FIREBASE_PROJECT_ID = 'gentlebubblebyar';
const DEFAULT_ALLOWED_ORIGINS = [
  'https://gentlebubblebyar.com',
  'https://www.gentlebubblebyar.com',
  'https://soap.bzcscjsktd.workers.dev',
];
const MENTIONS_CACHE_TTL_MS = 5 * 60 * 1000;
const SESSION_TTL_MS = 4 * 60 * 60 * 1000;
const JWKS_CACHE_TTL_MS = 60 * 60 * 1000;
const SAFE_ID_REGEX = /^[a-zA-Z0-9_-]{3,64}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GOOGLE_JWKS_URL =
  'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';

let cachedMentions: { expiresAt: number; payload: MentionsPayload } | null = null;
let cachedJwks: { expiresAt: number; keys: JsonWebKey[] } | null = null;
const workerPinAttempts = new Map<string, { count: number; resetAtMs: number }>();

function getWorkerEphemeralSigningSecret(env: WorkerEnv): string {
  if (typeof env.ATELIER_SESSION_SECRET === 'string' && env.ATELIER_SESSION_SECRET.trim()) {
    return env.ATELIER_SESSION_SECRET.trim();
  }
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

let cachedWorkerSigningKey: string | null = null;
function resolveSigningSecret(env: WorkerEnv): string {
  if (typeof env.ATELIER_SESSION_SECRET === 'string' && env.ATELIER_SESSION_SECRET.trim()) {
    return env.ATELIER_SESSION_SECRET.trim();
  }
  if (!cachedWorkerSigningKey) {
    cachedWorkerSigningKey = getWorkerEphemeralSigningSecret(env);
  }
  return cachedWorkerSigningKey;
}

function getPrimaryDomain(env: WorkerEnv): string {
  const configured = typeof env.PRIMARY_DOMAIN === 'string' ? env.PRIMARY_DOMAIN.trim() : '';
  return configured || DEFAULT_PRIMARY_DOMAIN;
}

function getFirebaseProjectId(env: WorkerEnv): string {
  const configured =
    typeof env.FIREBASE_PROJECT_ID === 'string' ? env.FIREBASE_PROJECT_ID.trim() : '';
  return configured || DEFAULT_FIREBASE_PROJECT_ID;
}

function getOriginHost(env: WorkerEnv): string {
  const raw = typeof env.ORIGIN_HOST === 'string' ? env.ORIGIN_HOST.trim() : '';
  if (!raw || raw.includes('PASTE-YOUR') || raw.includes('example.com')) {
    return '';
  }
  return raw.replace(/^https?:\/\//i, '').replace(/\/+$/, '');
}

function getAllowedOrigins(env: WorkerEnv, primaryDomain: string): Set<string> {
  const allowed = new Set<string>(DEFAULT_ALLOWED_ORIGINS);
  allowed.add(`https://${primaryDomain}`);
  allowed.add(`https://www.${primaryDomain}`);

  if (typeof env.ALLOWED_ORIGINS === 'string' && env.ALLOWED_ORIGINS.trim()) {
    for (const entry of env.ALLOWED_ORIGINS.split(',')) {
      const origin = entry.trim();
      if (origin.startsWith('https://')) {
        allowed.add(origin);
      }
    }
  }
  return allowed;
}

function isRunAppHost(hostname: string): boolean {
  const lower = hostname.toLowerCase();
  return lower === 'run.app' || lower.endsWith('.run.app');
}

function applyCorsHeaders(
  headers: Headers,
  requestOrigin: string | null,
  allowedOrigins: Set<string>,
): void {
  headers.delete('Access-Control-Allow-Origin');
  headers.delete('Access-Control-Allow-Credentials');
  headers.delete('Access-Control-Allow-Methods');
  headers.delete('Access-Control-Allow-Headers');
  headers.delete('Access-Control-Max-Age');

  const existingVary = headers.get('Vary') || '';
  const varyTokens = existingVary
    .toLowerCase()
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
  if (!varyTokens.includes('origin')) {
    headers.append('Vary', 'Origin');
  }

  if (requestOrigin && allowedOrigins.has(requestOrigin)) {
    headers.set('Access-Control-Allow-Origin', requestOrigin);
    headers.set('Access-Control-Allow-Credentials', 'true');
    headers.set('Access-Control-Allow-Methods', 'GET, HEAD, POST, PATCH, DELETE, OPTIONS');
    headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-Requested-With',
    );
    headers.set('Access-Control-Max-Age', '86400');
  }
}

function stripUpstreamLeakageAndHardenSecurity(headers: Headers): void {
  headers.delete('x-powered-by');
  headers.delete('x-cloud-trace-context');
  headers.delete('server');
  headers.delete('via');

  if (!headers.has('X-Content-Type-Options')) {
    headers.set('X-Content-Type-Options', 'nosniff');
  }
  if (!headers.has('Referrer-Policy')) {
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  }
  if (!headers.has('Permissions-Policy')) {
    headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)');
  }
  if (!headers.has('Strict-Transport-Security')) {
    headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
}

function rewriteLocationHeader(
  responseHeaders: Headers,
  upstreamUrl: URL,
  originHost: string,
  primaryDomain: string,
): void {
  const rawLocation = responseHeaders.get('Location');
  if (!rawLocation) return;

  try {
    const parsed = new URL(rawLocation, upstreamUrl);
    if (
      (originHost && parsed.hostname.toLowerCase() === originHost.toLowerCase()) ||
      parsed.hostname.toLowerCase() === `www.${primaryDomain}`.toLowerCase() ||
      isRunAppHost(parsed.hostname)
    ) {
      parsed.protocol = 'https:';
      parsed.hostname = primaryDomain;
      parsed.port = '';
      responseHeaders.set('Location', parsed.toString());
    }
  } catch {
    // Leave non-URL custom schemes untouched
  }
}

function hardenSetCookieHeaders(
  sourceHeaders: Headers,
  targetHeaders: Headers,
  originHost: string,
  primaryDomain: string,
): void {
  const reader = sourceHeaders as Headers & { getSetCookie?: () => string[] };
  const rawCookies: string[] =
    typeof reader.getSetCookie === 'function'
      ? reader.getSetCookie()
      : sourceHeaders.get('Set-Cookie')
        ? [sourceHeaders.get('Set-Cookie') as string]
        : [];

  if (rawCookies.length === 0) return;
  targetHeaders.delete('Set-Cookie');

  for (const rawCookie of rawCookies) {
    const segments = rawCookie.split(';').map((seg) => seg.trim());
    if (segments.length === 0 || !segments[0]) continue;

    let hasSecure = false;
    let hasSameSite = false;
    const rewrittenSegments = [segments[0]];

    for (let i = 1; i < segments.length; i++) {
      const attr = segments[i];
      if (!attr) continue;
      const lower = attr.toLowerCase();

      if (lower.startsWith('domain=')) {
        const domainValue = attr.slice(7).trim().replace(/^\./, '').toLowerCase();
        if (
          (originHost && domainValue === originHost.toLowerCase()) ||
          domainValue === `www.${primaryDomain}`.toLowerCase() ||
          domainValue === primaryDomain.toLowerCase() ||
          isRunAppHost(domainValue)
        ) {
          rewrittenSegments.push(`Domain=${primaryDomain}`);
        }
        continue;
      }

      if (lower === 'secure') {
        hasSecure = true;
        rewrittenSegments.push('Secure');
        continue;
      }

      if (lower.startsWith('samesite=')) {
        hasSameSite = true;
        rewrittenSegments.push(attr);
        continue;
      }

      rewrittenSegments.push(attr);
    }

    if (!hasSecure) rewrittenSegments.push('Secure');
    if (!hasSameSite) rewrittenSegments.push('SameSite=Lax');

    targetHeaders.append('Set-Cookie', rewrittenSegments.join('; '));
  }
}

function deriveD1AccountId(email: string): string {
  const norm = email.trim().toLowerCase();
  let h1 = 2166136261;
  for (let i = 0; i < norm.length; i += 1) {
    h1 ^= norm.charCodeAt(i);
    h1 = Math.imul(h1, 16777619);
  }
  const slug = norm
    .split('@')[0]
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .slice(0, 18);
  return `acct_${slug || 'collector'}_${(h1 >>> 0).toString(36)}`.slice(0, 64);
}

function base64UrlToUint8Array(input: string): Uint8Array {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/');
  const padLen = (4 - (padded.length % 4)) % 4;
  const bin = atob(padded + '='.repeat(padLen));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    bytes[i] = bin.charCodeAt(i);
  }
  return bytes;
}

function decodeBase64UrlJson<T>(segment: string): T | null {
  try {
    const bytes = base64UrlToUint8Array(segment);
    return JSON.parse(new TextDecoder().decode(bytes)) as T;
  } catch {
    return null;
  }
}

async function fetchGoogleJwks(): Promise<Array<JsonWebKey & { kid?: string }>> {
  if (cachedJwks && Date.now() < cachedJwks.expiresAt) {
    return cachedJwks.keys as Array<JsonWebKey & { kid?: string }>;
  }
  const resp = await fetch(GOOGLE_JWKS_URL, { headers: { Accept: 'application/json' } });
  if (!resp.ok) {
    throw new Error('Unable to load Google public verification keys.');
  }
  const json = (await resp.json()) as { keys?: Array<JsonWebKey & { kid?: string }> };
  const keys = Array.isArray(json.keys) ? json.keys : [];
  cachedJwks = { expiresAt: Date.now() + JWKS_CACHE_TTL_MS, keys };
  return keys;
}

async function verifyFirebaseIdToken(
  authHeader: string | null,
  env: WorkerEnv,
): Promise<VerifiedFirebaseIdentity | null> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7).trim();
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [headerB64, payloadB64, sigB64] = parts;
  const header = decodeBase64UrlJson<{ alg?: string; kid?: string }>(headerB64);
  const payload = decodeBase64UrlJson<{
    iss?: string;
    aud?: string;
    sub?: string;
    exp?: number;
    iat?: number;
    email?: string;
    email_verified?: boolean;
    name?: string;
  }>(payloadB64);

  if (!header || !payload || header.alg !== 'RS256' || !header.kid) {
    return null;
  }

  const projectId = getFirebaseProjectId(env);
  const nowSec = Math.floor(Date.now() / 1000);
  if (
    payload.aud !== projectId ||
    payload.iss !== `https://securetoken.google.com/${projectId}` ||
    typeof payload.sub !== 'string' ||
    !payload.sub ||
    typeof payload.exp !== 'number' ||
    payload.exp <= nowSec
  ) {
    return null;
  }

  try {
    const keys = await fetchGoogleJwks();
    const matchingKey = keys.find((k) => k.kid === header.kid);
    if (!matchingKey) return null;

    const cryptoKey = await crypto.subtle.importKey(
      'jwk',
      matchingKey,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['verify'],
    );

    const signedData = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
    const signatureBytes = base64UrlToUint8Array(sigB64);
    const verified = await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      cryptoKey,
      new Uint8Array(signatureBytes).buffer as ArrayBuffer,
      new Uint8Array(signedData).buffer as ArrayBuffer,
    );
    if (!verified) return null;

    const cleanEmail =
      typeof payload.email === 'string' && EMAIL_REGEX.test(payload.email)
        ? payload.email.trim().toLowerCase()
        : `${payload.sub}@collector.gentlebubblebyar.com`;

    return {
      uid: payload.sub.slice(0, 128),
      email: cleanEmail.slice(0, 160),
      displayName: (payload.name || cleanEmail.split('@')[0] || 'Maison Collector').slice(0, 120),
      emailVerified: Boolean(payload.email_verified),
    };
  } catch {
    return null;
  }
}

async function constantTimePinMatch(candidate: string, expected: string): Promise<boolean> {
  if (!expected || !/^\d{4,12}$/.test(candidate.trim())) return false;
  const enc = new TextEncoder();
  const [hashA, hashB] = await Promise.all([
    crypto.subtle.digest('SHA-256', enc.encode(candidate.trim())),
    crypto.subtle.digest('SHA-256', enc.encode(expected.trim())),
  ]);
  const bytesA = new Uint8Array(hashA);
  const bytesB = new Uint8Array(hashB);
  let diff = 0;
  for (let i = 0; i < bytesA.length; i++) {
    diff |= bytesA[i] ^ bytesB[i];
  }
  return diff === 0;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

async function signWorkerHmac(payloadB64: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payloadB64));
  return toBase64Url(new Uint8Array(sig));
}

async function issueWorkerAdminToken(env: WorkerEnv): Promise<{ token: string; expiresAtMs: number }> {
  const expiresAtMs = Date.now() + SESSION_TTL_MS;
  const payloadJson = JSON.stringify({ role: 'atelier_admin', exp: expiresAtMs });
  const payloadB64 = toBase64Url(new TextEncoder().encode(payloadJson));
  const sigB64 = await signWorkerHmac(payloadB64, resolveSigningSecret(env));
  return { token: `${payloadB64}.${sigB64}`, expiresAtMs };
}

async function verifyWorkerAdminBearer(
  authHeader: string | null,
  env: WorkerEnv,
): Promise<boolean> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  const token = authHeader.slice(7).trim();
  const dot = token.indexOf('.');
  if (dot <= 0) return false;
  const payloadB64 = token.slice(0, dot);
  const sigB64 = token.slice(dot + 1);
  const expectedSig = await signWorkerHmac(payloadB64, resolveSigningSecret(env));

  if (sigB64.length !== expectedSig.length) return false;
  let diff = 0;
  for (let i = 0; i < sigB64.length; i++) {
    diff |= sigB64.charCodeAt(i) ^ expectedSig.charCodeAt(i);
  }
  if (diff !== 0) return false;

  try {
    const padded = payloadB64.replace(/-/g, '+').replace(/_/g, '/');
    const json = JSON.parse(atob(padded)) as { role?: string; exp?: number };
    return json.role === 'atelier_admin' && typeof json.exp === 'number' && Date.now() < json.exp;
  } catch {
    return false;
  }
}

function jsonResponse(
  data: unknown,
  status: number,
  requestOrigin: string | null,
  allowedOrigins: Set<string>,
  extraHeaders: Record<string, string> = {},
): Response {
  const headers = new Headers({
    'Content-Type': 'application/json; charset=utf-8',
    ...extraHeaders,
  });
  applyCorsHeaders(headers, requestOrigin, allowedOrigins);
  stripUpstreamLeakageAndHardenSecurity(headers);
  return new Response(JSON.stringify(data), { status, headers });
}

function isSafeHttpsUrl(value: unknown): value is string {
  return typeof value === 'string' && value.startsWith('https://');
}

function buildEdgeSitemapXml(primaryDomain: string): string {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    { loc: `https://${primaryDomain}/`, priority: '1.0', freq: 'weekly' },
    { loc: `https://${primaryDomain}/?category=soaps`, priority: '0.9', freq: 'weekly' },
    { loc: `https://${primaryDomain}/?category=bath-bombs`, priority: '0.9', freq: 'weekly' },
    { loc: `https://${primaryDomain}/?category=fruit-duos`, priority: '0.95', freq: 'weekly' },
    { loc: `https://${primaryDomain}/?category=category-2`, priority: '0.85', freq: 'weekly' },
    { loc: `https://${primaryDomain}/?category=medieval`, priority: '0.75', freq: 'monthly' },
    { loc: `https://${primaryDomain}/?category=renaissance`, priority: '0.75', freq: 'monthly' },
    { loc: `https://${primaryDomain}/?category=baroque`, priority: '0.75', freq: 'monthly' },
    { loc: `https://${primaryDomain}/?category=romanticism`, priority: '0.75', freq: 'monthly' },
    { loc: `https://${primaryDomain}/?category=enlightenment`, priority: '0.75', freq: 'monthly' },
  ];

  const items = urls
    .map(
      (u) =>
        `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${u.freq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>\n`;
}

async function fetchInstagramTaggedMentions(
  env: WorkerEnv,
  forceRefresh: boolean,
): Promise<MentionsPayload> {
  const handle =
    typeof env.INSTAGRAM_BRAND_HANDLE === 'string' && env.INSTAGRAM_BRAND_HANDLE.trim()
      ? env.INSTAGRAM_BRAND_HANDLE.trim()
      : '@gentlebubble.ar';
  const accessToken =
    typeof env.INSTAGRAM_GRAPH_ACCESS_TOKEN === 'string'
      ? env.INSTAGRAM_GRAPH_ACCESS_TOKEN.trim()
      : '';
  const businessAccountId =
    typeof env.INSTAGRAM_BUSINESS_ACCOUNT_ID === 'string'
      ? env.INSTAGRAM_BUSINESS_ACCOUNT_ID.trim()
      : '';

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
        .map((node): MentionsPayload['posts'][number] | null => {
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
            username:
              typeof node.username === 'string' ? node.username.replace(/^@/, '') : 'collector',
            likeCount: typeof node.like_count === 'number' ? node.like_count : undefined,
            commentsCount: typeof node.comments_count === 'number' ? node.comments_count : undefined,
          };
        })
        .filter((item): item is MentionsPayload['posts'][number] => item !== null)
        .slice(0, 6)
    : [];

  const payload: MentionsPayload = {
    configured: true,
    handle,
    fetchedAt: new Date().toISOString(),
    cached: false,
    posts,
  };

  cachedMentions = {
    expiresAt: Date.now() + MENTIONS_CACHE_TTL_MS,
    payload,
  };

  return payload;
}

async function proxyToOrigin(
  request: Request,
  originHost: string,
  primaryDomain: string,
  requestOrigin: string | null,
  allowedOrigins: Set<string>,
): Promise<Response> {
  const upstreamUrl = new URL(request.url);
  upstreamUrl.protocol = 'https:';
  upstreamUrl.hostname = originHost;
  upstreamUrl.port = '';

  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete('host');
  requestHeaders.set('X-Forwarded-Host', primaryDomain);
  requestHeaders.set('X-Forwarded-Proto', 'https');
  const clientIp = request.headers.get('CF-Connecting-IP');
  if (clientIp) {
    requestHeaders.set('X-Real-IP', clientIp);
  }

  const hasBody = request.method !== 'GET' && request.method !== 'HEAD';
  const upstreamResponse = await fetch(upstreamUrl.toString(), {
    method: request.method,
    headers: requestHeaders,
    body: hasBody ? request.body : undefined,
    redirect: 'manual',
  });

  const responseHeaders = new Headers(upstreamResponse.headers);
  rewriteLocationHeader(responseHeaders, upstreamUrl, originHost, primaryDomain);
  hardenSetCookieHeaders(upstreamResponse.headers, responseHeaders, originHost, primaryDomain);
  applyCorsHeaders(responseHeaders, requestOrigin, allowedOrigins);
  stripUpstreamLeakageAndHardenSecurity(responseHeaders);

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: responseHeaders,
  });
}

function mapD1OrderRow(row: Record<string, unknown>) {
  let items: unknown[] = [];
  let completedSteps: string[] = [];
  try {
    items = JSON.parse(String(row.items_json || '[]')) as unknown[];
  } catch {
    items = [];
  }
  try {
    completedSteps = JSON.parse(String(row.completed_steps_json || '[]')) as string[];
  } catch {
    completedSteps = [];
  }

  return {
    orderNumber: String(row.order_number || ''),
    accountId: row.account_id ? String(row.account_id) : undefined,
    customerUid: row.firebase_uid ? String(row.firebase_uid) : undefined,
    customerName: String(row.customer_name || 'Maison Collector'),
    customerEmail: String(row.customer_email || ''),
    shippingAddress: String(row.shipping_address || ''),
    gpsLabel: row.gps_label ? String(row.gps_label) : undefined,
    engravingNote: row.engraving_note ? String(row.engraving_note) : undefined,
    paymentMethod: String(row.payment_method || 'Credit Card'),
    paymentStatus: String(row.payment_status || 'paid'),
    paidAtMs: typeof row.paid_at_ms === 'number' ? row.paid_at_ms : undefined,
    paymentReference: row.payment_reference ? String(row.payment_reference) : undefined,
    trackingCode: row.tracking_code ? String(row.tracking_code) : undefined,
    carrier: row.carrier ? String(row.carrier) : undefined,
    status: String(row.status || 'queued'),
    completedSteps,
    items,
    subtotalThb: Number(row.subtotal_thb || 0),
    shippingThb: Number(row.shipping_thb || 0),
    totalThb: Number(row.total_thb || 0),
    createdAtMs: Number(row.created_at_ms || Date.now()),
    updatedAtMs: Number(row.updated_at_ms || Date.now()),
    source: 'cloudflare-d1',
  };
}

export default {
  async fetch(
    request: Request,
    env: WorkerEnv = {},
    _ctx?: ExecutionContextLike,
  ): Promise<Response> {
    const url = new URL(request.url);
    const primaryDomain = getPrimaryDomain(env);
    const originHost = getOriginHost(env);
    const requestOrigin = request.headers.get('Origin');
    const allowedOrigins = getAllowedOrigins(env, primaryDomain);

    // 1. Canonical HTTPS & apex enforcement
    if (
      url.hostname.toLowerCase() === `www.${primaryDomain}`.toLowerCase() ||
      (url.hostname.toLowerCase() === primaryDomain.toLowerCase() && url.protocol === 'http:') ||
      isRunAppHost(url.hostname)
    ) {
      const canonical = new URL(request.url);
      canonical.protocol = 'https:';
      canonical.hostname = primaryDomain;
      canonical.port = '';
      return Response.redirect(canonical.toString(), 301);
    }

    // 2. Dynamic Cloudflare SEO Sitemap & Robots edge routes
    if (url.pathname === '/sitemap.xml' && request.method === 'GET') {
      const headers = new Headers({
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      });
      stripUpstreamLeakageAndHardenSecurity(headers);
      return new Response(buildEdgeSitemapXml(primaryDomain), { status: 200, headers });
    }

    if (url.pathname === '/robots.txt' && request.method === 'GET') {
      const headers = new Headers({
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      });
      stripUpstreamLeakageAndHardenSecurity(headers);
      return new Response(
        `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: https://${primaryDomain}/sitemap.xml\n`,
        { status: 200, headers },
      );
    }

    // 3. Strict CORS preflight handling for /api/* routes
    if (request.method === 'OPTIONS' && url.pathname.startsWith('/api/')) {
      const preflightHeaders = new Headers();
      applyCorsHeaders(preflightHeaders, requestOrigin, allowedOrigins);
      stripUpstreamLeakageAndHardenSecurity(preflightHeaders);
      return new Response(null, { status: 204, headers: preflightHeaders });
    }

    // 4. Optional reverse-proxy mode when ORIGIN_HOST is configured
    if (originHost && !url.pathname.startsWith('/api/auth/')) {
      return proxyToOrigin(request, originHost, primaryDomain, requestOrigin, allowedOrigins);
    }

    const configuredAdminPin =
      typeof env.ATELIER_ADMIN_PIN === 'string' ? env.ATELIER_ADMIN_PIN.trim() : '';

    // 5. Native Cloudflare Edge API + D1 + Google Auth Bridge + Workers AI
    if (url.pathname === '/api/health' && request.method === 'GET') {
      return jsonResponse(
        {
          ok: true,
          runtime: 'cloudflare-worker',
          domain: primaryDomain,
          d1Bound: Boolean(env.DB),
          aiBound: Boolean(env.AI),
        },
        200,
        requestOrigin,
        allowedOrigins,
      );
    }

    // Firebase / Google Sign-In Sync into Cloudflare D1 Schema
    if (url.pathname === '/api/auth/sync' && request.method === 'POST') {
      const identity = await verifyFirebaseIdToken(request.headers.get('Authorization'), env);
      if (!identity) {
        return jsonResponse(
          { ok: false, error: 'Valid Firebase Google ID token is required.' },
          401,
          requestOrigin,
          allowedOrigins,
        );
      }

      const now = Date.now();
      const accountId = deriveD1AccountId(identity.email);
      let orders: ReturnType<typeof mapD1OrderRow>[] = [];
      let history: Array<Record<string, unknown>> = [];

      if (env.DB) {
        await env.DB.prepare(
          `INSERT INTO collectors (
            account_id, firebase_uid, email, display_name, auth_provider, email_verified, created_at_ms, last_active_at_ms
          ) VALUES (?, ?, ?, ?, 'google', ?, ?, ?)
          ON CONFLICT(email) DO UPDATE SET
            firebase_uid = COALESCE(excluded.firebase_uid, collectors.firebase_uid),
            display_name = COALESCE(excluded.display_name, collectors.display_name),
            email_verified = MAX(collectors.email_verified, excluded.email_verified),
            last_active_at_ms = excluded.last_active_at_ms`,
        )
          .bind(
            accountId,
            identity.uid,
            identity.email,
            identity.displayName,
            identity.emailVerified ? 1 : 0,
            now,
            now,
          )
          .run();

        const orderRes = await env.DB.prepare(
          `SELECT * FROM atelier_orders
           WHERE firebase_uid = ? OR customer_email = ? OR account_id = ?
           ORDER BY created_at_ms DESC LIMIT 25`,
        )
          .bind(identity.uid, identity.email, accountId)
          .all<Record<string, unknown>>();
        orders = (orderRes.results || []).map(mapD1OrderRow);

        const histRes = await env.DB.prepare(
          `SELECT entry_id, item_id, item_type, title, subtitle, image_url, price_thb, viewed_at_ms
           FROM collector_history
           WHERE account_id = ?
           ORDER BY viewed_at_ms DESC LIMIT 24`,
        )
          .bind(accountId)
          .all<Record<string, unknown>>();

        history = (histRes.results || []).map((r) => ({
          entryId: String(r.entry_id || ''),
          itemId: String(r.item_id || ''),
          itemType: String(r.item_type || 'soap'),
          title: String(r.title || ''),
          subtitle: r.subtitle ? String(r.subtitle) : undefined,
          imageUrl: r.image_url ? String(r.image_url) : undefined,
          priceThb: typeof r.price_thb === 'number' ? r.price_thb : undefined,
          viewedAtMs: Number(r.viewed_at_ms || now),
        }));
      }

      return jsonResponse(
        {
          ok: true,
          collector: {
            accountId,
            email: identity.email,
            displayName: identity.displayName,
            linkedGoogleUid: identity.uid,
            emailVerified: identity.emailVerified,
            lastActiveAtMs: now,
          },
          orders,
          history,
        },
        200,
        requestOrigin,
        allowedOrigins,
      );
    }

    if (url.pathname === '/api/collector/history' && request.method === 'POST') {
      const identity = await verifyFirebaseIdToken(request.headers.get('Authorization'), env);
      if (!identity) {
        return jsonResponse({ ok: false, error: 'Unauthorized' }, 401, requestOrigin, allowedOrigins);
      }

      const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
      if (!body || typeof body.itemId !== 'string' || typeof body.title !== 'string') {
        return jsonResponse(
          { ok: false, error: 'Invalid history payload.' },
          400,
          requestOrigin,
          allowedOrigins,
        );
      }

      const accountId = deriveD1AccountId(identity.email);
      const itemType =
        body.itemType === 'bath-bomb' || body.itemType === 'marble-case' || body.itemType === 'order'
          ? body.itemType
          : 'soap';
      const itemId = body.itemId.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 120);
      const entryId = `${itemType}_${itemId}`.slice(0, 120);
      const now = Date.now();

      if (env.DB) {
        await env.DB.prepare(
          `INSERT INTO collector_history (
            account_id, entry_id, item_id, item_type, title, subtitle, image_url, price_thb, viewed_at_ms
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(account_id, entry_id) DO UPDATE SET
            title = excluded.title,
            subtitle = excluded.subtitle,
            price_thb = excluded.price_thb,
            viewed_at_ms = excluded.viewed_at_ms`,
        )
          .bind(
            accountId,
            entryId,
            itemId,
            itemType,
            String(body.title).slice(0, 155),
            body.subtitle ? String(body.subtitle).slice(0, 195) : null,
            body.imageUrl ? String(body.imageUrl).slice(0, 490) : null,
            typeof body.priceThb === 'number' && Number.isFinite(body.priceThb)
              ? Math.round(body.priceThb)
              : null,
            now,
          )
          .run();
      }

      return jsonResponse({ ok: true }, 200, requestOrigin, allowedOrigins);
    }

    if (url.pathname === '/api/ai/concierge' && request.method === 'POST') {
      const body = (await request.json().catch(() => null)) as { topic?: unknown } | null;
      const rawTopic = typeof body?.topic === 'string' ? body.topic.trim().slice(0, 80) : 'brightening botanical';

      if (env.AI) {
        try {
          const result = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
            messages: [
              {
                role: 'system',
                content:
                  'You are the concise fragrance concierge for GentleBubble by AR. Reply in 1 short luxury sentence pairing Alphonso Saffron Vit-C (GB-C), Garnet Strawberry Salicylic (GB-S), or Abyssal Dead Sea Mud & Kelp Dark Choco (GB-M).',
              },
              { role: 'user', content: `Recommend a pairing note for tab mood: ${rawTopic}` },
            ],
            max_tokens: 72,
          });
          if (result?.response) {
            return jsonResponse(
              { ok: true, source: 'cloudflare-ai', note: result.response.trim() },
              200,
              requestOrigin,
              allowedOrigins,
            );
          }
        } catch {
          // Fallback gracefully below
        }
      }

      return jsonResponse(
        {
          ok: true,
          source: 'catalog-fallback',
          note: 'Pair Alphonso Saffron Vit-C (GB-C) by morning with Abyssal Dead Sea Kelp & Valrhona Noir (GB-M) for evening renewal.',
        },
        200,
        requestOrigin,
        allowedOrigins,
      );
    }

    if (url.pathname === '/api/admin/status' && request.method === 'GET') {
      return jsonResponse(
        {
          configured: Boolean(configuredAdminPin),
          mode: configuredAdminPin ? 'env' : 'unconfigured',
        },
        200,
        requestOrigin,
        allowedOrigins,
      );
    }

    if (url.pathname === '/api/admin/verify-pin' && request.method === 'POST') {
      const clientIp = request.headers.get('CF-Connecting-IP') || 'edge';
      const now = Date.now();
      const rec = workerPinAttempts.get(clientIp);
      if (rec && now < rec.resetAtMs && rec.count >= 8) {
        return jsonResponse(
          { ok: false, error: 'Too many PIN attempts. Please try again later.' },
          429,
          requestOrigin,
          allowedOrigins,
        );
      }

      if (!configuredAdminPin) {
        return jsonResponse(
          { ok: false, error: 'Atelier PIN access is currently unavailable.' },
          503,
          requestOrigin,
          allowedOrigins,
        );
      }

      const body = (await request.json().catch(() => ({}))) as { pin?: unknown };
      const pin = typeof body?.pin === 'string' ? body.pin : '';
      const valid = Boolean(pin) && (await constantTimePinMatch(pin, configuredAdminPin));
      if (!valid) {
        if (!rec || now >= rec.resetAtMs) {
          workerPinAttempts.set(clientIp, { count: 1, resetAtMs: now + 15 * 60 * 1000 });
        } else {
          rec.count += 1;
        }
        return jsonResponse(
          { ok: false, error: 'Invalid atelier PIN code.' },
          401,
          requestOrigin,
          allowedOrigins,
        );
      }

      workerPinAttempts.delete(clientIp);
      const session = await issueWorkerAdminToken(env);
      return jsonResponse(
        { ok: true, token: session.token, expiresAtMs: session.expiresAtMs },
        200,
        requestOrigin,
        allowedOrigins,
      );
    }

    if (url.pathname === '/api/orders' && request.method === 'POST') {
      const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
      if (
        !body ||
        typeof body.orderNumber !== 'string' ||
        !SAFE_ID_REGEX.test(body.orderNumber.trim()) ||
        !Array.isArray(body.items) ||
        body.items.length === 0 ||
        body.items.length > 30
      ) {
        return jsonResponse(
          { ok: false, error: 'Invalid order payload.' },
          400,
          requestOrigin,
          allowedOrigins,
        );
      }

      const rawEmail =
        typeof body.customerEmail === 'string' ? body.customerEmail.trim().toLowerCase() : '';
      if (!EMAIL_REGEX.test(rawEmail) || rawEmail.length > 160) {
        return jsonResponse(
          { ok: false, error: 'Valid customer email is required.' },
          400,
          requestOrigin,
          allowedOrigins,
        );
      }

      const orderNumber = body.orderNumber.trim().slice(0, 32);
      const accountId = deriveD1AccountId(rawEmail);
      const now = Date.now();
      const paymentMethod = String(body.paymentMethod || 'Credit Card').slice(0, 64);
      const paymentStatus =
        body.paymentStatus === 'pending' || body.paymentStatus === 'cod' || body.paymentStatus === 'paid'
          ? body.paymentStatus
          : paymentMethod === 'PromptPay QR'
            ? 'pending'
            : 'paid';

      if (env.DB) {
        const customerName = String(body.customerName || 'Maison Collector').trim().slice(0, 120);
        const shippingAddress = String(body.shippingAddress || 'Atelier Collection Pickup')
          .trim()
          .slice(0, 300);

        await env.DB.prepare(
          `INSERT INTO collectors (account_id, firebase_uid, email, display_name, default_address, gps_label, created_at_ms, last_active_at_ms)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(email) DO UPDATE SET
             default_address = COALESCE(excluded.default_address, collectors.default_address),
             last_active_at_ms = excluded.last_active_at_ms`,
        )
          .bind(
            accountId,
            typeof body.customerUid === 'string' ? body.customerUid.slice(0, 128) : null,
            rawEmail,
            customerName,
            shippingAddress,
            typeof body.gpsLabel === 'string' ? body.gpsLabel.slice(0, 64) : null,
            now,
            now,
          )
          .run();

        await env.DB.prepare(
          `INSERT OR REPLACE INTO atelier_orders (
            order_number, account_id, firebase_uid, customer_name, customer_email, shipping_address,
            gps_label, engraving_note, payment_method, payment_status, paid_at_ms, payment_reference,
            carrier, status, completed_steps_json, items_json, subtotal_thb, shipping_thb, total_thb,
            created_at_ms, updated_at_ms
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'queued', '[]', ?, ?, ?, ?, ?, ?)`,
        )
          .bind(
            orderNumber,
            accountId,
            typeof body.customerUid === 'string' ? body.customerUid.slice(0, 128) : null,
            customerName,
            rawEmail,
            shippingAddress,
            typeof body.gpsLabel === 'string' ? body.gpsLabel.slice(0, 64) : null,
            typeof body.engravingNote === 'string' ? body.engravingNote.slice(0, 80) : null,
            paymentMethod,
            paymentStatus,
            paymentStatus === 'paid' ? now : null,
            typeof body.paymentReference === 'string'
              ? body.paymentReference.slice(0, 80)
              : `REF-${orderNumber}-${String(now).slice(-4)}`,
            'GentleBubble White-Glove Express',
            JSON.stringify(body.items.slice(0, 30)),
            Math.max(0, Math.round(Number(body.subtotalThb || 0))),
            Math.max(0, Math.round(Number(body.shippingThb || 0))),
            Math.max(0, Math.round(Number(body.totalThb || 0))),
            now,
            now,
          )
          .run();
      }

      return jsonResponse(
        {
          ok: true,
          order: {
            orderNumber,
            accountId,
            paymentStatus,
            status: 'queued',
            updatedAtMs: now,
          },
        },
        201,
        requestOrigin,
        allowedOrigins,
      );
    }

    const trackingMatch = url.pathname.match(/^\/api\/orders\/([a-zA-Z0-9_-]{3,40})\/tracking$/);
    if (trackingMatch && request.method === 'GET') {
      const orderNumber = trackingMatch[1];
      const emailQuery = (url.searchParams.get('email') || '').trim().toLowerCase();
      if (!EMAIL_REGEX.test(emailQuery)) {
        return jsonResponse(
          { ok: false, error: 'Matching customer email is required.' },
          400,
          requestOrigin,
          allowedOrigins,
        );
      }

      if (env.DB) {
        const row = await env.DB.prepare(
          `SELECT * FROM atelier_orders WHERE order_number = ? AND customer_email = ? LIMIT 1`,
        )
          .bind(orderNumber, emailQuery)
          .first<Record<string, unknown>>();

        if (row) {
          return jsonResponse(
            {
              ok: true,
              tracking: {
                orderNumber: String(row.order_number),
                status: String(row.status || 'queued'),
                paymentStatus: String(row.payment_status || 'paid'),
                paidAtMs: typeof row.paid_at_ms === 'number' ? row.paid_at_ms : undefined,
                paymentReference: row.payment_reference ? String(row.payment_reference) : undefined,
                trackingCode: row.tracking_code ? String(row.tracking_code) : undefined,
                carrier: row.carrier ? String(row.carrier) : undefined,
                updatedAtMs: Number(row.updated_at_ms || Date.now()),
              },
            },
            200,
            requestOrigin,
            allowedOrigins,
          );
        }
      }

      return jsonResponse(
        { ok: false, error: 'Order tracking record not found.' },
        404,
        requestOrigin,
        allowedOrigins,
      );
    }

    if (url.pathname === '/api/admin/orders' && request.method === 'GET') {
      const valid = await verifyWorkerAdminBearer(request.headers.get('Authorization'), env);
      if (!valid) {
        return jsonResponse({ ok: false, error: 'Unauthorized' }, 401, requestOrigin, allowedOrigins);
      }
      if (env.DB) {
        const rows = await env.DB.prepare(
          `SELECT * FROM atelier_orders ORDER BY created_at_ms DESC LIMIT 50`,
        ).all<Record<string, unknown>>();
        return jsonResponse(
          { ok: true, orders: (rows.results || []).map(mapD1OrderRow) },
          200,
          requestOrigin,
          allowedOrigins,
        );
      }
      return jsonResponse({ ok: true, orders: [] }, 200, requestOrigin, allowedOrigins);
    }

    const adminPatchMatch = url.pathname.match(/^\/api\/admin\/orders\/([a-zA-Z0-9_-]{3,40})$/);
    if (adminPatchMatch && request.method === 'PATCH') {
      const valid = await verifyWorkerAdminBearer(request.headers.get('Authorization'), env);
      if (!valid) {
        return jsonResponse({ ok: false, error: 'Unauthorized' }, 401, requestOrigin, allowedOrigins);
      }

      const orderNumber = adminPatchMatch[1];
      const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
      if (env.DB) {
        const now = Date.now();
        const nextStatus =
          typeof body.status === 'string' &&
          ['queued', 'molding', 'batching', 'curing', 'packing', 'shipped'].includes(body.status)
            ? body.status
            : 'queued';
        const nextPay =
          typeof body.paymentStatus === 'string' &&
          ['paid', 'pending', 'cod', 'refunded'].includes(body.paymentStatus)
            ? body.paymentStatus
            : 'paid';

        await env.DB.prepare(
          `UPDATE atelier_orders
           SET status = ?,
               payment_status = ?,
               paid_at_ms = COALESCE(?, paid_at_ms),
               payment_reference = COALESCE(?, payment_reference),
               tracking_code = COALESCE(?, tracking_code),
               carrier = COALESCE(?, carrier),
               completed_steps_json = ?,
               updated_at_ms = ?
           WHERE order_number = ?`,
        )
          .bind(
            nextStatus,
            nextPay,
            typeof body.paidAtMs === 'number' ? Math.round(body.paidAtMs) : nextPay === 'paid' ? now : null,
            typeof body.paymentReference === 'string' ? body.paymentReference.slice(0, 80) : null,
            typeof body.trackingCode === 'string' ? body.trackingCode.slice(0, 48) : null,
            typeof body.carrier === 'string' ? body.carrier.slice(0, 64) : null,
            Array.isArray(body.completedSteps) ? JSON.stringify(body.completedSteps.slice(0, 200)) : '[]',
            now,
            orderNumber,
          )
          .run();
      }

      return jsonResponse({ ok: true }, 200, requestOrigin, allowedOrigins);
    }

    if (url.pathname === '/api/instagram/mentions' && request.method === 'GET') {
      const forceRefresh =
        url.searchParams.get('refresh') === '1' || url.searchParams.get('refresh') === 'true';
      try {
        const payload = await fetchInstagramTaggedMentions(env, forceRefresh);
        return jsonResponse(payload, 200, requestOrigin, allowedOrigins, {
          'Cache-Control': 'public, max-age=60, stale-while-revalidate=240',
        });
      } catch (err) {
        const handle =
          typeof env.INSTAGRAM_BRAND_HANDLE === 'string' && env.INSTAGRAM_BRAND_HANDLE.trim()
            ? env.INSTAGRAM_BRAND_HANDLE.trim()
            : '@gentlebubble.ar';
        return jsonResponse(
          {
            configured: true,
            handle,
            fetchedAt: new Date().toISOString(),
            cached: false,
            posts: [],
            error: err instanceof Error ? err.message : 'Unable to fetch Instagram mentions',
          },
          502,
          requestOrigin,
          allowedOrigins,
        );
      }
    }

    // 6. Fast Edge Static Asset Serving with Immutable Asset Cache & Safe HTML Freshness
    if (env.ASSETS) {
      const assetResponse = await env.ASSETS.fetch(request);
      const responseHeaders = new Headers(assetResponse.headers);
      hardenSetCookieHeaders(assetResponse.headers, responseHeaders, originHost, primaryDomain);
      stripUpstreamLeakageAndHardenSecurity(responseHeaders);
      if (url.pathname.startsWith('/assets/')) {
        responseHeaders.set('Cache-Control', 'public, max-age=31536000, immutable');
      } else if (url.pathname === '/' || url.pathname.endsWith('.html')) {
        responseHeaders.set('Cache-Control', 'public, max-age=0, must-revalidate');
      }
      if (requestOrigin && allowedOrigins.has(requestOrigin)) {
        applyCorsHeaders(responseHeaders, requestOrigin, allowedOrigins);
      }
      return new Response(assetResponse.body, {
        status: assetResponse.status,
        statusText: assetResponse.statusText,
        headers: responseHeaders,
      });
    }

    return new Response('Worker assets binding (ASSETS) or ORIGIN_HOST is not configured.', {
      status: 500,
    });
  },
};

import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import fs from 'fs';
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

const PORT = Number(process.env.PORT || 3000);
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const CACHE_TTL_MS = 5 * 60 * 1000;

let cachedMentions: { expiresAt: number; payload: InstagramMentionsPayload } | null = null;

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

async function createAppServer() {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json());

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ ok: true });
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

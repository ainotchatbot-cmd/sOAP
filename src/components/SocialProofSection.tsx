import React, { memo, useCallback, useEffect, useState } from 'react';
import { ExternalLink, Heart, Instagram, MessageCircle, RefreshCw } from 'lucide-react';
import { useLanguage } from '../data/i18n';
import { ResilientImage } from './ResilientImage';

interface InstagramMentionItem {
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

interface InstagramMentionsApiResponse {
  configured: boolean;
  handle: string;
  fetchedAt: string;
  cached: boolean;
  posts: InstagramMentionItem[];
  error?: string;
}

interface SocialProofSectionProps {
  accentHex: string;
  accentTextHex?: string;
}

export const SocialProofSection: React.FC<SocialProofSectionProps> = memo(
  ({ accentHex, accentTextHex = '#261E14' }) => {
    const { lang, t } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [data, setData] = useState<InstagramMentionsApiResponse | null>(null);

    const fetchMentions = useCallback(async (forceRefresh: boolean, signal?: AbortSignal) => {
      if (forceRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setErrorMsg(null);

      try {
        const res = await fetch(
          forceRefresh ? '/api/instagram/mentions?refresh=1' : '/api/instagram/mentions',
          { signal },
        );
        const json = (await res.json()) as InstagramMentionsApiResponse;
        if (!res.ok || json.error) {
          setData(json);
          setErrorMsg(json.error ?? 'Request failed');
        } else {
          setData(json);
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        setErrorMsg('Network error');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    }, []);

    useEffect(() => {
      const controller = new AbortController();
      void fetchMentions(false, controller.signal);
      return () => controller.abort();
    }, [fetchMentions]);

    const handleName = data?.handle || '@gentlebubble.ar';
    const profileSlug = handleName.replace(/^@/, '');
    const posts = data?.posts ?? [];

    const formatMentionDate = (iso: string) => {
      try {
        return new Date(iso).toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      } catch {
        return '';
      }
    };

    return (
      <section
        id="social-proof"
        className="relative z-10 border-b border-[var(--border)] bg-transparent text-[var(--ink)] transition-colors duration-300"
      >
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-10 py-10 lg:py-12 space-y-6">
          {/* Header Strip */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-card)]/94 backdrop-blur-md px-5 py-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
            <div className="space-y-0.5">
              <p
                className="text-[11px] font-semibold tracking-[0.14em] uppercase"
                style={{ color: accentHex }}
              >
                {t.socialEyebrow}
              </p>
              <h2 className="marshmallow-text font-serif text-2xl sm:text-3xl font-medium text-[var(--ink)]">
                {t.socialHeading}
              </h2>
              <p className="text-xs text-[var(--muted)]">{t.socialSubtitle}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <a
                href={`https://www.instagram.com/${encodeURIComponent(profileSlug)}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-full border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--ink)]/30 text-xs font-medium text-[var(--ink)] inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
              >
                <Instagram className="w-3.5 h-3.5" style={{ color: accentHex }} />
                <span>{t.socialFollowLink}</span>
              </a>

              <button
                type="button"
                onClick={() => void fetchMentions(true)}
                disabled={loading || refreshing}
                className="luxury-3d-pill px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 transition-opacity hover:opacity-90 disabled:opacity-60 cursor-pointer whitespace-nowrap"
                style={{ backgroundColor: accentHex, color: accentTextHex }}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                <span>{t.socialRefreshBtn}</span>
              </button>
            </div>
          </div>

          {/* Loading Skeleton */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5" aria-busy="true">
              {[0, 1, 2].map((idx) => (
                <div
                  key={idx}
                  className="luxury-3d-card overflow-hidden p-4 space-y-3 animate-pulse bg-[var(--surface-card)]/90"
                >
                  <div className="aspect-square rounded-2xl bg-[var(--surface)]" />
                  <div className="h-3 w-1/2 rounded bg-[var(--surface)]" />
                  <div className="h-4 w-5/6 rounded bg-[var(--surface)]" />
                </div>
              ))}
            </div>
          ) : errorMsg ? (
            <div className="luxury-3d-card p-6 bg-[var(--surface-card)]/94 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="font-serif text-lg font-medium text-[var(--ink)]">
                  {t.socialHeading}
                </p>
                <p className="text-sm text-[var(--muted)]">{t.socialErrorDesc}</p>
              </div>
              <button
                type="button"
                onClick={() => void fetchMentions(true)}
                className="px-4 py-2 rounded-full text-xs font-semibold cursor-pointer self-start sm:self-center shrink-0"
                style={{ backgroundColor: accentHex, color: accentTextHex }}
              >
                {t.socialRetryBtn}
              </button>
            </div>
          ) : posts.length === 0 ? (
            <div className="luxury-3d-card p-6 sm:p-8 bg-[var(--surface-card)]/94 flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <div
                  className="w-11 h-11 rounded-2xl border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center shrink-0"
                  aria-hidden="true"
                >
                  <Instagram className="w-5 h-5" style={{ color: accentHex }} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-xl font-medium text-[var(--ink)]">
                    {t.socialEmptyTitle}
                  </h3>
                  <p className="text-sm text-[var(--muted)] max-w-2xl leading-relaxed">
                    {data?.configured === false ? t.socialAwaitingConfigDesc : t.socialEmptyDesc}
                  </p>
                </div>
              </div>

              <a
                href={`https://www.instagram.com/${encodeURIComponent(profileSlug)}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="luxury-3d-pill px-4 py-2.5 rounded-full text-xs font-semibold inline-flex items-center gap-2 shrink-0 self-start md:self-center"
                style={{ backgroundColor: accentHex, color: accentTextHex }}
              >
                <span>{handleName}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="luxury-3d-card overflow-hidden flex flex-col justify-between bg-[var(--surface-card)]/94"
                >
                  <a
                    href={post.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block relative aspect-square w-full overflow-hidden bg-[var(--surface)]"
                  >
                    <ResilientImage
                      src={post.mediaUrl}
                      alt={
                        post.caption
                          ? `${post.username} on Instagram: ${post.caption.slice(0, 90)}`
                          : `Tagged Instagram post by @${post.username}`
                      }
                      fallbackTitle={`@${post.username}`}
                      fallbackGradient="from-[#F5EBE0] via-[#DFB4AC] to-[#92735F]"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                    />
                  </a>

                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-[11px] text-[var(--muted)]">
                        <span className="font-semibold text-[var(--ink)]">
                          {t.socialTaggedPrefix} @{post.username}
                        </span>
                        <span aria-hidden="true">·</span>
                        <time dateTime={post.timestamp}>{formatMentionDate(post.timestamp)}</time>
                      </div>

                      {post.caption && (
                        <p className="text-sm text-[var(--ink)] leading-relaxed line-clamp-3">
                          {post.caption}
                        </p>
                      )}
                    </div>

                    <div className="pt-2.5 border-t border-[var(--border)] flex items-center justify-between gap-2 text-[11px] text-[var(--muted)]">
                      <div className="flex items-center gap-3 tabular-figures">
                        {typeof post.likeCount === 'number' && (
                          <span className="inline-flex items-center gap-1">
                            <Heart className="w-3.5 h-3.5" style={{ color: accentHex }} />
                            <span>{post.likeCount.toLocaleString()}</span>
                          </span>
                        )}
                        {typeof post.commentsCount === 'number' && (
                          <span className="inline-flex items-center gap-1">
                            <MessageCircle className="w-3.5 h-3.5" style={{ color: accentHex }} />
                            <span>{post.commentsCount.toLocaleString()}</span>
                          </span>
                        )}
                      </div>

                      <a
                        href={post.permalink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-semibold hover:opacity-80 transition-opacity"
                        style={{ color: accentHex }}
                      >
                        <span>{t.socialViewPostBtn}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  },
);

SocialProofSection.displayName = 'SocialProofSection';

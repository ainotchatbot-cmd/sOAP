import React, { useEffect, useState } from 'react';
import { Check, Loader2, Mail } from 'lucide-react';
import { useLanguage } from '../data/i18n';
import { subscribeToMailingList } from '../services/atelierStoreService';

interface MailingListBannerProps {
  accentHex: string;
  accentTextHex?: string;
  userEmail?: string | null;
  userUid?: string | null;
  adCookiesAccepted: boolean;
}

export const MailingListBanner: React.FC<MailingListBannerProps> = ({
  accentHex,
  accentTextHex = '#FFFFFF',
  userEmail,
  userUid,
  adCookiesAccepted,
}) => {
  const { lang, t } = useLanguage();
  const [email, setEmail] = useState(userEmail ?? '');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    'drops',
    'bath-bombs',
  ]);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (userEmail && !email) {
      setEmail(userEmail);
    }
  }, [userEmail, email]);

  const topicOptions = [
    { id: 'drops', label: t.mailingTopicDrops },
    { id: 'restocks', label: t.mailingTopicRestocks },
    { id: 'bath-bombs', label: t.mailingTopicBathBombs },
    { id: 'seasonal', label: t.mailingTopicSeasonal },
  ];

  const toggleTopic = (id: string) => {
    setSelectedTopics((prev) => {
      if (prev.includes(id)) {
        return prev.length > 1 ? prev.filter((item) => item !== id) : prev;
      }
      return [...prev, id];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus('error');
      setErrorMsg(t.mailingErrorMsg);
      return;
    }

    setStatus('submitting');
    setErrorMsg(null);
    try {
      await subscribeToMailingList({
        email: trimmed,
        lang,
        topics: selectedTopics,
        adCookiesAccepted,
        uid: userUid ?? null,
      });
      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMsg(t.mailingErrorMsg);
    }
  };

  return (
    <section
      id="mailing-list"
      className="relative z-10 border-t border-[var(--border)] bg-transparent text-[var(--ink)]"
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-10 py-8 lg:py-10">
        <div className="luxury-3d-card p-6 sm:p-8 bg-[var(--surface-card)]/95 backdrop-blur-md grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          <div className="lg:col-span-6 space-y-2">
            <p
              className="text-[11px] font-semibold tracking-[0.15em] uppercase inline-flex items-center gap-1.5"
              style={{ color: accentHex }}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{t.mailingEyebrow}</span>
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[var(--ink)] leading-snug">
              {t.mailingTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed max-w-xl">
              {t.mailingSubtitle}
            </p>
          </div>

          <div className="lg:col-span-6">
            {status === 'success' ? (
              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex items-center gap-3">
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: accentHex, color: accentTextHex }}
                >
                  <Check className="w-4 h-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-[var(--ink)]">
                    {t.mailingSuccessMsg}
                  </p>
                  <p className="text-[11px] text-[var(--muted)] truncate">{email.trim()}</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {topicOptions.map((opt) => {
                    const active = selectedTopics.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => toggleTopic(opt.id)}
                        aria-pressed={active}
                        className="px-2.5 py-1 rounded-full border text-[11px] font-medium transition-colors cursor-pointer"
                        style={{
                          borderColor: active ? accentHex : 'var(--border)',
                          backgroundColor: active ? accentHex : 'var(--surface)',
                          color: active ? accentTextHex : 'var(--muted)',
                        }}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.mailingEmailPlaceholder}
                    aria-label={t.mailingEmailPlaceholder}
                    className="flex-1 h-11 px-4 rounded-full border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="luxury-3d-pill h-11 px-6 rounded-full text-xs font-semibold inline-flex items-center justify-center gap-2 transition-opacity hover:opacity-90 cursor-pointer whitespace-nowrap disabled:opacity-60"
                    style={{ backgroundColor: accentHex, color: accentTextHex }}
                  >
                    {status === 'submitting' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{t.mailingSubmitBtn}</span>
                  </button>
                </div>

                {errorMsg && (
                  <p role="alert" className="text-xs text-red-500 font-medium">
                    {errorMsg}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

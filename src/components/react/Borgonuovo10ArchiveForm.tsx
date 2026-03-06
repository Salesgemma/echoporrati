import React, { useCallback, useMemo, useState } from 'react';

type Lang = 'it' | 'en';

type Taste = 'ICE' | 'FIRE' | 'METAL';

type Step = 'gate' | 'taste' | 'image' | 'birthdate' | 'email' | 'code';

const GOOGLE_APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbznpkx884WKOcdeuRRmRLarjW_sg35X8BfK_SWU-_H_zNH5fBd8FIEFf1bpAs6VpeAaMw/exec';

const COPY = {
  it: {
    back: 'Indietro',
    gate: {
      title: 'BORGONUOVO10 ARCHIVE.',
      subtitle: "Identificazione richiesta per l'accesso alla selezione riservata.",
      enter: 'ENTRA',
    },
    taste: {
      title: 'Cosa attira il tuo sguardo?',
      subtitle: "Scegli un'estetica.",
      ice: 'Diamanti, pietre bianche, luce.',
      fire: 'Zaffiri, smeraldi, pietre colorate.',
      metal: 'Oro scultoreo, design, texture.',
    },
    image: {
      title: "Mostraci un'immagine che ti rappresenta.",
      subtitle: 'Può essere uno screenshot, una foto, un dettaglio.',
      button: 'Carica immagine',
      change: 'Cambia immagine',
      hint: 'Formato immagine, max 5 MB.',
      errorTooBig: 'Immagine troppo grande (max 5 MB).',
      continue: 'Continua',
      previewAlt: 'Immagine caricata',
    },
    birthdate: {
      title: 'La tua annata.',
      subtitle: 'Per riservarti un pensiero nel tuo giorno.',
      invalid: 'Inserisci una data valida.',
      continue: 'Continua',
      day: 'DD',
      month: 'MM',
      year: 'YYYY',
      dayAria: 'Giorno',
      monthAria: 'Mese',
      yearAria: 'Anno',
    },
    email: {
      title: 'Dove dobbiamo inviare gli inviti per i prossimi eventi privati?',
      subtitle: 'Nessuno spam. Solo accessi prioritari.',
      label: 'Email',
      placeholder: 'nome@dominio.com',
      invalid: "Inserisci un'email valida.",
      continue: 'Continua',
      submitting: 'Invio in corso…',
    },
    code: {
      badge: 'ACCESSO AUTORIZZATO',
      title: 'Il tuo codice di sicurezza è:',
      subtitle:
        "Step finale: invia questo codice ora in DM sul nostro profilo Instagram per attivare l'accesso Archive.",
      dm: 'VAI AI DM INSTAGRAM',
      copy: 'COPIA CODICE',
      copied: 'Codice copiato',
      profile: 'Apri profilo Instagram',
    },
    footer: 'Pagina riservata — accesso tramite QR.',
    subject: 'BORGONUOVO10 ARCHIVE — Nuovo contatto',
    submitFallback: "Connessione instabile: puoi comunque procedere. Se vuoi assicurarti di ricevere gli inviti, includi anche l'email nel DM.",
  },
  en: {
    back: 'Back',
    gate: {
      title: 'BORGONUOVO10 ARCHIVE.',
      subtitle: 'Identification required for access to the restricted selection.',
      enter: 'ENTER',
    },
    taste: {
      title: 'What catches your eye?',
      subtitle: 'Choose an aesthetic.',
      ice: 'Diamonds, white stones, light.',
      fire: 'Sapphires, emeralds, color stones.',
      metal: 'Sculptural gold, design, texture.',
    },
    image: {
      title: 'Show us an image that represents you.',
      subtitle: 'It can be a screenshot, a photo, a detail.',
      button: 'Upload image',
      change: 'Change image',
      hint: 'Image format, max 5 MB.',
      errorTooBig: 'Image is too large (max 5 MB).',
      continue: 'Continue',
      previewAlt: 'Uploaded image',
    },
    birthdate: {
      title: 'Your vintage.',
      subtitle: 'So we can reserve a thought for your day.',
      invalid: 'Please enter a valid date.',
      continue: 'Continue',
      day: 'DD',
      month: 'MM',
      year: 'YYYY',
      dayAria: 'Day',
      monthAria: 'Month',
      yearAria: 'Year',
    },
    email: {
      title: 'Where should we send invitations to future private events?',
      subtitle: 'No spam. Only priority access.',
      label: 'Email',
      placeholder: 'name@domain.com',
      invalid: 'Please enter a valid email.',
      continue: 'Continue',
      submitting: 'Sending…',
    },
    code: {
      badge: 'ACCESS GRANTED',
      title: 'Your security code is:',
      subtitle:
        'Final step: send this code now via DM on our Instagram profile to activate Archive access.',
      dm: 'OPEN INSTAGRAM DMs',
      copy: 'COPY CODE',
      copied: 'Code copied',
      profile: 'Open Instagram profile',
    },
    footer: 'Restricted page — QR access only.',
    subject: 'BORGONUOVO10 ARCHIVE — New lead',
    submitFallback:
      'Unstable connection: you can still proceed. To make sure you receive invitations, include your email in the DM as well.',
  },
} as const;

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function clampNumericString(value: string, maxLen: number) {
  return value.replace(/\D/g, '').slice(0, maxLen);
}

function isValidDateParts(day: string, month: string, year: string) {
  const d = Number(day);
  const m = Number(month);
  const y = Number(year);
  if (!Number.isInteger(d) || !Number.isInteger(m) || !Number.isInteger(y)) return false;
  if (y < 1900 || y > new Date().getFullYear()) return false;
  if (m < 1 || m > 12) return false;
  if (d < 1 || d > 31) return false;
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

function formatDateIt(day: string, month: string, year: string) {
  return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
}

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error('file_read_error'));
    reader.readAsDataURL(file);
  });
}

interface Borgonuovo10ArchiveFormProps {
  initialLang?: Lang;
}

export default function Borgonuovo10ArchiveForm({ initialLang = 'it' }: Borgonuovo10ArchiveFormProps) {
  const [lang, setLang] = useState<Lang>(initialLang);
  const [step, setStep] = useState<Step>('gate');
  const [taste, setTaste] = useState<Taste | null>(null);
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const code = 'BN-GUEST';
  const instagramDmUrl = 'https://ig.me/m/borgonuovo10gioielli';
  const instagramProfileUrl = 'https://www.instagram.com/borgonuovo10gioielli/';

  const t = useMemo(() => COPY[lang], [lang]);

  const birthdateOk = useMemo(() => isValidDateParts(day, month, year), [day, month, year]);
  const emailOk = useMemo(() => isValidEmail(email), [email]);
  const imageOk = !!imageFile;

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setImageError(t.image.errorTooBig);
      setImageFile(null);
      setImagePreviewUrl(null);
      return;
    }

    setImageError(null);
    setImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  }

  const goBack = useCallback(() => {
    setSubmitError(null);
    setStep(prev => {
      switch (prev) {
        case 'taste':
          return 'gate';
        case 'image':
          return 'taste';
        case 'birthdate':
          return 'image';
        case 'email':
          return 'birthdate';
        case 'code':
          return 'email';
        default:
          return prev;
      }
    });
  }, []);

  const submitLead = useCallback(async () => {
    if (!taste || !imageOk || !birthdateOk || !emailOk) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      let imageBase64 = '';
      if (imageFile) {
        const fullBase64 = await fileToDataUrl(imageFile);
        // Rimuove l'intestazione data:image/...;base64,
        imageBase64 = fullBase64.split(',')[1];
      }

      const data = {
        source: 'borgonuovo10-archive',
        taste,
        birthdate: formatDateIt(day, month, year),
        email: email.trim(),
        lang,
        _subject: t.subject,
        imageName: imageFile ? imageFile.name : '',
        imageType: imageFile ? imageFile.type : '',
        imageBase64,
      };

      // Usiamo Content-Type text/plain per evitare il preflight CORS (OPTIONS)
      // che Google Apps Script non gestisce.
      const res = await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('submit_failed');
      }

      setStep('code');
    } catch {
      setSubmitError(t.submitFallback);
      setStep('code');
    } finally {
      setSubmitting(false);
    }
  }, [birthdateOk, day, email, emailOk, imageOk, imageFile, lang, month, t.subject, taste, year]);

  const copyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // ignore
    }
  }, [code]);

  return (
    <div className="min-h-[100svh] bg-gradient-to-b from-black via-nero-assoluto to-black text-bianco-sporco flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md relative">
        <div
          className="pointer-events-none absolute -inset-10 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.16),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(255,255,255,0.06),_transparent_60%)] opacity-50 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative rounded-3xl border border-grigio-antracite/60 bg-nero-assoluto/80 backdrop-blur-xl p-6 shadow-[0_24px_80px_rgba(0,0,0,1)] transform transition-all duration-300 hover:shadow-[0_0_80px_rgba(255,255,255,0.25)] hover:border-bianco-sporco/80 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-6">
            <div className="font-bodoni tracking-[0.32em] text-[0.7rem] text-greige-chiaro/90 uppercase">BORGONUOVO10 ARCHIVE</div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs font-medium rounded-full border border-grigio-antracite/70 bg-nero-assoluto/70 px-3 py-1 shadow-[0_0_24px_rgba(0,0,0,0.9)]">
                <button
                  type="button"
                  onClick={() => setLang('it')}
                  className={lang === 'it' ? 'text-bianco-sporco' : 'text-greige-chiaro hover:text-bianco-sporco transition-colors'}
                  aria-label="Italiano"
                >
                  IT
                </button>
                <span className="text-grigio-antracite">/</span>
                <button
                  type="button"
                  onClick={() => setLang('en')}
                  className={lang === 'en' ? 'text-bianco-sporco' : 'text-greige-chiaro hover:text-bianco-sporco transition-colors'}
                  aria-label="English"
                >
                  EN
                </button>
              </div>

              {step !== 'gate' && (
                <button
                  type="button"
                  onClick={goBack}
                  className="text-xs text-greige-chiaro hover:text-bianco-sporco transition-colors border-l border-grigio-antracite/60 pl-3"
                >
                  {t.back}
                </button>
              )}
            </div>
          </div>

          {step === 'gate' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="font-bodoni text-3xl leading-tight tracking-wide">{t.gate.title}</h1>
                <p className="text-greige-chiaro text-sm">{t.gate.subtitle}</p>
              </div>

              <button
                type="button"
                onClick={() => setStep('taste')}
                className="w-full rounded-full border border-bianco-sporco px-5 py-3 text-sm font-medium bg-transparent hover:bg-bianco-sporco hover:text-nero-assoluto shadow-[0_12px_30px_rgba(0,0,0,0.9)] hover:shadow-[0_18px_45px_rgba(255,255,255,0.25)] transition-all"
              >
                {t.gate.enter}
              </button>
            </div>
          )}

          {step === 'taste' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="font-bodoni text-2xl tracking-wide">{t.taste.title}</h2>
                <p className="text-greige-chiaro text-sm">{t.taste.subtitle}</p>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    setTaste('ICE');
                    setStep('image');
                  }}
                  className="w-full text-left rounded-2xl border border-grigio-antracite/60 bg-nero-assoluto/60 px-4 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.8)] hover:border-bianco-sporco hover:bg-white/5 hover:shadow-[0_18px_45px_rgba(0,0,0,1)] transition-all"
                >
                  <div className="font-medium">ICE</div>
                  <div className="text-greige-chiaro text-sm">{t.taste.ice}</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTaste('FIRE');
                    setStep('image');
                  }}
                  className="w-full text-left rounded-2xl border border-grigio-antracite/60 bg-nero-assoluto/60 px-4 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.8)] hover:border-bianco-sporco hover:bg-white/5 hover:shadow-[0_18px_45px_rgba(0,0,0,1)] transition-all"
                >
                  <div className="font-medium">FIRE</div>
                  <div className="text-greige-chiaro text-sm">{t.taste.fire}</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTaste('METAL');
                    setStep('image');
                  }}
                  className="w-full text-left rounded-2xl border border-grigio-antracite/60 bg-nero-assoluto/60 px-4 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.8)] hover:border-bianco-sporco hover:bg-white/5 hover:shadow-[0_18px_45px_rgba(0,0,0,1)] transition-all"
                >
                  <div className="font-medium">METAL</div>
                  <div className="text-greige-chiaro text-sm">{t.taste.metal}</div>
                </button>
              </div>
            </div>
          )}

          {step === 'image' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="font-bodoni text-2xl tracking-wide">{t.image.title}</h2>
                <p className="text-greige-chiaro text-sm">{t.image.subtitle}</p>
              </div>

              <div className="space-y-3">
                {imagePreviewUrl && (
                  <div className="w-full overflow-hidden rounded-xl border border-grigio-antracite/60 bg-nero-assoluto/60">
                    <img
                      src={imagePreviewUrl}
                      alt={t.image.previewAlt}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}

                <label className="block rounded-full border border-grigio-antracite/60 bg-nero-assoluto/60 px-4 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.8)] hover:border-bianco-sporco hover:bg-white/5 transition-all cursor-pointer">
                  <span className="sr-only">{t.image.button}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-xs text-greige-chiaro file:mr-4 file:rounded-full file:border-0 file:bg-bianco-sporco file:px-4 file:py-2 file:text-xs file:font-medium file:text-nero-assoluto hover:file:bg-white"
                  />
                </label>

                <p className="text-xs text-greige-chiaro/80">{t.image.hint}</p>
                {imageError && <p className="text-xs text-greige-chiaro">{imageError}</p>}
              </div>

              <button
                type="button"
                onClick={() => setStep('birthdate')}
                disabled={!imageOk}
                className="w-full rounded-full border border-bianco-sporco px-5 py-3 text-sm font-medium disabled:opacity-40 bg-transparent hover:bg-bianco-sporco hover:text-nero-assoluto shadow-[0_12px_30px_rgba(0,0,0,0.9)] hover:shadow-[0_18px_45px_rgba(255,255,255,0.25)] transition-all"
              >
                {t.image.continue}
              </button>
            </div>
          )}

          {step === 'birthdate' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="font-bodoni text-2xl tracking-wide">{t.birthdate.title}</h2>
                <p className="text-greige-chiaro text-sm">{t.birthdate.subtitle}</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-greige-chiaro">{t.birthdate.day}</label>
                  <input
                    value={day}
                    onChange={(e) => setDay(clampNumericString(e.target.value, 2))}
                    inputMode="numeric"
                    placeholder="00"
                    className="w-full rounded-xl bg-nero-assoluto border border-grigio-antracite/60 px-3 py-3 text-base outline-none focus:border-bianco-sporco"
                    aria-label={t.birthdate.dayAria}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-greige-chiaro">{t.birthdate.month}</label>
                  <input
                    value={month}
                    onChange={(e) => setMonth(clampNumericString(e.target.value, 2))}
                    inputMode="numeric"
                    placeholder="00"
                    className="w-full rounded-xl bg-nero-assoluto border border-grigio-antracite/60 px-3 py-3 text-base outline-none focus:border-bianco-sporco"
                    aria-label={t.birthdate.monthAria}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-greige-chiaro">{t.birthdate.year}</label>
                  <input
                    value={year}
                    onChange={(e) => setYear(clampNumericString(e.target.value, 4))}
                    inputMode="numeric"
                    placeholder="0000"
                    className="w-full rounded-xl bg-nero-assoluto border border-grigio-antracite/60 px-3 py-3 text-base outline-none focus:border-bianco-sporco"
                    aria-label={t.birthdate.yearAria}
                  />
                </div>
              </div>

              {!birthdateOk && (day || month || year) && (
                <p className="text-xs text-greige-chiaro">{t.birthdate.invalid}</p>
              )}

              <button
                type="button"
                onClick={() => setStep('email')}
                disabled={!birthdateOk}
                className="w-full rounded-full border border-bianco-sporco px-5 py-3 text-sm font-medium disabled:opacity-40 bg-transparent hover:bg-bianco-sporco hover:text-nero-assoluto shadow-[0_12px_30px_rgba(0,0,0,0.9)] hover:shadow-[0_18px_45px_rgba(255,255,255,0.25)] transition-all"
              >
                {t.birthdate.continue}
              </button>
            </div>
          )}

          {step === 'email' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="font-bodoni text-2xl tracking-wide">{t.email.title}</h2>
                <p className="text-greige-chiaro text-sm">{t.email.subtitle}</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-greige-chiaro">{t.email.label}</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder={t.email.placeholder}
                  className="w-full rounded-xl bg-nero-assoluto border border-grigio-antracite/60 px-3 py-3 text-base outline-none focus:border-bianco-sporco"
                />
                {!emailOk && email.length > 0 && (
                  <p className="text-xs text-greige-chiaro">{t.email.invalid}</p>
                )}
              </div>

              <button
                type="button"
                onClick={submitLead}
                disabled={!emailOk || submitting}
                className="w-full rounded-full border border-bianco-sporco px-5 py-3 text-sm font-medium disabled:opacity-40 bg-transparent hover:bg-bianco-sporco hover:text-nero-assoluto shadow-[0_12px_30px_rgba(0,0,0,0.9)] hover:shadow-[0_18px_45px_rgba(255,255,255,0.25)] transition-all"
              >
                {submitting ? t.email.submitting : t.email.continue}
              </button>

              {submitError && <p className="text-xs text-greige-chiaro">{submitError}</p>}
            </div>
          )}

          {step === 'code' && (
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-greige-chiaro text-xs tracking-widest">{t.code.badge}</p>
                <h2 className="font-bodoni text-2xl tracking-wide">{t.code.title}</h2>
                <div className="font-bodoni text-4xl tracking-wide">{code}</div>
              </div>

              <div className="space-y-2">
                <p className="text-greige-chiaro text-sm">{t.code.subtitle}</p>
                {submitError && <p className="text-greige-chiaro text-xs">{submitError}</p>}
              </div>

              <div className="grid grid-cols-1 gap-3">
                <a
                  href={instagramDmUrl}
                  className="w-full text-center rounded-full bg-bianco-sporco text-nero-assoluto px-5 py-3 text-sm font-medium shadow-[0_12px_30px_rgba(0,0,0,0.9)] hover:bg-white hover:shadow-[0_18px_45px_rgba(255,255,255,0.25)] transition-all"
                >
                  {t.code.dm}
                </a>

                <button
                  type="button"
                  onClick={copyCode}
                  className="w-full rounded-full border border-bianco-sporco px-5 py-3 text-sm font-medium bg-transparent hover:bg-bianco-sporco hover:text-nero-assoluto shadow-[0_12px_30px_rgba(0,0,0,0.9)] hover:shadow-[0_18px_45px_rgba(255,255,255,0.25)] transition-all"
                >
                  {copied ? t.code.copied : t.code.copy}
                </button>

                <a
                  href={instagramProfileUrl}
                  className="w-full text-center text-xs text-greige-chiaro hover:text-bianco-sporco transition-colors"
                >
                  {t.code.profile}
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 text-center text-xs text-greige-chiaro/70">
          <span>{t.footer}</span>
        </div>
      </div>
    </div>
  );
}

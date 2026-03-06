import React, { useState, useEffect, useCallback, useRef } from 'react';
import productsData from '../../data/products.json';
import jewelPricesRaw from '../../data/jewel-prices.csv?raw';

interface ProductEntry {
  title: string;
  description: string;
  category?: string;
  video?: string;
}

interface ProductsJson {
  it: Record<string, ProductEntry>;
  en?: Record<string, ProductEntry>;
}

interface JewelItem {
  code: string;
  title: string;
  description: string;
  category?: string;
  publicPrice?: string;
  eventPrice?: string;
  imageUrl?: string;
  imageUrlAlt?: string;
}

const typedProducts = productsData as ProductsJson;

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

const RADIUS_PX = 900;

function parseCsvToItems(text: string): JewelItem[] {
  const normalized = text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');
  const lines = normalized.split('\n').filter((line) => line.trim().length > 0);
  if (lines.length <= 1) {
    return [];
  }

  const [, ...rows] = lines;
  const items: JewelItem[] = [];
  const seen = new Set<string>();

  for (const row of rows) {
    const cells = row.split(';');
    if (!cells.length) continue;

    const rawCode = (cells[0] || '').trim();
    const compactCode = rawCode.replace(/\s+/g, '');
    if (!compactCode || seen.has(compactCode)) continue;
    seen.add(compactCode);

    const type = (cells[1] || '').trim();
    const metal = (cells[2] || '').trim();
    const mainShape = (cells[4] || '').trim();
    const mainCarat = (cells[5] || '').trim();
    const eventPriceRaw = (cells[11] || '').trim();
    const publicPriceRaw = (cells[12] || '').trim();

    const titleParts = [type, metal].filter(Boolean);
    const title = titleParts.length ? titleParts.join(' · ') : compactCode;

    const descParts: string[] = [];
    if (mainShape) {
      descParts.push(`Pietra: ${mainShape}`);
    }
    if (mainCarat) {
      descParts.push(`Carati: ${mainCarat}`);
    }
    const description = descParts.join(' — ');

    const cleanedEventPrice = eventPriceRaw ? eventPriceRaw.replace(/[\?\uFFFD]/g, '€').trim() : '';
    const cleanedPublicPrice = publicPriceRaw ? publicPriceRaw.replace(/[\?\uFFFD]/g, '€').trim() : '';

    const isNe = /^ne/i.test(compactCode);
    const imageUrl = isNe ? undefined : `/jewels/${compactCode}.jpg`;
    const imageUrlAlt = isNe ? undefined : `/jewels/${compactCode}.png`;

    items.push({
      code: compactCode,
      title,
      description,
      category: type || undefined,
      publicPrice: cleanedPublicPrice || undefined,
      eventPrice: cleanedEventPrice || undefined,
      imageUrl,
      imageUrlAlt,
    });
  }

  return items;
}

const CSV_ITEMS: JewelItem[] = parseCsvToItems(jewelPricesRaw);

function buildFallbackItems(locale: Lang): JewelItem[] {
  const source =
    locale === 'en'
      ? typedProducts.en ?? typedProducts.it ?? {}
      : typedProducts.it ?? typedProducts.en ?? {};
  const entries = Object.entries(source);
  return entries.map(([code, value]) => ({
    code,
    title: value.title,
    description: value.description,
    category: value.category,
  }));
}

const COPY = {
  it: {
    brand: 'PORRATI',
    title: 'Ricerca per codice gioiello',
    subtitle:
      "Inserisci il codice interno del gioiello oppure il suo nome per navigare direttamente al pezzo corrispondente all'interno dello spazio.",
    inputLabel: 'Codice gioiello',
    inputPlaceholder: 'Es. teorema, fiore-astrale-blu…',
    submit: 'Vai al gioiello',
    codeLabel: 'CODICE',
    notFound: 'Nessun gioiello trovato. Prova con un altro codice o nome.',
    publicPriceLabel: 'Prezzo al pubblico',
    publicPriceUnavailable: 'Prezzo al pubblico non disponibile per questo gioiello.',
    eventPriceLabel: 'Prezzo riservato evento',
    eventPriceReveal: 'Svela prezzo riservato',
    eventPriceHide: 'Nascondi prezzo riservato',
    eventPriceNote: "Valore riservato ai partecipanti dell'evento.",
    eventPriceUnavailable: 'Prezzo riservato non disponibile per questo gioiello.',
  },
  en: {
    brand: 'PORRATI',
    title: 'Jewel code search',
    subtitle:
      'Type the internal jewel code or its name to jump directly to the corresponding piece in space.',
    inputLabel: 'Jewel code',
    inputPlaceholder: 'E.g. theorem, astral-flower-blue…',
    submit: 'Go to jewel',
    codeLabel: 'CODE',
    notFound: 'No jewel found. Try another code or name.',
    publicPriceLabel: 'Public price',
    publicPriceUnavailable: 'Public price not available for this jewel.',
    eventPriceLabel: 'Event guest price',
    eventPriceReveal: 'Reveal guest price',
    eventPriceHide: 'Hide guest price',
    eventPriceNote: 'Value reserved for guests attending the event.',
    eventPriceUnavailable: 'Guest price not available for this jewel.',
  },
} as const;

type Lang = keyof typeof COPY;

interface JewelCodeSearchProps {
  lang?: Lang;
}

export default function JewelCodeSearch({ lang = 'it' }: JewelCodeSearchProps) {
  const locale: Lang = lang in COPY ? lang : 'it';
  const t = COPY[locale];

  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [items, setItems] = useState<JewelItem[]>(() => {
    if (CSV_ITEMS.length) return CSV_ITEMS;
    return buildFallbackItems(locale);
  });
  const [priceRevealedFor, setPriceRevealedFor] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const handleStagePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const dx = x / rect.width - 0.5;
    const dy = y / rect.height - 0.5;
    el.style.setProperty('--spot-x', `${x}px`);
    el.style.setProperty('--spot-y', `${y}px`);
    el.style.setProperty('--tilt-x', `${dy * -4}deg`);
    el.style.setProperty('--tilt-y', `${dx * 6}deg`);
  }, []);

  const handleStagePointerLeave = useCallback(() => {
    const el = stageRef.current;
    if (!el) return;
    el.style.setProperty('--spot-x', '50%');
    el.style.setProperty('--spot-y', '45%');
    el.style.setProperty('--tilt-x', '0deg');
    el.style.setProperty('--tilt-y', '0deg');
  }, []);

  useEffect(() => {
    if (!CSV_ITEMS.length) {
      setItems(buildFallbackItems(locale));
    }
  }, [locale]);

  const anglePerItem = items.length > 0 ? 360 / items.length : 0;

  useEffect(() => {
    if (!items.length) return;
    setRotation(-activeIndex * anglePerItem);
  }, [activeIndex, anglePerItem, items.length]);

  useEffect(() => {
    setPriceRevealedFor(null);
  }, [activeIndex]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!items.length) return;

      const normQuery = normalize(query);
      if (!normQuery) return;

      const exactIndex = items.findIndex((item) => normalize(item.code) === normQuery);
      const index =
        exactIndex >= 0
          ? exactIndex
          : items.findIndex((item) => {
              const nCode = normalize(item.code);
              const nTitle = normalize(item.title);
              return nCode.includes(normQuery) || nTitle.includes(normQuery);
            });

      if (index >= 0) {
        setActiveIndex(index);
        setIsFocused(true);
      }
    },
    [items, query]
  );

  const current = items[activeIndex] ?? null;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-10">
      <div className="text-center">
        <p className="font-bodoni tracking-[0.3em] text-[0.7rem] text-greige-chiaro/80 uppercase">
          {t.brand}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto flex flex-col sm:flex-row items-stretch gap-3"
      >
        <label className="sr-only" htmlFor="jewel-code-input">
          {t.inputLabel}
        </label>
        <input
          id="jewel-code-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.inputPlaceholder}
          className="flex-1 rounded-full bg-nero-assoluto border border-grigio-antracite/70 px-5 py-3 text-sm text-bianco-sporco outline-none focus:border-bianco-sporco focus:ring-2 focus:ring-bianco-sporco/30 transition"
        />
        <button
          type="submit"
          className="sm:w-auto w-full rounded-full px-6 py-3 text-sm font-medium bg-bianco-sporco text-nero-assoluto shadow-[0_12px_30px_rgba(0,0,0,0.9)] hover:bg-white hover:shadow-[0_18px_45px_rgba(255,255,255,0.25)] transition-all"
        >
          {t.submit}
        </button>
      </form>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-10 items-center">
        <div
          ref={stageRef}
          onPointerMove={handleStagePointerMove}
          onPointerLeave={handleStagePointerLeave}
          className="relative z-10 w-full aspect-[3/4] sm:aspect-[4/3] lg:aspect-[1/1] flex items-center justify-center overflow-hidden"
          style={{
            perspective: '2200px',
            ['--spot-x' as any]: '50%',
            ['--spot-y' as any]: '45%',
            ['--tilt-x' as any]: '0deg',
            ['--tilt-y' as any]: '0deg',
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 rounded-[32px] bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.1),_rgba(0,0,0,0.92)_72%)] opacity-0 transition-opacity duration-500"
            style={{ opacity: isFocused ? 1 : 0 }}
          />
          <div
            className="pointer-events-none absolute inset-0 rounded-[32px] opacity-0 transition-opacity duration-500"
            style={{
              opacity: isFocused ? 1 : 0,
              background:
                'radial-gradient(circle at var(--spot-x) var(--spot-y), rgba(255,255,255,0.06), transparent 58%)',
              mixBlendMode: 'soft-light',
            }}
          />
          <div
            className="relative w-full h-full"
            style={{
              transform: 'rotateX(var(--tilt-x)) rotateY(var(--tilt-y))',
              transformStyle: 'preserve-3d',
              transition: 'transform 160ms ease-out',
            }}
          >
            <div
              className="relative w-full h-full transition-transform duration-700 ease-out"
              style={{
                transform: `translateZ(-${RADIUS_PX}px) rotateY(${rotation}deg)`,
                transformStyle: 'preserve-3d',
              }}
            >
              {items.map((item, index) => {
                const angle = index * anglePerItem;
                const distanceRaw = Math.abs(index - activeIndex);
                const distance = Math.min(distanceRaw, items.length - distanceRaw);

                const isActive = distance === 0;
                const isNeighbor = distance === 1;
                const isSecondaryNeighbor = distance === 2;

                let opacity: number;
                let scale: number;
                let translateY = 0;
                let filter = 'none';
                let zIndex = 0;
                let zOffset = 0;

                if (isActive) {
                  opacity = 1;
                  scale = isFocused ? 1.03 : 1;
                  translateY = isFocused ? -16 : -10;
                  zIndex = 30;
                  zOffset = isFocused ? 80 : 0;
                } else if (isNeighbor) {
                  opacity = 0.92;
                  scale = 0.84;
                  translateY = 18;
                  filter = 'blur(0.85px) brightness(0.42) saturate(0.28) contrast(0.95)';
                  zIndex = 20;
                  zOffset = -320;
                } else if (isSecondaryNeighbor) {
                  opacity = 0.58;
                  scale = 0.78;
                  translateY = 34;
                  filter = 'blur(1.25px) brightness(0.32) saturate(0.18) contrast(0.92)';
                  zIndex = 10;
                  zOffset = -440;
                } else {
                  opacity = 0;
                  scale = 0.85;
                  zIndex = 0;
                  zOffset = -520;
                }

                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => {
                      setActiveIndex(index);
                      setIsFocused(true);
                    }}
                    className="group absolute w-[270px] h-[380px] sm:w-[310px] sm:h-[440px] lg:w-[340px] lg:h-[480px] outline-none"
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${RADIUS_PX + zOffset}px) translateY(${translateY}px) scale(${scale})`,
                      transformStyle: 'preserve-3d',
                      backfaceVisibility: 'hidden',
                      opacity,
                      filter,
                      zIndex,
                      transition:
                        'opacity 0.35s ease-out, transform 0.45s ease-out, filter 0.35s ease-out',
                      pointerEvents: distance <= 1 ? 'auto' : 'none',
                    }}
                  >
                    <div className="relative w-full h-full rounded-3xl border border-grigio-antracite/70 bg-black shadow-[0_24px_80px_rgba(0,0,0,1)] overflow-hidden flex flex-col">
                      <div className="relative flex-1 overflow-hidden bg-black">
                        {item.imageUrl ? (
                          <>
                            <img
                              src={item.imageUrl}
                              alt=""
                              aria-hidden="true"
                              onError={(e) => {
                                if (
                                  item.imageUrlAlt &&
                                  e.currentTarget.src.endsWith('.jpg')
                                ) {
                                  e.currentTarget.src = item.imageUrlAlt;
                                }
                              }}
                              className="absolute inset-0 h-full w-full object-cover blur-3xl scale-110 opacity-[0.28]"
                            />
                            <img
                              src={item.imageUrl}
                              alt={item.title || item.code}
                              onError={(e) => {
                                if (
                                  item.imageUrlAlt &&
                                  e.currentTarget.src.endsWith('.jpg')
                                ) {
                                  e.currentTarget.src = item.imageUrlAlt;
                                }
                              }}
                              className={`relative z-10 h-full w-full object-contain transition-transform duration-700 ease-out ${
                                isActive ? 'scale-[1.06]' : 'scale-[1.02]'
                              } group-hover:scale-[1.08]`}
                            />
                            <div
                              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"
                              style={{ opacity: isActive ? 0.7 : 0.92 }}
                            />
                            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                              <div className="absolute -inset-y-10 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-12 translate-x-[-140%] group-hover:translate-x-[260%] transition-transform duration-1000 ease-out" />
                            </div>
                          </>
                        ) : (
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.05),transparent_62%)]" />
                        )}
                      </div>
                      <div className="relative z-10 flex flex-col justify-between p-5 bg-black">
                        <div className="space-y-2">
                          <div className="inline-flex items-center gap-2 rounded-full border border-bianco-sporco/40 bg-black/60 px-3 py-1 text-[0.65rem] tracking-[0.3em] uppercase text-greige-chiaro/80">
                            <span className="font-mono">{item.code}</span>
                          </div>
                          {isActive && (
                            <>
                              <h2 className="font-bodoni text-xl leading-snug tracking-wide text-bianco-sporco">
                                {item.title}
                              </h2>
                              {item.category && (
                                <p className="text-xs text-greige-chiaro/80 uppercase tracking-[0.18em]">
                                  {item.category}
                                </p>
                              )}
                            </>
                          )}
                        </div>
                        {isActive && item.description && (
                          <p className="text-[0.7rem] text-greige-chiaro/80 line-clamp-3">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="relative z-20 space-y-4">
          {current ? (
            <>
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-grigio-antracite/70 bg-nero-assoluto/80 px-3 py-1 text-[0.65rem] tracking-[0.3em] uppercase text-greige-chiaro/80 font-mono">
                  <span>{t.codeLabel}</span>
                  <span className="text-bianco-sporco">{current.code}</span>
                </div>
                <h2 className="font-bodoni text-2xl tracking-wide">
                  {current.title}
                </h2>
                {current.category && (
                  <p className="text-xs text-greige-chiaro/80 uppercase tracking-[0.18em]">
                    {current.category}
                  </p>
                )}
              </div>
              {current.description && (
                <p className="text-sm text-greige-chiaro leading-relaxed">{current.description}</p>
              )}
              <div className="space-y-3">
                {current.publicPrice ? (
                  <div className="rounded-2xl border border-grigio-antracite/70 bg-black/60 px-4 py-3 shadow-[0_18px_45px_rgba(0,0,0,1)]">
                    <p className="text-[0.7rem] uppercase tracking-[0.25em] text-greige-chiaro/80">
                      {t.publicPriceLabel}
                    </p>
                    <p className="font-bodoni text-2xl tracking-wide text-bianco-sporco">
                      {current.publicPrice}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-greige-chiaro/70">{t.publicPriceUnavailable}</p>
                )}

                {current.eventPrice ? (
                  <div className="space-y-2">
                    <div className="relative overflow-hidden rounded-2xl border border-bianco-sporco/25 bg-black/80 shadow-[0_18px_50px_rgba(0,0,0,0.95)]">
                      <div className="relative z-10 px-4 py-4">
                        <p className="text-[0.7rem] uppercase tracking-[0.25em] text-greige-chiaro/80">
                          {t.eventPriceLabel}
                        </p>
                        <p className="font-bodoni text-3xl tracking-wide text-bianco-sporco">
                          {priceRevealedFor === current.code ? current.eventPrice : '•••••'}
                        </p>
                      </div>
                      {! (priceRevealedFor === current.code) && (
                        <button
                          type="button"
                          onClick={() => setPriceRevealedFor(current.code)}
                          className="absolute inset-0 z-20 flex items-center justify-center bg-black/55 backdrop-blur-sm transition-colors hover:bg-black/35"
                        >
                          <span className="text-[0.7rem] uppercase tracking-[0.3em] text-bianco-sporco">
                            {t.eventPriceReveal}
                          </span>
                        </button>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setPriceRevealedFor((prev) =>
                          prev === current.code ? null : current.code
                        )
                      }
                      className="inline-flex items-center justify-center rounded-full border border-bianco-sporco/25 bg-black/40 px-4 py-2 text-[0.65rem] uppercase tracking-[0.25em] text-bianco-sporco hover:border-bianco-sporco/50 hover:bg-black/60 transition-all"
                    >
                      {priceRevealedFor === current.code ? t.eventPriceHide : t.eventPriceReveal}
                    </button>
                    <p className="text-xs text-greige-chiaro/70">{t.eventPriceNote}</p>
                  </div>
                ) : (
                  <p className="text-xs text-greige-chiaro/70">{t.eventPriceUnavailable}</p>
                )}
              </div>
              </>
          ) : (
            <p className="text-sm text-greige-chiaro/80">{t.notFound}</p>
          )}
        </div>
      </div>
    </div>
  );
}

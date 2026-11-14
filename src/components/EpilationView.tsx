import React, { useMemo, useState } from 'react';
import { ArrowRight, CalendarCheck, Check, Info, ShieldCheck, Sparkles } from 'lucide-react';
import {
  AFTERCARE_TIPS,
  CONSULTATION_PRICE_EUR,
  DURATION_PRICES_EUR,
  PRE_TREATMENT_CHECKLIST,
  STUDIO_IMAGES,
  TREATMENTS,
} from '../data/studioData';
import { ResilientImage } from './ResilientImage';
import type { DurationMinutes, TreatmentCategory, TreatmentItem } from '../types/studio';

interface EpilationViewProps {
  onSelectForBooking: (treatment: TreatmentItem, duration: DurationMinutes) => void;
}

const CATEGORIES: TreatmentCategory[] = [
  'Alle',
  'Gesicht',
  'Körper',
  'Sensible Zonen',
  'Beratung & Probebehandlung',
];

const DURATIONS: DurationMinutes[] = [15, 30, 60, 90];

export const EpilationView: React.FC<EpilationViewProps> = ({ onSelectForBooking }) => {
  const [activeCategory, setActiveCategory] = useState<TreatmentCategory>('Alle');
  const [estimatorTreatmentId, setEstimatorTreatmentId] = useState<string>('gesicht-oberlippe-kinn');
  const [estimatorDuration, setEstimatorDuration] = useState<DurationMinutes>(30);
  const [activeCareTab, setActiveCareTab] = useState<'vor' | 'nach'>('vor');

  const filteredTreatments = useMemo(() => {
    if (activeCategory === 'Alle') return TREATMENTS;
    return TREATMENTS.filter((t) => t.category === activeCategory);
  }, [activeCategory]);

  const selectedTreatment = useMemo(
    () => TREATMENTS.find((t) => t.id === estimatorTreatmentId) ?? TREATMENTS[1],
    [estimatorTreatmentId]
  );

  const effectiveDuration: DurationMinutes = selectedTreatment.includesConsultation
    ? 30
    : selectedTreatment.typicalDurations.includes(estimatorDuration)
      ? estimatorDuration
      : selectedTreatment.typicalDurations[0];

  const estimatedPrice = selectedTreatment.includesConsultation
    ? CONSULTATION_PRICE_EUR
    : DURATION_PRICES_EUR[effectiveDuration];

  return (
    <div className="space-y-14 pb-16">
      {/* Header */}
      <section className="pt-2 space-y-3">
        <p className="text-xs font-medium text-[#3A7CA5]">Behandlungen &amp; Preise · Havixbeck</p>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1A1A1A] max-w-3xl">
          Präzise Elektro-Epilation für dauerhaft glatte Haut
        </h1>
        <p className="text-sm sm:text-base text-[#4B5563] max-w-2xl leading-relaxed">
          Die einzige wissenschaftlich anerkannte Methode zur 100 % dauerhaften Haarentfernung —
          geeignet für jeden Hauttyp und jede Haarfarbe, einschließlich weißer, grauer, blonder und
          rötlicher Haare.
        </p>
      </section>

      {/* Interactive Duration & Price Estimator */}
      <section
        aria-label="Interaktiver Dauer- und Preisrechner"
        className="rounded-3xl bg-[#EBF4FA]/75 border border-[#D6E7F3] p-6 sm:p-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-5">
            <div>
              <p className="text-xs font-medium text-[#3A7CA5] mb-1">Dauer- &amp; Preisrechner</p>
              <h2 className="text-xl sm:text-2xl font-semibold text-[#1A1A1A]">
                Behandlungszeit und Kosten direkt berechnen
              </h2>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="estimator-zone"
                className="block text-xs font-semibold text-[#1A1A1A]"
              >
                1. Zone oder Beratungsleistung wählen
              </label>
              <select
                id="estimator-zone"
                value={estimatorTreatmentId}
                onChange={(e) => {
                  const nextId = e.target.value;
                  setEstimatorTreatmentId(nextId);
                  const found = TREATMENTS.find((t) => t.id === nextId);
                  if (found && !found.typicalDurations.includes(estimatorDuration)) {
                    setEstimatorDuration(found.typicalDurations[0]);
                  }
                }}
                className="w-full min-h-[48px] rounded-xl bg-white border border-[#D6E7F3] px-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#3A7CA5]"
              >
                {TREATMENTS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.category} — {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <span className="block text-xs font-semibold text-[#1A1A1A]">
                2. Behandlungsdauer festlegen
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {DURATIONS.map((dur) => {
                  const supported = selectedTreatment.typicalDurations.includes(dur);
                  const active = effectiveDuration === dur;
                  return (
                    <button
                      key={dur}
                      type="button"
                      disabled={!supported}
                      onClick={() => setEstimatorDuration(dur)}
                      className={`min-h-[46px] rounded-xl px-3 py-2 text-sm font-semibold tabular-nums transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'bg-[#1A1A1A] text-white'
                          : supported
                            ? 'bg-white text-[#1A1A1A] border border-[#D6E7F3] hover:bg-white/80'
                            : 'bg-white/40 text-[#9CA3AF] border border-transparent cursor-not-allowed'
                      }`}
                    >
                      {dur} Min.
                    </button>
                  );
                })}
              </div>
              {selectedTreatment.includesConsultation && (
                <p className="text-xs text-[#4B5563]">
                  Die Erstberatung umfasst fest 30 Min. (inkl. Hautanalyse und 15 Min. Probebehandlung).
                </p>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl bg-white border border-[#D6E7F3] p-6 space-y-4 shadow-[0_12px_32px_-16px_rgba(26,26,26,0.08)]">
            <div className="flex items-baseline justify-between gap-4 border-b border-[#F3F4F6] pb-4">
              <div>
                <p className="text-xs text-[#6B7280]">{selectedTreatment.category}</p>
                <p className="text-base font-semibold text-[#1A1A1A] mt-0.5">
                  {selectedTreatment.name}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-2xl sm:text-3xl font-semibold text-[#1A1A1A] tabular-nums">
                  {estimatedPrice} €
                </p>
                <p className="text-xs text-[#6B7280] tabular-nums">{effectiveDuration} Min.</p>
              </div>
            </div>

            <ul className="space-y-2 text-xs text-[#374151]">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#3A7CA5] shrink-0 mt-0.5" />
                <span>Sterile Einweg-Gold- oder Edelstahlsonde inklusive</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#3A7CA5] shrink-0 mt-0.5" />
                <span>Beruhigende medizinische Nachpflege direkt im Studio</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#3A7CA5] shrink-0 mt-0.5" />
                <span>Empfohlenes Intervall: {selectedTreatment.recommendedInterval}</span>
              </li>
            </ul>

            <button
              type="button"
              onClick={() => onSelectForBooking(selectedTreatment, effectiveDuration)}
              className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-[#C5A880] hover:bg-[#B39368] text-white font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Diese Behandlung buchen</span>
            </button>
          </div>
        </div>
      </section>

      {/* Categorized Treatment Menu */}
      <section aria-label="Behandlungskatalog">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-semibold text-[#1A1A1A]">Alle Behandlungszonen</h2>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar bg-[#F3F6F9] p-1 rounded-xl">
            {CATEGORIES.map((category) => {
              const active = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`min-h-[40px] px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-white text-[#1A1A1A] shadow-sm'
                      : 'text-[#4B5563] hover:text-[#1A1A1A]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredTreatments.map((item) => {
            const defaultDur = item.typicalDurations[0];
            const startPrice = item.includesConsultation
              ? CONSULTATION_PRICE_EUR
              : DURATION_PRICES_EUR[defaultDur];
            return (
              <article
                key={item.id}
                className="rounded-2xl bg-white border border-[#E5E7EB] p-6 flex flex-col justify-between shadow-[0_10px_28px_-16px_rgba(26,26,26,0.06)]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-[#3A7CA5] font-medium mb-2">
                    <span>{item.category}</span>
                    <span className="text-[#1A1A1A] font-semibold tabular-nums">
                      ab {startPrice} € ({defaultDur} Min.)
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">{item.name}</h3>
                  <p className="text-sm text-[#4B5563] leading-relaxed mb-4">
                    {item.shortDescription}
                  </p>
                  <p className="text-xs text-[#6B7280] mb-5">
                    Methode: {item.methodNote} · Rhythmus: {item.recommendedInterval}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#F3F4F6]">
                  <span className="text-xs text-[#4B5563] tabular-nums">
                    Dauer: {item.typicalDurations.map((d) => `${d} Min.`).join(' / ')}
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelectForBooking(item, defaultDur)}
                    className="min-h-[44px] px-4 py-2 rounded-xl bg-[#EBF4FA] hover:bg-[#DCECF7] text-[#1A1A1A] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>Auswählen</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#3A7CA5]" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* How Electro-Epilation Works + Pre/Post Care */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-5 rounded-3xl bg-white border border-[#E5E7EB] p-6 sm:p-8 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-medium text-[#3A7CA5]">
              <Info className="w-4 h-4" />
              <span>Wirkprinzip der Elektro-Epilation</span>
            </div>
            <h2 className="text-2xl font-semibold text-[#1A1A1A]">
              So wirkt die Nadelepilation direkt im Follikel
            </h2>
            <p className="text-sm text-[#4B5563] leading-relaxed">
              Eine haarfeine, sterile Sonde gleitet schmerzfrei in den natürlichen Haarkanal bis zur
              Wachstumszone. Ein präzise dosierter Impuls verödet die Nährzellen, sodass aus diesem
              Follikel kein neues Haar mehr nachwachsen kann.
            </p>
            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-2xl bg-[#F8FBFE] border border-[#EBF4FA]">
                <p className="text-sm font-semibold text-[#1A1A1A]">Thermolyse (Hochfrequenz)</p>
                <p className="text-xs text-[#4B5563] mt-1">
                  Sekundenschnelle, gezielte Wärmeabgabe — ideal für feine Gesichtshaare und sensible Areale.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[#F8FBFE] border border-[#EBF4FA]">
                <p className="text-sm font-semibold text-[#1A1A1A]">Blend-Methode (Kombiniert)</p>
                <p className="text-xs text-[#4B5563] mt-1">
                  Verbindet Wärme und galvanische Reaktion für kräftige oder gekrümmte Haarfollikel.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 aspect-[4/3] rounded-2xl overflow-hidden bg-[#EBF4FA]">
            <ResilientImage
              src={STUDIO_IMAGES.aftercareSkincare}
              alt="Hautberuhigende Vor- und Nachsorge-Produkte"
              fallbackTitle="Vor- & Nachsorge Pflege"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="lg:col-span-7 rounded-3xl bg-white border border-[#E5E7EB] p-6 sm:p-8 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-[#B39368]">Vor- &amp; Nachsorge</p>
                <h2 className="text-2xl font-semibold text-[#1A1A1A] mt-0.5">
                  Pflegeleitfaden für optimale Hautruhe
                </h2>
              </div>
              <div className="inline-flex p-1 rounded-xl bg-[#F3F6F9]">
                <button
                  type="button"
                  onClick={() => setActiveCareTab('vor')}
                  className={`min-h-[40px] px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeCareTab === 'vor'
                      ? 'bg-white text-[#1A1A1A] shadow-sm'
                      : 'text-[#4B5563]'
                  }`}
                >
                  Vor der Behandlung
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCareTab('nach')}
                  className={`min-h-[40px] px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeCareTab === 'nach'
                      ? 'bg-white text-[#1A1A1A] shadow-sm'
                      : 'text-[#4B5563]'
                  }`}
                >
                  Nach der Behandlung
                </button>
              </div>
            </div>

            {activeCareTab === 'vor' ? (
              <div className="space-y-3">
                {PRE_TREATMENT_CHECKLIST.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-[#F8FBFE] border border-[#EBF4FA] flex items-start gap-3.5"
                  >
                    <span className="text-xs font-semibold text-[#3A7CA5] tabular-nums mt-0.5">
                      0{idx + 1}.
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[#1A1A1A]">{item.title}</p>
                      <p className="text-xs text-[#4B5563] leading-relaxed mt-1">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {AFTERCARE_TIPS.map((tip, idx) => (
                  <div
                    key={tip.title}
                    className="p-4 rounded-2xl bg-[#FBF7F1]/70 border border-[#C5A880]/25 flex items-start gap-3.5"
                  >
                    <span className="text-xs font-semibold text-[#B39368] tabular-nums mt-0.5">
                      0{idx + 1}.
                    </span>
                    <div>
                      <p className="text-xs font-medium text-[#B39368]">{tip.window}</p>
                      <p className="text-sm font-semibold text-[#1A1A1A] mt-0.5">{tip.title}</p>
                      <p className="text-xs text-[#4B5563] leading-relaxed mt-1">
                        {tip.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 pt-5 border-t border-[#F3F4F6] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs text-[#4B5563]">
              <ShieldCheck className="w-4 h-4 text-[#3A7CA5] shrink-0" />
              <span>Unsicher bei Ihrer Zone? Starten Sie mit einer Erstberatung inklusive Probe.</span>
            </div>
            <button
              type="button"
              onClick={() => onSelectForBooking(TREATMENTS[0], 30)}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-[#333333] text-white text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Probebehandlung (29 €) buchen</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

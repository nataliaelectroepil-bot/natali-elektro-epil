import React from 'react';
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Clock,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { ResilientImage } from './ResilientImage';
import { CLIENT_REVIEWS, STUDIO_IMAGES } from '../data/studioData';
import type { Appointment, AppSection } from '../types/studio';

interface StartseiteViewProps {
  onNavigate: (section: AppSection) => void;
  onOpenPortal: () => void;
  upcomingSoonAppointment?: Appointment;
}

export const StartseiteView: React.FC<StartseiteViewProps> = ({
  onNavigate,
  onOpenPortal,
  upcomingSoonAppointment,
}) => {
  const overviewCards = [
    {
      id: 'card-epilation',
      index: '01 · Behandlungen',
      title: 'Elektro-Epilation Behandlungen',
      description:
        '100 % dauerhafte Haarentfernung für Gesicht, Körper und sensible Zonen — wirksam bei jeder Haar- und Hautfarbe.',
      image: STUDIO_IMAGES.studioRoom,
      imageAlt: 'Heller Behandlungsraum bei NATALI elektro-epil in Havixbeck',
      actionLabel: 'Preise & Zonen ansehen',
      onClick: () => onNavigate('epilation'),
    },
    {
      id: 'card-schulung',
      index: '02 · Akademie Havixbeck',
      title: 'Schulung & Umschulung',
      description:
        'Zertifizierte Fach-Schulungen für Profis sowie komplette Umschulung für Quereinsteiger mit intensiver Praxis am Modell.',
      image: STUDIO_IMAGES.trainingAcademy,
      imageAlt: 'Praxistraining in der NATALI elektro-epil Akademie in Havixbeck',
      actionLabel: 'Programme entdecken',
      onClick: () => onNavigate('schulung'),
    },
    {
      id: 'card-aftercare',
      index: '03 · Hautschutz & Pflege',
      title: 'Vor- & Nachsorge',
      description:
        'Klare Pflegeprotokolle vor und nach jeder Sitzung sowie automatische 24h-Erinnerungen für optimale Hautregeneration.',
      image: STUDIO_IMAGES.aftercareSkincare,
      imageAlt: 'Beruhigende Pflegeprodukte für die Vor- und Nachsorge nach der Epilation',
      actionLabel: 'Pflegeleitfaden öffnen',
      onClick: () => onNavigate('epilation'),
    },
  ];

  const formatShortDateTime = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleString('de-DE', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-[#EBF4FA] min-h-[540px] lg:min-h-[600px] flex items-end lg:items-center">
        <ResilientImage
          src={STUDIO_IMAGES.hero}
          alt="Sanfte Gesichts-Elektro-Epilation bei NATALI elektro-epil in Havixbeck"
          fallbackTitle="NATALI elektro-epil Studio Havixbeck"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/75 via-[#1A1A1A]/25 to-transparent lg:bg-gradient-to-r lg:from-[#1A1A1A]/65 lg:via-[#1A1A1A]/20 lg:to-transparent"
          aria-hidden="true"
        />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
          <div className="max-w-xl bg-white/88 backdrop-blur-md border border-white/80 rounded-3xl p-6 sm:p-9 shadow-[0_24px_60px_-15px_rgba(26,26,26,0.18)]">
            <BrandLogo variant="card" className="mb-4" />
            <p className="text-xs font-medium text-[#3A7CA5] tracking-wide mb-2">
              Havixbeck · Münsterland · Medizinisch-ästhetische Fachpraxis &amp; Akademie
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-semibold tracking-tight text-[#1A1A1A] leading-[1.12] mb-4">
              Dauerhafte Haarentfernung, Schulung &amp; Umschulung in Havixbeck
            </h1>
            <p className="text-sm sm:text-base text-[#374151] leading-relaxed mb-7">
              Präzise Elektro-Epilation für spürbar glatte Haut bei jeder Haarfarbe — und fundierte
              Ausbildung für Ihren erfolgreichen Start in einem gefragten Fachberuf.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => onNavigate('termine')}
                className="min-h-[48px] px-6 py-3 rounded-xl bg-[#C5A880] hover:bg-[#B39368] text-white font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
              >
                <CalendarCheck className="w-4 h-4" strokeWidth={1.8} />
                <span>Termin buchen</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('schulung')}
                className="min-h-[48px] px-6 py-3 rounded-xl bg-white hover:bg-[#EBF4FA] text-[#1A1A1A] border border-[#3A7CA5]/30 font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <GraduationCap className="w-4 h-4 text-[#3A7CA5]" strokeWidth={1.8} />
                <span>Schulung &amp; Umschulung</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Smart 24h Pre-Treatment Reminder Banner (if upcoming appointment exists) */}
      {upcomingSoonAppointment && (
        <section
          aria-label="Automatische 24-Stunden-Terminerinnerung"
          className="bg-[#EBF4FA] border border-[#3A7CA5]/20 rounded-2xl p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
        >
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#3A7CA5]">
              <Clock className="w-4 h-4 shrink-0" strokeWidth={1.8} />
              <span>24h Vorab-Erinnerung aktiv</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">
                Nächster Termin: {formatShortDateTime(upcomingSoonAppointment.dateTimeIso)} Uhr
              </span>
              <span aria-hidden="true">·</span>
              <span>{upcomingSoonAppointment.treatmentName}</span>
            </div>
            <p className="text-sm sm:text-base font-medium text-[#1A1A1A]">
              Bitte 24h vorher keine direkte Sonne, Haarlänge ca. 2–3 mm belassen und ungeschminkt erscheinen.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenPortal}
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-white hover:bg-white/90 border border-[#3A7CA5]/25 text-sm font-semibold text-[#1A1A1A] inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Checkliste in Meine Termine</span>
            <ArrowRight className="w-4 h-4 text-[#3A7CA5]" />
          </button>
        </section>
      )}

      {/* Dual-User Flow Strip */}
      <section aria-label="Wegweiser für Kunden und Lernende" className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="rounded-2xl bg-white border border-[#E5E7EB] p-6 sm:p-7 flex flex-col justify-between shadow-[0_10px_30px_-15px_rgba(26,26,26,0.06)]">
          <div>
            <p className="text-xs font-medium text-[#3A7CA5] mb-2">Für Studio-Kundinnen &amp; -Kunden</p>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#1A1A1A] mb-2">
              Dauerhaft haarfreie Haut
            </h2>
            <p className="text-sm text-[#4B5563] leading-relaxed mb-5">
              Individuelle Behandlung im Gesicht, an den Achseln oder sensiblen Zonen — inklusive
              digitalem Terminportal und persönlicher Nachsorge.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('epilation')}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-[#EBF4FA] hover:bg-[#DCECF7] text-[#1A1A1A] text-sm font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Behandlungen &amp; Preise</span>
              <ArrowRight className="w-4 h-4 text-[#3A7CA5]" />
            </button>
            <button
              type="button"
              onClick={onOpenPortal}
              className="min-h-[44px] px-3 py-2 text-sm font-medium text-[#3A7CA5] hover:text-[#1A1A1A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Zu Meine Termine
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-[#E5E7EB] p-6 sm:p-7 flex flex-col justify-between shadow-[0_10px_30px_-15px_rgba(26,26,26,0.06)]">
          <div>
            <p className="text-xs font-medium text-[#B39368] mb-2">
              Für Fachkräfte &amp; Quereinsteiger
            </p>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#1A1A1A] mb-2">
              Schulung &amp; Umschulung in Havixbeck
            </h2>
            <p className="text-sm text-[#4B5563] leading-relaxed mb-5">
              Lernen Sie Elektro-Epilation von Grund auf oder spezialisieren Sie Ihr Studio — in
              kleinen Gruppen mit echten Modellen und anerkanntem Zertifikat.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('schulung')}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-[#FBF7F1] hover:bg-[#F5EDE0] border border-[#C5A880]/40 text-[#1A1A1A] text-sm font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Termine &amp; Bewerbung</span>
              <ArrowRight className="w-4 h-4 text-[#C5A880]" />
            </button>
          </div>
        </div>
      </section>

      {/* Quick Overview Cards (Horizontal Scrollable on Mobile, 3-Column Grid on Desktop) */}
      <section aria-label="Schnellübersicht">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-medium text-[#3A7CA5] mb-1">Leistungsübersicht</p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1A1A1A]">
              Behandlung, Akademie &amp; Hautpflege
            </h2>
          </div>
        </div>

        <div className="flex md:grid md:grid-cols-3 gap-5 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-2 md:pb-0 no-scrollbar">
          {overviewCards.map((card) => (
            <article
              key={card.id}
              className="min-w-[82%] sm:min-w-[60%] md:min-w-0 snap-start rounded-2xl bg-white border border-[#E5E7EB] overflow-hidden flex flex-col justify-between shadow-[0_12px_32px_-16px_rgba(26,26,26,0.08)]"
            >
              <div>
                <div className="aspect-[4/3] w-full overflow-hidden bg-[#EBF4FA]">
                  <ResilientImage
                    src={card.image}
                    alt={card.imageAlt}
                    fallbackTitle={card.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <p className="text-xs font-medium text-[#3A7CA5] mb-1.5">{card.index}</p>
                  <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">{card.title}</h3>
                  <p className="text-sm text-[#4B5563] leading-relaxed">{card.description}</p>
                </div>
              </div>
              <div className="px-6 pb-6 pt-1">
                <button
                  type="button"
                  onClick={card.onClick}
                  className="min-h-[44px] inline-flex items-center gap-2 text-sm font-semibold text-[#1A1A1A] hover:text-[#3A7CA5] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>{card.actionLabel}</span>
                  <ArrowRight className="w-4 h-4 text-[#C5A880]" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Studio-Philosophie */}
      <section className="rounded-3xl bg-[#EBF4FA]/70 border border-[#D6E7F3] p-6 sm:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-center space-y-5">
            <p className="text-xs font-medium text-[#3A7CA5]">Studio-Philosophie in Havixbeck</p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1A1A1A]">
              Klinische Reinheit trifft ruhige, individuelle Betreuung
            </h2>
            <p className="text-sm sm:text-base text-[#374151] leading-relaxed">
              Bei NATALI elektro-epil stehen präzise Handwerkskunst, strengste Hygienestandards und
              ehrliche Aufklärung an erster Stelle. Während Licht- und Lasersysteme bei blonden,
              roten, weißen oder feinen Flaumhaaren an Grenzen stoßen, verödet die Elektro-Epilation
              jeden Haarfollikel einzeln und endgültig.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-white rounded-2xl p-4 border border-[#D6E7F3]">
                <ShieldCheck className="w-5 h-5 text-[#3A7CA5] mb-2" strokeWidth={1.7} />
                <p className="text-sm font-semibold text-[#1A1A1A]">100 % Einweg-Sonden</p>
                <p className="text-xs text-[#4B5563] mt-1">
                  Sterile Gold- &amp; Edelstahlsonden für jede einzelne Kundin.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-[#D6E7F3]">
                <Sparkles className="w-5 h-5 text-[#C5A880] mb-2" strokeWidth={1.7} />
                <p className="text-sm font-semibold text-[#1A1A1A]">Alle Haarfarben</p>
                <p className="text-xs text-[#4B5563] mt-1">
                  Wirksam bei weißen, grauen, roten, blonden und dunklen Haaren.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-[#D6E7F3]">
                <CheckCircle2 className="w-5 h-5 text-[#3A7CA5] mb-2" strokeWidth={1.7} />
                <p className="text-sm font-semibold text-[#1A1A1A]">Ruhige Privatpraxis</p>
                <p className="text-xs text-[#4B5563] mt-1">
                  Feste Einzeltermine ohne Wartezeit direkt in Havixbeck.
                </p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="h-full min-h-[260px] rounded-2xl overflow-hidden bg-white border border-[#D6E7F3]">
              <ResilientImage
                src={STUDIO_IMAGES.studioRoom}
                alt="Steriles Behandlungszimmer bei NATALI elektro-epil Havixbeck"
                fallbackTitle="Hygienestandard Studio Havixbeck"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Kundenbewertungen */}
      <section aria-label="Kundenbewertungen">
        <div className="mb-6">
          <p className="text-xs font-medium text-[#3A7CA5] mb-1">Erfahrungen aus dem Münsterland</p>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1A1A1A]">
            Kundenbewertungen &amp; Absolventenstimmen
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {CLIENT_REVIEWS.map((review) => (
            <article
              key={review.id}
              className="rounded-2xl bg-white border border-[#E5E7EB] p-6 flex flex-col justify-between shadow-[0_10px_28px_-16px_rgba(26,26,26,0.08)]"
            >
              <div>
                <div className="flex items-center gap-1 text-[#C5A880] mb-4" aria-label="5 von 5 Sternen">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#C5A880] text-[#C5A880]" />
                  ))}
                </div>
                <p className="text-sm text-[#1A1A1A] leading-relaxed mb-3">„{review.quote}“</p>
                <p className="text-xs text-[#4B5563] leading-relaxed mb-5">{review.outcome}</p>
              </div>
              <div className="pt-4 border-t border-[#F3F4F6]">
                <p className="text-sm font-semibold text-[#1A1A1A]">{review.author}</p>
                <p className="text-xs text-[#6B7280] mt-0.5">{review.locationAndService}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

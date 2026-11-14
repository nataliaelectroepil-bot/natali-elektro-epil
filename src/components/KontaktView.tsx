import React, { useState } from 'react';
import {
  Car,
  ChevronDown,
  Clock,
  Instagram,
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
  TrainFront,
} from 'lucide-react';
import { FAQ_ITEMS, STUDIO_IMAGES } from '../data/studioData';
import { HavixbeckMap } from './HavixbeckMap';
import { ResilientImage } from './ResilientImage';

interface KontaktViewProps {
  onOpenLegal: (doc: 'impressum' | 'datenschutz') => void;
}

export const KontaktView: React.FC<KontaktViewProps> = ({ onOpenLegal }) => {
  const [faqTopic, setFaqTopic] = useState<'Alle' | 'Behandlung' | 'Schulung & Umschulung' | 'Studio & Hygiene'>('Alle');
  const [openFaqId, setOpenFaqId] = useState<string | null>(FAQ_ITEMS[0].id);

  const visibleFaqs =
    faqTopic === 'Alle' ? FAQ_ITEMS : FAQ_ITEMS.filter((item) => item.topic === faqTopic);

  return (
    <div className="space-y-14 pb-16">
      {/* Header */}
      <section className="pt-2 space-y-3">
        <p className="text-xs font-medium text-[#3A7CA5]">Kontakt &amp; Studio in Havixbeck</p>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1A1A1A]">
          Anfahrt, Hygiene &amp; direkte Erreichbarkeit
        </h1>
        <p className="text-sm sm:text-base text-[#4B5563] max-w-2xl leading-relaxed">
          Unser Studio und die Fachakademie liegen ruhig und gut erreichbar im Herzen von
          Havixbeck im Münsterland — nur rund 18 Autominuten von Münster entfernt.
        </p>
      </section>

      {/* Map + Directions & Direct Channels */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-4">
          <HavixbeckMap />
        </div>

        <div className="lg:col-span-5 space-y-5">
          {/* Anfahrt & Parken */}
          <div className="rounded-3xl bg-white border border-[#E5E7EB] p-6 space-y-4 shadow-[0_12px_32px_-16px_rgba(26,26,26,0.06)]">
            <h2 className="text-xl font-semibold text-[#1A1A1A]">
              Anfahrt &amp; Parken in Havixbeck
            </h2>

            <div className="space-y-3 text-sm text-[#4B5563]">
              <div className="flex items-start gap-3">
                <Car className="w-5 h-5 text-[#3A7CA5] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#1A1A1A]">Mit dem PKW &amp; Parkplätze</p>
                  <p className="text-xs leading-relaxed mt-0.5">
                    Über die L550 / B54 aus Münster, Coesfeld oder Nottuln bequem erreichbar.
                    Kostenfreie Kundenparkplätze direkt am Haus sowie rund um den Ortskern Havixbeck.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <TrainFront className="w-5 h-5 text-[#3A7CA5] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#1A1A1A]">Öffentliche Verkehrsmittel</p>
                  <p className="text-xs leading-relaxed mt-0.5">
                    Mit der Baumberge-Bahn (RB63) ab Münster Hbf oder Coesfeld bis Bahnhof
                    Havixbeck; von dort wenige Minuten Fußweg in den Ortskern.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#1A1A1A]">Studio- &amp; Akademiezeiten</p>
                  <p className="text-xs leading-relaxed mt-0.5 tabular-nums">
                    Mo – Fr: 09:00 – 18:30 Uhr · Sa: nach Vereinbarung (und Schulungswochenenden)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Direct WhatsApp / Instagram / Mail */}
          <div className="rounded-3xl bg-[#EBF4FA]/75 border border-[#D6E7F3] p-6 space-y-4">
            <h2 className="text-lg font-semibold text-[#1A1A1A]">Direkter Kontakt</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href="https://wa.me/4925070000000?text=Hallo%20Natali%2C%20ich%20habe%20eine%20Frage%20zur%20Elektro-Epilation%20oder%20Schulung%20in%20Havixbeck."
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[48px] px-4 py-3 rounded-xl bg-[#1A1A1A] hover:bg-[#333333] text-white text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#C5A880]" />
                <span>WhatsApp Beratung</span>
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[48px] px-4 py-3 rounded-xl bg-white hover:bg-white/90 border border-[#D6E7F3] text-[#1A1A1A] text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors"
              >
                <Instagram className="w-4 h-4 text-[#3A7CA5]" />
                <span>@natali.elektroepil</span>
              </a>
            </div>
            <div className="pt-2 space-y-1.5 text-xs text-[#374151]">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#3A7CA5]" />
                <span>natalia.electro.epil@gmail.com</span>
              </p>
              <p className="flex items-center gap-2 tabular-nums">
                <Phone className="w-4 h-4 text-[#3A7CA5]" />
                <span>02507 / Havixbeck · Terminvereinbarung auf Anfrage</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sterile Standards Showcase */}
      <section className="rounded-3xl bg-white border border-[#E5E7EB] p-6 sm:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-5">
            <div className="h-full min-h-[240px] rounded-2xl overflow-hidden bg-[#EBF4FA]">
              <ResilientImage
                src={STUDIO_IMAGES.studioRoom}
                alt="Steriles Behandlungszimmer bei NATALI elektro-epil"
                fallbackTitle="Hygienestandard Studio Havixbeck"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-7 flex flex-col justify-center space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-medium text-[#3A7CA5]">
              <ShieldCheck className="w-4 h-4" />
              <span>Hygienestandards auf medizinischem Niveau</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#1A1A1A]">
              Maximale Sterilität bei jedem Handgriff
            </h2>
            <p className="text-sm text-[#4B5563] leading-relaxed">
              In unserem Studio und in allen Schulungsräumen arbeiten wir streng nach
              Hygieneverordnung. Jede Kundin und jedes Modell erhält eine frisch geöffnete,
              einzeln steril verpackte Einwegsonde.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-[#374151]">
              <div className="p-4 rounded-2xl bg-[#F8FBFE] border border-[#EBF4FA]">
                <p className="font-semibold text-[#1A1A1A]">Einmal-Sonden &amp; Schutzmaterial</p>
                <p className="mt-1 text-[#4B5563]">
                  Sterile Einzelblister aus medizinischem Edelstahl oder 24k vergoldet, nach jeder
                  Sitzung fachgerecht entsorgt.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[#F8FBFE] border border-[#EBF4FA]">
                <p className="font-semibold text-[#1A1A1A]">Autoklav- &amp; Ultraschall-Zyklus</p>
                <p className="mt-1 text-[#4B5563]">
                  Vollständige Instrumentenaufbereitung für Pinzetten sowie VAH-gelistete
                  Flächendesinfektion zwischen allen Terminen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section aria-label="Häufige Fragen">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-medium text-[#3A7CA5] mb-1">Häufig gestellte Fragen</p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#1A1A1A]">
              Fragen zu Behandlung, Schulung &amp; Umschulung
            </h2>
          </div>

          <div className="flex items-center gap-1 bg-[#F3F6F9] p-1 rounded-xl overflow-x-auto no-scrollbar">
            {(['Alle', 'Behandlung', 'Schulung & Umschulung', 'Studio & Hygiene'] as const).map(
              (topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => setFaqTopic(topic)}
                  className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    faqTopic === topic
                      ? 'bg-white text-[#1A1A1A] shadow-sm'
                      : 'text-[#4B5563] hover:text-[#1A1A1A]'
                  }`}
                >
                  {topic}
                </button>
              )
            )}
          </div>
        </div>

        <div className="space-y-3">
          {visibleFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-2xl bg-white border border-[#E5E7EB] overflow-hidden"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  className="w-full min-h-[56px] px-6 py-4 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div>
                    <span className="block text-[11px] font-medium text-[#3A7CA5] mb-0.5">
                      {faq.topic}
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-[#1A1A1A]">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-[#6B7280] shrink-0 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-0 text-sm text-[#4B5563] leading-relaxed border-t border-[#F3F4F6]">
                    <p className="pt-3">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Legal Footer Card */}
      <section className="rounded-2xl bg-[#F8FBFE] border border-[#EBF4FA] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#1A1A1A]">Rechtliche Hinweise &amp; Standort</p>
          <p className="text-xs text-[#4B5563] mt-0.5">
            NATALI elektro-epil · Fachpraxis &amp; Akademie · 48329 Havixbeck
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onOpenLegal('impressum')}
            className="min-h-[42px] px-4 py-2 rounded-xl bg-white border border-[#D6E7F3] text-xs font-semibold text-[#1A1A1A] hover:bg-[#EBF4FA] cursor-pointer"
          >
            Impressum
          </button>
          <button
            type="button"
            onClick={() => onOpenLegal('datenschutz')}
            className="min-h-[42px] px-4 py-2 rounded-xl bg-white border border-[#D6E7F3] text-xs font-semibold text-[#1A1A1A] hover:bg-[#EBF4FA] cursor-pointer"
          >
            Datenschutz
          </button>
        </div>
      </section>
    </div>
  );
};

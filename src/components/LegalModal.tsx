import React from 'react';
import { X } from 'lucide-react';

interface LegalModalProps {
  doc: 'impressum' | 'datenschutz' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ doc, onClose }) => {
  if (!doc) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={doc === 'impressum' ? 'Impressum' : 'Datenschutzerklärung'}
      className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl bg-white border border-[#E5E7EB] p-6 sm:p-8 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 border-b border-[#F3F4F6] pb-4">
          <h2 className="text-xl font-semibold text-[#1A1A1A]">
            {doc === 'impressum' ? 'Impressum' : 'Datenschutzerklärung'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Dialog schließen"
            className="min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center text-[#4B5563] hover:bg-[#F3F6F9] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {doc === 'impressum' ? (
          <div className="space-y-3 text-sm text-[#374151] leading-relaxed">
            <p className="font-semibold text-[#1A1A1A]">Angaben gemäß § 5 DDG</p>
            <p>
              NATALI elektro-epil — Studio für Elektro-Epilation &amp; Fachakademie
              <br />
              Inhaberin: Natali
              <br />
              48329 Havixbeck, Münsterland
              <br />
              Deutschland
            </p>
            <p>
              E-Mail: natalia.electro.epil@gmail.com
              <br />
              Telefon / Terminanfragen: 02507 (Havixbeck)
            </p>
            <p className="text-xs text-[#6B7280] pt-2">
              Hinweis: Alle Behandlungen sowie Schulungs- und Umschulungsprogramme erfolgen nach
              individueller Terminvereinbarung und persönlicher Eignungsprüfung.
            </p>
          </div>
        ) : (
          <div className="space-y-3 text-sm text-[#374151] leading-relaxed">
            <p className="font-semibold text-[#1A1A1A]">1. Verantwortliche Stelle &amp; Zweck</p>
            <p>
              Wir verarbeiten Ihre Angaben aus Terminbuchungen, Checklisten und
              Schulungs- bzw. Umschulungsanfragen ausschließlich zur Vorbereitung, Durchführung und
              Nachbetreuung Ihrer Termine in Havixbeck.
            </p>
            <p className="font-semibold text-[#1A1A1A]">2. Lokale Speicherung im Browser</p>
            <p>
              Ihre persönlichen Buchungen und Vorbereitungs-Checklisten im Portal „Meine Termine“
              werden lokal in Ihrem Browser gespeichert, sodass Sie Termine jederzeit verschieben
              oder stornieren können.
            </p>
            <p className="font-semibold text-[#1A1A1A]">3. Einbindung von Google Maps</p>
            <p>
              Im Bereich „Kontakt &amp; Studio“ nutzen wir zur Darstellung der Anfahrt und
              Parkmöglichkeiten in Havixbeck Funktionen von Google Maps Platform. Es gelten die{' '}
              <a
                href="https://maps.google.com/help/terms_maps/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#3A7CA5] underline"
              >
                Google Maps Endnutzerbedingungen
              </a>{' '}
              sowie die{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#3A7CA5] underline"
              >
                Datenschutzerklärung von Google
              </a>
              .
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

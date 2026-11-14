import React, { useMemo, useState } from 'react';
import {
  Award,
  Calendar,
  Check,
  CheckCircle2,
  GraduationCap,
  Send,
  Users,
} from 'lucide-react';
import {
  CURRICULUM_MODULES,
  STUDIO_IMAGES,
  TRAINING_TRACKS,
} from '../data/studioData';
import { ResilientImage } from './ResilientImage';
import type { TrainingCohort, TrainingInquiry } from '../types/studio';

interface SchulungViewProps {
  cohorts: TrainingCohort[];
  onSubmitInquiry: (inquiry: Omit<TrainingInquiry, 'id' | 'createdAtIso'>) => void;
  submittedInquiries: TrainingInquiry[];
}

export const SchulungView: React.FC<SchulungViewProps> = ({
  cohorts,
  onSubmitInquiry,
  submittedInquiries,
}) => {
  const [selectedTrackId, setSelectedTrackId] = useState<string>(TRAINING_TRACKS[0].id);
  const [selectedCohortId, setSelectedCohortId] = useState<string>(cohorts[0]?.id ?? '');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [background, setBackground] = useState('Quereinsteiger / Berufswechsel');
  const [message, setMessage] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmationId, setConfirmationId] = useState<string | null>(null);

  const selectedTrack = useMemo(
    () => TRAINING_TRACKS.find((t) => t.id === selectedTrackId) ?? TRAINING_TRACKS[0],
    [selectedTrackId]
  );

  const handleSelectCohort = (cohort: TrainingCohort) => {
    setSelectedTrackId(cohort.trackId);
    setSelectedCohortId(cohort.id);
    const formEl = document.getElementById('akademie-bewerbung');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setFormError('Bitte füllen Sie Ihren Namen, Ihre E-Mail-Adresse und Telefonnummer aus.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFormError('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
      return;
    }
    if (!privacyAccepted) {
      setFormError('Bitte bestätigen Sie die Hinweise zum Datenschutz für Ihre Anfrage.');
      return;
    }

    onSubmitInquiry({
      trackId: selectedTrackId,
      cohortId: selectedCohortId,
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      background,
      message: message.trim(),
    });

    setConfirmationId(`ANF-${Date.now().toString().slice(-5)}`);
    setFullName('');
    setEmail('');
    setPhone('');
    setMessage('');
    setPrivacyAccepted(false);
  };

  return (
    <div className="space-y-14 pb-16">
      {/* Header Banner */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-7 flex flex-col justify-center space-y-4">
          <p className="text-xs font-medium text-[#B39368]">
            Akademie Havixbeck · Weiterbildung &amp; Berufswechsel
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1A1A1A]">
            Schulung &amp; Umschulung in der Elektro-Epilation
          </h1>
          <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed">
            Ob Sie als Beauty-Profi Ihr Leistungsangebot erweitern möchten oder als Quereinsteigerin
            einen eigenständigen, hochspezialisierten Fachberuf suchen — in unserer Akademie in
            Havixbeck trainieren Sie praxisnah in kleinen Gruppen am echten Modell.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#akademie-termine"
              className="min-h-[46px] px-5 py-2.5 rounded-xl bg-[#C5A880] hover:bg-[#B39368] text-white text-sm font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
            >
              <Calendar className="w-4 h-4" />
              <span>Nächste Termine ansehen</span>
            </a>
            <a
              href="#akademie-bewerbung"
              className="min-h-[46px] px-5 py-2.5 rounded-xl bg-[#EBF4FA] hover:bg-[#DCECF7] text-[#1A1A1A] text-sm font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
            >
              <GraduationCap className="w-4 h-4 text-[#3A7CA5]" />
              <span>Beratungsgespräch anfragen</span>
            </a>
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="h-full min-h-[260px] rounded-3xl overflow-hidden bg-[#EBF4FA] border border-[#D6E7F3]">
            <ResilientImage
              src={STUDIO_IMAGES.trainingAcademy}
              alt="Kleine Gruppe beim Praxistraining für Elektro-Epilation in Havixbeck"
              fallbackTitle="Akademie NATALI elektro-epil"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Program Tracks */}
      <section aria-label="Ausbildungsprogramme">
        <div className="mb-6">
          <p className="text-xs font-medium text-[#3A7CA5] mb-1">Drei spezialisierte Wege</p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#1A1A1A]">
            Das passende Programm für Ihren Start
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {TRAINING_TRACKS.map((track) => {
            const isSelected = track.id === selectedTrackId;
            return (
              <article
                key={track.id}
                className={`rounded-2xl p-6 flex flex-col justify-between transition-colors border ${
                  isSelected
                    ? 'bg-[#F8FBFE] border-[#3A7CA5] shadow-[0_12px_32px_-16px_rgba(58,124,165,0.22)]'
                    : 'bg-white border-[#E5E7EB]'
                }`}
              >
                <div>
                  <p className="text-xs font-medium text-[#B39368] mb-2">{track.badgeLabel}</p>
                  <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">{track.title}</h3>
                  <p className="text-xs text-[#3A7CA5] font-medium mb-3">
                    {track.duration} · {track.format}
                  </p>
                  <p className="text-sm text-[#4B5563] leading-relaxed mb-4">{track.summary}</p>
                  <ul className="space-y-2 mb-6">
                    {track.highlights.map((hl) => (
                      <li key={hl} className="flex items-start gap-2 text-xs text-[#374151]">
                        <Check className="w-4 h-4 text-[#3A7CA5] shrink-0 mt-0.5" />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-[#E5E7EB]/80 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-[#6B7280]">Teilnahmegebühr</p>
                    <p className="text-xl font-semibold text-[#1A1A1A] tabular-nums">
                      {track.priceEur.toLocaleString('de-DE')} €
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTrackId(track.id);
                      const matchingCohort = cohorts.find((c) => c.trackId === track.id);
                      if (matchingCohort) setSelectedCohortId(matchingCohort.id);
                    }}
                    className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-[#1A1A1A] text-white'
                        : 'bg-[#EBF4FA] hover:bg-[#DCECF7] text-[#1A1A1A]'
                    }`}
                  >
                    {isSelected ? 'Ausgewählt' : 'Track wählen'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Upcoming Dates & Available Spots Counter */}
      <section id="akademie-termine" aria-label="Nächste Schulungstermine">
        <div className="mb-6">
          <p className="text-xs font-medium text-[#3A7CA5] mb-1">Termine &amp; Verfügbarkeit</p>
          <h2 className="text-2xl font-semibold text-[#1A1A1A]">
            Kommende Lehrgänge in Havixbeck
          </h2>
        </div>

        <div className="rounded-2xl bg-white border border-[#E5E7EB] divide-y divide-[#F3F4F6] overflow-hidden">
          {cohorts.map((cohort) => {
            const track = TRAINING_TRACKS.find((t) => t.id === cohort.trackId);
            const isSelected = cohort.id === selectedCohortId;
            return (
              <div
                key={cohort.id}
                className={`p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isSelected ? 'bg-[#F8FBFE]' : ''
                }`}
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#6B7280]">
                    <span className="font-semibold text-[#3A7CA5]">{cohort.location}</span>
                    <span aria-hidden="true">·</span>
                    <span>{cohort.scheduleSummary}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-[#1A1A1A]">
                    {cohort.dateLabel} — {track?.title}
                  </h3>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap items-center gap-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#1A1A1A] tabular-nums whitespace-nowrap">
                    <Users className="w-4 h-4 text-[#C5A880]" />
                    <span>
                      {cohort.availableSpots > 0
                        ? `Noch ${cohort.availableSpots} von ${cohort.totalSpots} freien Plätzen`
                        : 'Ausgebucht (Warteliste)'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSelectCohort(cohort)}
                    className="min-h-[44px] px-4 py-2 rounded-xl bg-[#C5A880] hover:bg-[#B39368] text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Termin anfragen
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Curriculum Breakdown + Certificate Preview */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-5">
          <div>
            <p className="text-xs font-medium text-[#3A7CA5] mb-1">
              Inhalte &amp; Praxis am Modell
            </p>
            <h2 className="text-2xl font-semibold text-[#1A1A1A]">
              Strukturierter Aufbau in 5 Modulen
            </h2>
          </div>

          <div className="space-y-3">
            {CURRICULUM_MODULES.map((mod) => (
              <div
                key={mod.number}
                className="rounded-2xl bg-white border border-[#E5E7EB] p-5 flex items-start gap-4"
              >
                <span className="text-base font-semibold text-[#C5A880] tabular-nums shrink-0">
                  {mod.number}.
                </span>
                <div>
                  <h3 className="text-base font-semibold text-[#1A1A1A]">{mod.title}</h3>
                  <p className="text-sm text-[#4B5563] leading-relaxed mt-1">{mod.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certificate Preview */}
        <div className="lg:col-span-5 space-y-4">
          <p className="text-xs font-medium text-[#B39368]">Zertifikat &amp; Berufseinstieg</p>
          <div className="rounded-3xl bg-gradient-to-br from-[#FBF7F1] via-white to-[#EBF4FA] border border-[#C5A880]/50 p-7 sm:p-8 shadow-[0_20px_50px_-20px_rgba(26,26,26,0.12)]">
            <div className="border border-[#C5A880]/40 rounded-2xl p-6 text-center space-y-4 bg-white/85 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-full bg-[#FBF7F1] border border-[#C5A880]/40 mx-auto flex items-center justify-center">
                <Award className="w-6 h-6 text-[#C5A880]" strokeWidth={1.6} />
              </div>
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[#3A7CA5] uppercase">
                Fachzertifikat
              </p>
              <h3
                className="text-2xl sm:text-3xl font-semibold italic text-[#1A1A1A]"
                style={{ fontFamily: 'var(--font-serif-brand)' }}
              >
                Zertifizierte Fachkraft für Elektro-Epilation
              </h3>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                Ausgestellt durch die Fachakademie NATALI elektro-epil Havixbeck nach erfolgreicher
                Theorie- und Praxisprüfung am Modell inklusive Hygienenachweis.
              </p>
              <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between text-xs text-[#6B7280]">
                <span>Akademie Havixbeck</span>
                <span className="font-medium text-[#1A1A1A]">Natali · Ausbildungsleitung</span>
              </div>
            </div>
            <p className="text-xs text-[#4B5563] mt-4 leading-relaxed">
              Nach Abschluss erhalten Sie neben Ihrem Zertifikat Checklisten für Gewerbeanmeldung,
              Gerätebeschaffung und rechtssichere Kundenaufklärung.
            </p>
          </div>
        </div>
      </section>

      {/* Inquiry / Application Form */}
      <section
        id="akademie-bewerbung"
        aria-label="Unverbindliches Beratungsgespräch oder Bewerbung"
        className="rounded-3xl bg-[#EBF4FA]/70 border border-[#D6E7F3] p-6 sm:p-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-4">
            <p className="text-xs font-medium text-[#3A7CA5]">Persönliche Beratung</p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#1A1A1A]">
              Unverbindliches Beratungsgespräch oder Bewerbung
            </h2>
            <p className="text-sm text-[#374151] leading-relaxed">
              Sie möchten prüfen, ob die Umschulung oder Fach-Schulung zu Ihrer beruflichen
              Situation passt? Senden Sie uns Ihre unverbindliche Anfrage — wir melden uns innerhalb
              von 24 Stunden telefonisch oder per E-Mail.
            </p>
            <div className="rounded-2xl bg-white p-5 border border-[#D6E7F3] space-y-2">
              <p className="text-xs font-medium text-[#6B7280]">Aktuelle Auswahl</p>
              <p className="text-sm font-semibold text-[#1A1A1A]">{selectedTrack.title}</p>
              <p className="text-xs text-[#3A7CA5]">
                Voraussetzung: {selectedTrack.prerequisites}
              </p>
            </div>
            {submittedInquiries.length > 0 && (
              <div className="rounded-2xl bg-white p-4 border border-[#D6E7F3] text-xs text-[#374151]">
                Bereits eingereichte Anfragen in dieser Sitzung: {submittedInquiries.length}
              </div>
            )}
          </div>

          <div className="lg:col-span-7">
            {confirmationId ? (
              <div className="rounded-2xl bg-white border border-[#D6E7F3] p-7 space-y-4">
                <div className="flex items-center gap-3 text-[#3A7CA5]">
                  <CheckCircle2 className="w-6 h-6" />
                  <h3 className="text-xl font-semibold text-[#1A1A1A]">
                    Ihre Anfrage ist eingegangen
                  </h3>
                </div>
                <p className="text-sm text-[#4B5563] leading-relaxed">
                  Vielen Dank! Wir haben Ihre Bewerbung bzw. Gesprächsanfrage unter der Referenz{' '}
                  <span className="font-semibold text-[#1A1A1A] tabular-nums">{confirmationId}</span>{' '}
                  für <strong>{selectedTrack.title}</strong> registriert und ein Beratungsfenster
                  reserviert.
                </p>
                <button
                  type="button"
                  onClick={() => setConfirmationId(null)}
                  className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#EBF4FA] hover:bg-[#DCECF7] text-sm font-semibold text-[#1A1A1A] cursor-pointer"
                >
                  Weitere Anfrage senden
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl bg-white border border-[#D6E7F3] p-6 sm:p-8 space-y-4"
                noValidate
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="schulung-track"
                      className="block text-xs font-semibold text-[#1A1A1A] mb-1.5"
                    >
                      Gewünschtes Programm
                    </label>
                    <select
                      id="schulung-track"
                      value={selectedTrackId}
                      onChange={(e) => setSelectedTrackId(e.target.value)}
                      className="w-full min-h-[46px] rounded-xl border border-[#D1D5DB] px-3.5 py-2 text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#3A7CA5]"
                    >
                      {TRAINING_TRACKS.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="schulung-cohort"
                      className="block text-xs font-semibold text-[#1A1A1A] mb-1.5"
                    >
                      Wunschtermin in Havixbeck
                    </label>
                    <select
                      id="schulung-cohort"
                      value={selectedCohortId}
                      onChange={(e) => setSelectedCohortId(e.target.value)}
                      className="w-full min-h-[46px] rounded-xl border border-[#D1D5DB] px-3.5 py-2 text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#3A7CA5]"
                    >
                      {cohorts.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.dateLabel} ({c.availableSpots} Plätze frei)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="schulung-name"
                      className="block text-xs font-semibold text-[#1A1A1A] mb-1.5"
                    >
                      Vor- und Nachname *
                    </label>
                    <input
                      id="schulung-name"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="z. B. Laura Kästner"
                      className="w-full min-h-[46px] rounded-xl border border-[#D1D5DB] px-3.5 py-2 text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#3A7CA5]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="schulung-background"
                      className="block text-xs font-semibold text-[#1A1A1A] mb-1.5"
                    >
                      Aktueller Hintergrund
                    </label>
                    <select
                      id="schulung-background"
                      value={background}
                      onChange={(e) => setBackground(e.target.value)}
                      className="w-full min-h-[46px] rounded-xl border border-[#D1D5DB] px-3.5 py-2 text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#3A7CA5]"
                    >
                      <option value="Quereinsteiger / Berufswechsel">
                        Quereinsteiger / Berufswechsel
                      </option>
                      <option value="Kosmetikerin / Beauty-Studio">
                        Kosmetikerin / Beauty-Studio
                      </option>
                      <option value="Medizinischer / pflegerischer Beruf">
                        Medizinischer / pflegerischer Beruf
                      </option>
                      <option value="Bereits im Bereich Epilation tätig">
                        Bereits im Bereich Epilation tätig
                      </option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="schulung-email"
                      className="block text-xs font-semibold text-[#1A1A1A] mb-1.5"
                    >
                      E-Mail-Adresse *
                    </label>
                    <input
                      id="schulung-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@beispiel.de"
                      className="w-full min-h-[46px] rounded-xl border border-[#D1D5DB] px-3.5 py-2 text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#3A7CA5]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="schulung-phone"
                      className="block text-xs font-semibold text-[#1A1A1A] mb-1.5"
                    >
                      Telefon / WhatsApp *
                    </label>
                    <input
                      id="schulung-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+49 170 0000000"
                      className="w-full min-h-[46px] rounded-xl border border-[#D1D5DB] px-3.5 py-2 text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#3A7CA5]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="schulung-message"
                    className="block text-xs font-semibold text-[#1A1A1A] mb-1.5"
                  >
                    Ihre Fragen oder Ziele (optional)
                  </label>
                  <textarea
                    id="schulung-message"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Erzählen Sie uns kurz, ob Sie ein eigenes Studio planen oder als Zusatzangebot starten möchten."
                    className="w-full rounded-xl border border-[#D1D5DB] px-3.5 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#3A7CA5]"
                  />
                </div>

                <label className="flex items-start gap-2.5 text-xs text-[#4B5563] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacyAccepted}
                    onChange={(e) => setPrivacyAccepted(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-[#D1D5DB] text-[#3A7CA5] focus:ring-[#3A7CA5]"
                  />
                  <span>
                    Ich stimme zu, dass meine Angaben zur Bearbeitung meiner Schulungs- bzw.
                    Umschulungsanfrage gemäß Datenschutzerklärung verarbeitet werden.
                  </span>
                </label>

                {formError && (
                  <p role="alert" className="text-xs font-medium text-red-700 bg-red-50 px-3.5 py-2.5 rounded-xl">
                    {formError}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full min-h-[48px] px-6 py-3 rounded-xl bg-[#C5A880] hover:bg-[#B39368] text-white font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Unverbindliches Beratungsgespräch anfragen</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

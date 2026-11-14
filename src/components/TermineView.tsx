import React, { useMemo, useState } from 'react';
import {
  Bell,
  Calendar,
  CalendarCheck,
  Check,
  CheckCircle2,
  Clock,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Trash2,
} from 'lucide-react';
import {
  AFTERCARE_TIPS,
  AVAILABLE_TIME_SLOTS,
  CONSULTATION_PRICE_EUR,
  DURATION_PRICES_EUR,
  PRE_TREATMENT_CHECKLIST,
  TREATMENTS,
} from '../data/studioData';
import type {
  Appointment,
  DurationMinutes,
  TreatmentItem,
  TreatmentProgressItem,
} from '../types/studio';

interface TermineViewProps {
  activeSubTab: 'buchen' | 'portal';
  onChangeSubTab: (tab: 'buchen' | 'portal') => void;
  preselectedTreatment: TreatmentItem;
  preselectedDuration: DurationMinutes;
  appointments: Appointment[];
  progressItems: TreatmentProgressItem[];
  onCreateAppointment: (apt: Omit<Appointment, 'id' | 'status' | 'checklistCompletedIds'>) => void;
  onRescheduleAppointment: (id: string, newDateTimeIso: string) => void;
  onCancelAppointment: (id: string) => void;
  onToggleChecklistItem: (appointmentId: string, itemId: string) => void;
  onToggleReminder: (appointmentId: string, type: '24h' | 'aftercare') => void;
}

const DURATIONS: DurationMinutes[] = [15, 30, 60, 90];

function buildUpcomingDates(): { isoDate: string; label: string; weekday: string }[] {
  const result: { isoDate: string; label: string; weekday: string }[] = [];
  // Reference studio calendar starting from 2026-11-16 onwards (skipping Sundays)
  const base = new Date('2026-11-16T09:00:00');
  let offset = 0;
  while (result.length < 8) {
    const candidate = new Date(base);
    candidate.setDate(base.getDate() + offset);
    offset += 1;
    if (candidate.getDay() === 0) continue; // Closed Sundays
    const yyyy = candidate.getFullYear();
    const mm = String(candidate.getMonth() + 1).padStart(2, '0');
    const dd = String(candidate.getDate()).padStart(2, '0');
    result.push({
      isoDate: `${yyyy}-${mm}-${dd}`,
      label: candidate.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }),
      weekday: candidate.toLocaleDateString('de-DE', { weekday: 'short' }),
    });
  }
  return result;
}

export const TermineView: React.FC<TermineViewProps> = ({
  activeSubTab,
  onChangeSubTab,
  preselectedTreatment,
  preselectedDuration,
  appointments,
  progressItems,
  onCreateAppointment,
  onRescheduleAppointment,
  onCancelAppointment,
  onToggleChecklistItem,
  onToggleReminder,
}) => {
  const upcomingDates = useMemo(() => buildUpcomingDates(), []);

  // Booking wizard state
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedTreatmentId, setSelectedTreatmentId] = useState<string>(preselectedTreatment.id);
  const [selectedDuration, setSelectedDuration] = useState<DurationMinutes>(preselectedDuration);
  const [selectedDate, setSelectedDate] = useState<string>(upcomingDates[0].isoDate);
  const [selectedSlot, setSelectedSlot] = useState<string>('10:30');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientNotes, setClientNotes] = useState('');
  const [reminder24hEnabled, setReminder24hEnabled] = useState(true);
  const [aftercareReminderEnabled, setAftercareReminderEnabled] = useState(true);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [justBookedName, setJustBookedName] = useState<string | null>(null);

  // Reschedule state inside Meine Termine
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState<string>(upcomingDates[1].isoDate);
  const [rescheduleSlot, setRescheduleSlot] = useState<string>('14:00');

  const selectedTreatment = useMemo(
    () => TREATMENTS.find((t) => t.id === selectedTreatmentId) ?? TREATMENTS[0],
    [selectedTreatmentId]
  );

  const effectiveDuration: DurationMinutes = selectedTreatment.includesConsultation
    ? 30
    : selectedTreatment.typicalDurations.includes(selectedDuration)
      ? selectedDuration
      : selectedTreatment.typicalDurations[0];

  const finalPrice = selectedTreatment.includesConsultation
    ? CONSULTATION_PRICE_EUR
    : DURATION_PRICES_EUR[effectiveDuration];

  const activeUpcoming = useMemo(
    () =>
      appointments
        .filter((a) => a.status === 'bestätigt')
        .sort((a, b) => a.dateTimeIso.localeCompare(b.dateTimeIso)),
    [appointments]
  );

  const pastOrCanceled = useMemo(
    () =>
      appointments
        .filter((a) => a.status !== 'bestätigt')
        .sort((a, b) => b.dateTimeIso.localeCompare(a.dateTimeIso)),
    [appointments]
  );

  const isWithin24To48Hours = (iso: string) => {
    // Reference current date 2026-11-14T13:30:00 (matching session context) or live clock
    const now = new Date('2026-11-14T13:30:00').getTime();
    const target = new Date(iso).getTime();
    const diffHours = (target - now) / (1000 * 60 * 60);
    return diffHours > 0 && diffHours <= 48;
  };

  const formatFullDate = (iso: string) => {
    return new Date(iso).toLocaleString('de-DE', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);

    if (!clientName.trim() || !clientEmail.trim() || !clientPhone.trim()) {
      setBookingError('Bitte geben Sie Ihren Namen, Ihre E-Mail-Adresse und Telefonnummer ein.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail.trim())) {
      setBookingError('Bitte prüfen Sie das Format Ihrer E-Mail-Adresse.');
      return;
    }

    onCreateAppointment({
      treatmentId: selectedTreatment.id,
      treatmentName: selectedTreatment.name,
      category: selectedTreatment.category,
      duration: effectiveDuration,
      priceEur: finalPrice,
      dateTimeIso: `${selectedDate}T${selectedSlot}:00`,
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim(),
      clientPhone: clientPhone.trim(),
      notes: clientNotes.trim() || undefined,
      reminder24hEnabled,
      aftercareReminderEnabled,
    });

    setJustBookedName(selectedTreatment.name);
    setClientName('');
    setClientEmail('');
    setClientPhone('');
    setClientNotes('');
    setStep(1);
    onChangeSubTab('portal');
  };

  const stepLabels = [
    { num: 1 as const, label: '01. Behandlung wählen' },
    { num: 2 as const, label: '02. Dauer festlegen' },
    { num: 3 as const, label: '03. Datum & Uhrzeit' },
    { num: 4 as const, label: '04. Daten bestätigen' },
  ];

  return (
    <div className="space-y-10 pb-16">
      {/* Header + Segmented Portal/Booking Switcher */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-5 pt-2">
        <div className="space-y-2">
          <p className="text-xs font-medium text-[#3A7CA5]">Terminbuchung &amp; Kundenportal</p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1A1A1A]">
            {activeSubTab === 'buchen' ? 'Ihren Termin in Havixbeck buchen' : 'Meine Termine & Pflege'}
          </h1>
        </div>

        <div className="inline-flex p-1 rounded-xl bg-[#EBF4FA] self-start md:self-auto">
          <button
            type="button"
            onClick={() => {
              setJustBookedName(null);
              onChangeSubTab('buchen');
            }}
            className={`min-h-[44px] px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeSubTab === 'buchen'
                ? 'bg-white text-[#1A1A1A] shadow-sm'
                : 'text-[#4B5563] hover:text-[#1A1A1A]'
            }`}
          >
            Termin buchen
          </button>
          <button
            type="button"
            onClick={() => onChangeSubTab('portal')}
            className={`min-h-[44px] px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer tabular-nums ${
              activeSubTab === 'portal'
                ? 'bg-white text-[#1A1A1A] shadow-sm'
                : 'text-[#4B5563] hover:text-[#1A1A1A]'
            }`}
          >
            Meine Termine ({activeUpcoming.length})
          </button>
        </div>
      </section>

      {justBookedName && activeSubTab === 'portal' && (
        <div
          role="status"
          className="rounded-2xl bg-[#EBF4FA] border border-[#3A7CA5]/30 p-5 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#3A7CA5] shrink-0" />
            <div>
              <p className="text-sm font-semibold text-[#1A1A1A]">
                Termin bestätigt: {justBookedName}
              </p>
              <p className="text-xs text-[#4B5563]">
                Ihre Buchung erscheint ab sofort in Ihrer Übersicht inklusive automatischer Vor- &amp;
                Nachsorge-Erinnerung.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setJustBookedName(null)}
            className="min-h-[40px] px-3 py-1.5 text-xs font-semibold text-[#3A7CA5] cursor-pointer"
          >
            Schließen
          </button>
        </div>
      )}

      {activeSubTab === 'buchen' ? (
        <section aria-label="Schritt-für-Schritt-Terminbuchung" className="space-y-8">
          {/* Stepper Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
            {stepLabels.map((s) => {
              const active = step === s.num;
              const completed = step > s.num;
              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => setStep(s.num)}
                  className={`min-h-[46px] px-4 py-2.5 rounded-xl text-left text-xs font-semibold transition-colors border cursor-pointer ${
                    active
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                      : completed
                        ? 'bg-[#EBF4FA] text-[#1A1A1A] border-[#D6E7F3]'
                        : 'bg-white text-[#6B7280] border-[#E5E7EB]'
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 rounded-3xl bg-white border border-[#E5E7EB] p-6 sm:p-8 shadow-[0_12px_36px_-16px_rgba(26,26,26,0.06)]">
              {step === 1 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-semibold text-[#1A1A1A]">
                    1. Welche Behandlung möchten Sie buchen?
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {TREATMENTS.map((item) => {
                      const active = item.id === selectedTreatmentId;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setSelectedTreatmentId(item.id);
                            if (!item.typicalDurations.includes(selectedDuration)) {
                              setSelectedDuration(item.typicalDurations[0]);
                            }
                          }}
                          className={`text-left p-4 rounded-2xl border transition-colors cursor-pointer ${
                            active
                              ? 'bg-[#F8FBFE] border-[#3A7CA5]'
                              : 'bg-white border-[#E5E7EB] hover:border-[#3A7CA5]/50'
                          }`}
                        >
                          <p className="text-xs font-medium text-[#3A7CA5] mb-1">{item.category}</p>
                          <p className="text-sm font-semibold text-[#1A1A1A] mb-1">{item.name}</p>
                          <p className="text-xs text-[#6B7280] line-clamp-2">
                            {item.shortDescription}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="min-h-[46px] px-6 py-2.5 rounded-xl bg-[#C5A880] hover:bg-[#B39368] text-white text-sm font-semibold cursor-pointer"
                    >
                      Weiter zur Dauer
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-semibold text-[#1A1A1A]">
                    2. Gewünschte Behandlungsdauer wählen
                  </h2>
                  <p className="text-sm text-[#4B5563]">
                    Ausgewählt: <strong>{selectedTreatment.name}</strong>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {DURATIONS.map((dur) => {
                      const supported = selectedTreatment.typicalDurations.includes(dur);
                      const active = effectiveDuration === dur;
                      const price = selectedTreatment.includesConsultation
                        ? CONSULTATION_PRICE_EUR
                        : DURATION_PRICES_EUR[dur];
                      return (
                        <button
                          key={dur}
                          type="button"
                          disabled={!supported}
                          onClick={() => setSelectedDuration(dur)}
                          className={`p-5 rounded-2xl border text-left transition-colors flex items-center justify-between cursor-pointer ${
                            active
                              ? 'bg-[#F8FBFE] border-[#3A7CA5]'
                              : supported
                                ? 'bg-white border-[#E5E7EB] hover:border-[#3A7CA5]/50'
                                : 'bg-[#F9FAFB] border-[#F3F4F6] opacity-50 cursor-not-allowed'
                          }`}
                        >
                          <div>
                            <p className="text-base font-semibold text-[#1A1A1A] tabular-nums">
                              {dur} Minuten
                            </p>
                            <p className="text-xs text-[#6B7280] mt-0.5">
                              {selectedTreatment.includesConsultation
                                ? 'Analyse + 15 Min. Probe'
                                : 'Inkl. steriler Einwegsonde'}
                            </p>
                          </div>
                          <span className="text-lg font-semibold text-[#1A1A1A] tabular-nums">
                            {price} €
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="min-h-[46px] px-5 py-2.5 rounded-xl bg-[#F3F6F9] text-[#1A1A1A] text-sm font-semibold cursor-pointer"
                    >
                      Zurück
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="min-h-[46px] px-6 py-2.5 rounded-xl bg-[#C5A880] hover:bg-[#B39368] text-white text-sm font-semibold cursor-pointer"
                    >
                      Weiter zu Datum &amp; Uhrzeit
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-[#1A1A1A]">
                    3. Datum und Uhrzeit in Havixbeck auswählen
                  </h2>

                  <div>
                    <p className="text-xs font-semibold text-[#1A1A1A] mb-2.5">Verfügbare Tage</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {upcomingDates.map((d) => {
                        const active = d.isoDate === selectedDate;
                        return (
                          <button
                            key={d.isoDate}
                            type="button"
                            onClick={() => setSelectedDate(d.isoDate)}
                            className={`min-h-[54px] px-3 py-2 rounded-xl border text-center transition-colors cursor-pointer ${
                              active
                                ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                                : 'bg-white text-[#1A1A1A] border-[#E5E7EB] hover:bg-[#F8FBFE]'
                            }`}
                          >
                            <span className="block text-[11px] opacity-80">{d.weekday}</span>
                            <span className="block text-sm font-semibold tabular-nums">{d.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-[#1A1A1A] mb-2.5">Freie Uhrzeiten</p>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                      {AVAILABLE_TIME_SLOTS.map((slot) => {
                        const active = slot === selectedSlot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedSlot(slot)}
                            className={`min-h-[46px] px-3 py-2 rounded-xl border text-sm font-semibold tabular-nums transition-colors cursor-pointer ${
                              active
                                ? 'bg-[#3A7CA5] text-white border-[#3A7CA5]'
                                : 'bg-white text-[#1A1A1A] border-[#E5E7EB] hover:bg-[#F8FBFE]'
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="min-h-[46px] px-5 py-2.5 rounded-xl bg-[#F3F6F9] text-[#1A1A1A] text-sm font-semibold cursor-pointer"
                    >
                      Zurück
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(4)}
                      className="min-h-[46px] px-6 py-2.5 rounded-xl bg-[#C5A880] hover:bg-[#B39368] text-white text-sm font-semibold cursor-pointer"
                    >
                      Weiter zu Ihren Daten
                    </button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <form onSubmit={handleConfirmBooking} className="space-y-4" noValidate>
                  <h2 className="text-xl font-semibold text-[#1A1A1A]">
                    4. Persönliche Daten eingeben &amp; bestätigen
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="booking-name"
                        className="block text-xs font-semibold text-[#1A1A1A] mb-1.5"
                      >
                        Vor- und Nachname *
                      </label>
                      <input
                        id="booking-name"
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="z. B. Hannah Mertens"
                        className="w-full min-h-[46px] rounded-xl border border-[#D1D5DB] px-3.5 py-2 text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#3A7CA5]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="booking-phone"
                        className="block text-xs font-semibold text-[#1A1A1A] mb-1.5"
                      >
                        Telefon / WhatsApp *
                      </label>
                      <input
                        id="booking-phone"
                        type="tel"
                        required
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="+49 171 0000000"
                        className="w-full min-h-[46px] rounded-xl border border-[#D1D5DB] px-3.5 py-2 text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#3A7CA5]"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="booking-email"
                      className="block text-xs font-semibold text-[#1A1A1A] mb-1.5"
                    >
                      E-Mail-Adresse *
                    </label>
                    <input
                      id="booking-email"
                      type="email"
                      required
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="name@beispiel.de"
                      className="w-full min-h-[46px] rounded-xl border border-[#D1D5DB] px-3.5 py-2 text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#3A7CA5]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="booking-notes"
                      className="block text-xs font-semibold text-[#1A1A1A] mb-1.5"
                    >
                      Hinweise zu Haut oder Wunschzone (optional)
                    </label>
                    <textarea
                      id="booking-notes"
                      rows={2}
                      value={clientNotes}
                      onChange={(e) => setClientNotes(e.target.value)}
                      placeholder="z. B. empfindliche Haut, frühere Laser-Vorgeschichte"
                      className="w-full rounded-xl border border-[#D1D5DB] px-3.5 py-2 text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#3A7CA5]"
                    />
                  </div>

                  <div className="space-y-2 pt-1">
                    <label className="flex items-center gap-2.5 text-xs text-[#374151] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={reminder24hEnabled}
                        onChange={(e) => setReminder24hEnabled(e.target.checked)}
                        className="w-4 h-4 rounded border-[#D1D5DB] text-[#3A7CA5]"
                      />
                      <span>24h vorab automatische Vorbereitungs-Checkliste aktivieren</span>
                    </label>
                    <label className="flex items-center gap-2.5 text-xs text-[#374151] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={aftercareReminderEnabled}
                        onChange={(e) => setAftercareReminderEnabled(e.target.checked)}
                        className="w-4 h-4 rounded border-[#D1D5DB] text-[#3A7CA5]"
                      />
                      <span>Nach der Behandlung automatische Nachsorge-Hinweise erhalten</span>
                    </label>
                  </div>

                  {bookingError && (
                    <p
                      role="alert"
                      className="text-xs font-medium text-red-700 bg-red-50 px-3.5 py-2.5 rounded-xl"
                    >
                      {bookingError}
                    </p>
                  )}

                  <div className="flex justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="min-h-[46px] px-5 py-2.5 rounded-xl bg-[#F3F6F9] text-[#1A1A1A] text-sm font-semibold cursor-pointer"
                    >
                      Zurück
                    </button>
                    <button
                      type="submit"
                      className="min-h-[48px] px-6 py-3 rounded-xl bg-[#C5A880] hover:bg-[#B39368] text-white text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
                    >
                      <CalendarCheck className="w-4 h-4" />
                      <span>Termin verbindlich buchen</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Live Booking Summary Card */}
            <aside className="lg:col-span-4 rounded-3xl bg-[#EBF4FA]/75 border border-[#D6E7F3] p-6 space-y-4">
              <p className="text-xs font-medium text-[#3A7CA5]">Ihre Buchungsübersicht</p>
              <div className="space-y-3 border-b border-[#D6E7F3] pb-4">
                <div>
                  <p className="text-xs text-[#6B7280]">Behandlung</p>
                  <p className="text-sm font-semibold text-[#1A1A1A]">{selectedTreatment.name}</p>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B7280]">Dauer</span>
                  <span className="font-semibold text-[#1A1A1A] tabular-nums">
                    {effectiveDuration} Min.
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B7280]">Termin</span>
                  <span className="font-semibold text-[#1A1A1A] tabular-nums">
                    {new Date(`${selectedDate}T${selectedSlot}:00`).toLocaleDateString('de-DE', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}{' '}
                    · {selectedSlot} Uhr
                  </span>
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium text-[#1A1A1A]">Gesamtbetrag im Studio</span>
                <span className="text-2xl font-semibold text-[#1A1A1A] tabular-nums">
                  {finalPrice} €
                </span>
              </div>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                Kostenfreie Umbuchung oder Stornierung bis 24 Stunden vor dem Termin direkt im
                Bereich „Meine Termine“.
              </p>
            </aside>
          </div>
        </section>
      ) : (
        /* Client Portal: Meine Termine */
        <section aria-label="Kundenportal Meine Termine" className="space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Upcoming & Past Appointments */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[#1A1A1A]">Kommende Termine</h2>
                <button
                  type="button"
                  onClick={() => onChangeSubTab('buchen')}
                  className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-[#EBF4FA] text-xs font-semibold text-[#1A1A1A] hover:bg-[#DCECF7] cursor-pointer"
                >
                  + Neuer Termin
                </button>
              </div>

              {activeUpcoming.length === 0 ? (
                <div className="rounded-2xl bg-white border border-[#E5E7EB] p-8 text-center space-y-3">
                  <Calendar className="w-8 h-8 text-[#3A7CA5] mx-auto" strokeWidth={1.5} />
                  <p className="text-base font-semibold text-[#1A1A1A]">
                    Aktuell keine offenen Termine
                  </p>
                  <p className="text-sm text-[#4B5563]">
                    Buchen Sie jetzt Ihre nächste Sitzung oder ein unverbindliches Beratungsgespräch.
                  </p>
                  <button
                    type="button"
                    onClick={() => onChangeSubTab('buchen')}
                    className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#C5A880] text-white text-sm font-semibold cursor-pointer"
                  >
                    Termin buchen
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {activeUpcoming.map((apt) => {
                    const showSmartChecklist = isWithin24To48Hours(apt.dateTimeIso);
                    const isRescheduling = reschedulingId === apt.id;
                    return (
                      <article
                        key={apt.id}
                        className="rounded-3xl bg-white border border-[#E5E7EB] p-6 space-y-5 shadow-[0_12px_32px_-16px_rgba(26,26,26,0.08)]"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-[#3A7CA5] font-medium mb-1">
                              <span>Bestätigt</span>
                              <span aria-hidden="true">·</span>
                              <span className="tabular-nums">{apt.duration} Min.</span>
                              <span aria-hidden="true">·</span>
                              <span className="tabular-nums">{apt.priceEur} €</span>
                            </div>
                            <h3 className="text-lg font-semibold text-[#1A1A1A]">
                              {apt.treatmentName}
                            </h3>
                            <p className="text-sm text-[#4B5563] mt-0.5 tabular-nums">
                              {formatFullDate(apt.dateTimeIso)} Uhr
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setReschedulingId(isRescheduling ? null : apt.id);
                                setRescheduleDate(upcomingDates[1].isoDate);
                                setRescheduleSlot('14:00');
                              }}
                              className="min-h-[42px] px-3.5 py-2 rounded-xl bg-[#EBF4FA] hover:bg-[#DCECF7] text-[#1A1A1A] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                            >
                              <RefreshCw className="w-3.5 h-3.5 text-[#3A7CA5]" />
                              <span>Verschieben</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onCancelAppointment(apt.id)}
                              className="min-h-[42px] px-3.5 py-2 rounded-xl bg-white border border-[#E5E7EB] hover:bg-red-50 hover:border-red-200 text-[#4B5563] hover:text-red-700 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Stornieren</span>
                            </button>
                          </div>
                        </div>

                        {/* One-Tap Reschedule Inline Panel */}
                        {isRescheduling && (
                          <div className="rounded-2xl bg-[#F8FBFE] border border-[#D6E7F3] p-4 space-y-3">
                            <p className="text-xs font-semibold text-[#1A1A1A]">
                              Neuen Wunschtermin wählen
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <select
                                aria-label="Neues Datum"
                                value={rescheduleDate}
                                onChange={(e) => setRescheduleDate(e.target.value)}
                                className="min-h-[42px] rounded-xl bg-white border border-[#D1D5DB] px-3 text-xs text-[#1A1A1A]"
                              >
                                {upcomingDates.map((d) => (
                                  <option key={d.isoDate} value={d.isoDate}>
                                    {d.weekday}, {d.label}
                                  </option>
                                ))}
                              </select>
                              <select
                                aria-label="Neue Uhrzeit"
                                value={rescheduleSlot}
                                onChange={(e) => setRescheduleSlot(e.target.value)}
                                className="min-h-[42px] rounded-xl bg-white border border-[#D1D5DB] px-3 text-xs text-[#1A1A1A]"
                              >
                                {AVAILABLE_TIME_SLOTS.map((slot) => (
                                  <option key={slot} value={slot}>
                                    {slot} Uhr
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setReschedulingId(null)}
                                className="min-h-[40px] px-3 text-xs font-semibold text-[#4B5563] cursor-pointer"
                              >
                                Abbrechen
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  onRescheduleAppointment(
                                    apt.id,
                                    `${rescheduleDate}T${rescheduleSlot}:00`
                                  );
                                  setReschedulingId(null);
                                }}
                                className="min-h-[40px] px-4 rounded-xl bg-[#1A1A1A] text-white text-xs font-semibold cursor-pointer"
                              >
                                Änderung speichern
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Smart 24h Pre-Treatment Checklist */}
                        {showSmartChecklist && (
                          <div className="rounded-2xl bg-[#EBF4FA]/80 border border-[#3A7CA5]/25 p-5 space-y-3">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 text-xs font-semibold text-[#3A7CA5]">
                                <Clock className="w-4 h-4" />
                                <span>Smarte 24h-Vorbereitungs-Checkliste</span>
                              </div>
                              <span className="text-xs font-semibold text-[#1A1A1A] tabular-nums">
                                {apt.checklistCompletedIds.length}/{PRE_TREATMENT_CHECKLIST.length} erledigt
                              </span>
                            </div>
                            <p className="text-xs text-[#374151]">
                              Ihr Termin steht bevor: Bitte 24h vorher keine direkte Sonne,
                              Haarlänge ca. 2–3 mm belassen. Haken Sie Ihre Vorbereitung ab:
                            </p>
                            <div className="space-y-2">
                              {PRE_TREATMENT_CHECKLIST.map((item) => {
                                const checked = apt.checklistCompletedIds.includes(item.id);
                                return (
                                  <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => onToggleChecklistItem(apt.id, item.id)}
                                    className={`w-full text-left p-3 rounded-xl border transition-colors flex items-start gap-3 cursor-pointer ${
                                      checked
                                        ? 'bg-white border-[#3A7CA5]/40 text-[#1A1A1A]'
                                        : 'bg-white/75 border-[#D6E7F3] text-[#374151]'
                                    }`}
                                  >
                                    <span
                                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                                        checked
                                          ? 'bg-[#3A7CA5] text-white'
                                          : 'border border-[#9CA3AF] bg-white'
                                      }`}
                                    >
                                      {checked && <Check className="w-3.5 h-3.5" />}
                                    </span>
                                    <span>
                                      <span className="block text-xs font-semibold">{item.title}</span>
                                      <span className="block text-[11px] text-[#6B7280] mt-0.5">
                                        {item.detail}
                                      </span>
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Automated Reminders Toggle Row */}
                        <div className="pt-3 border-t border-[#F3F4F6] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2 text-[#4B5563]">
                            <Bell className="w-4 h-4 text-[#C5A880]" />
                            <span>Automatisierte Erinnerungen:</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => onToggleReminder(apt.id, '24h')}
                              className={`min-h-[38px] px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer ${
                                apt.reminder24hEnabled
                                  ? 'bg-[#EBF4FA] border-[#3A7CA5]/30 text-[#1A1A1A]'
                                  : 'bg-white border-[#E5E7EB] text-[#6B7280]'
                              }`}
                            >
                              24h Vorab-Info: {apt.reminder24hEnabled ? 'Aktiv' : 'Aus'}
                            </button>
                            <button
                              type="button"
                              onClick={() => onToggleReminder(apt.id, 'aftercare')}
                              className={`min-h-[38px] px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer ${
                                apt.aftercareReminderEnabled
                                  ? 'bg-[#FBF7F1] border-[#C5A880]/40 text-[#1A1A1A]'
                                  : 'bg-white border-[#E5E7EB] text-[#6B7280]'
                              }`}
                            >
                              48h Nachsorge: {apt.aftercareReminderEnabled ? 'Aktiv' : 'Aus'}
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}

              {/* Past / Completed Appointments */}
              {pastOrCanceled.length > 0 && (
                <div className="space-y-3 pt-4">
                  <h3 className="text-base font-semibold text-[#1A1A1A]">
                    Vergangene &amp; stornierte Termine
                  </h3>
                  <div className="rounded-2xl bg-white border border-[#E5E7EB] divide-y divide-[#F3F4F6]">
                    {pastOrCanceled.map((apt) => (
                      <div
                        key={apt.id}
                        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                      >
                        <div>
                          <p className="font-semibold text-[#1A1A1A]">{apt.treatmentName}</p>
                          <p className="text-[#6B7280] tabular-nums">
                            {formatFullDate(apt.dateTimeIso)} Uhr · {apt.duration} Min.
                          </p>
                        </div>
                        <span
                          className={`font-semibold ${
                            apt.status === 'abgeschlossen' ? 'text-[#3A7CA5]' : 'text-[#6B7280]'
                          }`}
                        >
                          {apt.status === 'abgeschlossen' ? 'Abgeschlossen' : 'Storniert'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Treatment Progress & Automated Aftercare Guide */}
            <aside className="lg:col-span-5 space-y-6">
              <div className="rounded-3xl bg-white border border-[#E5E7EB] p-6 space-y-5">
                <div className="flex items-center gap-2 text-xs font-medium text-[#3A7CA5]">
                  <Sparkles className="w-4 h-4 text-[#C5A880]" />
                  <span>Behandlungsfortschritt</span>
                </div>
                <h2 className="text-xl font-semibold text-[#1A1A1A]">
                  Ihr Fortschritt nach Körperzone
                </h2>

                <div className="space-y-4">
                  {progressItems.map((prog) => (
                    <div
                      key={prog.id}
                      className="p-4 rounded-2xl bg-[#F8FBFE] border border-[#EBF4FA] space-y-2.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-[#1A1A1A]">{prog.zone}</p>
                        <span className="text-xs font-semibold text-[#3A7CA5] tabular-nums">
                          {prog.completedSessions}/{prog.plannedSessions} Sitzungen
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#DCECF7] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#C5A880]"
                          style={{ width: `${prog.reductionPercent}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-[#4B5563] tabular-nums">
                        <span>Geschätzte Reduktion: {prog.reductionPercent} %</span>
                        <span>Intervall: {prog.nextRecommendedWindow}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-[#FBF7F1]/80 border border-[#C5A880]/30 p-6 space-y-4">
                <div className="flex items-center gap-2 text-xs font-medium text-[#B39368]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Automatisierte Nachsorge-Hinweise</span>
                </div>
                <h3 className="text-lg font-semibold text-[#1A1A1A]">
                  Pflege nach Ihrer letzten Sitzung
                </h3>
                <div className="space-y-3">
                  {AFTERCARE_TIPS.map((tip) => (
                    <div key={tip.title} className="bg-white rounded-2xl p-4 border border-[#C5A880]/20">
                      <p className="text-[11px] font-semibold text-[#B39368]">{tip.window}</p>
                      <p className="text-sm font-semibold text-[#1A1A1A] mt-0.5">{tip.title}</p>
                      <p className="text-xs text-[#4B5563] leading-relaxed mt-1">
                        {tip.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </section>
      )}
    </div>
  );
};

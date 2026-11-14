import React, { useEffect, useMemo, useState } from 'react';
import {
  CalendarCheck,
  GraduationCap,
  Home,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { BrandLogo } from './components/BrandLogo';
import { EpilationView } from './components/EpilationView';
import { KontaktView } from './components/KontaktView';
import { LegalModal } from './components/LegalModal';
import { SchulungView } from './components/SchulungView';
import { StartseiteView } from './components/StartseiteView';
import { TermineView } from './components/TermineView';
import {
  INITIAL_APPOINTMENTS,
  INITIAL_PROGRESS,
  TRAINING_COHORTS,
  TREATMENTS,
} from './data/studioData';
import type {
  Appointment,
  AppSection,
  DurationMinutes,
  TrainingCohort,
  TrainingInquiry,
  TreatmentItem,
} from './types/studio';

const STORAGE_KEYS = {
  appointments: 'natali_elektro_epil_appointments_v1',
  cohorts: 'natali_elektro_epil_cohorts_v1',
  inquiries: 'natali_elektro_epil_inquiries_v1',
};

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [activeSection, setActiveSection] = useState<AppSection>('start');
  const [termineSubTab, setTermineSubTab] = useState<'buchen' | 'portal'>('buchen');
  const [legalDoc, setLegalDoc] = useState<'impressum' | 'datenschutz' | null>(null);
  const [gmpQuotaExceeded, setGmpQuotaExceeded] = useState(false);

  const [preselectedTreatment, setPreselectedTreatment] = useState<TreatmentItem>(TREATMENTS[1]);
  const [preselectedDuration, setPreselectedDuration] = useState<DurationMinutes>(30);

  const [appointments, setAppointments] = useState<Appointment[]>(() =>
    readStorage<Appointment[]>(STORAGE_KEYS.appointments, INITIAL_APPOINTMENTS)
  );
  const [cohorts, setCohorts] = useState<TrainingCohort[]>(() =>
    readStorage<TrainingCohort[]>(STORAGE_KEYS.cohorts, TRAINING_COHORTS)
  );
  const [inquiries, setInquiries] = useState<TrainingInquiry[]>(() =>
    readStorage<TrainingInquiry[]>(STORAGE_KEYS.inquiries, [])
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.appointments, JSON.stringify(appointments));
    } catch {
      // Ignore storage quota errors
    }
  }, [appointments]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.cohorts, JSON.stringify(cohorts));
    } catch {
      // Ignore storage quota errors
    }
  }, [cohorts]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.inquiries, JSON.stringify(inquiries));
    } catch {
      // Ignore storage quota errors
    }
  }, [inquiries]);

  useEffect(() => {
    const handleQuota = () => setGmpQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  const navigateTo = (section: AppSection) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPortal = () => {
    setTermineSubTab('portal');
    navigateTo('termine');
  };

  const handleSelectTreatmentForBooking = (
    treatment: TreatmentItem,
    duration: DurationMinutes
  ) => {
    setPreselectedTreatment(treatment);
    setPreselectedDuration(duration);
    setTermineSubTab('buchen');
    navigateTo('termine');
  };

  const handleCreateAppointment = (
    aptData: Omit<Appointment, 'id' | 'status' | 'checklistCompletedIds'>
  ) => {
    const newApt: Appointment = {
      ...aptData,
      id: `apt-${Date.now()}`,
      status: 'bestätigt',
      checklistCompletedIds: [],
    };
    setAppointments((prev) => [newApt, ...prev]);
  };

  const handleRescheduleAppointment = (id: string, newDateTimeIso: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, dateTimeIso: newDateTimeIso } : a))
    );
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'storniert' } : a))
    );
  };

  const handleToggleChecklistItem = (appointmentId: string, itemId: string) => {
    setAppointments((prev) =>
      prev.map((a) => {
        if (a.id !== appointmentId) return a;
        const exists = a.checklistCompletedIds.includes(itemId);
        return {
          ...a,
          checklistCompletedIds: exists
            ? a.checklistCompletedIds.filter((id) => id !== itemId)
            : [...a.checklistCompletedIds, itemId],
        };
      })
    );
  };

  const handleToggleReminder = (appointmentId: string, type: '24h' | 'aftercare') => {
    setAppointments((prev) =>
      prev.map((a) => {
        if (a.id !== appointmentId) return a;
        if (type === '24h') {
          return { ...a, reminder24hEnabled: !a.reminder24hEnabled };
        }
        return { ...a, aftercareReminderEnabled: !a.aftercareReminderEnabled };
      })
    );
  };

  const handleSubmitTrainingInquiry = (
    inquiryData: Omit<TrainingInquiry, 'id' | 'createdAtIso'>
  ) => {
    const created: TrainingInquiry = {
      ...inquiryData,
      id: `inq-${Date.now()}`,
      createdAtIso: new Date().toISOString(),
    };
    setInquiries((prev) => [created, ...prev]);
    setCohorts((prev) =>
      prev.map((c) =>
        c.id === inquiryData.cohortId && c.availableSpots > 0
          ? { ...c, availableSpots: c.availableSpots - 1 }
          : c
      )
    );
  };

  const upcomingSoonAppointment = useMemo(() => {
    const refNow = new Date('2026-11-14T13:30:00').getTime();
    return appointments.find((a) => {
      if (a.status !== 'bestätigt' || !a.reminder24hEnabled) return false;
      const diffHours = (new Date(a.dateTimeIso).getTime() - refNow) / (1000 * 60 * 60);
      return diffHours > 0 && diffHours <= 48;
    });
  }, [appointments]);

  const navItems: { id: AppSection; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'start', label: 'Startseite', icon: Home },
    { id: 'epilation', label: 'Epilation', icon: Sparkles },
    { id: 'schulung', label: 'Schulung', icon: GraduationCap },
    { id: 'termine', label: 'Termine', icon: CalendarCheck },
    { id: 'kontakt', label: 'Studio', icon: MapPin },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1A1A1A] pb-20 md:pb-0">
      {gmpQuotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Top Navigation Header — Strictly 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E5E7EB]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <button
            type="button"
            onClick={() => navigateTo('start')}
            className="whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3A7CA5] rounded-lg"
            aria-label="NATALI elektro-epil Startseite"
          >
            <BrandLogo variant="header" />
          </button>

          {/* Zone 2: 5 concise single-line text nav links */}
          <nav
            aria-label="Hauptnavigation"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-[#4B5563]"
          >
            {navItems.map((item) => {
              const active = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigateTo(item.id)}
                  className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
                    active
                      ? 'text-[#1A1A1A] font-semibold border-[#C5A880]'
                      : 'border-transparent hover:text-[#1A1A1A] hover:border-[#3A7CA5]/40'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Single primary action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => {
                setTermineSubTab('buchen');
                navigateTo('termine');
              }}
              className="min-h-[42px] px-4 sm:px-5 py-2 rounded-xl bg-[#C5A880] hover:bg-[#B39368] text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Termin buchen
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeSection === 'start' && (
          <StartseiteView
            onNavigate={navigateTo}
            onOpenPortal={handleOpenPortal}
            upcomingSoonAppointment={upcomingSoonAppointment}
          />
        )}

        {activeSection === 'epilation' && (
          <EpilationView onSelectForBooking={handleSelectTreatmentForBooking} />
        )}

        {activeSection === 'schulung' && (
          <SchulungView
            cohorts={cohorts}
            onSubmitInquiry={handleSubmitTrainingInquiry}
            submittedInquiries={inquiries}
          />
        )}

        {activeSection === 'termine' && (
          <TermineView
            activeSubTab={termineSubTab}
            onChangeSubTab={setTermineSubTab}
            preselectedTreatment={preselectedTreatment}
            preselectedDuration={preselectedDuration}
            appointments={appointments}
            progressItems={INITIAL_PROGRESS}
            onCreateAppointment={handleCreateAppointment}
            onRescheduleAppointment={handleRescheduleAppointment}
            onCancelAppointment={handleCancelAppointment}
            onToggleChecklistItem={handleToggleChecklistItem}
            onToggleReminder={handleToggleReminder}
          />
        )}

        {activeSection === 'kontakt' && <KontaktView onOpenLegal={setLegalDoc} />}
      </main>

      {/* Quiet Footer (Desktop & Scroll End) */}
      <footer className="border-t border-[#E5E7EB] bg-[#F8FBFE]/60 py-8 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#6B7280]">
          <div className="space-y-1">
            <p className="font-semibold text-[#1A1A1A]">
              NATALI elektro-epil · Fachpraxis &amp; Akademie Havixbeck
            </p>
            <p>Dauerhafte Haarentfernung, Fach-Schulung &amp; Umschulung im Münsterland</p>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={() => navigateTo('epilation')}
              className="hover:text-[#1A1A1A] cursor-pointer"
            >
              Behandlungen
            </button>
            <button
              type="button"
              onClick={() => navigateTo('schulung')}
              className="hover:text-[#1A1A1A] cursor-pointer"
            >
              Schulung &amp; Umschulung
            </button>
            <button
              type="button"
              onClick={() => setLegalDoc('impressum')}
              className="hover:text-[#1A1A1A] cursor-pointer"
            >
              Impressum
            </button>
            <button
              type="button"
              onClick={() => setLegalDoc('datenschutz')}
              className="hover:text-[#1A1A1A] cursor-pointer"
            >
              Datenschutz
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile Fixed Bottom Thumb-Zone Navigation (<= 15% viewport height) */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] grid grid-cols-5 items-center"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => navigateTo(item.id)}
              className={`min-h-[44px] flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
                active ? 'text-[#C5A880]' : 'text-[#4B5563]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[11px] font-medium tracking-tight leading-none">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <LegalModal doc={legalDoc} onClose={() => setLegalDoc(null)} />
    </div>
  );
}

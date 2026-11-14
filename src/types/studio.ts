export type AppSection = 'start' | 'epilation' | 'schulung' | 'termine' | 'kontakt';

export type TreatmentCategory =
  | 'Alle'
  | 'Gesicht'
  | 'Körper'
  | 'Sensible Zonen'
  | 'Beratung & Probebehandlung';

export type DurationMinutes = 15 | 30 | 60 | 90;

export interface TreatmentItem {
  id: string;
  name: string;
  category: Exclude<TreatmentCategory, 'Alle'>;
  shortDescription: string;
  typicalDurations: DurationMinutes[];
  recommendedInterval: string;
  methodNote: string;
  includesConsultation?: boolean;
}

export interface TrainingTrack {
  id: string;
  badgeLabel: string;
  title: string;
  audience: string;
  duration: string;
  priceEur: number;
  format: string;
  summary: string;
  highlights: string[];
  prerequisites: string;
}

export interface TrainingCohort {
  id: string;
  trackId: string;
  dateLabel: string;
  startDateIso: string;
  location: string;
  totalSpots: number;
  availableSpots: number;
  scheduleSummary: string;
}

export interface TrainingInquiry {
  id: string;
  trackId: string;
  cohortId: string;
  fullName: string;
  email: string;
  phone: string;
  background: string;
  message: string;
  createdAtIso: string;
}

export type AppointmentStatus = 'bestätigt' | 'abgeschlossen' | 'storniert';

export interface Appointment {
  id: string;
  treatmentId: string;
  treatmentName: string;
  category: string;
  duration: DurationMinutes;
  priceEur: number;
  dateTimeIso: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  notes?: string;
  status: AppointmentStatus;
  checklistCompletedIds: string[];
  reminder24hEnabled: boolean;
  aftercareReminderEnabled: boolean;
}

export interface TreatmentProgressItem {
  id: string;
  zone: string;
  completedSessions: number;
  plannedSessions: number;
  reductionPercent: number;
  nextRecommendedWindow: string;
  methodUsed: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  locationAndService: string;
  quote: string;
  outcome: string;
}

export interface FaqItem {
  id: string;
  topic: 'Behandlung' | 'Schulung & Umschulung' | 'Studio & Hygiene';
  question: string;
  answer: string;
}

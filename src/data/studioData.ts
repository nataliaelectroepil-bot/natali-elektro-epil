import type {
  Appointment,
  DurationMinutes,
  FaqItem,
  ReviewItem,
  TrainingCohort,
  TrainingTrack,
  TreatmentItem,
  TreatmentProgressItem,
} from '../types/studio';

export const STUDIO_IMAGES = {
  hero: '/src/assets/images/hero_electro_epilation_1794664437214.jpg',
  studioRoom: '/src/assets/images/studio_treatment_room_1794664437885.jpg',
  trainingAcademy: '/src/assets/images/training_academy_session_1794664438435.jpg',
  aftercareSkincare: '/src/assets/images/aftercare_skincare_1794664438369.jpg',
} as const;

export const DURATION_PRICES_EUR: Record<DurationMinutes, number> = {
  15: 38,
  30: 68,
  60: 124,
  90: 178,
};

export const CONSULTATION_PRICE_EUR = 29;

export const TREATMENTS: TreatmentItem[] = [
  {
    id: 'beratung-probe',
    name: 'Erstberatung & Probebehandlung',
    category: 'Beratung & Probebehandlung',
    shortDescription:
      'Ausführliche Haut- und Haaranalyse, individuelle Aufklärung zu Thermolyse & Blend-Methode sowie 15 Min. Probebehandlung inklusive.',
    typicalDurations: [30],
    recommendedInterval: 'Einmalig vor Behandlungsstart',
    methodNote: 'Inklusive individueller Verträglichkeitsprüfung & Behandlungsplan',
    includesConsultation: true,
  },
  {
    id: 'gesicht-oberlippe-kinn',
    name: 'Oberlippe, Kinn & Wangenkontur',
    category: 'Gesicht',
    shortDescription:
      'Präzise Entfernung feiner, hormonell bedingter oder weißer Gesichtshaare ohne Pigmentverlust und ohne Narbenbildung.',
    typicalDurations: [15, 30, 60],
    recommendedInterval: 'Alle 2–4 Wochen in der Wachstumsphase',
    methodNote: 'Sanfte Mikrostrom-Thermolyse oder Blend mit steriler Goldsonde',
  },
  {
    id: 'gesicht-augenbrauen',
    name: 'Augenbrauen-Feinmodellierung & Glabella',
    category: 'Gesicht',
    shortDescription:
      'Haargenaue Konturierung einzelner Follikel zwischen den Augenbrauen und entlang der Brauenlinie für dauerhaft ruhige Konturen.',
    typicalDurations: [15, 30],
    recommendedInterval: 'Alle 3–4 Wochen',
    methodNote: 'Hochpräzise Lupenarbeit mit isolierter Einweg-Feinstsonde',
  },
  {
    id: 'koerper-achseln',
    name: 'Achseln & Oberarme',
    category: 'Körper',
    shortDescription:
      'Dauerhafte Entfernung auch sehr heller, rötlicher oder grauer Haare, bei denen Laser- oder IPL-Systeme wirkungslos bleiben.',
    typicalDurations: [30, 60, 90],
    recommendedInterval: 'Alle 3–5 Wochen',
    methodNote: 'Blend-Technik für tief sitzende Follikel',
  },
  {
    id: 'koerper-bauch-ruecken',
    name: 'Bauchlinie, Brust & Rückenareale',
    category: 'Körper',
    shortDescription:
      'Systematische Auslichtung und vollständige Entfernung störender Einzelhaare oder größerer Zonen in planbaren Sitzungen.',
    typicalDurations: [30, 60, 90],
    recommendedInterval: 'Alle 4–6 Wochen',
    methodNote: 'Kombination aus Flash-Thermolyse und sanfter Nachpflege',
  },
  {
    id: 'sensibel-bikini',
    name: 'Bikinizone & sensible Hautareale',
    category: 'Sensible Zonen',
    shortDescription:
      'Besonders hautschonende Epilation empfindlicher Regionen mit temperierter Nadeltechnik und beruhigender Sofort-Pflege.',
    typicalDurations: [30, 60],
    recommendedInterval: 'Alle 3–4 Wochen',
    methodNote: 'Isolierte Komfort-Sonden zum Schutz der oberen Hautschicht',
  },
  {
    id: 'sensibel-brustwarze',
    name: 'Areola & empfindliche Einzelhaare',
    category: 'Sensible Zonen',
    shortDescription:
      'Diskrete, behutsame Behandlung einzelner störender Haare rund um empfindliche Hautpartien in entspannter Privatsphäre.',
    typicalDurations: [15, 30],
    recommendedInterval: 'Alle 3–4 Wochen',
    methodNote: 'Sanfte Impulse mit steriler Einweg-Goldsonde',
  },
];

export const PRE_TREATMENT_CHECKLIST = [
  {
    id: 'haarlaenge',
    title: 'Haarlänge ca. 2–3 mm belassen',
    detail: 'Bitte 3–5 Tage vorher nicht mehr rasieren, zupfen oder wachsen, damit das Haar mit der Pinzette fassbar bleibt.',
  },
  {
    id: 'keine-sonne',
    title: '24 Stunden vorher keine direkte Sonne & kein Solarium',
    detail: 'Beruhigte, nicht UV-gereizte Haut sorgt für maximale Verträglichkeit und schnellste Regeneration.',
  },
  {
    id: 'haut-rein',
    title: 'Ungeschminkt & ohne ölige Cremes erscheinen',
    detail: 'Am Behandlungstag keine fetthaltigen Lotionen, Selbstbräuner oder säurehaltige Seren auf das Areal auftragen.',
  },
  {
    id: 'hydration',
    title: 'Ausreichend Wasser trinken',
    detail: 'Gut durchfeuchtete Haut verbessert die Leitfähigkeit im Haarfollikel und macht die Behandlung spürbar angenehmer.',
  },
];

export const AFTERCARE_TIPS = [
  {
    window: 'Erste 24 Stunden',
    title: 'Kühlen & berührungsfrei halten',
    description:
      'Behandelte Stelle nicht unnötig anfassen. Beruhigendes Panthenol-Gel oder steriles Aloe-Serum dünn auftragen.',
  },
  {
    window: 'Erste 48 Stunden',
    title: 'Kein Make-up, Sauna, Sport & Schwimmbad',
    description:
      'Vermeiden Sie starkes Schwitzen, Chlorwasser sowie parfümierte Pflegeprodukte, damit die feinen Haarkanäle ruhig schließen.',
  },
  {
    window: 'Folgende 14 Tage',
    title: 'Konsequenter UV-Schutz (LSF 50)',
    description:
      'Schützen Sie die Haut im Freien mit Lichtschutzfaktor 50 und verzichten Sie zwischen den Sitzungen aufs Zupfen.',
  },
];

export const TRAINING_TRACKS: TrainingTrack[] = [
  {
    id: 'umschulung-quereinsteiger',
    badgeLabel: 'Für Quereinsteiger · Berufswechsel',
    title: 'Komplette Umschulung für Quereinsteiger',
    audience: 'Berufswechsler ohne kosmetische Vorbildung mit Wunsch nach fundierter Selbstständigkeit',
    duration: '5 Tage Präsenz in Havixbeck + 4 Wochen Praxisbegleitung',
    priceEur: 2890,
    format: 'Kleingruppe (max. 3 Teilnehmende)',
    summary:
      'Der strukturierte Weg in einen gefragten, krisensicheren Fachberuf: Von Anatomie und Hygiene über sichere Sondenführung bis zur eigenen Studio-Eröffnung.',
    highlights: [
      'Keine Vorkenntnisse nötig — schrittweiser Aufbau ab Tag 1',
      'Umfangreiche Praxis an mehreren echten Modellen unter Fachaufsicht',
      'Komplette Hygiene-, Desinfektions- und NiSV-Orientierung',
      'Gründungsleitfaden, Preiskalkulation & Starter-Materialempfehlung',
    ],
    prerequisites: 'Keine Vorkenntnisse erforderlich; Freude an präziser Feinarbeit.',
  },
  {
    id: 'fachschulung-profis',
    badgeLabel: 'Für Kosmetikerinnen & Heilberufe',
    title: 'Fach-Schulung Elektro-Epilation',
    audience: 'Kosmetikerinnen, medizinische Fachangestellte & Laser-Studios als Ergänzungsangebot',
    duration: '3 Tage Intensiv-Praxis in Havixbeck',
    priceEur: 1690,
    format: 'Kleingruppe (max. 4 Teilnehmende)',
    summary:
      'Erweitern Sie Ihr Studio-Portfolio um die einzige Methode für dauerhafte Entfernung weißer, blonder und hormoneller Haare.',
    highlights: [
      'Vertiefung Thermolyse, Elektrolyse & Blend-Verfahren',
      'Sondenauswahl (Gold, Edelstahl, isoliert) für sensible Hautzonen',
      'Professionelle Anamnese & realistische Sitzungsplanung',
      'Direkte Praxis am Modell für Gesicht, Achseln und Körperzonen',
    ],
    prerequisites: 'Grundkenntnisse in Kosmetik, Pflege oder Ästhetik von Vorteil.',
  },
  {
    id: 'praxis-hygiene-intensiv',
    badgeLabel: 'Aufbautraining · Perfektionierung',
    title: 'Praxis-Intensivtraining & Hygiene',
    audience: 'Bereits geschulte Anwenderinnen zur Routine-Steigerung & Qualitätsprüfung',
    duration: '1 Tag Intensiv-Workshop (8 UE)',
    priceEur: 650,
    format: 'Einzelcoaching oder Zweier-Team',
    summary:
      'Gezieltes Troubleshooting für Insertionswinkel, Stromstärke ohne Hautreizung und lückenlose Praxis-Hygiene nach aktuellem Standard.',
    highlights: [
      'Analyse Ihrer eigenen Arbeitstechnik unter Lupenkontrolle',
      'Optimierung der Einstichtiefe & Vermeidung von Überbehandlungen',
      'Sterilisationskette, Dokumentation & Kundenaufklärung im Detail',
      'Individuelle Fallbesprechung komplexer Haarstrukturen',
    ],
    prerequisites: 'Vorherige Grundausbildung in der Elektro-Epilation.',
  },
];

export const TRAINING_COHORTS: TrainingCohort[] = [
  {
    id: 'cohort-jan-27',
    trackId: 'umschulung-quereinsteiger',
    dateLabel: '18. – 22. Januar 2027',
    startDateIso: '2027-01-18',
    location: 'Akademie Havixbeck',
    totalSpots: 3,
    availableSpots: 2,
    scheduleSummary: 'Mo–Fr, jeweils 09:30 – 16:30 Uhr',
  },
  {
    id: 'cohort-feb-27',
    trackId: 'fachschulung-profis',
    dateLabel: '15. – 17. Februar 2027',
    startDateIso: '2027-02-15',
    location: 'Akademie Havixbeck',
    totalSpots: 4,
    availableSpots: 3,
    scheduleSummary: 'Mo–Mi, jeweils 09:30 – 17:00 Uhr',
  },
  {
    id: 'cohort-mar-27',
    trackId: 'praxis-hygiene-intensiv',
    dateLabel: '08. März 2027',
    startDateIso: '2027-03-08',
    location: 'Akademie Havixbeck',
    totalSpots: 2,
    availableSpots: 1,
    scheduleSummary: 'Montag, 09:30 – 17:30 Uhr',
  },
  {
    id: 'cohort-apr-27',
    trackId: 'umschulung-quereinsteiger',
    dateLabel: '12. – 16. April 2027',
    startDateIso: '2027-04-12',
    location: 'Akademie Havixbeck',
    totalSpots: 3,
    availableSpots: 3,
    scheduleSummary: 'Mo–Fr, jeweils 09:30 – 16:30 Uhr',
  },
];

export const CURRICULUM_MODULES = [
  {
    number: '01',
    title: 'Haut- & Haaranatomie verstehen',
    details:
      'Wachstumsphasen (Anagen, Katagen, Telogen), Haarfollikel-Tiefe und hormonelle Einflüsse sicher beurteilen.',
  },
  {
    number: '02',
    title: 'Geräte-, Strom- & Sondenlehre',
    details:
      'Thermolyse, Elektrolyse und Blend präzise dosieren. Richtige Wahl zwischen isolierten, Gold- und Edelstahlsonden.',
  },
  {
    number: '03',
    title: 'Hygiene, Sterilisation & Aufklärung',
    details:
      'RKI-orientierte Praxishygiene, Einweg-Materialien, Kontraindikationen und rechtssichere Einwilligungsbögen.',
  },
  {
    number: '04',
    title: 'Intensive Praxis am echten Modell',
    details:
      'Geführtes Training für Gesicht, Oberlippe, Kinn, Achseln und Körperzonen unter ruhiger Einzelkorrektur.',
  },
  {
    number: '05',
    title: 'Zertifikat & erfolgreicher Berufseinstieg',
    details:
      'Praktische Abschlussprüfung, Zertifikatsvergabe, Gerätekauf-Beratung, Terminkalkulation und Kundengewinnung.',
  },
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-upcoming-24h',
    treatmentId: 'gesicht-oberlippe-kinn',
    treatmentName: 'Oberlippe, Kinn & Wangenkontur',
    category: 'Gesicht',
    duration: 30,
    priceEur: 68,
    dateTimeIso: '2026-11-15T11:30:00',
    clientName: 'Hannah Mertens',
    clientEmail: 'hannah.mertens@beispiel.de',
    clientPhone: '+49 171 4829104',
    notes: 'Bitte wieder die isolierte Goldsonde verwenden.',
    status: 'bestätigt',
    checklistCompletedIds: ['haarlaenge'],
    reminder24hEnabled: true,
    aftercareReminderEnabled: true,
  },
  {
    id: 'apt-past-completed',
    treatmentId: 'gesicht-oberlippe-kinn',
    treatmentName: 'Oberlippe, Kinn & Wangenkontur',
    category: 'Gesicht',
    duration: 30,
    priceEur: 68,
    dateTimeIso: '2026-10-20T14:00:00',
    clientName: 'Hannah Mertens',
    clientEmail: 'hannah.mertens@beispiel.de',
    clientPhone: '+49 171 4829104',
    status: 'abgeschlossen',
    checklistCompletedIds: ['haarlaenge', 'keine-sonne', 'haut-rein', 'hydration'],
    reminder24hEnabled: true,
    aftercareReminderEnabled: true,
  },
];

export const INITIAL_PROGRESS: TreatmentProgressItem[] = [
  {
    id: 'prog-1',
    zone: 'Gesicht · Kinn & Oberlippe',
    completedSessions: 4,
    plannedSessions: 8,
    reductionPercent: 58,
    nextRecommendedWindow: 'Alle 3 Wochen',
    methodUsed: 'Blend & Thermolyse (Goldsonde)',
  },
  {
    id: 'prog-2',
    zone: 'Achseln beidseitig',
    completedSessions: 2,
    plannedSessions: 7,
    reductionPercent: 32,
    nextRecommendedWindow: 'Alle 4 Wochen',
    methodUsed: 'Komfort-Thermolyse',
  },
];

export const CLIENT_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    author: 'Elena Becker',
    locationAndService: 'Münster · Gesichtsepilation (6 Sitzungen)',
    quote:
      'Nach drei erfolglosen Laser-Zyklen bei meinen hellen Kinnhaaren habe ich zu Natali nach Havixbeck gewechselt.',
    outcome:
      'Schon nach der dritten Sitzung waren über die Hälfte der Haare dauerhaft verschwunden — ohne Rötungen oder Hautschäden.',
  },
  {
    id: 'rev-2',
    author: 'Miriam Schulte',
    locationAndService: 'Coesfeld · Absolventin Umschulung 2026',
    quote:
      'Als gelernte Friseurin wollte ich mich beruflich neu orientieren und medizinisch-sauber arbeiten.',
    outcome:
      'Durch die kleinen Gruppen und echte Modellarbeit konnte ich direkt nach dem Zertifikat mein eigenes Kabinenangebot starten.',
  },
  {
    id: 'rev-3',
    author: 'Katrin Hoffmann',
    locationAndService: 'Havixbeck · Sensible Zonen',
    quote:
      'Mir war absolute Hygiene, Diskretion und eine ehrliche Einschätzung der Behandlungsdauer besonders wichtig.',
    outcome:
      'Die ruhige Atmosphäre im Studio und die klaren Vor- und Nachsorge-Tipps haben jede Sitzung angenehm und planbar gemacht.',
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    topic: 'Behandlung',
    question: 'Funktioniert Elektro-Epilation wirklich bei weißen, blonden und grauen Haaren?',
    answer:
      'Ja. Im Gegensatz zu Laser oder IPL benötigt die Elektro-Epilation kein Melanin (Farbpigment) im Haar. Jeder Haarfollikel wird über eine hauchfeine sterile Sonde direkt an der Haarwurzel verödet — zuverlässig bei jeder Haar- und Hautfarbe.',
  },
  {
    id: 'faq-2',
    topic: 'Behandlung',
    question: 'Wie fühlt sich die Behandlung an und wie lange hält die Rötung an?',
    answer:
      'Sie spüren lediglich ein kurzes, warmes Impulskribbeln im Follikel. Eine leichte Rötung klingt mit unserer beruhigenden Nachpflege meist innerhalb weniger Stunden ab.',
  },
  {
    id: 'faq-3',
    topic: 'Behandlung',
    question: 'Wie lang müssen die Haare vor dem Termin sein?',
    answer:
      'Ideal ist eine Haarlänge von ca. 2–3 mm, damit das Haar nach dem sanften Impuls mit einer sterilen Pinzette widerstandslos herausgezogen werden kann. Bitte vorher nicht zupfen oder epilieren.',
  },
  {
    id: 'faq-4',
    topic: 'Schulung & Umschulung',
    question: 'Kann ich die Umschulung in Havixbeck auch als Quereinsteigerin ohne Kosmetikausbildung absolvieren?',
    answer:
      'Ja, unsere 5-tägige Komplett-Umschulung ist speziell für Quereinsteiger konzipiert. Alle medizinischen Grundlagen zu Haut, Haarwachstum, Hygiene und Gerätetechnik werden praxisnah von Grund auf vermittelt.',
  },
  {
    id: 'faq-5',
    topic: 'Schulung & Umschulung',
    question: 'Erhalte ich ein anerkanntes Zertifikat und arbeite ich am echten Modell?',
    answer:
      'Ja. Jede Schulung und Umschulung umfasst begleitete Behandlungen an echten Modellen sowie eine praktische Lernerfolgskontrolle. Bei erfolgreichem Abschluss erhalten Sie Ihr personalisiertes Fachzertifikat von NATALI elektro-epil.',
  },
  {
    id: 'faq-6',
    topic: 'Studio & Hygiene',
    question: 'Welche Hygienestandards gelten im Studio und in der Akademie?',
    answer:
      'Wir arbeiten ausschließlich mit einzeln steril verpackten Einweg-Sonden, medizinischer Flächendesinfektion, Ultraschall- und Autoklav-Aufbereitung der Instrumente sowie lückenloser Einmal-Schutzausrüstung.',
  },
];

export const AVAILABLE_TIME_SLOTS = ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00'];

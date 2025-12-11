export type Domain = 'ECE' | 'VHDL' | 'Quantum' | 'Python' | 'Embedded' | 'Revision';

export interface CrossLink {
  domain: string;
  title: string;
}

export interface SessionBreakdown {
  theory: number;
  intuition: number;
  problemSolving: number;
  review: number;
  coding?: number;
  practice?: number;
  notes?: number;
  total: number;
}

export interface DayData {
  cycle: number;
  dayNum: number;
  dayOfWeek: string;
  domain: Domain;
  theme: string;
  primaryTopic: string;
  subtopics: string[];
  crossLinks: CrossLink[];
  learningObjective: string;
  sessionBreakdown: SessionBreakdown;
  deliverable: string;
  tags: string[];
  isRevisionDay: boolean;
  isCompleted: boolean;
}

export interface CycleData {
  cycleNum: number;
  days: DayData[];
  isCompleted: boolean;
  isMilestone: boolean;
}

export interface MarathonStats {
  totalDays: number;
  completedDays: number;
  totalHours: number;
  hoursStudied: number;
  hoursRemaining: number;
  currentCycle: number;
  currentDay: number;
  streak: number;
  lastCompletedDate: string | null;
  skippedDays?: number;
}

export interface DomainStats {
  domain: Domain;
  totalDays: number;
  completedDays: number;
  totalTopics: number;
  color: string;
  glowClass: string;
}

export const DOMAIN_CONFIG: Record<Domain, { color: string; bgClass: string; glowClass: string; label: string; topics: number }> = {
  ECE: {
    color: 'hsl(207, 64%, 32%)',
    bgClass: 'bg-domain-ece',
    glowClass: 'glow-ece',
    label: 'ECE',
    topics: 947,
  },
  VHDL: {
    color: 'hsl(28, 82%, 52%)',
    bgClass: 'bg-domain-verilog',
    glowClass: 'glow-verilog',
    label: 'Verilog/VHDL',
    topics: 367,
  },
  Quantum: {
    color: 'hsl(277, 56%, 47%)',
    bgClass: 'bg-domain-quantum',
    glowClass: 'glow-quantum',
    label: 'Quantum',
    topics: 1466,
  },
  Python: {
    color: 'hsl(145, 63%, 42%)',
    bgClass: 'bg-domain-python',
    glowClass: 'glow-python',
    label: 'Python',
    topics: 381,
  },
  Embedded: {
    color: 'hsl(4, 74%, 57%)',
    bgClass: 'bg-domain-embedded',
    glowClass: 'glow-embedded',
    label: 'Embedded',
    topics: 1753,
  },
  Revision: {
    color: 'hsl(210, 8%, 53%)',
    bgClass: 'bg-domain-revision',
    glowClass: 'glow-revision',
    label: 'Revision',
    topics: 0,
  },
};

export const MILESTONE_CYCLES = [6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78];

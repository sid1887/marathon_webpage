import { useState, useEffect, useCallback } from 'react';
import { CycleData, DayData, Domain, MarathonStats, DomainStats, DOMAIN_CONFIG } from '@/types/marathon';

const STORAGE_KEY = 'sid-marathon-progress';
const NOTES_KEY = 'sid-marathon-notes';
const SKIPPED_KEY = 'sid-marathon-skipped';
const TIME_KEY = 'sid-marathon-time';

interface StoredProgress {
  completedDays: number[];
  streak: number;
  lastCompletedDate: string | null;
}

interface StoredNotes {
  [dayNum: number]: string;
}

interface StoredSkipped {
  [dayNum: number]: boolean;
}

interface StoredTime {
  [dayNum: number]: number;
}

export function useMarathonStore(cycles: CycleData[]) {
  const [progress, setProgress] = useState<StoredProgress>({
    completedDays: [],
    streak: 0,
    lastCompletedDate: null,
  });

  const [notes, setNotes] = useState<StoredNotes>({});
  const [skipped, setSkipped] = useState<StoredSkipped>({});
  const [studyTime, setStudyTime] = useState<StoredTime>({});
  const [selectedCycle, setSelectedCycle] = useState<number>(4);
  const [activeDomainFilters, setActiveDomainFilters] = useState<Domain[]>([
    'ECE', 'VHDL', 'Quantum', 'Python', 'Embedded', 'Revision'
  ]);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  // Load from localStorage
  useEffect(() => {
    const storedProgress = localStorage.getItem(STORAGE_KEY);
    if (storedProgress) {
      try {
        setProgress(JSON.parse(storedProgress));
      } catch (e) {
        console.error('Failed to parse progress:', e);
      }
    }

    const storedNotes = localStorage.getItem(NOTES_KEY);
    if (storedNotes) {
      try {
        setNotes(JSON.parse(storedNotes));
      } catch (e) {
        console.error('Failed to parse notes:', e);
      }
    }

    const storedSkipped = localStorage.getItem(SKIPPED_KEY);
    if (storedSkipped) {
      try {
        setSkipped(JSON.parse(storedSkipped));
      } catch (e) {
        console.error('Failed to parse skipped:', e);
      }
    }

    const storedTime = localStorage.getItem(TIME_KEY);
    if (storedTime) {
      try {
        setStudyTime(JSON.parse(storedTime));
      } catch (e) {
        console.error('Failed to parse study time:', e);
      }
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  }, [notes]);

  // Save skipped to localStorage
  useEffect(() => {
    localStorage.setItem(SKIPPED_KEY, JSON.stringify(skipped));
  }, [skipped]);

  // Save study time to localStorage
  useEffect(() => {
    localStorage.setItem(TIME_KEY, JSON.stringify(studyTime));
  }, [studyTime]);

  const toggleDayComplete = useCallback((dayNum: number) => {
    setProgress(prev => {
      const isCompleted = prev.completedDays.includes(dayNum);
      let newCompletedDays: number[];
      let newStreak = prev.streak;

      if (isCompleted) {
        // Uncompleting a day
        newCompletedDays = prev.completedDays.filter(d => d !== dayNum);
        // Recalculate streak by counting consecutive days from the end
        if (newCompletedDays.length === 0) {
          newStreak = 0;
        } else {
          // Sort completed days and count consecutive from the end
          const sorted = [...newCompletedDays].sort((a, b) => a - b);
          newStreak = 1;
          for (let i = sorted.length - 1; i > 0; i--) {
            if (sorted[i] - sorted[i - 1] === 1) {
              newStreak++;
            } else {
              break;
            }
          }
        }
      } else {
        // Completing a day
        newCompletedDays = [...prev.completedDays, dayNum];
        // Sort and count consecutive days from the end
        const sorted = [...newCompletedDays].sort((a, b) => a - b);
        newStreak = 1;
        for (let i = sorted.length - 1; i > 0; i--) {
          if (sorted[i] - sorted[i - 1] === 1) {
            newStreak++;
          } else {
            break;
          }
        }
      }

      return {
        completedDays: newCompletedDays,
        streak: newStreak,
        lastCompletedDate: prev.lastCompletedDate,
      };
    });
  }, []);

  const updateNote = useCallback((dayNum: number, note: string) => {
    setNotes(prev => ({
      ...prev,
      [dayNum]: note,
    }));
  }, []);

  const toggleDomainFilter = useCallback((domain: Domain) => {
    setActiveDomainFilters(prev => {
      if (prev.includes(domain)) {
        return prev.filter(d => d !== domain);
      }
      return [...prev, domain];
    });
  }, []);

  const resetFilters = useCallback(() => {
    setActiveDomainFilters(['ECE', 'VHDL', 'Quantum', 'Python', 'Embedded', 'Revision']);
  }, []);

  // Get all days flattened
  const allDays = cycles.flatMap(c => c.days);

  // Get current cycle data
  const currentCycleData = cycles.find(c => c.cycleNum === selectedCycle);

  // Get filtered days for current cycle
  const filteredDays = currentCycleData?.days.filter(d =>
    activeDomainFilters.includes(d.domain)
  ) || [];

  // Calculate stats
  const skippedDaysCount = Object.values(skipped).filter(Boolean).length;

  // Calculate hours studied based on completed days and their custom study times
  const hoursStudied = progress.completedDays.reduce((total, dayNum) => {
    return total + (studyTime[dayNum] ?? 2.5);
  }, 0);

  // Calculate remaining days: total - completed - skipped
  const remainingDays = allDays.length - progress.completedDays.length - skippedDaysCount;

  const stats: MarathonStats = {
    totalDays: allDays.length,
    completedDays: progress.completedDays.length,
    totalHours: allDays.length * 2.5,
    hoursStudied: parseFloat(hoursStudied.toFixed(1)),
    hoursRemaining: parseFloat((remainingDays * 2.5).toFixed(1)),
    currentCycle: selectedCycle,
    currentDay: currentCycleData?.days[0]?.dayNum || 1,
    streak: progress.streak,
    lastCompletedDate: progress.lastCompletedDate,
    skippedDays: skippedDaysCount,
  };

  // Calculate domain stats
  const domainStats: DomainStats[] = Object.keys(DOMAIN_CONFIG).map(domain => {
    const domainDays = allDays.filter(d => d.domain === domain);
    const completedDomainDays = domainDays.filter(d => progress.completedDays.includes(d.dayNum));

    return {
      domain: domain as Domain,
      totalDays: domainDays.length,
      completedDays: completedDomainDays.length,
      totalTopics: DOMAIN_CONFIG[domain as Domain].topics,
      color: DOMAIN_CONFIG[domain as Domain].color,
      glowClass: DOMAIN_CONFIG[domain as Domain].glowClass,
    };
  });

  // Check if a day is completed
  const isDayCompleted = (dayNum: number) => progress.completedDays.includes(dayNum);

  // Get note for a day
  const getDayNote = (dayNum: number) => notes[dayNum] || '';

  // Toggle skip status for a day
  const toggleSkip = useCallback((dayNum: number) => {
    setSkipped(prev => {
      const isCurrentlySkipped = prev[dayNum];

      // If marking as skipped, reset streak to 0
      if (!isCurrentlySkipped) {
        setProgress(prevProgress => ({
          ...prevProgress,
          streak: 0,
        }));
      }

      return {
        ...prev,
        [dayNum]: !isCurrentlySkipped,
      };
    });
  }, []);

  // Check if a day is skipped
  const isSkipped = useCallback((dayNum: number) => {
    return skipped[dayNum] || false;
  }, [skipped]);

  // Update study time for a day
  const updateStudyTime = useCallback((dayNum: number, hours: number) => {
    setStudyTime(prev => ({
      ...prev,
      [dayNum]: Math.max(0, hours), // Ensure non-negative
    }));
  }, []);

  // Get study time for a day (defaults to 2.5 if not set)
  const getStudyTime = useCallback((dayNum: number) => {
    return studyTime[dayNum] ?? 2.5;
  }, [studyTime]);

  return {
    cycles,
    allDays,
    currentCycleData,
    filteredDays,
    selectedCycle,
    setSelectedCycle,
    activeDomainFilters,
    toggleDomainFilter,
    resetFilters,
    expandedDay,
    setExpandedDay,
    stats,
    domainStats,
    toggleDayComplete,
    isDayCompleted,
    updateNote,
    getDayNote,
    toggleSkip,
    isSkipped,
    updateStudyTime,
    getStudyTime,
    progress,
  };
}

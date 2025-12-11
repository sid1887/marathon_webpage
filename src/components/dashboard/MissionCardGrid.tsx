import { motion } from 'framer-motion';
import { DayData } from '@/types/marathon';
import { MissionCard } from './MissionCard';

interface MissionCardGridProps {
  days: DayData[];
  expandedDay: number | null;
  onToggleExpand: (dayNum: number) => void;
  isDayCompleted: (dayNum: number) => boolean;
  onToggleComplete: (dayNum: number) => void;
  getDayNote: (dayNum: number) => string;
  onUpdateNote: (dayNum: number, note: string) => void;
  isEditable?: boolean;
  isSkipped?: (dayNum: number) => boolean;
  onToggleSkip?: (dayNum: number) => void;
  getStudyTime?: (dayNum: number) => number;
  onUpdateTime?: (dayNum: number, hours: number) => void;
}

export function MissionCardGrid({
  days,
  expandedDay,
  onToggleExpand,
  isDayCompleted,
  onToggleComplete,
  getDayNote,
  onUpdateNote,
  isEditable = false,
  isSkipped = () => false,
  onToggleSkip = () => {},
  getStudyTime = () => 2.5,
  onUpdateTime = () => {},
}: MissionCardGridProps) {
  if (days.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <p className="text-muted-foreground font-mono text-sm">
          No missions match the current filters.
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Try adjusting your domain filters.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-max"
    >
      {days.map((day, index) => (
        <div key={day.dayNum} className="relative z-0">
          <MissionCard
            day={day}
            isCompleted={isDayCompleted(day.dayNum)}
            isExpanded={expandedDay === day.dayNum}
            onToggleExpand={() => onToggleExpand(expandedDay === day.dayNum ? -1 : day.dayNum)}
            onToggleComplete={() => onToggleComplete(day.dayNum)}
            note={getDayNote(day.dayNum)}
            onUpdateNote={(note) => onUpdateNote(day.dayNum, note)}
            index={index}
            isEditable={isEditable}
            isSkipped={isSkipped(day.dayNum)}
            onToggleSkip={() => onToggleSkip(day.dayNum)}
            studyTime={getStudyTime(day.dayNum)}
            onUpdateTime={(hours) => onUpdateTime(day.dayNum, hours)}
          />
        </div>
      ))}
    </motion.div>
  );
}

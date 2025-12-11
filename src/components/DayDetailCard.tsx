import { motion } from 'framer-motion';
import { DayData, DOMAIN_CONFIG } from '@/types/marathon';
import { BookOpen, Lightbulb, PenTool, RotateCcw, Code, FileText, Timer, StickyNote } from 'lucide-react';

interface DayDetailCardProps {
  day: DayData;
  isCompleted: boolean;
  studyTime: number;
  note: string;
  isSkipped: boolean;
  index: number;
}

export function DayDetailCard({
  day,
  isCompleted,
  studyTime,
  note,
  isSkipped,
  index,
}: DayDetailCardProps) {
  const config = DOMAIN_CONFIG[day.domain as keyof typeof DOMAIN_CONFIG];

  if (!config) {
    return (
      <div className="glass rounded-xl p-6 border border-red-500/50">
        <p className="text-red-500">Error: Invalid domain "{day.domain}" for Day {day.dayNum}</p>
      </div>
    );
  }

  if (!day.sessionBreakdown) {
    return (
      <div className="glass rounded-xl p-6 border border-red-500/50">
        <p className="text-red-500">Error: Missing session breakdown for Day {day.dayNum}</p>
      </div>
    );
  }

  const sessionItems = [
    { label: 'Theory', icon: BookOpen, value: day.sessionBreakdown.theory },
    { label: 'Intuition', icon: Lightbulb, value: day.sessionBreakdown.intuition },
    { label: 'Problems', icon: PenTool, value: day.sessionBreakdown.problemSolving },
    { label: 'Review', icon: RotateCcw, value: day.sessionBreakdown.review },
    { label: 'Coding', icon: Code, value: day.sessionBreakdown.coding },
    { label: 'Practice', icon: Timer, value: day.sessionBreakdown.practice },
    { label: 'Notes', icon: StickyNote, value: day.sessionBreakdown.notes },
  ].filter(item => item.value && item.value > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass rounded-xl p-6 border-l-4"
      style={{ borderColor: config.color }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-mono font-bold uppercase px-3 py-1 rounded" style={{ backgroundColor: `${config.color}20`, color: config.color }}>
              {day.dayOfWeek}
            </span>
            <span className="text-sm font-mono font-bold uppercase" style={{ color: config.color }}>
              Day {day.dayNum}
            </span>
            <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground font-mono">
              {config.label}
            </span>
            {day.isRevisionDay && (
              <span className="text-xs px-2 py-1 rounded bg-accent/20 text-accent font-mono">
                REVISION
              </span>
            )}
          </div>

          <h2 className="text-xl font-semibold text-foreground mb-1">
            {day.primaryTopic}
          </h2>
          <p className="text-sm text-muted-foreground">
            Theme: {day.theme}
          </p>
        </div>

        {/* Status Badges */}
        <div className="flex flex-col gap-2 ml-4">
          {isCompleted && (
            <span className="text-xs px-3 py-1 rounded bg-success/20 text-success font-mono font-bold">
              ✓ COMPLETED
            </span>
          )}
          {isSkipped && (
            <span className="text-xs px-3 py-1 rounded bg-amber-500/20 text-amber-400 font-mono font-bold">
              ⊘ SKIPPED
            </span>
          )}
          {!isCompleted && !isSkipped && (
            <span className="text-xs px-3 py-1 rounded bg-muted text-muted-foreground font-mono font-bold">
              PENDING
            </span>
          )}
          <span className="text-xs px-3 py-1 rounded bg-blue-500/20 text-blue-400 font-mono font-bold">
            {studyTime}h
          </span>
        </div>
      </div>

      {/* Learning Objective */}
      <div className="mb-4 p-3 rounded bg-muted/50">
        <p className="text-sm text-foreground font-medium mb-1">Learning Objective:</p>
        <p className="text-sm text-muted-foreground">{day.learningObjective}</p>
      </div>

      {/* Subtopics */}
      {day.subtopics.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-semibold mb-2">Subtopics:</p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {day.subtopics.map((subtopic, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                {subtopic}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Session Breakdown */}
      <div className="mb-4">
        <p className="text-sm font-semibold mb-3">Session Breakdown:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sessionItems.map((item) => (
            <div key={item.label} className="flex items-center gap-2 p-2 rounded bg-muted/50">
              <item.icon className="w-4 h-4 text-primary" />
              <span className="text-sm font-mono flex-1">{item.label}</span>
              <span className="text-sm font-bold text-primary">{item.value}m</span>
            </div>
          ))}
        </div>
      </div>

      {/* Deliverable */}
      <div className="mb-4 p-3 rounded bg-muted/50">
        <p className="text-sm font-semibold mb-1 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Deliverable:
        </p>
        <p className="text-sm text-muted-foreground">{day.deliverable}</p>
      </div>

      {/* Cross Links */}
      {day.crossLinks.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-semibold mb-2">Related Topics:</p>
          <div className="flex flex-wrap gap-2">
            {day.crossLinks.map((link, i) => (
              <span key={i} className="text-xs px-2 py-1 rounded bg-accent/20 text-accent font-mono">
                {link.domain} • {link.title}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {day.tags.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-semibold mb-2">Tags:</p>
          <div className="flex flex-wrap gap-2">
            {day.tags.map((tag, i) => (
              <span key={i} className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground font-mono">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {note && (
        <div className="p-3 rounded bg-muted/50 border border-primary/20">
          <p className="text-sm font-semibold mb-2 flex items-center gap-2">
            <StickyNote className="w-4 h-4" />
            Your Notes:
          </p>
          <p className="text-sm text-muted-foreground">{note}</p>
        </div>
      )}
    </motion.div>
  );
}

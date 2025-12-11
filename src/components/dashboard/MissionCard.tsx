import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Clock, BookOpen, Lightbulb, PenTool, RotateCcw, Code, ExternalLink, FileText, Timer, StickyNote, SkipForward } from 'lucide-react';
import { DayData, DOMAIN_CONFIG } from '@/types/marathon';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface MissionCardProps {
  day: DayData;
  isCompleted: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onToggleComplete: () => void;
  onToggleSkip?: () => void;
  isSkipped?: boolean;
  studyTime?: number;
  onUpdateTime?: (time: number) => void;
  note: string;
  onUpdateNote: (note: string) => void;
  index: number;
  isEditable?: boolean;
}

export function MissionCard({
  day,
  isCompleted,
  isExpanded,
  onToggleExpand,
  onToggleComplete,
  onToggleSkip,
  isSkipped = false,
  studyTime = 2.5,
  onUpdateTime,
  note,
  onUpdateNote,
  index,
  isEditable = false,
}: MissionCardProps) {
  const [showNotes, setShowNotes] = useState(false);
  const [editingTime, setEditingTime] = useState(false);
  const [timeValue, setTimeValue] = useState(studyTime.toString());
  const config = DOMAIN_CONFIG[day.domain];

  const sessionItems = [
    { key: 'theory', label: 'Theory', icon: BookOpen, value: day.sessionBreakdown.theory },
    { key: 'intuition', label: 'Intuition', icon: Lightbulb, value: day.sessionBreakdown.intuition },
    { key: 'problemSolving', label: 'Problems', icon: PenTool, value: day.sessionBreakdown.problemSolving },
    { key: 'review', label: 'Review', icon: RotateCcw, value: day.sessionBreakdown.review },
    { key: 'coding', label: 'Coding', icon: Code, value: day.sessionBreakdown.coding },
    { key: 'practice', label: 'Practice', icon: Timer, value: day.sessionBreakdown.practice },
    { key: 'notes', label: 'Notes', icon: StickyNote, value: day.sessionBreakdown.notes },
  ].filter(item => item.value && item.value > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={`glass rounded-xl overflow-visible transition-all duration-300 relative ${
        isCompleted ? 'opacity-70' : ''
      } ${isExpanded ? 'z-20' : 'z-0'}`}
      style={{
        borderColor: config.color,
        borderWidth: '1px',
        boxShadow: isExpanded ? `0 0 30px ${config.color}40` : undefined,
      }}
    >
      {/* Header */}
      <div
        className="w-full p-4 text-left"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Day info row */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="font-mono text-xs font-bold uppercase" style={{ color: config.color }}>
                {day.dayOfWeek.slice(0, 3)}
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                Day {day.dayNum}
              </span>
              <span
                className="px-2 py-0.5 rounded text-[10px] font-mono uppercase"
                style={{ backgroundColor: `${config.color}20`, color: config.color }}
              >
                {config.label}
              </span>
              {day.isRevisionDay && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-accent/20 text-accent">
                  Revision
                </span>
              )}
            </div>

            {/* Primary topic */}
            <h3 className="font-medium text-sm text-foreground line-clamp-2">
              {day.primaryTopic}
            </h3>

            {/* Theme */}
            <p className="text-xs text-muted-foreground mt-1">
              Theme: {day.theme}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Complete checkbox */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (isEditable) onToggleComplete();
              }}
              disabled={!isEditable}
              className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                isCompleted
                  ? 'bg-success border-success text-success-foreground'
                  : 'border-muted-foreground/50 hover:border-primary'
              } ${!isEditable ? 'cursor-not-allowed opacity-50' : ''}`}
              title={isEditable ? 'Mark complete' : 'Login to edit'}
            >
              {isCompleted && <Check className="w-4 h-4" />}
            </button>

            {/* Skip button */}
            {isEditable && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSkip?.();
                }}
                className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                  isSkipped
                    ? 'bg-amber-600/40 border-amber-500 text-amber-400'
                    : 'border-muted-foreground/50 hover:border-amber-500'
                }`}
                title="Mark as skipped"
              >
                {isSkipped && <SkipForward className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Time info and mini-bars */}
        <div className="flex items-center justify-between mt-3 mb-2">
          <div className="flex-1">
            {/* Session breakdown mini-bars */}
            <div className="flex gap-1">
              {sessionItems.map((item) => (
                <div
                  key={item.key}
                  className="flex-1 h-1 rounded-full bg-muted overflow-hidden"
                  title={`${item.label}: ${item.value}m`}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: config.color,
                      width: `${(item.value! / day.sessionBreakdown.total) * 100}%`
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Study time display/editor */}
          {isEditable && (
            <div className="shrink-0 ml-3">
              {!editingTime ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingTime(true);
                  }}
                  className="flex items-center gap-1 px-2 py-1 rounded text-xs font-mono bg-muted/50 hover:bg-muted transition-colors"
                  title="Click to edit study time"
                >
                  <Clock className="w-3 h-3" />
                  {studyTime}h
                </button>
              ) : (
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={timeValue}
                    onChange={(e) => setTimeValue(e.target.value)}
                    className="w-12 px-2 py-1 rounded text-xs font-mono bg-muted/50 border border-border"
                    autoFocus
                    onBlur={() => {
                      const newTime = parseFloat(timeValue) || studyTime;
                      onUpdateTime?.(newTime);
                      setTimeValue(newTime.toString());
                      setEditingTime(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const newTime = parseFloat(timeValue) || studyTime;
                        onUpdateTime?.(newTime);
                        setTimeValue(newTime.toString());
                        setEditingTime(false);
                      }
                    }}
                  />
                  <span className="text-xs text-muted-foreground">h</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Session breakdown mini-bars */}

        {/* Tags */}
        <div className="flex gap-1 mt-2 flex-wrap">
          {day.tags.map(tag => (
            <span
              key={tag}
              className="text-[10px] px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Expanded content - Inline with maxHeight animation */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, maxHeight: 0 }}
            animate={{ opacity: 1, maxHeight: 1500 }}
            exit={{ opacity: 0, maxHeight: 0 }}
            transition={{ duration: 0.35 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4 border-t border-border/50 pt-4">
              {day.subtopics.length > 0 && (
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                    Subtopics
                  </h4>
                  <ul className="space-y-1.5">
                    {day.subtopics.map((subtopic, i) => (
                      <li key={i} className="text-sm text-foreground/90 flex gap-2">
                        <span className="text-primary shrink-0">•</span>
                        <span>{subtopic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Learning Objective */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                  Learning Objective
                </h4>
                <p className="text-sm text-foreground/80">{day.learningObjective}</p>
              </div>

              {/* Session Breakdown */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                  Session Breakdown ({day.sessionBreakdown.total}m total)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {sessionItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.key}
                        className="flex items-center gap-2 p-2 rounded-lg bg-muted/30"
                      >
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="text-xs text-muted-foreground">{item.label}</div>
                          <div className="text-sm font-mono font-bold">{item.value}m</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cross-links */}
              {day.crossLinks.length > 0 && (
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                    Cross-Links
                  </h4>
                  <div className="space-y-1.5">
                    {day.crossLinks.map((link, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 text-sm text-accent hover:text-accent/80 cursor-pointer transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                        <span>
                          <span className="font-mono text-xs opacity-70">[{link.domain}]</span>{' '}
                          {link.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Deliverable */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                  Deliverable
                </h4>
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4 text-primary" />
                  <span>{day.deliverable}</span>
                </div>
              </div>

              {/* Notes section */}
              <div>
                <button
                  onClick={() => {
                    if (isEditable) setShowNotes(!showNotes);
                  }}
                  disabled={!isEditable}
                  className={`flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors ${
                    !isEditable ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  title={isEditable ? 'Edit notes' : 'Login to edit'}
                >
                  <StickyNote className="w-3.5 h-3.5" />
                  {showNotes ? 'Hide Notes' : 'Add Notes'}
                </button>

                {showNotes && isEditable && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-2"
                  >
                    <Textarea
                      value={note}
                      onChange={(e) => onUpdateNote(e.target.value)}
                      placeholder="Add your notes here..."
                      className="min-h-[100px] bg-muted/30 border-border/50 text-sm resize-none"
                    />
                  </motion.div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={onToggleComplete}
                  disabled={!isEditable}
                  variant={isCompleted ? 'secondary' : 'default'}
                  size="sm"
                  className={`flex-1 ${!isEditable ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title={isEditable ? 'Mark complete' : 'Login to edit'}
                >
                  <Check className="w-4 h-4 mr-2" />
                  {isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

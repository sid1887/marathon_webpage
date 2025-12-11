import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CheckCircle2, Clock, Badge, Play } from 'lucide-react';
import { DayData, DOMAIN_CONFIG } from '@/types/marathon';
import { Button } from '@/components/ui/button';
import { variants, ANIMATION_TIMINGS } from '@/lib/animations';

interface MissionCardProps {
  day: DayData;
  isCompleted: boolean;
  isExpanded: boolean;
  onToggleExpand: (dayNum: number) => void;
  onToggleComplete: (dayNum: number) => void;
  note?: string;
  onUpdateNote: (dayNum: number, note: string) => void;
}

export const MissionCardEnhanced: React.FC<MissionCardProps> = ({
  day,
  isCompleted,
  isExpanded,
  onToggleExpand,
  onToggleComplete,
  note = '',
  onUpdateNote,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [noteText, setNoteText] = useState(note);
  const config = DOMAIN_CONFIG[day.domain];

  const handleExpandClick = () => {
    onToggleExpand(day.dayNum);
  };

  const dayName = `Day ${day.dayNum} - ${day.dayOfWeek}`;

  return (
    <motion.div
      layout
      variants={variants.cardCascade}
      initial="hidden"
      animate="visible"
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{
        scale: 1.05,
        y: -8,
        transition: { duration: 0.3 }
      }}
    >
      {/* Card Container */}
      <div
        className={`
          relative rounded-xl overflow-hidden transition-all duration-300
          backdrop-blur-xl border border-border/50
          ${isCompleted ? 'opacity-75' : 'opacity-100'}
        `}
        style={{
          background: `linear-gradient(135deg, rgba(15, 23, 42, 0.6) 0%, rgba(20, 30, 50, 0.5) 100%)`,
          boxShadow: isHovered
            ? `0 0 30px ${config.color}40, 0 20px 40px rgba(0, 0, 0, 0.3)`
            : `0 0 20px ${config.color}30, 0 10px 30px rgba(0, 0, 0, 0.2)`
        }}
      >
        {/* Animated Glow Border */}
        <motion.div
          className="absolute inset-0 rounded-xl"
          animate={{
            boxShadow: isHovered
              ? `inset 0 0 20px ${config.color}40`
              : `inset 0 0 10px ${config.color}20`
          }}
          transition={{ duration: 0.3 }}
          style={{ pointerEvents: 'none' }}
        />

        {/* Collapsed View */}
        <div className="relative p-4 cursor-pointer" onClick={handleExpandClick}>
          <div className="flex items-start justify-between gap-4">
            {/* Left Section: Domain Badge + Title */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                {/* Domain Badge */}
                <motion.div
                  className="relative w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: config.color + '20',
                    border: `2px solid ${config.color}`,
                    boxShadow: isHovered ? `0 0 15px ${config.color}` : `0 0 8px ${config.color}`
                  }}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  {isCompleted && (
                    <CheckCircle2 className="w-4 h-4" style={{ color: config.color }} />
                  )}
                </motion.div>

                {/* Day Info */}
                <div>
                  <h3 className="font-mono font-bold text-sm text-foreground">
                    {dayName}
                  </h3>
                  <p className="text-xs text-muted-foreground font-semibold">
                    {day.theme}
                  </p>
                </div>
              </div>

              {/* Topic Title */}
              <motion.p
                className="text-sm font-semibold line-clamp-2 transition-colors duration-300"
                style={{ color: isHovered ? config.color : 'currentColor' }}
              >
                {day.primaryTopic}
              </motion.p>

              {/* Session Breakdown Bars */}
              <div className="mt-3 space-y-1">
                <div className="flex gap-2 text-[10px] font-mono text-muted-foreground">
                  {day.sessionBreakdown.theory > 0 && (
                    <span>Th: {day.sessionBreakdown.theory}m</span>
                  )}
                  {day.sessionBreakdown.intuition > 0 && (
                    <span>In: {day.sessionBreakdown.intuition}m</span>
                  )}
                  {day.sessionBreakdown.problemSolving > 0 && (
                    <span>Pr: {day.sessionBreakdown.problemSolving}m</span>
                  )}
                  {day.sessionBreakdown.coding && day.sessionBreakdown.coding > 0 && (
                    <span>Co: {day.sessionBreakdown.coding}m</span>
                  )}
                </div>
              </div>

              {/* Tags */}
              {day.tags.length > 0 && (
                <motion.div className="mt-3 flex flex-wrap gap-2">
                  {day.tags.slice(0, 2).map((tag, idx) => (
                    <motion.span
                      key={idx}
                      className="text-[10px] px-2 py-1 rounded font-semibold"
                      style={{
                        background: config.color + '30',
                        color: config.color,
                        border: `1px solid ${config.color}60`
                      }}
                      whileHover={{ scale: 1.1 }}
                    >
                      #{tag}
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Right Section: Action Icons */}
            <div className="flex flex-col gap-2 flex-shrink-0">
              {/* Complete Toggle */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleComplete(day.dayNum);
                }}
                className="p-2 hover:scale-110 transition-transform"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                style={{
                  color: isCompleted ? config.color : 'currentColor'
                }}
              >
                <CheckCircle2 className="w-5 h-5" />
              </motion.button>

              {/* Expand Chevron */}
              <motion.button
                onClick={handleExpandClick}
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="p-2"
                style={{ color: config.color }}
              >
                <ChevronDown className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="border-t border-border/30 px-4 py-4 space-y-4"
            >
              {/* Primary Topic */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h4 className="text-sm font-bold mb-2" style={{ color: config.color }}>
                  📌 Primary Topic
                </h4>
                <p className="text-sm text-foreground">{day.primaryTopic}</p>
              </motion.div>

              {/* Subtopics */}
              {day.subtopics.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <h4 className="text-sm font-bold mb-2" style={{ color: config.color }}>
                    📋 Subtopics
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {day.subtopics.map((subtopic, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 + idx * 0.05 }}
                        className="flex items-start gap-2"
                      >
                        <span style={{ color: config.color }}>▸</span>
                        <span>{subtopic}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Learning Objective */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="p-3 rounded-lg border"
                style={{
                  background: config.color + '10',
                  borderColor: config.color + '40'
                }}
              >
                <p className="text-xs font-bold mb-1 text-muted-foreground uppercase">
                  🎯 Learning Objective
                </p>
                <p className="text-sm text-foreground">{day.learningObjective}</p>
              </motion.div>

              {/* Cross-Links */}
              {day.crossLinks.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <h4 className="text-sm font-bold mb-2" style={{ color: config.color }}>
                    🔗 Cross-Links
                  </h4>
                  <div className="space-y-2">
                    {day.crossLinks.map((link, idx) => (
                      <motion.div
                        key={idx}
                        className="text-sm p-2 rounded border"
                        style={{
                          background: config.color + '08',
                          borderColor: config.color + '30'
                        }}
                      >
                        <p className="text-muted-foreground">
                          <span style={{ color: config.color }}>■</span>{' '}
                          <strong>{link.domain}</strong>: {link.title}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex gap-2 pt-2 border-t border-border/30"
              >
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleComplete(day.dayNum);
                  }}
                  variant={isCompleted ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1"
                  style={isCompleted ? { background: config.color } : {}}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  {isCompleted ? 'Completed' : 'Mark Complete'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Timer
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default MissionCardEnhanced;

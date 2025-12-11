import { motion } from 'framer-motion';
import { CycleData, MILESTONE_CYCLES } from '@/types/marathon';

interface CycleWheelProps {
  cycles: CycleData[];
  selectedCycle: number;
  onSelectCycle: (cycle: number) => void;
  completedDays: number[];
}

export function CycleWheel({ cycles, selectedCycle, onSelectCycle, completedDays }: CycleWheelProps) {
  const totalCycles = 75; // Cycles 4-78
  const startCycle = 4;
  const radius = 140;
  const centerX = 160;
  const centerY = 160;
  
  const getCyclePosition = (cycleNum: number) => {
    const index = cycleNum - startCycle;
    const angle = (index / totalCycles) * Math.PI * 2 - Math.PI / 2;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  };
  
  const getCycleProgress = (cycleNum: number) => {
    const cycle = cycles.find(c => c.cycleNum === cycleNum);
    if (!cycle) return 0;
    const completedInCycle = cycle.days.filter(d => completedDays.includes(d.dayNum)).length;
    return completedInCycle / cycle.days.length;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="relative flex items-center justify-center"
    >
      <div className="relative w-[320px] h-[320px]">
        {/* Background glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/5 to-accent/5 blur-xl" />
        
        {/* Outer ring */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 320">
          {/* Background circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="2"
            opacity="0.3"
          />
          
          {/* Cycle markers */}
          {Array.from({ length: totalCycles }, (_, i) => {
            const cycleNum = startCycle + i;
            const pos = getCyclePosition(cycleNum);
            const isSelected = cycleNum === selectedCycle;
            const progress = getCycleProgress(cycleNum);
            const isMilestone = MILESTONE_CYCLES.includes(cycleNum);
            
            return (
              <g key={cycleNum}>
                {/* Connection line to center */}
                {isSelected && (
                  <motion.line
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.3 }}
                    x1={pos.x}
                    y1={pos.y}
                    x2={centerX}
                    y2={centerY}
                    stroke="hsl(var(--primary))"
                    strokeWidth="1"
                    opacity="0.3"
                  />
                )}
                
                {/* Cycle dot */}
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isSelected ? 8 : isMilestone ? 5 : 3}
                  fill={progress === 1 ? 'hsl(var(--success))' : isSelected ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'}
                  opacity={isSelected ? 1 : 0.6}
                  className="cursor-pointer transition-all duration-200"
                  onClick={() => onSelectCycle(cycleNum)}
                  whileHover={{ scale: 1.5 }}
                  whileTap={{ scale: 0.9 }}
                />
                
                {/* Progress ring for selected */}
                {isSelected && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={12}
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                    opacity="0.5"
                    className="animate-glow-pulse"
                  />
                )}
              </g>
            );
          })}
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            key={selectedCycle}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="text-center"
          >
            <div className="text-4xl font-mono font-bold text-primary text-glow-primary">
              {selectedCycle}
            </div>
            <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mt-1">
              Cycle
            </div>
            <div className="text-[10px] text-accent mt-2">
              {MILESTONE_CYCLES.includes(selectedCycle) && '🎯 MILESTONE'}
            </div>
          </motion.div>
        </div>
        
        {/* Navigation arrows */}
        <button
          onClick={() => onSelectCycle(Math.max(4, selectedCycle - 1))}
          className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-primary transition-colors"
          disabled={selectedCycle <= 4}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => onSelectCycle(Math.min(78, selectedCycle + 1))}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-primary transition-colors"
          disabled={selectedCycle >= 78}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}

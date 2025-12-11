import { motion } from 'framer-motion';
import { Rocket, Calendar, Clock, Flame } from 'lucide-react';
import { MarathonStats } from '@/types/marathon';
import { ANIMATION_TIMINGS, variants } from '@/lib/animations';
import React, { useState, useEffect } from 'react';

interface HeaderProps {
  stats: MarathonStats;
}

const StatBadge = ({
  icon,
  label,
  value,
  color,
  delay
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  delay: number;
}) => {
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    // Parse numeric value from string - handle both integers and floats
    const numValue = parseFloat(value.split(' ')[0]) || 0;
    let current = 0;
    const increment = numValue / 30;

    const timer = setInterval(() => {
      current += increment;
      if (current >= numValue) {
        // Display as float if it has decimals, otherwise as integer
        setDisplayValue(numValue % 1 === 0 ? numValue.toString() : numValue.toFixed(1));
        clearInterval(timer);
      } else {
        // Show decimals during animation for float values
        setDisplayValue((Math.floor(current * 10) / 10).toFixed(1));
      }
    }, 20);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      variants={variants.statBoxEnter}
      initial="hidden"
      animate="visible"
      transition={{ delay: ANIMATION_TIMINGS.STAT_BOXES.delay + delay }}
      className="glass rounded-lg p-3 border-l-4 border-primary/60 flex items-center gap-2 hover:scale-105 transition-transform"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="text-primary"
      >
        {icon}
      </motion.div>
      <div className="flex flex-col">
        <span className="text-xs uppercase text-muted-foreground font-semibold">{label}</span>
        <span className="text-lg font-mono font-bold text-primary">{displayValue}</span>
      </div>
    </motion.div>
  );
};

export function Header({ stats }: HeaderProps) {
  const daysRemaining = stats.totalDays - stats.completedDays - (stats.skippedDays || 0);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass border-b border-border/50 sticky top-0 z-50 relative overflow-hidden"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Title Section */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: ANIMATION_TIMINGS.INITIALIZATION_GLOW.delay,
              duration: 0.6
            }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="text-primary animate-pulse-glow"
            >
              <Rocket className="w-8 h-8" />
            </motion.div>
            <div>
              <motion.h1
                className="text-xl lg:text-2xl font-mono font-bold tracking-wider uppercase text-glow-primary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                SID's Marathon
              </motion.h1>
              <motion.p
                className="text-xs lg:text-sm text-muted-foreground font-mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                MISSION CONTROL DASHBOARD
              </motion.p>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <div className="flex flex-wrap items-center gap-2 lg:gap-4">
            <StatBadge
              icon={<Calendar className="w-4 h-4" />}
              label="Cycle"
              value={stats.currentCycle.toString()}
              color="primary"
              delay={0}
            />
            <StatBadge
              icon={<Clock className="w-4 h-4" />}
              label="Days Studied"
              value={`${stats.completedDays} Days`}
              color="primary"
              delay={0.1}
            />
            <StatBadge
              icon={<Clock className="w-4 h-4" />}
              label="Hours Studied"
              value={`${stats.hoursStudied}h`}
              color="primary"
              delay={0.2}
            />
            <StatBadge
              icon={<Flame className="w-4 h-4" />}
              label="Streak"
              value={`${stats.streak} Days`}
              color="primary"
              delay={0.3}
            />
          </div>
        </div>

        {/* Animated Border Bottom */}
        <motion.div
          className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-primary/50 via-primary to-primary/50"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          style={{ transformOrigin: 'left' }}
        />
      </div>
    </motion.header>
  );
}

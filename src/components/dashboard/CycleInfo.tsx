import { motion } from 'framer-motion';
import { CycleData, DOMAIN_CONFIG, MILESTONE_CYCLES } from '@/types/marathon';
import { Trophy, Calendar, Clock, Target } from 'lucide-react';

interface CycleInfoProps {
  cycle: CycleData | undefined;
  completedDays: number[];
}

export function CycleInfo({ cycle, completedDays }: CycleInfoProps) {
  if (!cycle) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Select a cycle to view details
      </div>
    );
  }

  const completedInCycle = cycle.days.filter(d => completedDays.includes(d.dayNum)).length;
  const totalDays = cycle.days.length;
  const progressPercent = Math.round((completedInCycle / totalDays) * 100);

  // Get unique domains in this cycle
  const domainsInCycle = [...new Set(cycle.days.map(d => d.domain))];

  // Get themes
  const themes = [...new Set(cycle.days.map(d => d.theme))].slice(0, 3);

  const isMilestone = MILESTONE_CYCLES.includes(cycle.cycleNum);

  return (
    <motion.div
      key={cycle.cycleNum}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass rounded-xl p-4 mb-6"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Cycle title and info */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="font-mono text-xl font-bold text-primary">
              Cycle {cycle.cycleNum}
            </h2>
            {isMilestone && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs font-mono">
                <Trophy className="w-3 h-3" />
                MILESTONE
              </span>
            )}
          </div>

          <p className="text-sm text-muted-foreground">
            Days {cycle.days[0]?.dayNum} - {cycle.days[cycle.days.length - 1]?.dayNum}
          </p>

          {/* Themes */}
          <div className="flex flex-wrap gap-1 mt-2">
            {themes.map(theme => (
              <span
                key={theme}
                className="text-[10px] px-2 py-0.5 rounded bg-muted/50 text-muted-foreground"
              >
                {theme}
              </span>
            ))}
          </div>
        </div>

        {/* Quick stats */}
        <div className="flex items-center gap-4">
          {/* Domains */}
          <div className="flex -space-x-1">
            {domainsInCycle.map(domain => {
              const config = DOMAIN_CONFIG[domain as keyof typeof DOMAIN_CONFIG];
              if (!config) return null;
              return (
                <div
                  key={domain}
                  className="w-6 h-6 rounded-full border-2 border-background"
                  style={{ backgroundColor: config.color }}
                  title={config.label}
                />
              );
            })}
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-primary rounded-full"
              />
            </div>
            <span className="text-sm font-mono text-muted-foreground">
              {completedInCycle}/{totalDays}
            </span>
          </div>

          {/* Time estimate */}
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="font-mono">{(totalDays * 2.5).toFixed(1)}h</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

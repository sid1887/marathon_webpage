import { motion } from 'framer-motion';
import { Target, Clock, Flame, Calendar, Trophy, AlertCircle } from 'lucide-react';
import { MarathonStats, DomainStats, DOMAIN_CONFIG, MILESTONE_CYCLES } from '@/types/marathon';
import { Progress } from '@/components/ui/progress';

interface StatsPanelProps {
  stats: MarathonStats;
  domainStats: DomainStats[];
  selectedCycle: number;
}

export function StatsPanel({ stats, domainStats, selectedCycle }: StatsPanelProps) {
  const overallProgress = Math.round((stats.completedDays / stats.totalDays) * 100);
  const daysRemaining = (stats.totalDays - stats.completedDays - (stats.skippedDays || 0));

  // Find next milestone
  const nextMilestone = MILESTONE_CYCLES.find(m => m > selectedCycle) || 78;
  const cyclesToMilestone = nextMilestone - selectedCycle;

  // Find next revision day (every Sunday, day 7 of each cycle)
  const currentCycleDay = ((stats.completedDays % 7) || 7);
  const daysToRevision = 7 - currentCycleDay;

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass rounded-xl p-4 h-fit sticky top-24 space-y-6"
    >
      {/* Overall Progress */}
      <div>
        <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          Mission Progress
        </h3>

        <div className="relative mb-4">
          {/* Circular progress */}
          <div className="w-32 h-32 mx-auto relative">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="8"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="8"
                strokeLinecap="round"
                initial={{ strokeDasharray: "0 283" }}
                animate={{ strokeDasharray: `${overallProgress * 2.83} 283` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-2xl font-mono font-bold text-primary"
              >
                {overallProgress}%
              </motion.span>
              <span className="text-[10px] text-muted-foreground uppercase">
                Complete
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Days Complete</span>
            <span className="font-mono">{stats.completedDays} / {stats.totalDays}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Hours Logged</span>
            <span className="font-mono">{(stats.completedDays * 2.5).toFixed(1)}h</span>
          </div>
        </div>
      </div>

      {/* Domain Breakdown */}
      <div>
        <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3">
          Domain Progress
        </h3>
        <div className="space-y-3">
          {domainStats.filter(d => d.domain !== 'Revision').map((stat, index) => {
            const config = DOMAIN_CONFIG[stat.domain];
            const progress = stat.totalDays > 0
              ? Math.round((stat.completedDays / stat.totalDays) * 100)
              : 0;

            return (
              <motion.div
                key={stat.domain}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
              >
                <div className="flex justify-between text-xs mb-1">
                  <span className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: config.color }}
                    />
                    {config.label}
                  </span>
                  <span className="font-mono text-muted-foreground">{progress}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: config.color }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Key Metrics */}
      <div>
        <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3">
          Key Metrics
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <MetricCard
            icon={<Calendar className="w-4 h-4" />}
            label="Days Studied"
            value={stats.completedDays.toString()}
            color="accent"
          />
          <MetricCard
            icon={<Clock className="w-4 h-4" />}
            label="Hours Studied"
            value={`${stats.hoursStudied}h`}
            color="muted"
          />
          <MetricCard
            icon={<Target className="w-4 h-4" />}
            label="Daily Avg"
            value="2.5h"
            color="primary"
            check
          />
          <MetricCard
            icon={<Flame className="w-4 h-4" />}
            label="Streak"
            value={stats.streak.toString()}
            color="destructive"
            emoji="🔥"
          />
          <MetricCard
            icon={<AlertCircle className="w-4 h-4" />}
            label="Skipped Days"
            value={stats.skippedDays?.toString() || '0'}
            color="muted"
          />
        </div>
      </div>

      {/* Milestones */}
      <div>
        <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-accent" />
          Milestones
        </h3>
        <div className="space-y-2">
          {MILESTONE_CYCLES.slice(0, 5).map(milestone => {
            const isCompleted = selectedCycle > milestone;
            const isCurrent = selectedCycle === milestone;
            const isUpcoming = selectedCycle < milestone;

            return (
              <div
                key={milestone}
                className={`flex items-center gap-2 text-xs py-1 ${
                  isCompleted ? 'text-success' : isCurrent ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  isCompleted ? 'bg-success border-success' : isCurrent ? 'border-primary' : 'border-muted-foreground/50'
                }`}>
                  {isCompleted && <span className="text-[8px]">✓</span>}
                  {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                </span>
                <span>Cycle {milestone}</span>
                {isCurrent && <span className="text-accent ml-auto">Current</span>}
              </div>
            );
          })}
          <div className="text-[10px] text-muted-foreground mt-2">
            +{MILESTONE_CYCLES.length - 5} more milestones...
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div>
        <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-accent" />
          Alerts
        </h3>
        <div className="space-y-2">
          <div className="p-2 rounded-lg bg-accent/10 border border-accent/30 text-xs">
            <span className="text-accent font-medium">Next Milestone:</span>
            <span className="text-foreground ml-2">Cycle {nextMilestone} ({cyclesToMilestone} cycles away)</span>
          </div>
          <div className="p-2 rounded-lg bg-muted/50 border border-border text-xs">
            <span className="text-muted-foreground font-medium">Next Revision:</span>
            <span className="text-foreground ml-2">{daysToRevision === 0 ? 'Today!' : `${daysToRevision} days`}</span>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: 'primary' | 'accent' | 'muted' | 'destructive';
  check?: boolean;
  emoji?: string;
}

function MetricCard({ icon, label, value, color, check, emoji }: MetricCardProps) {
  const colorClasses = {
    primary: 'text-primary',
    accent: 'text-accent',
    muted: 'text-muted-foreground',
    destructive: 'text-destructive',
  };

  return (
    <div className="p-2 rounded-lg bg-muted/30 border border-border/50">
      <div className={`${colorClasses[color]} mb-1`}>{icon}</div>
      <div className="text-[10px] text-muted-foreground uppercase">{label}</div>
      <div className={`text-sm font-mono font-bold ${colorClasses[color]}`}>
        {value}
        {check && <span className="ml-1 text-success">✓</span>}
        {emoji && <span className="ml-1">{emoji}</span>}
      </div>
    </div>
  );
}

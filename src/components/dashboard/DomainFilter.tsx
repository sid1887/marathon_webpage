import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { Domain, DOMAIN_CONFIG, DomainStats } from '@/types/marathon';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface DomainFilterProps {
  activeDomains: Domain[];
  domainStats: DomainStats[];
  onToggleDomain: (domain: Domain) => void;
  onReset: () => void;
}

export function DomainFilter({ activeDomains, domainStats, onToggleDomain, onReset }: DomainFilterProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass rounded-xl p-4 h-fit sticky top-24"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-mono font-bold text-sm uppercase tracking-wider text-primary">
          Mission Streams
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Reset
        </Button>
      </div>
      
      <div className="space-y-3">
        {domainStats.map((stat, index) => {
          const config = DOMAIN_CONFIG[stat.domain];
          const isActive = activeDomains.includes(stat.domain);
          const progressPercent = stat.totalDays > 0 
            ? Math.round((stat.completedDays / stat.totalDays) * 100) 
            : 0;
          
          return (
            <motion.button
              key={stat.domain}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onToggleDomain(stat.domain)}
              className={`w-full text-left p-3 rounded-lg transition-all duration-300 border ${
                isActive 
                  ? `border-opacity-50 ${config.glowClass}` 
                  : 'border-border/30 opacity-40 hover:opacity-60'
              }`}
              style={{
                borderColor: isActive ? config.color : undefined,
                backgroundColor: isActive ? `${config.color}15` : undefined,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: config.color }}
                />
                <span className="font-mono text-sm font-medium">
                  {config.label}
                </span>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{stat.totalDays} days</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: config.color }}
                  />
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.aside>
  );
}

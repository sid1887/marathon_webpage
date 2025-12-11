import { useState } from 'react';
import { parseMarkdown } from '@/lib/parseMarkdown';
import { useMarathonStore } from '@/hooks/useMarathonStore';
import { DayDetailCard } from '@/components/DayDetailCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import timetableRaw from '@/data/timetable.md?raw';
import { useNavigate } from 'react-router-dom';

export default function ListView() {
  const navigate = useNavigate();
  const [cycles] = useState(() => parseMarkdown(timetableRaw));
  const store = useMarathonStore(cycles);

  return (
    <div className="min-h-screen bg-background grid-bg scanlines">
      {/* Header */}
      <div className="glass border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </div>
          <h1 className="text-2xl font-mono font-bold text-glow-primary">DETAILED DAY VIEW</h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <p className="text-muted-foreground mb-4">
            Total Days: <span className="font-bold text-primary">{store.allDays.length}</span> |
            Completed: <span className="font-bold text-success">{store.progress.completedDays.length}</span> |
            Skipped: <span className="font-bold text-amber-400">{store.stats.skippedDays}</span>
          </p>
        </div>

        <div className="space-y-4">
          {store.allDays.map((day, index) => (
            <DayDetailCard
              key={`${day.cycle}-${day.dayNum}`}
              day={day}
              isCompleted={store.isDayCompleted(day.dayNum)}
              studyTime={store.getStudyTime(day.dayNum)}
              note={store.getDayNote(day.dayNum)}
              isSkipped={store.isSkipped(day.dayNum)}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

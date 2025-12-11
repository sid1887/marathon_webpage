import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background grid-bg scanlines flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl font-mono font-bold text-primary"
        >
          404
        </motion.div>
        <div>
          <h1 className="text-2xl font-mono font-bold text-foreground mb-2">
            MISSION NOT FOUND
          </h1>
          <p className="text-muted-foreground font-mono">
            The route you're looking for doesn't exist.
          </p>
        </div>
        <Button
          onClick={() => navigate('/')}
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Return to Mission Control
        </Button>
      </motion.div>
    </div>
  );
}

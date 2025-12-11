import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AuthModalProps {
  onLogin: (password: string) => boolean;
  isOpen: boolean;
}

export function AuthModal({ onLogin, isOpen }: AuthModalProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLogin(password)) {
      setPassword('');
      setError('');
    } else {
      setError('Invalid password');
      setPassword('');
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-xl p-8 w-96 max-w-full border border-cyan-500/30"
        style={{ boxShadow: '0 0 30px rgba(0, 255, 255, 0.2)' }}
      >
        <div className="flex items-center justify-center mb-6">
          <Lock className="w-8 h-8 text-cyan-400 mr-3" />
          <h2 className="text-2xl font-bold text-foreground">Admin Login</h2>
        </div>

        <p className="text-muted-foreground text-sm mb-6 text-center">
          Enter the admin password to enable editing
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoFocus
              className="w-full px-4 py-2 bg-muted/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm text-center"
            >
              {error}
            </motion.p>
          )}

          <Button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2"
          >
            Login
          </Button>
        </form>

        <p className="text-xs text-muted-foreground mt-4 text-center">
          Only the admin password allows editing
        </p>
      </motion.div>
    </motion.div>
  );
}

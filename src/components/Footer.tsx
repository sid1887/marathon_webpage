import { Github, Linkedin } from 'lucide-react';

interface FooterProps {
  // Footer is now shown to everyone
}

export function Footer({ }: FooterProps) {
  return (
    <footer className="mt-16 border-t border-cyan-500/20 pt-8 pb-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <div className="text-center md:text-left">
            <p className="font-mono text-sm text-muted-foreground">
              Created by <span className="text-cyan-400 font-semibold">Siddharth Yelugam</span>
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              SID's Marathon Challenge - 280 Days, 700 Hours
            </p>
          </div>

          <div className="flex gap-4">
            <a
              href="https://www.linkedin.com/in/siddharth-yelugam-9b0959340/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg
                border border-cyan-500/30 hover:border-cyan-500/60
                bg-cyan-500/5 hover:bg-cyan-500/10
                text-cyan-400 hover:text-cyan-300
                transition-all duration-200 font-mono text-sm"
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </a>

            <a
              href="https://github.com/sid1887/SID_POWERCORE_MARATHON.git"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg
                border border-cyan-500/30 hover:border-cyan-500/60
                bg-cyan-500/5 hover:bg-cyan-500/10
                text-cyan-400 hover:text-cyan-300
                transition-all duration-200 font-mono text-sm"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

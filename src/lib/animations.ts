/**
 * Global Animation Utilities & Configurations
 * Framer Motion variants, keyframes, and reusable animation patterns
 */

// Page Load Sequence Timings
export const ANIMATION_TIMINGS = {
  INITIALIZATION_GLOW: { duration: 0.8, delay: 0 },
  STAT_BOXES: { duration: 0.6, delay: 0.8, stagger: 0.1 },
  BUTTONS_POP: { duration: 0.5, delay: 1.4 },
  WHEEL_EMERGENCE: { duration: 1.7, delay: 1.8 },
  CARD_CASCADE: { duration: 0.4, delay: 3.5, stagger: 0.08 },
  STATS_PANEL: { duration: 0.5, delay: 3.8 },
};

// Framer Motion Variants
export const variants = {
  // Page Load Animations
  pageLoad: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8 }
    }
  },

  // Stat Boxes
  statBoxEnter: {
    hidden: {
      opacity: 0,
      y: -40
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 30
      }
    }
  },

  // Buttons Pop
  buttonPop: {
    hidden: {
      opacity: 0,
      scale: 0
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 15
      }
    }
  },

  // Cards Cascade
  cardCascade: {
    hidden: {
      opacity: 0,
      y: 30
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'easeOut',
        duration: 0.4
      }
    }
  },

  // Expand/Collapse
  expandCard: {
    hidden: {
      opacity: 0,
      height: 0
    },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.3 }
    }
  },

  // Hover Effects
  cardHover: {
    whileHover: {
      scale: 1.05,
      y: -8,
      transition: { duration: 0.3 }
    }
  },

  // Glow Pulse
  glowPulse: {
    animate: {
      boxShadow: [
        '0 0 20px rgba(0, 255, 255, 0.3)',
        '0 0 40px rgba(0, 255, 255, 0.6)',
        '0 0 20px rgba(0, 255, 255, 0.3)',
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  },

  // Spin
  spinSlow: {
    animate: {
      rotate: 360,
      transition: {
        duration: 60,
        repeat: Infinity,
        ease: 'linear'
      }
    }
  },

  // Float
  float: {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  },

  // Fade In
  fadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.4 }
    }
  },

  // Scale Bounce
  scaleBounce: {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20
      }
    }
  },
};

// Tailwind CSS Keyframes (for pure CSS animations)
export const keyframes = `
  @keyframes pulse-glow {
    0%, 100% {
      opacity: 1;
      filter: brightness(1);
    }
    50% {
      opacity: 0.8;
      filter: brightness(1.2);
    }
  }

  @keyframes spin-slow {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -200% center;
    }
    100% {
      background-position: 200% center;
    }
  }

  @keyframes typewriter {
    0% {
      width: 0;
    }
    100% {
      width: 100%;
    }
  }

  @keyframes scanline-drift {
    0% {
      transform: translateY(-100%);
    }
    100% {
      transform: translateY(100vh);
    }
  }

  @keyframes border-move {
    0% {
      background-position: 0% center;
    }
    100% {
      background-position: 100% center;
    }
  }

  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }

  @keyframes bounce-in {
    0% {
      opacity: 0;
      transform: scale(0.3);
    }
    50% {
      opacity: 1;
    }
    100% {
      transform: scale(1);
    }
  }
`;

// Particle System Configuration
export const particleConfigs = {
  burst: {
    count: 12,
    duration: 0.8,
    spread: 360,
    speed: 5,
    gravity: 0.2,
  },
  cycleBurst: {
    count: 20,
    duration: 1,
    spread: 360,
    speed: 8,
    gravity: 0.15,
  },
  milestoneBurst: {
    count: 30,
    duration: 1.5,
    spread: 360,
    speed: 10,
    gravity: 0.1,
  },
  driftBackground: {
    count: 8,
    duration: Infinity,
    spread: 360,
    speed: 2,
    gravity: 0,
  },
};

// Color Intensity Levels
export const colorLevels = {
  level1: 'opacity-100', // Highest attention
  level2: 'opacity-75',  // Medium attention
  level3: 'opacity-50',  // Lower attention
  level4: 'opacity-20',  // Minimal attention
};

// Animation Speed Guidelines (in seconds)
export const animationSpeeds = {
  fast: 0.2,      // Button clicks, ripple effects
  medium: 0.4,    // Hover states, toggles
  slow: 0.5,      // Card expand, sidebar slide
  cinematic: 0.8, // Milestone celebrations
  epic: 1.2,      // Major transitions
  continuous: 2,  // Glow pulsing
};

// Easing Functions
export const easings = {
  easeOut: [0.25, 0.46, 0.45, 0.94],
  easeInOut: [0.42, 0, 0.58, 1],
  bounce: [0.34, 1.56, 0.64, 1],
  smooth: [0.4, 0.0, 0.2, 1.0],
};

// Transition Configurations
export const transitions = {
  snappy: {
    type: 'spring',
    stiffness: 300,
    damping: 30,
  },
  smooth: {
    type: 'spring',
    stiffness: 200,
    damping: 20,
  },
  elastic: {
    type: 'spring',
    stiffness: 300,
    damping: 15,
  },
};

// Counter Animation Helper
export const counterAnimation = {
  textContent: 'var(--value)',
  transition: {
    type: 'spring',
    duration: 1.5,
  },
};

// Stagger Container
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

// Stagger Item
export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
};

/**
 * Keyboard Shortcuts Manager
 * Handles all keyboard navigation and shortcuts
 */

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  description: string;
  action: () => void;
}

const shortcuts: KeyboardShortcut[] = [
  {
    key: 'ArrowLeft',
    description: 'Previous Cycle',
    action: () => {}, // Will be set by component
  },
  {
    key: 'ArrowRight',
    description: 'Next Cycle',
    action: () => {},
  },
  {
    key: 'a',
    description: 'Previous Cycle (Alt)',
    action: () => {},
  },
  {
    key: 'd',
    description: 'Next Cycle (Alt)',
    action: () => {},
  },
  {
    key: 'Home',
    description: 'Jump to Cycle 1',
    action: () => {},
  },
  {
    key: 'End',
    description: 'Jump to Last Cycle',
    action: () => {},
  },
  {
    key: 'Escape',
    description: 'Close Expanded Card / Clear Filters',
    action: () => {},
  },
  {
    key: '/',
    shift: true,
    description: 'Show Help / Shortcuts',
    action: () => {},
  },
];

export const useKeyboardShortcuts = (callbacks: {
  onPreviousCycle?: () => void;
  onNextCycle?: () => void;
  onFirstCycle?: () => void;
  onLastCycle?: () => void;
  onClose?: () => void;
  onShowHelp?: () => void;
}) => {
  const handleKeyDown = (event: KeyboardEvent) => {
    const { key, ctrlKey, shiftKey, altKey } = event;

    // Previous cycle
    if ((key === 'ArrowLeft' || key === 'a' || key === 'A') && callbacks.onPreviousCycle) {
      event.preventDefault();
      callbacks.onPreviousCycle();
    }
    // Next cycle
    else if ((key === 'ArrowRight' || key === 'd' || key === 'D') && callbacks.onNextCycle) {
      event.preventDefault();
      callbacks.onNextCycle();
    }
    // First cycle
    else if (key === 'Home' && callbacks.onFirstCycle) {
      event.preventDefault();
      callbacks.onFirstCycle();
    }
    // Last cycle
    else if (key === 'End' && callbacks.onLastCycle) {
      event.preventDefault();
      callbacks.onLastCycle();
    }
    // Close/Escape
    else if (key === 'Escape' && callbacks.onClose) {
      event.preventDefault();
      callbacks.onClose();
    }
    // Show help
    else if (key === '/' && shiftKey && callbacks.onShowHelp) {
      event.preventDefault();
      callbacks.onShowHelp();
    }
    // Number shortcuts (1-9, 0)
    else if (/^[0-9]$/.test(key)) {
      const cycleNum = key === '0' ? 10 : parseInt(key);
      // Dispatch custom event for cycle jump
      window.dispatchEvent(
        new CustomEvent('jumpToCycle', { detail: { cycle: cycleNum } })
      );
    }
  };

  return { handleKeyDown, shortcuts };
};

export default useKeyboardShortcuts;

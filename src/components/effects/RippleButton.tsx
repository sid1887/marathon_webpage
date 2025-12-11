import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface RippleProps {
  color?: string;
  duration?: number;
}

export const RippleButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & RippleProps
>(({ children, color = 'rgba(0, 255, 255, 0.6)', duration = 600, ...props }, ref) => {
  const [ripples, setRipples] = useState<
    Array<{ id: number; x: number; y: number }>
  >([]);
  const rippleRef = React.useRef<HTMLButtonElement>(null);
  const nextRippleId = React.useRef(0);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const button = rippleRef.current;
      if (!button) return;

      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const id = nextRippleId.current++;
      setRipples((prev) => [...prev, { id, x, y }]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
      }, duration);

      props.onClick?.(event);
    },
    [duration, props]
  );

  return (
    <button
      ref={rippleRef || ref}
      {...props}
      onClick={handleClick}
      className="relative overflow-hidden"
    >
      {ripples.map(({ id, x, y }) => (
        <motion.span
          key={id}
          className="absolute rounded-full pointer-events-none"
          initial={{ width: 0, height: 0, opacity: 1 }}
          animate={{ width: 200, height: 200, opacity: 0 }}
          transition={{ duration: duration / 1000, ease: 'easeOut' }}
          style={{
            left: x,
            top: y,
            backgroundColor: color,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
      {children}
    </button>
  );
});

RippleButton.displayName = 'RippleButton';

export default RippleButton;

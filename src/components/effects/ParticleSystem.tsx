import React, { useEffect, useRef } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

interface ParticleSystemProps {
  isActive: boolean;
  count?: number;
  color?: string;
  duration?: number;
  x?: number;
  y?: number;
  spread?: number;
  speed?: number;
  gravity?: number;
  className?: string;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  isActive,
  count = 12,
  color = 'rgba(0, 255, 255, 0.6)',
  duration = 0.8,
  x = 0,
  y = 0,
  spread = 360,
  speed = 5,
  gravity = 0.2,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!isActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Setup canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialize particles
    particlesRef.current = Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * (spread * (Math.PI / 180));
      const velocity = speed + Math.random() * 2;
      return {
        id: i,
        x: x || canvas.width / 2,
        y: y || canvas.height / 2,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        life: 1,
        color,
        size: 3 + Math.random() * 3,
      };
    });

    startTimeRef.current = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const progress = elapsed / duration;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        particle.vy += gravity;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life = Math.max(0, 1 - progress);

        ctx.globalAlpha = particle.life * 0.8;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [isActive, count, color, duration, x, y, spread, speed, gravity]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 1000 }}
    />
  );
};

export default ParticleSystem;

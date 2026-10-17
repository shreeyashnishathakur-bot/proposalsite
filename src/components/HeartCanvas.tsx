import React, { useEffect, useRef } from 'react';

interface HeartParticle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  wobbleSpeed: number;
  wobbleDistance: number;
  wobbleAngle: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  maxOpacity: number;
  color: string;
  type: 'heart' | 'sparkle' | 'petal';
}

interface HeartCanvasProps {
  isCelebration?: boolean;
}

const ROMANTIC_PALETTE = [
  '#FF2E63', // hot crimson rose
  '#FF5E7E', // pink rose
  '#FFAAA7', // soft blush
  '#FF85A1', // bubblegum romance
  '#FF3366', // deep love red
  '#FFD166', // golden glimmer
  '#FF99C8', // pastel pink
];

export const HeartCanvas: React.FC<HeartCanvasProps> = ({ isCelebration = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<HeartParticle[]>([]);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Initial ambient particles
    const particleCount = isCelebration ? 120 : 50;
    const particles: HeartParticle[] = [];

    const createParticle = (initialY?: number): HeartParticle => {
      const typeChoice = Math.random();
      let type: 'heart' | 'sparkle' | 'petal' = 'heart';
      if (isCelebration) {
        if (typeChoice > 0.6) type = 'petal';
        else if (typeChoice > 0.45) type = 'sparkle';
      } else {
        if (typeChoice > 0.75) type = 'sparkle';
      }

      return {
        x: Math.random() * width,
        y: initialY !== undefined ? initialY : Math.random() * height,
        size: type === 'sparkle' ? Math.random() * 4 + 2 : Math.random() * 16 + 10,
        speedY: isCelebration 
          ? (Math.random() * 2.5 + 1.2) // Falling in celebration
          : -(Math.random() * 1.2 + 0.5), // Rising gently in ambient mode
        speedX: (Math.random() - 0.5) * 0.8,
        wobbleSpeed: Math.random() * 0.03 + 0.015,
        wobbleDistance: Math.random() * 1.5 + 0.5,
        wobbleAngle: Math.random() * Math.PI * 2,
        rotation: (Math.random() - 0.5) * 0.8,
        rotationSpeed: (Math.random() - 0.5) * 0.03,
        opacity: Math.random() * 0.2 + 0.1,
        maxOpacity: Math.random() * 0.4 + 0.4,
        color: ROMANTIC_PALETTE[Math.floor(Math.random() * ROMANTIC_PALETTE.length)],
        type,
      };
    };

    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }
    particlesRef.current = particles;

    // Helper to draw a heart shape
    const drawHeart = (c: CanvasRenderingContext2D, size: number) => {
      c.beginPath();
      const topCurveHeight = size * 0.3;
      c.moveTo(0, topCurveHeight);
      // top left curve
      c.bezierCurveTo(
        -size / 2, -topCurveHeight * 1.2,
        -size, topCurveHeight / 2,
        0, size
      );
      // top right curve
      c.bezierCurveTo(
        size, topCurveHeight / 2,
        size / 2, -topCurveHeight * 1.2,
        0, topCurveHeight
      );
      c.closePath();
      c.fill();
    };

    // Helper to draw a delicate rose petal
    const drawPetal = (c: CanvasRenderingContext2D, size: number) => {
      c.beginPath();
      c.moveTo(0, -size);
      c.quadraticCurveTo(size * 0.8, 0, 0, size);
      c.quadraticCurveTo(-size * 0.8, 0, 0, -size);
      c.closePath();
      c.fill();
    };

    // Helper to draw a twinkle sparkle
    const drawSparkle = (c: CanvasRenderingContext2D, size: number) => {
      c.beginPath();
      c.arc(0, 0, size, 0, Math.PI * 2);
      c.fill();
    };

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particlesRef.current.forEach((p, idx) => {
        p.wobbleAngle += p.wobbleSpeed;
        p.x += Math.sin(p.wobbleAngle) * p.wobbleDistance + p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        if (p.opacity < p.maxOpacity) {
          p.opacity += 0.01;
        }

        // Wrap around boundaries
        if (isCelebration) {
          // Falling down
          if (p.y > height + 40) {
            particlesRef.current[idx] = createParticle(-20);
          }
        } else {
          // Rising up
          if (p.y < -40) {
            particlesRef.current[idx] = createParticle(height + 20);
          }
        }

        if (p.x < -30) p.x = width + 30;
        if (p.x > width + 30) p.x = -30;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.type === 'heart') {
          drawHeart(ctx, p.size);
        } else if (p.type === 'petal') {
          drawPetal(ctx, p.size);
        } else {
          drawSparkle(ctx, p.size);
        }

        ctx.restore();
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isCelebration]);

  // Click handler to create an interactive splash of mini hearts
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const burstParticles: HeartParticle[] = [];
    for (let i = 0; i < 16; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 1.5;
      burstParticles.push({
        x: clickX,
        y: clickY,
        size: Math.random() * 14 + 8,
        speedX: Math.cos(angle) * speed,
        speedY: Math.sin(angle) * speed - 1.5,
        wobbleSpeed: Math.random() * 0.04 + 0.02,
        wobbleDistance: Math.random() * 2,
        wobbleAngle: Math.random() * Math.PI * 2,
        rotation: (Math.random() - 0.5) * 1.2,
        rotationSpeed: (Math.random() - 0.5) * 0.05,
        opacity: 0.9,
        maxOpacity: 0.95,
        color: ROMANTIC_PALETTE[Math.floor(Math.random() * ROMANTIC_PALETTE.length)],
        type: Math.random() > 0.2 ? 'heart' : 'sparkle',
      });
    }

    particlesRef.current = [...particlesRef.current.slice(16), ...burstParticles];
  };

  return (
    <canvas
      ref={canvasRef}
      onClick={handleCanvasClick}
      className="fixed inset-0 pointer-events-auto z-0"
      style={{ touchAction: 'none' }}
      aria-hidden="true"
    />
  );
};

"use client";
import { useEffect, useRef } from "react";

const COLORS = ["#c0c0c0", "#a8a8b3", "#9090a0", "#b8b8c8", "#d4d4e0"];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  glowColor: string;
  originalAlpha: number;
  alpha: number;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function ThreeDBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const smoothRef = useRef({ x: 0, y: 0 });
  const mouseRef = useRef({ x: 0, y: 0, rawX: 0, rawY: 0, isHovering: false });
  const rafRef = useRef<number>(0);

  // Orb refs for 3D translation
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);
  const floorRef = useRef<HTMLDivElement>(null);
  const ceilRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    
    // Fix 1: Handle high-DPI (Retina) displays for mobile clarity
    const setupCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
      ctx.scale(dpr, dpr);
    };
    
    setupCanvas();
    window.addEventListener("resize", setupCanvas);

    // Fix 2: Abstract input handling for both Mouse and Touch
    const updateInputPosition = (clientX: number, clientY: number) => {
      const x = clientX / window.innerWidth - 0.5;
      const y = clientY / window.innerHeight - 0.5;
      mouseRef.current = {
        x,
        y,
        rawX: clientX,
        rawY: clientY,
        isHovering: true
      };
    };

    const handleMouseMove = (e: MouseEvent) => updateInputPosition(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updateInputPosition(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    
    const handleInputLeave = () => {
      mouseRef.current.isHovering = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchstart", handleTouchMove, { passive: true });
    window.addEventListener("mouseleave", handleInputLeave);
    window.addEventListener("touchend", handleInputLeave);

    const particleCount = Math.min(60, Math.floor((width * height) / 25000));
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45 - 0.1,
        radius: Math.random() * 2 + 1.2,
        color,
        glowColor: color,
        originalAlpha: Math.random() * 0.4 + 0.2,
        alpha: 0
      });
    }

    let targetX = 0;
    let targetY = 0;

    function tick() {
      if (!canvas || !ctx) return;

      targetX = mouseRef.current.x;
      targetY = mouseRef.current.y;
      smoothRef.current.x = lerp(smoothRef.current.x, targetX, 0.05);
      smoothRef.current.y = lerp(smoothRef.current.y, targetY, 0.05);

      const sx = smoothRef.current.x;
      const sy = smoothRef.current.y;

      if (orb1Ref.current)
        orb1Ref.current.style.transform = `translate(${sx * 65}px, ${sy * 65}px)`;
      if (orb2Ref.current)
        orb2Ref.current.style.transform = `translate(${sx * -45}px, ${sy * -45}px)`;
      if (orb3Ref.current)
        orb3Ref.current.style.transform = `translate(${sx * 35}px, ${sy * 35}px)`;

      if (floorRef.current)
        floorRef.current.style.transform = `perspective(1000px) rotateX(${66 + sy * 6}deg) rotateZ(${sx * 3}deg)`;
      if (ceilRef.current)
        ceilRef.current.style.transform = `perspective(1000px) rotateX(${-66 - sy * 6}deg) rotateZ(${-sx * 3}deg)`;

      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;
      const maxConnectDistance = 130;

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < -10) p1.x = width + 10;
        if (p1.x > width + 10) p1.x = -10;
        if (p1.y < -10) p1.y = height + 10;
        if (p1.y > height + 10) p1.y = -10;

        if (mouse.isHovering) {
          const dx = mouse.rawX - p1.x;
          const dy = mouse.rawY - p1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            const force = (150 - dist) / 1500;
            p1.vx += (dx / dist) * force * 0.1;
            p1.vy += (dy / dist) * force * 0.1;

            const speed = Math.sqrt(p1.vx * p1.vx + p1.vy * p1.vy);
            if (speed > 1.2) {
              p1.vx = (p1.vx / speed) * 1.2;
              p1.vy = (p1.vy / speed) * 1.2;
            }
          }
        }

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectDistance) {
            const alpha = (1 - dist / maxConnectDistance) * 0.18;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(180, 180, 196, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }

        if (mouse.isHovering) {
          const dx = p1.x - mouse.rawX;
          const dy = p1.y - mouse.rawY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            const alpha = (1 - dist / 160) * 0.28;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.rawX, mouse.rawY);
            ctx.strokeStyle = `rgba(210, 210, 225, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        p1.alpha = lerp(p1.alpha, p1.originalAlpha, 0.05);

        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = p1.color;
        ctx.shadowBlur = p1.radius * 3;
        ctx.shadowColor = p1.glowColor;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", setupCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchstart", handleTouchMove);
      window.removeEventListener("mouseleave", handleInputLeave);
      window.removeEventListener("touchend", handleInputLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      style={{ background: "radial-gradient(ellipse 80% 60% at 50% 10%, #1a1e26 0%, #0d0f14 65%, #070809 100%)" }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />

      {/* Fix 3: Added min() limits to dimensions so Orbs scale down on mobile screens */}
      <div
        ref={orb1Ref}
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "min(800px, 150vw)", height: "min(800px, 150vw)",
          top: "-20%", right: "-10%",
          background: "radial-gradient(circle, rgba(192,192,210,0.07) 0%, rgba(140,140,165,0.02) 50%, transparent 70%)",
        }}
      />
      <div
        ref={orb2Ref}
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "min(650px, 120vw)", height: "min(650px, 120vw)",
          bottom: "-15%", left: "-10%",
          background: "radial-gradient(circle, rgba(160,165,185,0.05) 0%, rgba(80,85,110,0.01) 50%, transparent 70%)",
        }}
      />
      <div
        ref={orb3Ref}
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "min(500px, 100vw)", height: "min(500px, 100vw)",
          top: "35%", left: "30%",
          background: "radial-gradient(circle, rgba(200,200,215,0.03) 0%, transparent 70%)",
        }}
      />

      <div
        ref={floorRef}
        className="absolute"
        style={{
          left: "-30%", right: "-30%",
          bottom: -80,
          height: "60%",
          backgroundImage:
            "linear-gradient(to right, rgba(180,180,200,0.055) 1px, transparent 1px), linear-gradient(to bottom, rgba(180,180,200,0.055) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          transformOrigin: "bottom center",
          transform: "perspective(1000px) rotateX(66deg)",
          WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.35) 50%, transparent 100%)",
          maskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.35) 50%, transparent 100%)",
        }}
      />

      <div
        ref={ceilRef}
        className="absolute"
        style={{
          left: "-30%", right: "-30%",
          top: -80,
          height: "50%",
          backgroundImage:
            "linear-gradient(to right, rgba(160,165,190,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(160,165,190,0.04) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          transformOrigin: "top center",
          transform: "perspective(1000px) rotateX(-66deg)",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.25) 50%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.25) 50%, transparent 100%)",
        }}
      />

      <div
        className="absolute left-0 right-0 h-px"
        style={{
          background: "linear-gradient(to right, transparent 0%, rgba(200,200,215,0.2) 30%, rgba(215,215,228,0.38) 50%, rgba(200,200,215,0.2) 70%, transparent 100%)",
          filter: "blur(0.5px)",
          animation: "scan 7s ease-in-out infinite",
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 85% 85% at 50% 50%, transparent 50%, rgba(0,0,0,0.72) 100%)",
        }}
      />

      {/* Made the corners slightly smaller on mobile, falling back to 56px max */}
      <div className="absolute top-6 left-6 w-[min(14vw,56px)] h-[min(14vw,56px)]" style={{ borderTop: "1.5px solid rgba(192,192,210,0.22)", borderLeft: "1.5px solid rgba(192,192,210,0.22)" }} />
      <div className="absolute top-6 right-6 w-[min(14vw,56px)] h-[min(14vw,56px)]" style={{ borderTop: "1.5px solid rgba(192,192,210,0.22)", borderRight: "1.5px solid rgba(192,192,210,0.22)" }} />
      <div className="absolute bottom-6 left-6 w-[min(14vw,56px)] h-[min(14vw,56px)]" style={{ borderBottom: "1.5px solid rgba(160,165,185,0.18)", borderLeft: "1.5px solid rgba(160,165,185,0.18)" }} />
      <div className="absolute bottom-6 right-6 w-[min(14vw,56px)] h-[min(14vw,56px)]" style={{ borderBottom: "1.5px solid rgba(160,165,185,0.18)", borderRight: "1.5px solid rgba(160,165,185,0.18)" }} />

      <style>{`
        @keyframes scan {
          0%   { top: 15%; opacity: 0; }
          8%   { opacity: 1; }
          50%  { top: 85%; opacity: 0.55; }
          92%  { opacity: 1; }
          100% { top: 15%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
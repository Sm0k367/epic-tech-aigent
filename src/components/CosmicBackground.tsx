"use client";

import { useEffect, useRef } from "react";

const PARTICLE_COUNT = 2500;

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
}

interface NebulaPlane {
  x: number;
  y: number;
  radius: number;
  color: string;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  scaleX: number;
  scaleY: number;
}

const COLORS = ["#00f5ff", "#ff00aa", "#a855f7", "#7c3aed", "#e8e0f0"];
const NEBULA_COLORS = [
  "rgba(0, 245, 255, 0.06)",
  "rgba(255, 0, 170, 0.05)",
  "rgba(124, 58, 237, 0.07)",
];

function createParticles(w: number, h: number): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    z: Math.random(),
    vx: (Math.random() - 0.5) * 0.18,
    vy: (Math.random() - 0.5) * 0.18,
    size: Math.random() * 1.8 + 0.3,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    opacity: Math.random() * 0.8 + 0.15,
  }));
}

function createNebulae(w: number, h: number): NebulaPlane[] {
  return [
    {
      x: w * 0.25,
      y: h * 0.35,
      radius: Math.min(w, h) * 0.55,
      color: NEBULA_COLORS[0],
      opacity: 1,
      rotation: 0,
      rotationSpeed: 0.00015,
      scaleX: 1.6,
      scaleY: 1.0,
    },
    {
      x: w * 0.75,
      y: h * 0.6,
      radius: Math.min(w, h) * 0.45,
      color: NEBULA_COLORS[1],
      opacity: 1,
      rotation: Math.PI / 4,
      rotationSpeed: -0.0002,
      scaleX: 1.2,
      scaleY: 1.7,
    },
    {
      x: w * 0.5,
      y: h * 0.5,
      radius: Math.min(w, h) * 0.65,
      color: NEBULA_COLORS[2],
      opacity: 1,
      rotation: Math.PI / 6,
      rotationSpeed: 0.00010,
      scaleX: 1.4,
      scaleY: 0.9,
    },
  ];
}

export default function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let particles: Particle[] = [];
    let nebulae: NebulaPlane[] = [];

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = createParticles(canvas.width, canvas.height);
      nebulae = createNebulae(canvas.width, canvas.height);
    }

    function drawNebula(n: NebulaPlane) {
      if (!ctx || !canvas) return;
      ctx.save();
      ctx.translate(n.x, n.y);
      ctx.rotate(n.rotation);
      ctx.scale(n.scaleX, n.scaleY);

      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, n.radius);
      // Parse color to use with alpha
      const baseColor = n.color.replace("rgba(", "").replace(")", "").split(",");
      const r = baseColor[0].trim();
      const g = baseColor[1].trim();
      const b = baseColor[2].trim();
      const a = parseFloat(baseColor[3].trim());

      grad.addColorStop(0, `rgba(${r},${g},${b},${a * 3})`);
      grad.addColorStop(0.3, `rgba(${r},${g},${b},${a * 1.5})`);
      grad.addColorStop(0.7, `rgba(${r},${g},${b},${a * 0.5})`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, n.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function draw() {
      if (!ctx || !canvas) return;

      // Deep void background
      ctx.fillStyle = "#0d0015";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw nebulae (additive blending feel via globalCompositeOperation)
      ctx.globalCompositeOperation = "screen";
      for (const n of nebulae) {
        n.rotation += n.rotationSpeed;
        drawNebula(n);
      }
      ctx.globalCompositeOperation = "source-over";

      // Draw particles with depth fog
      for (const p of particles) {
        // Fog: closer (higher z) = brighter
        const fogAlpha = 0.2 + p.z * 0.8;
        const apparentSize = p.size * (0.4 + p.z * 0.6);

        ctx.globalAlpha = p.opacity * fogAlpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, apparentSize, 0, Math.PI * 2);
        ctx.fill();

        // Drift
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around
        if (p.x < -2) p.x = canvas.width + 2;
        if (p.x > canvas.width + 2) p.x = -2;
        if (p.y < -2) p.y = canvas.height + 2;
        if (p.y > canvas.height + 2) p.y = -2;
      }
      ctx.globalAlpha = 1;

      animId = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}

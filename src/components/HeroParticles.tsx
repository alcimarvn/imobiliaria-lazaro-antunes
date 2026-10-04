"use client";

import React, { useEffect, useRef } from "react";

interface Snowflake {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  swaySpeed: number;
  swayAngle: number;
  swayDistance: number;
  opacity: number;
  isStar: boolean;
  twinkleSpeed: number;
}

export function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Desativa em mobile, telas touch ou se o usu�rio prefere redu��o de movimento
    if (
      typeof window === "undefined" ||
      window.innerWidth < 768 ||
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    // Pr�-renderizar os sprites dos flocos em mini canvases off-screen para evitar 9.000 gradientes/s no loop
    const spriteCircle = document.createElement("canvas");
    spriteCircle.width = 32;
    spriteCircle.height = 32;
    const cCtx = spriteCircle.getContext("2d");
    if (cCtx) {
      const grad = cCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, "rgba(255, 255, 255, 1)");
      grad.addColorStop(0.5, "rgba(240, 248, 255, 0.75)");
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");
      cCtx.fillStyle = grad;
      cCtx.beginPath();
      cCtx.arc(16, 16, 16, 0, Math.PI * 2);
      cCtx.fill();
    }

    // Flakes reduzidos e ultraleves (60 a 75 part�culas s�o visualmente id�nticas e gastam 80% menos recursos)
    const flakeCount = Math.min(Math.floor(width / 18), 70);
    const flakes: Snowflake[] = [];

    for (let i = 0; i < flakeCount; i++) {
      const radius = Math.random() * 1.6 + 0.9;
      flakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius,
        speedY: (radius / 2.5) * 0.65 + 0.3,
        swaySpeed: Math.random() * 0.015 + 0.006,
        swayAngle: Math.random() * Math.PI * 2,
        swayDistance: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.5 + 0.35,
        isStar: Math.random() > 0.7,
        twinkleSpeed: Math.random() * 0.012 + 0.005,
      });
    }

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);
    canvas.addEventListener("mousemove", handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < flakes.length; i++) {
        const f = flakes[i];

        f.y += f.speedY;
        f.swayAngle += f.swaySpeed;
        f.x += Math.sin(f.swayAngle) * f.swayDistance;
        f.opacity += Math.sin(f.swayAngle * 2) * f.twinkleSpeed;
        const currentOpacity = Math.max(0.15, Math.min(0.85, f.opacity));

        const dx = f.x - mouseX;
        const dy = f.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 70) {
          f.x += (dx / dist) * 1.5;
          f.y += (dy / dist) * 1.0;
        }

        if (f.y > height + 8) {
          f.y = -8;
          f.x = Math.random() * width;
        }
        if (f.x < -10) f.x = width + 10;
        if (f.x > width + 10) f.x = -10;

        // Renderiza��o acelerada por GPU usando sprite pr�-renderizado (Zero garbage collection)
        ctx.globalAlpha = currentOpacity;
        const drawSize = f.radius * 3.2;
        ctx.drawImage(spriteCircle, f.x - drawSize / 2, f.y - drawSize / 2, drawSize, drawSize);

        // Se for floco estelar, tra�o em cruz sem criar gradientes
        if (f.isStar && f.radius > 1.6) {
          ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          const arm = f.radius * 1.4;
          ctx.moveTo(f.x - arm, f.y);
          ctx.lineTo(f.x + arm, f.y);
          ctx.moveTo(f.x, f.y - arm);
          ctx.lineTo(f.x, f.y + arm);
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1.0;
      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="hidden md:block pointer-events-auto absolute inset-0 w-full h-full z-10 opacity-90"
    />
  );
}

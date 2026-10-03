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
  isStar: boolean; // Pequeno cristal com brilho em cruz
  twinkleSpeed: number;
}

export function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    // Maior número de flocos (120 a 160 flocos)
    const flakeCount = Math.min(Math.floor(width / 9), 150);
    const flakes: Snowflake[] = [];

    for (let i = 0; i < flakeCount; i++) {
      // Tamanhos bem menores e delicados (1.0px a 2.8px)
      const radius = Math.random() * 1.8 + 1.0;
      flakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius,
        // Velocidade suave de descida proporcional à profundidade
        speedY: (radius / 2.8) * 0.75 + 0.35,
        swaySpeed: Math.random() * 0.02 + 0.008,
        swayAngle: Math.random() * Math.PI * 2,
        swayDistance: Math.random() * 0.65 + 0.25,
        opacity: Math.random() * 0.6 + 0.3,
        isStar: Math.random() > 0.65, // ~35% dos flocos têm brilho cristalino estelar
        twinkleSpeed: Math.random() * 0.015 + 0.005,
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

        // Queda suave dos flocos
        f.y += f.speedY;

        // Ondulação com o vento da serra
        f.swayAngle += f.swaySpeed;
        f.x += Math.sin(f.swayAngle) * f.swayDistance;

        // Cintilação suave
        f.opacity += Math.sin(f.swayAngle * 2) * f.twinkleSpeed;
        const currentOpacity = Math.max(0.2, Math.min(0.9, f.opacity));

        // Reação ao mouse (brisa sutil)
        const dx = f.x - mouseX;
        const dy = f.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80) {
          f.x += (dx / dist) * 1.8;
          f.y += (dy / dist) * 1.2;
        }

        // Reinicia no topo quando sai pela base
        if (f.y > height + 8) {
          f.y = -8;
          f.x = Math.random() * width;
        }
        if (f.x < -10) f.x = width + 10;
        if (f.x > width + 10) f.x = -10;

        // Renderização suave e cristalina
        ctx.save();
        ctx.translate(f.x, f.y);

        // Núcleo com gradiente radial suave (elimina bordas duras ou serrilhadas)
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, f.radius * 1.6);
        grad.addColorStop(0, `rgba(255, 255, 255, ${currentOpacity})`);
        grad.addColorStop(0.5, `rgba(240, 248, 255, ${currentOpacity * 0.75})`);
        grad.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, f.radius * 1.6, 0, Math.PI * 2);
        ctx.fill();

        // Se for um floco cristalino estelar, adicionar pequenos feixes sutis de 4 pontas
        if (f.isStar && f.radius > 1.8) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${currentOpacity * 0.8})`;
          ctx.lineWidth = 0.7;
          ctx.lineCap = "round";

          const arm = f.radius * 1.5;
          ctx.beginPath();
          ctx.moveTo(-arm, 0);
          ctx.lineTo(arm, 0);
          ctx.moveTo(0, -arm);
          ctx.lineTo(0, arm);
          ctx.stroke();
        }

        ctx.restore();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-auto absolute inset-0 w-full h-full z-10 opacity-90"
    />
  );
}

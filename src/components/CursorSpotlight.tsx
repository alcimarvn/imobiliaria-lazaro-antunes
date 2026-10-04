"use client";

import React, { useEffect, useRef } from "react";

export function CursorSpotlight() {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Desativa em dispositivos touch ou sem ponteiro fino
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    let currentX = -200;
    let currentY = -200;
    let targetX = -200;
    let targetY = -200;
    let animationFrameId: number;
    let visible = false;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!visible) {
        visible = true;
        if (containerRef.current) containerRef.current.style.opacity = "1";
      }
    };

    const handleMouseLeave = () => {
      visible = false;
      if (containerRef.current) containerRef.current.style.opacity = "0";
    };

    const animate = () => {
      // Interpolação suave (lerp) para movimento orgânico
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;

      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-300 overflow-hidden opacity-0"
      aria-hidden="true"
    >
      <div
        ref={spotlightRef}
        className="absolute top-0 left-0 w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl pointer-events-none will-change-transform"
        style={{
          background: "radial-gradient(circle, rgba(227, 196, 115, 0.08) 0%, rgba(15, 42, 74, 0.04) 50%, transparent 75%)",
        }}
      />
    </div>
  );
}

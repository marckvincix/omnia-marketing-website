"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

type QuickTo = (value: number) => void;

export function TiltCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  const setRotateX = useRef<QuickTo | null>(null);
  const setRotateY = useRef<QuickTo | null>(null);
  const setScale = useRef<QuickTo | null>(null);

  useEffect(() => {
    if (!innerRef.current) return;
    setRotateX.current = gsap.quickTo(innerRef.current, "rotateX", { duration: 0.6, ease: "power3.out" });
    setRotateY.current = gsap.quickTo(innerRef.current, "rotateY", { duration: 0.6, ease: "power3.out" });
    setScale.current = gsap.quickTo(innerRef.current, "scale", { duration: 0.6, ease: "power3.out" });
  }, []);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setRotateY.current?.(px * 12);
    setRotateX.current?.(-py * 12);
    setScale.current?.(1.02);
  }

  function handleMouseLeave() {
    setRotateX.current?.(0);
    setRotateY.current?.(0);
    setScale.current?.(1);
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`gs-hover-3d [perspective:1200px] ${className}`}
    >
      <div ref={innerRef} className="h-full w-full [transform-style:preserve-3d] will-change-transform">
        {children}
      </div>
    </div>
  );
}

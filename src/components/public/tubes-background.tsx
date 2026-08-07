"use client";

import { useEffect, useRef, useState } from "react";

interface TubesApp {
  tubes: {
    setColors: (colors: string[]) => void;
    setLightsColors: (colors: string[]) => void;
  };
}

const TUBES_CDN_URL =
  "https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js";

const BRAND_TUBE_COLORS = ["#ff6b50", "#ff2d55", "#ffffff"];
const BRAND_LIGHT_COLORS = ["#ff6b50", "#ffb199", "#ffffff", "#ff2d55"];

function randomColors(count: number) {
  return Array.from(
    { length: count },
    () => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0"),
  );
}

interface TubesBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  enableClickInteraction?: boolean;
}

export function TubesBackground({
  children,
  className = "",
  enableClickInteraction = true,
}: TubesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<TubesApp | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      if (!canvasRef.current) return;
      try {
        const mod = await import(/* webpackIgnore: true */ TUBES_CDN_URL);
        if (!mounted || !canvasRef.current) return;
        const TubesCursor = mod.default;
        appRef.current = TubesCursor(canvasRef.current, {
          tubes: {
            colors: BRAND_TUBE_COLORS,
            lights: {
              intensity: 200,
              colors: BRAND_LIGHT_COLORS,
            },
          },
        });
        setLoaded(true);
      } catch (error) {
        console.error("Impossibile caricare lo sfondo 3D:", error);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  function handleClick() {
    if (!enableClickInteraction || !appRef.current) return;
    appRef.current.tubes.setColors(randomColors(3));
    appRef.current.tubes.setLightsColors(randomColors(4));
  }

  return (
    <div className={`relative w-full overflow-hidden bg-black ${className}`} onClick={handleClick}>
      <canvas ref={canvasRef} className={`absolute inset-0 block h-full w-full transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`} />
      <div className="relative z-10 h-full w-full pointer-events-none">{children}</div>
    </div>
  );
}

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

const BRAND_TUBE_COLORS = ["#2e9bd6", "#14305c", "#ffffff"];
const BRAND_LIGHT_COLORS = ["#2e9bd6", "#8fd3f4", "#ffffff", "#14305c"];

const BAND_HEIGHT_PX = 150;

function randomColors(count: number) {
  return Array.from(
    { length: count },
    () => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0"),
  );
}

/**
 * Sfondo 3D interattivo fisso: copre l'intero viewport nella hero,
 * poi si restringe a una fascia sottile in cima allo schermo per il
 * resto della homepage, restando sempre reattivo al cursore.
 */
export function PersistentTubesBackdrop({ enableClickInteraction = true }: { enableClickInteraction?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<TubesApp | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [shrunk, setShrunk] = useState(false);

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

  useEffect(() => {
    function handleScroll() {
      setShrunk(window.scrollY > window.innerHeight * 0.85);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleClick() {
    if (!enableClickInteraction || !appRef.current) return;
    appRef.current.tubes.setColors(randomColors(3));
    appRef.current.tubes.setLightsColors(randomColors(4));
  }

  return (
    <div
      onClick={handleClick}
      className="fixed inset-x-0 top-0 z-40 overflow-hidden bg-[#000000] transition-[height,opacity] duration-700 ease-out mix-blend-screen"
      style={{ height: shrunk ? `${BAND_HEIGHT_PX}px` : "100vh", opacity: shrunk ? 0.5 : 1 }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className={`absolute inset-x-0 top-0 block h-screen w-full transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}

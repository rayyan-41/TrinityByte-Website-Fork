"use client";

import { useEffect, useRef } from "react";

/**
 * Hero backdrop: a faint dot lattice, plus a cursor trail — moving the pointer
 * leaves short runs of mono glyphs on the lattice that flicker through random
 * characters, then settle and fade.
 *
 * Cost control: the canvas only animates while glyphs are alive; otherwise it
 * holds one static frame of dots. Touch devices and reduced motion get the dots
 * without the trail.
 */

const CELL = 30; // lattice pitch, CSS px — the dots and the glyph slots
const GLYPHS = "01{}<>/\\*+=#$%&[]:;~^".split("");
const GLYPH_LIFE = 1100; // ms
const SPAWN_EVERY = 26; // px of pointer travel between bursts
const SCRAMBLE_EVERY = 80; // ms between character swaps while a glyph is fresh
const INK = "150,150,150"; // subdued grey on the black hero
const DOT = "rgba(255,255,255,0.2)";

type Glyph = { x: number; y: number; ch: string; born: number; swapped: number };

const randomGlyph = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];

export function HeroField({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx) return;

    const interactive =
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mono =
      getComputedStyle(document.documentElement).getPropertyValue("--font-intel-mono").trim() || "monospace";

    let width = 0;
    let height = 0;
    let lastSpawn: { x: number; y: number } | null = null;
    let glyphs: Glyph[] = [];
    let raf = 0;

    const resize = () => {
      const rect = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!raf) draw(performance.now());
    };

    // centre the lattice so dots and runs sit symmetrically around the logo
    const origin = () => ({ x: (width % CELL) / 2, y: (height % CELL) / 2 });

    const draw = (now: number) => {
      ctx.clearRect(0, 0, width, height);
      const o = origin();
      ctx.fillStyle = DOT;
      for (let y = o.y; y <= height; y += CELL)
        for (let x = o.x; x <= width; x += CELL) ctx.fillRect(x - 0.75, y - 0.75, 1.5, 1.5);

      glyphs = glyphs.filter((g) => now - g.born < GLYPH_LIFE);
      ctx.font = `400 12px ${mono}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (const g of glyphs) {
        const t = Math.max(0, (now - g.born) / GLYPH_LIFE);
        // characters keep cycling while fresh, then settle as they fade — reads
        // like a line of output scrolling past rather than stamped marks
        if (t < 0.55 && now - g.swapped > SCRAMBLE_EVERY) {
          g.ch = randomGlyph();
          g.swapped = now;
        }
        ctx.fillStyle = `rgba(${INK},${(0.55 * (1 - t)).toFixed(3)})`;
        ctx.fillText(g.ch, g.x, g.y - t * 14);
      }
    };

    const tick = (now: number) => {
      draw(now);
      raf = glyphs.length ? requestAnimationFrame(tick) : 0;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const rect = host.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (lastSpawn && Math.hypot(x - lastSpawn.x, y - lastSpawn.y) < SPAWN_EVERY) return;
      lastSpawn = { x, y };

      // a short run of 2–3 characters along the nearest lattice row
      const o = origin();
      const gx = o.x + Math.round((x - o.x) / CELL) * CELL;
      const gy = o.y + Math.round((y - o.y) / CELL) * CELL;
      const run = 2 + ((Math.random() * 2) | 0);
      const start = -Math.floor(run / 2);
      const now = performance.now();
      for (let i = 0; i < run; i++) {
        const gxi = gx + (start + i) * CELL;
        // skip lattice points that already hold a live glyph
        if (glyphs.some((g) => g.x === gxi && g.y === gy)) continue;
        glyphs.push({ x: gxi, y: gy, ch: randomGlyph(), born: now + i * 40, swapped: now });
      }
      if (glyphs.length > 60) glyphs.splice(0, glyphs.length - 60);
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onLeave = () => {
      lastSpawn = null;
    };

    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();
    if (interactive) {
      host.addEventListener("pointermove", onMove, { passive: true });
      host.addEventListener("pointerleave", onLeave);
    }

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`} />;
}

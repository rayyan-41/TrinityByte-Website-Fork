"use client";

import { useEffect, useRef } from "react";

/**
 * Cursor-reactive backdrop for the hero: a faint grid whose vertices are pulled
 * toward the pointer (so the lines bend around it) and light up gold as it
 * passes, with a trail of mono glyphs left on the nearest grid points.
 *
 * Cost control: the canvas only animates while something is moving — pointer
 * activity, the influence easing out, or live glyphs. At rest it holds one
 * static frame, so an idle hero costs nothing. Touch devices and reduced
 * motion get the static grid only.
 */

const CELL = 44; // grid pitch, CSS px
const RADIUS = 220; // pointer influence radius
const PULL = 24; // max vertex displacement toward the pointer
const GLYPHS = "01{}<>/\\*+=#$%&[]:;~^".split("");
const GLYPH_LIFE = 900; // ms
const SPAWN_EVERY = 18; // px of pointer travel between glyphs

type Glyph = { x: number; y: number; ch: string; born: number };

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
    let dpr = 1;
    // eased pointer position and influence strength (0 = pointer away)
    const target = { x: -9999, y: -9999, on: 0 };
    const eased = { x: -9999, y: -9999, on: 0 };
    let lastSpawn: { x: number; y: number } | null = null;
    let glyphs: Glyph[] = [];
    let raf = 0;

    const resize = () => {
      const rect = host.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(performance.now());
    };

    // centre the lattice so it is symmetric around the logo
    const origin = () => ({ x: (width % CELL) / 2, y: (height % CELL) / 2 });

    const displace = (x: number, y: number) => {
      if (eased.on < 0.001) return { x, y, k: 0 };
      const dx = eased.x - x;
      const dy = eased.y - y;
      const d = Math.hypot(dx, dy);
      if (d >= RADIUS || d === 0) return { x, y, k: 0 };
      const k = (1 - d / RADIUS) ** 2 * eased.on;
      return { x: x + (dx / d) * PULL * k, y: y + (dy / d) * PULL * k, k };
    };

    function draw(now: number) {
      ctx!.clearRect(0, 0, width, height);
      const o = origin();
      const cols = Math.ceil(width / CELL) + 1;
      const rows = Math.ceil(height / CELL) + 1;

      // displaced lattice, computed once per frame
      const pts: { x: number; y: number; k: number }[] = new Array(cols * rows);
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++) pts[r * cols + c] = displace(o.x + c * CELL, o.y + r * CELL);

      ctx!.lineWidth = 1;
      ctx!.strokeStyle = "rgba(242,239,233,0.055)";
      ctx!.beginPath();
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const p = pts[r * cols + c];
          if (c === 0) ctx!.moveTo(p.x, p.y);
          else ctx!.lineTo(p.x, p.y);
        }
      }
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const p = pts[r * cols + c];
          if (r === 0) ctx!.moveTo(p.x, p.y);
          else ctx!.lineTo(p.x, p.y);
        }
      }
      ctx!.stroke();

      // the same bent lines again, lit gold around the pointer
      if (eased.on > 0.01) {
        const glow = ctx!.createRadialGradient(eased.x, eased.y, 0, eased.x, eased.y, RADIUS);
        glow.addColorStop(0, `rgba(217,196,150,${(0.55 * eased.on).toFixed(3)})`);
        glow.addColorStop(1, "rgba(217,196,150,0)");
        ctx!.strokeStyle = glow;
        ctx!.stroke();
      }

      // vertices near the pointer light up
      for (const p of pts) {
        if (p.k < 0.02) continue;
        ctx!.fillStyle = `rgba(229,205,150,${(0.25 + 0.75 * p.k).toFixed(3)})`;
        const s = 1.5 + 2.5 * p.k;
        ctx!.fillRect(p.x - s / 2, p.y - s / 2, s, s);
      }

      // glyph trail
      if (glyphs.length) {
        ctx!.font = `500 14px ${mono}`;
        ctx!.textAlign = "center";
        ctx!.textBaseline = "middle";
        glyphs = glyphs.filter((g) => now - g.born < GLYPH_LIFE);
        for (const g of glyphs) {
          const t = (now - g.born) / GLYPH_LIFE;
          ctx!.fillStyle = `rgba(229,205,150,${(1 - t).toFixed(3)})`;
          ctx!.fillText(g.ch, g.x, g.y - t * 10);
        }
      }
    }

    const tick = (now: number) => {
      eased.x += (target.x - eased.x) * 0.18;
      eased.y += (target.y - eased.y) * 0.18;
      eased.on += (target.on - eased.on) * 0.08;
      draw(now);
      const settling = Math.abs(target.on - eased.on) > 0.002 || Math.hypot(target.x - eased.x, target.y - eased.y) > 0.5;
      raf = settling || glyphs.length ? requestAnimationFrame(tick) : 0;
    };
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const rect = host.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (eased.on < 0.01) {
        // entering: start the ease from the cursor, not from off-screen
        eased.x = x;
        eased.y = y;
      }
      target.x = x;
      target.y = y;
      target.on = 1;

      if (!lastSpawn || Math.hypot(x - lastSpawn.x, y - lastSpawn.y) >= SPAWN_EVERY) {
        lastSpawn = { x, y };
        const o = origin();
        glyphs.push({
          x: o.x + Math.round((x - o.x) / CELL) * CELL,
          y: o.y + Math.round((y - o.y) / CELL) * CELL,
          ch: GLYPHS[(Math.random() * GLYPHS.length) | 0],
          born: performance.now(),
        });
        if (glyphs.length > 40) glyphs.shift();
      }
      wake();
    };
    const onLeave = () => {
      target.on = 0;
      lastSpawn = null;
      wake();
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

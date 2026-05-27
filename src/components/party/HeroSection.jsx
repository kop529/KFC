import { useEffect, useRef, useCallback, useState } from 'react';

const copy = {
  en: {
    tagline: '',
    tagline2: '',
    sub: '',
    cta: '',
    label: '',
    scroll: '',
  },
  th: {
    tagline: '',
    tagline2: '',
    sub: '',
    cta: '',
    label: '',
    scroll: '',
  }
};

// ─── Canvas Arrow Field ───
// Single <canvas> replaces ~400 DOM nodes. RAF loop draws all arrows in one
// GPU-composited pass — React never re-renders for mouse movement.
function ArrowCanvas({ heroRef }) {
  const canvasRef = useRef(null);
  // Ref (not state) — writing to a ref never triggers a React re-render
  const mousePosRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef(null);
  const arrowsRef = useRef([]);

  // Build arrow grid to fill the current canvas dimensions
  const buildGrid = useCallback((width, height) => {
    const SPACING = 95; // px between arrows — ~400 on a 1920×900 section
    const cols = Math.ceil(width / SPACING) + 1;
    const rows = Math.ceil(height / SPACING) + 1;
    const arr = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        arr.push({ x: c * SPACING, y: r * SPACING });
      }
    }
    arrowsRef.current = arr;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !heroRef.current) return;
    const ctx = canvas.getContext('2d');

    // ── Size canvas to the hero section ──
    const resize = () => {
      if (!heroRef.current) return;
      const { width, height } = heroRef.current.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      buildGrid(width, height);
    };
    resize();

    // Debounce resize to avoid rapid rebuilds
    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    };
    window.addEventListener('resize', onResize, { passive: true });

    // ── Mouse tracking via ref — zero React renders ──
    const onMouse = (e) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      mousePosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };
    window.addEventListener('mousemove', onMouse, { passive: true });

    // ── Arrow shape: exact replica of the original SVG icon ──
    // Original: <svg width="34" height="34" viewBox="0 0 24 24">
    //   <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
    // Translated: subtract centre (12,12), then scale by 34/24 ≈ 1.417
    // Result: centred at origin, pointing right, same proportions as original
    const SC = 1.417; // scale factor: 34px display / 24px viewBox
    const arrowPath = new Path2D();
    arrowPath.moveTo(0 * SC, -8 * SC); // M12,4   → (0,-8)
    arrowPath.lineTo(-1.41 * SC, -6.59 * SC); // l-1.41,1.41 → (10.59,5.41)
    arrowPath.lineTo(4.17 * SC, -1 * SC); // L16.17,11
    arrowPath.lineTo(-8 * SC, -1 * SC); // H4
    arrowPath.lineTo(-8 * SC, 1 * SC); // v2
    arrowPath.lineTo(4.17 * SC, 1 * SC); // h12.17
    arrowPath.lineTo(-1.41 * SC, 6.59 * SC); // l-5.58,5.59
    arrowPath.lineTo(0 * SC, 8 * SC); // L12,20
    arrowPath.lineTo(8 * SC, 0); // l8,-8  → tip (8,0)
    arrowPath.closePath();                            // z → back to (0,-8)

    // ── RAF render loop ──
    // Runs at 60fps. All ~400 arrows drawn in a single composited pass.
    const INFLUENCE_RADIUS = 280; // px — cursor "field" radius
    const INFLUENCE_SQ = INFLUENCE_RADIUS * INFLUENCE_RADIUS;
    const BASE_OPACITY = 0.10;
    const BOOST_OPACITY = 0.55;

    const render = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const { x: mx, y: my } = mousePosRef.current;
      const arrows = arrowsRef.current;

      for (let i = 0; i < arrows.length; i++) {
        const { x, y } = arrows[i];
        const dx = mx - x;
        const dy = my - y;
        const distSq = dx * dx + dy * dy;

        // Proximity factor 0→1 (skip expensive sqrt by comparing squares)
        const proximity = distSq < INFLUENCE_SQ
          ? 1 - distSq / INFLUENCE_SQ
          : 0;

        const opacity = BASE_OPACITY + proximity * BOOST_OPACITY;
        const angle = Math.atan2(dy, dx); // only computed for visible arrows

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.fillStyle = `rgba(255,107,0,${opacity.toFixed(2)})`;
        ctx.fill(arrowPath); // reuse Path2D — no path rebuild each frame
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouse);
      clearTimeout(resizeTimer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [heroRef, buildGrid]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}

export default function HeroSection({ lang }) {
  const heroRef = useRef(null);
  const [isPC, setIsPC] = useState(false);

  useEffect(() => {
    // Detect if device is a PC/Notebook
    const ua = navigator.userAgent;
    const isMobileUA = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const isIPad = navigator.maxTouchPoints && 
                   navigator.maxTouchPoints > 2 && 
                   /Macintosh/.test(ua);
    const isTouchOnly = window.matchMedia('(pointer: coarse)').matches && 
                        window.matchMedia('(hover: none)').matches;

    if (!isMobileUA && !isIPad && !isTouchOnly) {
      setIsPC(true);
    }
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex flex-col justify-end overflow-hidden bg-[#111827]"
      id="hero"
    >
      {/* Canvas Arrow Field — Rendered only on PC/Notebook for performance */}
      {isPC && <ArrowCanvas heroRef={heroRef} />}

      <div className="absolute inset-0 bg-gradient-to-b from-[#111827]/60 via-[#111827]/20 to-[#111827]" />
    </section>
  );
}
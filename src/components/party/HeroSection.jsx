import { useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

const copy = {
  en: {
    tagline: 'For the People,',
    tagline2: 'By the People.',
    sub: 'A new era of transparent governance, democratic reform, and sustainable progress for every Thai citizen.',
    cta: 'Explore Our Vision',
    label: 'People\'s Party — Thailand',
    scroll: 'Scroll',
  },
  th: {
    tagline: 'เพื่อประชาชน,',
    tagline2: 'โดยประชาชน.',
    sub: 'ยุคใหม่ของการปกครองที่โปร่งใส การปฏิรูปประชาธิปไตย และความก้าวหน้าที่ยั่งยืนสำหรับทุกคน',
    cta: 'สำรวจวิสัยทัศน์ของเรา',
    label: 'พรรคประชาชน — ประเทศไทย',
    scroll: 'เลื่อนลง',
  }
};

// ─── Easing presets ───
const EXPO_OUT = [0.16, 1, 0.3, 1];

// ─── Stagger orchestration ───
const stagger = {
  container: {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } }
  },
  clipUp: {
    hidden: { clipPath: 'inset(100% 0 0 0)', y: 40, opacity: 0 },
    visible: {
      clipPath: 'inset(0% 0 0 0)', y: 0, opacity: 1,
      transition: { duration: 0.9, ease: EXPO_OUT }
    }
  },
  blurIn: {
    hidden: { opacity: 0, filter: 'blur(12px)', y: 16 },
    visible: {
      opacity: 1, filter: 'blur(0px)', y: 0,
      transition: { duration: 1, ease: EXPO_OUT, delay: 0.6 }
    }
  },
  ctaRise: {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1, y: 0, scale: 1,
      transition: { type: 'spring', stiffness: 200, damping: 20, delay: 0.85 }
    }
  },
  labelFade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1, delay: 1.3, ease: EXPO_OUT } }
  }
};

// ─── Magnetic Button Hook ───
function useMagneticHover(strength = 0.3) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const ref = useRef(null);

  const handleMouse = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  }, [x, y, strength]);

  const handleLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  return { ref, springX, springY, handleMouse, handleLeave };
}

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
    arrowPath.moveTo(  0          * SC, -8    * SC); // M12,4   → (0,-8)
    arrowPath.lineTo( -1.41       * SC, -6.59 * SC); // l-1.41,1.41 → (10.59,5.41)
    arrowPath.lineTo(  4.17       * SC, -1    * SC); // L16.17,11
    arrowPath.lineTo( -8          * SC, -1    * SC); // H4
    arrowPath.lineTo( -8          * SC,  1    * SC); // v2
    arrowPath.lineTo(  4.17       * SC,  1    * SC); // h12.17
    arrowPath.lineTo( -1.41       * SC,  6.59 * SC); // l-5.58,5.59
    arrowPath.lineTo(  0          * SC,  8    * SC); // L12,20
    arrowPath.lineTo(  8          * SC,  0        ); // l8,-8  → tip (8,0)
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
  const c = copy[lang];

  // Scroll-driven progress bar
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const springProgress = useSpring(progressWidth, { stiffness: 100, damping: 30 });

  // Magnetic CTA
  const magnetic = useMagneticHover(0.25);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex flex-col justify-end overflow-hidden bg-[#111827]"
      id="hero"
    >
      {/* Canvas Arrow Field — 1 DOM node, ~400 arrows, zero React re-renders */}
      <ArrowCanvas heroRef={heroRef} />

      <div className="absolute inset-0 bg-gradient-to-b from-[#111827]/60 via-[#111827]/20 to-[#111827]" />

      {/* Scroll-tracking amber progress line */}
      <motion.div
        className="absolute top-0 left-0 h-[2px] bg-[#FF6B00] origin-left will-change-transform z-20"
        style={{ width: springProgress }}
      />

      {/* Section label */}
      <motion.div
        className="absolute top-24 right-6 lg:right-12 text-right"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 1.4, ease: EXPO_OUT }}
      >
        <div className="text-[10px] tracking-[0.25em] text-white/30 font-inter uppercase">
          {lang === 'th' ? 'หน้าหลัก' : 'Home'} / 001
        </div>
      </motion.div>

      {/* Hero Content — Orchestrated Entrance */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pb-24 lg:pb-32 pt-32">
        <motion.div
          variants={stagger.container}
          initial="hidden"
          animate="visible"
          className="will-change-transform"
        >
          {/* Staggered headline with clip-mask reveal */}
          <div className="relative mb-8">
            {/* Ghost shadow layer */}
            <motion.div
              variants={stagger.clipUp}
              className="absolute -top-2 left-1 font-anakotmai font-bold text-white/20 leading-none select-none"
              style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)' }}
            >
              {c.tagline}<br />{c.tagline2}
            </motion.div>

            {/* Foreground headline — each line reveals separately */}
            <div
              className={`relative font-black text-white leading-none ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}
              style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)', letterSpacing: '-0.03em' }}
            >
              <motion.div variants={stagger.clipUp} className="overflow-hidden">
                <motion.h1 variants={stagger.clipUp} className="leading-none">
                  {c.tagline}
                </motion.h1>
              </motion.div>
              <motion.div variants={stagger.clipUp} className="overflow-hidden">
                <motion.span variants={stagger.clipUp} className="text-[#FF6B00] block leading-none">
                  {c.tagline2}
                </motion.span>
              </motion.div>
            </div>
          </div>

          {/* Sub text — blur-in */}
          <motion.p
            variants={stagger.blurIn}
            className={`max-w-xl text-white/60 text-lg leading-relaxed mb-10 ${
              lang === 'th' ? 'font-anakotmai' : 'font-inter'
            }`}
          >
            {c.sub}
          </motion.p>

          {/* CTA — Magnetic + Spring */}
          <motion.div variants={stagger.ctaRise}>
            <motion.button
              ref={magnetic.ref}
              onMouseMove={magnetic.handleMouse}
              onMouseLeave={magnetic.handleLeave}
              style={{ x: magnetic.springX, y: magnetic.springY }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}
              className="group inline-flex items-center gap-3 bg-[#FF6B00] text-[#111827] font-inter font-semibold text-sm tracking-wide px-8 py-4 transition-colors duration-300 hover:bg-white btn-ripple focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111827]"
            >
              {lang === 'th' ? <span className="font-anakotmai">{c.cta}</span> : c.cta}
              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ArrowDown size={16} />
              </motion.div>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Bottom label */}
        <motion.div
          variants={stagger.labelFade}
          initial="hidden"
          animate="visible"
          className="mt-16 flex items-center gap-4 will-change-opacity"
        >
          <motion.div
            className="w-12 h-px bg-[#FF6B00]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 1.5, ease: EXPO_OUT }}
            style={{ originX: 0 }}
          />
          <span className="text-xs tracking-[0.2em] text-white/30 font-inter uppercase">
            {c.label}
          </span>
        </motion.div>
      </div>

      {/* Scroll indicator — breathing animation */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.8, ease: EXPO_OUT }}
      >
        <motion.div
          className="w-[1px] h-16 bg-gradient-to-b from-transparent via-[#FF6B00] to-transparent"
          animate={{ scaleY: [1, 0.4, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.span
          className={`text-white/15 text-[8px] tracking-[0.5em] uppercase ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {c.scroll}
        </motion.span>
      </motion.div>
    </section>
  );
}
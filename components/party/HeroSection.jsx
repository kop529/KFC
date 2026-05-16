import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

const copy = {
  en: {
    tagline: 'For the People,',
    tagline2: 'By the People.',
    sub: 'A new era of transparent governance, democratic reform, and sustainable progress for every Thai citizen.',
    cta: 'Explore Our Vision',
    label: 'People\'s Party — Thailand',
  },
  th: {
    tagline: 'เพื่อประชาชน,',
    tagline2: 'โดยประชาชน.',
    sub: 'ยุคใหม่ของการปกครองที่โปร่งใส การปฏิรูปประชาธิปไตย และความก้าวหน้าที่ยั่งยืนสำหรับทุกคน',
    cta: 'สำรวจวิสัยทัศน์ของเรา',
    label: 'พรรคประชาชน — ประเทศไทย',
  }
};

export default function HeroSection({ lang }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  const c = copy[lang];

  useEffect(() => {
    const handleMouse = (e) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setMousePos({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });
    };
    const el = heroRef.current;
    el?.addEventListener('mousemove', handleMouse);
    return () => el?.removeEventListener('mousemove', handleMouse);
  }, []);

  const parallaxX = (mousePos.x - 0.5) * 20;
  const parallaxY = (mousePos.y - 0.5) * 10;

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex flex-col justify-end overflow-hidden bg-[#111827]"
      id="hero"
    >
      {/* Background Image with parallax */}
      <motion.div
        className="absolute inset-0"
        style={{ x: parallaxX, y: parallaxY, scale: 1.06 }}
        transition={{ type: 'spring', stiffness: 50, damping: 20 }}
      >
        <img
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80&auto=format&fit=crop"
          alt="Thai Parliament architecture"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#111827]/20 via-[#111827]/50 to-[#111827]" />
      </motion.div>

      {/* Amber progress line */}
      <motion.div
        className="absolute top-0 left-0 h-0.5 bg-[#FF6B00]"
        initial={{ width: '0%' }}
        animate={{ width: '30%' }}
        transition={{ duration: 2, delay: 0.5, ease: 'easeOut' }}
      />

      {/* Section label - editorial metadata */}
      <div className="absolute top-24 right-6 lg:right-12 text-right">
        <div className="text-[10px] tracking-[0.25em] text-white/30 font-inter uppercase">
          {lang === 'th' ? 'หน้าหลัก' : 'Home'} / 001
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pb-24 lg:pb-32 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Bilingual stacked headline */}
          <div className="relative mb-8">
            {/* Thai shadow behind */}
            <div
              className="absolute -top-2 left-1 font-kanit font-bold text-white/20 leading-none select-none"
              style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)' }}
            >
              {c.tagline}<br />{c.tagline2}
            </div>
            {/* English foreground */}
            <h1
              className="relative font-inter font-black text-white leading-none"
              style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)', letterSpacing: '-0.03em' }}
            >
              {c.tagline}
              <br />
              <span className="text-[#FF6B00]">{c.tagline2}</span>
            </h1>
          </div>

          {/* Sub text */}
          <p
            className={`max-w-xl text-white/60 text-lg leading-relaxed mb-10 ${
              lang === 'th' ? 'font-kanit' : 'font-inter'
            }`}
          >
            {c.sub}
          </p>

          {/* CTA */}
          <button
            onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}
            className="group inline-flex items-center gap-3 bg-[#FF6B00] text-[#111827] font-inter font-semibold text-sm tracking-wide px-8 py-4 hover:bg-white transition-all duration-300"
          >
            {lang === 'th' ? <span className="font-kanit">{c.cta}</span> : c.cta}
            <ArrowDown size={16} className="group-hover:translate-y-1 transition-transform duration-300" />
          </button>
        </motion.div>

        {/* Bottom label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-16 flex items-center gap-4"
        >
          <div className="w-12 h-px bg-[#FF6B00]" />
          <span className="text-xs tracking-[0.2em] text-white/30 font-inter uppercase">
            {c.label}
          </span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <motion.div
          className="w-px h-12 bg-gradient-to-b from-transparent to-[#FF6B00]"
          animate={{ scaleY: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  );
}
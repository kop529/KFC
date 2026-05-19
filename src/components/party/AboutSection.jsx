import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useInView, useSpring, useMotionValue } from 'framer-motion';

const EXPO_OUT = [0.16, 1, 0.3, 1];

const copy = {
  en: {
    section: '002 — About',
    headline: 'A Movement Built on Truth, Transparency, and the Will of the People.',
    body1: "The People's Party (พรรคประชาชน) was founded on the belief that every citizen deserves a government that listens, acts with integrity, and builds for the future. We are not a coalition of elites — we are a movement of ordinary people demanding extraordinary change.",
    body2: "Our approach is grounded in constitutional democracy, human rights, and economic justice. We believe that a strong Thailand begins with empowered citizens, accountable institutions, and policies forged through honest public dialogue.",
    stat1: { num: '4.2M', label: 'Supporters Nationwide', rawNum: 4200000 },
    stat2: { num: '77', label: 'Provinces Represented', rawNum: 77 },
    stat3: { num: '2019', label: 'Founded', rawNum: 2019 },
    quote: '"The future of Thailand belongs to its people — not to power, not to privilege."',
  },
  th: {
    section: '002 — เกี่ยวกับพรรค',
    headline: 'ขบวนการที่สร้างขึ้นบนความจริง ความโปร่งใส และเจตนารมณ์ของประชาชน',
    body1: 'พรรคประชาชนก่อตั้งขึ้นจากความเชื่อที่ว่าพลเมืองทุกคนสมควรได้รับรัฐบาลที่รับฟัง ปฏิบัติงานด้วยความซื่อสัตย์ และสร้างอนาคต เราไม่ใช่พันธมิตรของชนชั้นนำ เราคือขบวนการของประชาชนธรรมดาที่ต้องการการเปลี่ยนแปลงอย่างพิเศษ',
    body2: 'แนวทางของเราตั้งอยู่บนระบอบประชาธิปไตยตามรัฐธรรมนูญ สิทธิมนุษยชน และความยุติธรรมทางเศรษฐกิจ เราเชื่อว่าประเทศไทยที่เข้มแข็งเริ่มต้นจากพลเมืองที่มีอำนาจ สถาบันที่รับผิดชอบ และนโยบายที่เกิดจากการสนทนาสาธารณะที่ซื่อสัตย์',
    stat1: { num: '4.2M', label: 'ผู้สนับสนุนทั่วประเทศ', rawNum: 4200000 },
    stat2: { num: '77', label: 'จังหวัดที่เป็นตัวแทน', rawNum: 77 },
    stat3: { num: '2019', label: 'ก่อตั้งเมื่อ', rawNum: 2019 },
    quote: '"อนาคตของประเทศไทยเป็นของประชาชน ไม่ใช่ของอำนาจหรือสิทธิพิเศษ"',
  }
};

// ─── Animated Counter ───
function useAnimatedCounter(target, isInView, duration = 1.5) {
  const [displayValue, setDisplayValue] = useState('0');
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    // Parse target: handle "4.2M", "77", "2019"
    const isMillions = target.includes('M');
    const numericTarget = isMillions
      ? parseFloat(target.replace('M', ''))
      : parseInt(target, 10);

    const startTime = performance.now();
    const durationMs = duration * 1000;

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = numericTarget * eased;

      if (isMillions) {
        setDisplayValue(current.toFixed(1) + 'M');
      } else {
        setDisplayValue(Math.round(current).toString());
      }

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }, [isInView, target, duration]);

  return displayValue;
}

function StatCard({ num, label, lang, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const displayNum = useAnimatedCounter(num, inView, 1.8);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, delay, ease: EXPO_OUT }}
      whileHover={{ scale: 1.04, y: -4 }}
      className="border-t-2 border-[#FF6B00] pt-6 will-change-transform origin-left cursor-default"
    >
      <div className="font-inter font-black text-5xl text-[#111827] mb-2 tabular-nums">
        {displayNum}
      </div>
      <div className={`text-sm text-[#111827]/50 tracking-wide ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}>
        {label}
      </div>
    </motion.div>
  );
}

export default function AboutSection({ lang }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const c = copy[lang];

  return (
    <section id="about" className="bg-[#F9FAFB] py-28 lg:py-40 relative">
      {/* Visual Transition to Dark Section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#0B0F17]" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Label — slide in from left */}
        <motion.div
          className="flex items-center gap-4 mb-16"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EXPO_OUT }}
        >
          <motion.div
            className="w-8 h-px bg-[#FF6B00]"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EXPO_OUT }}
            style={{ originX: 0 }}
          />
          <span className={`text-xs tracking-[0.25em] text-[#111827]/40 uppercase font-bold ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}>
            {c.section}
          </span>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20" ref={ref}>
          {/* Headline col — clip-mask word reveal */}
          <div className="lg:col-span-5">
            <div className="overflow-hidden mb-12">
              <motion.h2
                initial={{ y: '100%', opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.9, ease: EXPO_OUT }}
                className={`font-inter font-black text-4xl lg:text-5xl text-[#111827] leading-tight will-change-transform ${
                  lang === 'th' ? 'font-anakotmai' : ''
                }`}
                style={{ letterSpacing: '-0.02em' }}
              >
                {c.headline}
              </motion.h2>
            </div>

            {/* Stats — staggered with counters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard num={c.stat1.num} label={c.stat1.label} lang={lang} delay={0.2} />
              <StatCard num={c.stat2.num} label={c.stat2.label} lang={lang} delay={0.35} />
              <StatCard num={c.stat3.num} label={c.stat3.label} lang={lang} delay={0.5} />
            </div>
          </div>

          {/* Body col — parallax depth stagger */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 30, x: 10 }}
                animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.1, ease: EXPO_OUT }}
                className={`text-lg text-[#111827]/70 leading-relaxed mb-8 will-change-transform ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}
              >
                {c.body1}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 30, x: 15 }}
                animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.25, ease: EXPO_OUT }}
                className={`text-lg text-[#111827]/70 leading-relaxed will-change-transform ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}
              >
                {c.body2}
              </motion.p>
            </div>

            {/* Pull quote — slides from right with self-drawing line */}
            <motion.blockquote
              initial={{ opacity: 0, x: 40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.45, ease: EXPO_OUT }}
              className="mt-12 relative will-change-transform"
            >
              {/* Self-drawing amber line */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-[2px] bg-[#FF6B00]"
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 1, delay: 0.6, ease: EXPO_OUT }}
                style={{ originX: 0 }}
              />
              <div className={`p-8 bg-[#111827]/05 text-xl font-medium text-[#111827] leading-snug italic ${
                lang === 'th' ? 'font-anakotmai' : 'font-inter'
              }`}>
                {c.quote}
              </div>
            </motion.blockquote>
          </div>
        </div>

        {/* Amber divider — scroll-driven pen stroke */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 1.5, delay: 0.2, ease: EXPO_OUT }}
          className="h-px bg-[#FF6B00]/20 mt-24 origin-left will-change-transform"
        />
      </div>
    </section>
  );
}

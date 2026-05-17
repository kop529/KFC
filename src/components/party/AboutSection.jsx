import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const copy = {
  en: {
    section: '002 — About',
    headline: 'A Movement Built on Truth, Transparency, and the Will of the People.',
    body1: "The People's Party (พรรคประชาชน) was founded on the belief that every citizen deserves a government that listens, acts with integrity, and builds for the future. We are not a coalition of elites — we are a movement of ordinary people demanding extraordinary change.",
    body2: "Our approach is grounded in constitutional democracy, human rights, and economic justice. We believe that a strong Thailand begins with empowered citizens, accountable institutions, and policies forged through honest public dialogue.",
    stat1: { num: '4.2M', label: 'Supporters Nationwide' },
    stat2: { num: '77', label: 'Provinces Represented' },
    stat3: { num: '2019', label: 'Founded' },
    quote: '"The future of Thailand belongs to its people — not to power, not to privilege."',
  },
  th: {
    section: '002 — เกี่ยวกับพรรค',
    headline: 'ขบวนการที่สร้างขึ้นบนความจริง ความโปร่งใส และเจตนารมณ์ของประชาชน',
    body1: 'พรรคประชาชนก่อตั้งขึ้นจากความเชื่อที่ว่าพลเมืองทุกคนสมควรได้รับรัฐบาลที่รับฟัง ปฏิบัติงานด้วยความซื่อสัตย์ และสร้างอนาคต เราไม่ใช่พันธมิตรของชนชั้นนำ เราคือขบวนการของประชาชนธรรมดาที่ต้องการการเปลี่ยนแปลงอย่างพิเศษ',
    body2: 'แนวทางของเราตั้งอยู่บนระบอบประชาธิปไตยตามรัฐธรรมนูญ สิทธิมนุษยชน และความยุติธรรมทางเศรษฐกิจ เราเชื่อว่าประเทศไทยที่เข้มแข็งเริ่มต้นจากพลเมืองที่มีอำนาจ สถาบันที่รับผิดชอบ และนโยบายที่เกิดจากการสนทนาสาธารณะที่ซื่อสัตย์',
    stat1: { num: '4.2M', label: 'ผู้สนับสนุนทั่วประเทศ' },
    stat2: { num: '77', label: 'จังหวัดที่เป็นตัวแทน' },
    stat3: { num: '2019', label: 'ก่อตั้งเมื่อ' },
    quote: '"อนาคตของประเทศไทยเป็นของประชาชน ไม่ใช่ของอำนาจหรือสิทธิพิเศษ"',
  }
};

function StatCard({ num, label, lang, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="border-t-2 border-[#FF6B00] pt-6"
    >
      <div className="font-inter font-black text-5xl text-[#111827] mb-2">{num}</div>
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
    <section id="about" className="bg-[#F9FAFB] py-28 lg:py-40">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Label */}
        <div className="flex items-center gap-4 mb-16">
          <div className="w-8 h-px bg-[#FF6B00]" />
          <span className={`text-xs tracking-[0.25em] text-[#111827]/40 uppercase font-bold ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}>
            {c.section}
          </span>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20" ref={ref}>
          {/* Headline col */}
          <div className="lg:col-span-5">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className={`font-inter font-black text-4xl lg:text-5xl text-[#111827] leading-tight mb-12 ${
                lang === 'th' ? 'font-anakotmai' : ''
              }`}
              style={{ letterSpacing: '-0.02em' }}
            >
              {c.headline}
            </motion.h2>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <StatCard num={c.stat1.num} label={c.stat1.label} lang={lang} delay={0.2} />
              <StatCard num={c.stat2.num} label={c.stat2.label} lang={lang} delay={0.35} />
              <StatCard num={c.stat3.num} label={c.stat3.label} lang={lang} delay={0.5} />
            </div>
          </div>

          {/* Body col */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              <p className={`text-lg text-[#111827]/70 leading-relaxed mb-8 ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}>
                {c.body1}
              </p>
              <p className={`text-lg text-[#111827]/70 leading-relaxed ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}>
                {c.body2}
              </p>
            </motion.div>

            {/* Pull quote */}
            <motion.blockquote
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className={`mt-12 p-8 bg-[#111827]/05 border-t-2 border-[#FF6B00] text-xl font-medium text-[#111827] leading-snug italic ${
                lang === 'th' ? 'font-anakotmai' : 'font-inter'
              }`}
            >
              {c.quote}
            </motion.blockquote>
          </div>
        </div>

        {/* Amber divider line */}
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: '100%' } : {}}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="h-px bg-[#FF6B00]/20 mt-24"
        />
      </div>
    </section>
  );
}

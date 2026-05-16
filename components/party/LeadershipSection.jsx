import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const leaders = [
  {
    en: { name: 'Pita Limjaroenrat', role: 'Party Leader', focus: 'Democratic Reform' },
    th: { name: 'พิธา ลิ้มเจริญรัตน์', role: 'หัวหน้าพรรค', focus: 'การปฏิรูปประชาธิปไตย' },
    img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80&auto=format&fit=crop&crop=face',
  },
  {
    en: { name: 'Sirikanya Tansakun', role: 'Deputy Leader & Economic Policy', focus: 'Economic Justice' },
    th: { name: 'ศิริกัญญา ตันสกุล', role: 'รองหัวหน้าพรรค & นโยบายเศรษฐกิจ', focus: 'ความยุติธรรมทางเศรษฐกิจ' },
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80&auto=format&fit=crop&crop=face',
  },
  {
    en: { name: 'Chaithawat Tulathon', role: 'Secretary-General', focus: 'Rule of Law' },
    th: { name: 'ชัยธวัช ตุลาธน', role: 'เลขาธิการพรรค', focus: 'หลักนิติธรรม' },
    img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80&auto=format&fit=crop&crop=face',
  },
  {
    en: { name: 'Wiroj Lakkhanaadisorn', role: 'Head of Policy Committee', focus: 'Education Reform' },
    th: { name: 'วิโรจน์ ลักขณาอดิศร', role: 'ประธานคณะกรรมการนโยบาย', focus: 'การปฏิรูปการศึกษา' },
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80&auto=format&fit=crop&crop=face',
  },
  {
    en: { name: 'Rangsiman Rome', role: 'Human Rights Spokesperson', focus: 'Civil Liberties' },
    th: { name: 'รังสิมันต์ โรม', role: 'โฆษกด้านสิทธิมนุษยชน', focus: 'เสรีภาพพลเมือง' },
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80&auto=format&fit=crop&crop=face',
  },
  {
    en: { name: 'Pannika Wanich', role: 'Media & Communications', focus: 'Press Freedom' },
    th: { name: 'พรรณิการ์ วานิช', role: 'สื่อสารและประชาสัมพันธ์', focus: 'เสรีภาพสื่อ' },
    img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80&auto=format&fit=crop&crop=face',
  },
];

function LeaderCard({ leader, lang, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const data = leader[lang];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: (index % 3) * 0.15 }}
      className="leader-portrait group cursor-default"
    >
      {/* Portrait */}
      <div className="relative overflow-hidden aspect-[3/4] mb-5 bg-[#111827]/05">
        <img
          src={leader.img}
          alt={data.name}
          className="w-full h-full object-cover object-top"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-[#FF6B00]/0 group-hover:bg-[#FF6B00]/10 transition-colors duration-500" />
        {/* Focus tag */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out">
          <div className="bg-[#FF6B00] px-4 py-2">
            <span className={`text-[#111827] font-semibold text-xs tracking-wide ${lang === 'th' ? 'font-kanit' : 'font-inter'}`}>
              {data.focus}
            </span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="flex gap-3 items-start">
        {/* Vertical Thai name */}
        <div className="hidden lg:block">
          <div
            className="font-kanit text-xs text-[#111827]/20 leading-tight"
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
          >
            {leader.th.name}
          </div>
        </div>
        <div>
          <h3 className={`font-inter font-bold text-base text-[#111827] mb-1 ${lang === 'th' ? 'font-kanit' : ''}`}>
            {data.name}
          </h3>
          <p className={`text-xs text-[#111827]/40 tracking-wide ${lang === 'th' ? 'font-kanit' : 'font-inter'}`}>
            {data.role}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function LeadershipSection({ lang }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const label = lang === 'th' ? '004 — ผู้นำ' : '004 — Leadership';
  const headline = lang === 'th' ? 'คณะผู้นำพรรค' : 'Party Leadership';
  const sub = lang === 'th'
    ? 'บุคคลที่ขับเคลื่อนการเปลี่ยนแปลง'
    : 'The people driving the movement forward.';

  return (
    <section id="leadership" className="bg-[#F9FAFB] py-28 lg:py-40">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Label */}
        <div className="flex items-center gap-4 mb-16" ref={ref}>
          <div className="w-8 h-px bg-[#FF6B00]" />
          <span className="text-xs tracking-[0.25em] text-[#111827]/40 font-inter uppercase">
            {label}
          </span>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 mb-20">
          <div className="lg:col-span-5">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className={`font-inter font-black text-5xl text-[#111827] leading-none ${lang === 'th' ? 'font-kanit' : ''}`}
              style={{ letterSpacing: '-0.03em' }}
            >
              {headline}
            </motion.h2>
          </div>
          <div className="lg:col-span-7 flex items-end">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 }}
              className={`text-xl text-[#111827]/50 ${lang === 'th' ? 'font-kanit' : 'font-inter'}`}
            >
              {sub}
            </motion.p>
          </div>
        </div>

        {/* 3-col staggered grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {leaders.map((leader, i) => (
            <LeaderCard key={i} leader={leader} lang={lang} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

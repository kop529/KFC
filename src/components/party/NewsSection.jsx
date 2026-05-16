import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const news = [
  {
    date: '15 May 2026',
    dateTh: '15 พฤษภาคม 2569',
    category: 'Policy',
    categoryTh: 'นโยบาย',
    en: {
      title: 'People\'s Party Unveils Comprehensive Economic Reform Blueprint',
      excerpt: 'The party released its 100-day economic plan focusing on SME support, progressive taxation, and wage reform. The proposal has received broad support from economists and civil society groups.',
    },
    th: {
      title: 'พรรคประชาชนเปิดเผยแผนปฏิรูปเศรษฐกิจฉบับสมบูรณ์',
      excerpt: 'พรรคเปิดตัวแผนเศรษฐกิจ 100 วัน โดยมุ่งเน้นการสนับสนุน SMEs การเก็บภาษีแบบก้าวหน้า และการปฏิรูปค่าจ้าง',
    },
    img: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80&auto=format&fit=crop',
  },
  {
    date: '10 May 2026',
    dateTh: '10 พฤษภาคม 2569',
    category: 'Parliament',
    categoryTh: 'รัฐสภา',
    en: {
      title: 'Constitutional Amendment Bill Passes First Reading in Parliament',
      excerpt: 'A landmark bill to amend key provisions of the 2017 constitution passed its first reading with 312 votes. People\'s Party MPs celebrated the milestone as a step toward democratic restoration.',
    },
    th: {
      title: 'ร่างกฎหมายแก้ไขรัฐธรรมนูญผ่านการอ่านครั้งแรกในรัฐสภา',
      excerpt: 'ร่างกฎหมายสำคัญเพื่อแก้ไขบทบัญญัติหลักของรัฐธรรมนูญปี 2560 ผ่านการอ่านครั้งแรกด้วยคะแนนเสียง 312 เสียง',
    },
    img: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80&auto=format&fit=crop',
  },
  {
    date: '3 May 2026',
    dateTh: '3 พฤษภาคม 2569',
    category: 'Community',
    categoryTh: 'ชุมชน',
    en: {
      title: '50,000 Citizens Join National Policy Dialogue in Bangkok',
      excerpt: 'A record-breaking public forum saw 50,000 participants from all 77 provinces gather in Bangkok to co-design the party\'s next policy platform through open democratic deliberation.',
    },
    th: {
      title: '50,000 คนร่วมสนทนานโยบายระดับชาติในกรุงเทพฯ',
      excerpt: 'เวทีสาธารณะที่ทำลายสถิติเห็นผู้เข้าร่วม 50,000 คนจากทั้ง 77 จังหวัดรวมตัวกันที่กรุงเทพฯ',
    },
    img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80&auto=format&fit=crop',
  },
  {
    date: '28 Apr 2026',
    dateTh: '28 เมษายน 2569',
    category: 'Environment',
    categoryTh: 'สิ่งแวดล้อม',
    en: {
      title: 'Green Energy Bill Advances to Senate With Party\'s Full Backing',
      excerpt: 'The renewable energy transition bill, championed by People\'s Party, advanced to the senate with amendments calling for a 50% renewable target by 2035.',
    },
    th: {
      title: 'ร่างกฎหมายพลังงานสีเขียวเข้าสู่วุฒิสภาด้วยการสนับสนุนเต็มรูปแบบ',
      excerpt: 'ร่างกฎหมายเปลี่ยนผ่านพลังงานหมุนเวียนที่พรรคประชาชนผลักดันได้รับการส่งต่อสู่วุฒิสภา',
    },
    img: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&q=80&auto=format&fit=crop',
  },
];

function NewsItem({ item, lang, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const isLeft = index % 2 === 0;
  const data = item[lang];

  return (
    <div ref={ref} className="relative flex items-center">
      {/* Timeline dot */}
      <div className="absolute left-1/2 -translate-x-1/2 z-10 hidden lg:block">
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="w-3 h-3 rounded-full bg-[#FF6B00] border-4 border-[#F9FAFB]"
        />
      </div>

      {/* Content — alternating */}
      <div className="w-full grid lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Left slot */}
        <motion.div
          initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
          className={`${isLeft ? 'lg:col-start-1' : 'lg:col-start-2'} group cursor-default`}
        >
          {/* Image */}
          <div className="overflow-hidden aspect-video mb-5">
            <img
              src={item.img}
              alt={data.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Meta */}
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs bg-[#FF6B00]/10 text-[#FF6B00] font-inter font-semibold tracking-widest px-2 py-1 uppercase">
              {lang === 'th' ? item.categoryTh : item.category}
            </span>
            <span className="text-xs text-[#111827]/30 font-inter">
              {lang === 'th' ? item.dateTh : item.date}
            </span>
          </div>

          <h3 className={`font-inter font-bold text-xl text-[#111827] mb-3 leading-snug group-hover:text-[#FF6B00] transition-colors duration-300 ${lang === 'th' ? 'font-kanit' : ''}`}>
            {data.title}
          </h3>

          <p className={`text-sm text-[#111827]/50 leading-relaxed mb-4 ${lang === 'th' ? 'font-kanit' : 'font-inter'}`}>
            {data.excerpt}
          </p>

          <button className="flex items-center gap-2 text-xs font-inter font-semibold text-[#FF6B00] tracking-wide group-hover:gap-3 transition-all duration-300">
            {lang === 'th' ? 'อ่านเพิ่มเติม' : 'Read More'} <ArrowUpRight size={14} />
          </button>
        </motion.div>

        {/* Empty col placeholder for the other side */}
        {isLeft ? <div className="hidden lg:block" /> : <div className="hidden lg:block lg:col-start-1" style={{ gridRow: 1 }} />}
      </div>
    </div>
  );
}

export default function NewsSection({ lang }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const label = lang === 'th' ? '005 — ข่าวสาร' : '005 — News';
  const headline = lang === 'th' ? 'ข่าวล่าสุด' : 'Latest News';
  const sub = lang === 'th'
    ? 'ติดตามความเคลื่อนไหวและการกระทำของเรา'
    : 'Stay informed on our actions and progress.';

  return (
    <section id="news" className="bg-[#F9FAFB] py-28 lg:py-40">
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

        {/* Timeline */}
        <div className="relative">
          {/* Vertical center line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-[#111827]/08" />

          <div className="space-y-20">
            {news.map((item, i) => (
              <NewsItem key={i} item={item} lang={lang} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ChevronDown, Zap, Landmark, Leaf, GraduationCap, Heart, Scale } from 'lucide-react';

const policies = [
  {
    index: '01',
    icon: Landmark,
    en: {
      title: 'Democratic Reform',
      tagline: 'Restoring the people\'s voice to the center of government.',
      points: [
        'Amend the constitution to reflect genuine democratic values',
        'Abolish the unelected senate and restore parliamentary supremacy',
        'Establish independent anti-corruption bodies with real enforcement power',
        'Decentralize power to local communities and municipalities',
      ]
    },
    th: {
      title: 'การปฏิรูปประชาธิปไตย',
      tagline: 'คืนเสียงของประชาชนสู่ศูนย์กลางของรัฐบาล',
      points: [
        'แก้ไขรัฐธรรมนูญให้สะท้อนคุณค่าประชาธิปไตยที่แท้จริง',
        'ยกเลิกวุฒิสภาที่ไม่ได้มาจากการเลือกตั้ง',
        'จัดตั้งองค์กรอิสระต่อต้านการทุจริต',
        'กระจายอำนาจสู่ชุมชนและเทศบาลท้องถิ่น',
      ]
    }
  },
  {
    index: '02',
    icon: Zap,
    en: {
      title: 'Economic Justice',
      tagline: 'An economy that works for every citizen, not just the privileged few.',
      points: [
        'Progressive taxation to reduce wealth inequality',
        'Universal basic welfare and social safety net',
        'Support for SMEs and local entrepreneurs',
        'Fair minimum wage indexed to cost of living',
      ]
    },
    th: {
      title: 'ความยุติธรรมทางเศรษฐกิจ',
      tagline: 'เศรษฐกิจที่ทำงานเพื่อทุกคน ไม่ใช่เพียงชนชั้นสูง',
      points: [
        'ระบบภาษีก้าวหน้าเพื่อลดความไม่เท่าเทียมด้านความมั่งคั่ง',
        'สวัสดิการพื้นฐานสากลและเครือข่ายความปลอดภัยทางสังคม',
        'การสนับสนุน SMEs และผู้ประกอบการท้องถิ่น',
        'ค่าแรงขั้นต่ำที่เป็นธรรมตามค่าครองชีพ',
      ]
    }
  },
  {
    index: '03',
    icon: GraduationCap,
    en: {
      title: 'Education for All',
      tagline: 'Equipping the next generation for the world they will inherit.',
      points: [
        'Free quality education from kindergarten through university',
        'Modernize curricula to include critical thinking and digital literacy',
        'Invest in teacher training and competitive salaries',
        'Expand vocational pathways and lifelong learning programs',
      ]
    },
    th: {
      title: 'การศึกษาสำหรับทุกคน',
      tagline: 'เตรียมคนรุ่นต่อไปสำหรับโลกที่พวกเขาจะสืบทอด',
      points: [
        'การศึกษาที่มีคุณภาพฟรีตั้งแต่อนุบาลจนถึงมหาวิทยาลัย',
        'ปรับปรุงหลักสูตรให้รวมการคิดวิเคราะห์และความรู้ดิจิทัล',
        'ลงทุนในการฝึกอบรมครูและเงินเดือนที่แข่งขันได้',
        'ขยายเส้นทางอาชีวศึกษาและโปรแกรมการเรียนรู้ตลอดชีวิต',
      ]
    }
  },
  {
    index: '04',
    icon: Leaf,
    en: {
      title: 'Green Future',
      tagline: 'Protecting the land, water, and air for generations to come.',
      points: [
        'Achieve net-zero carbon emissions by 2050',
        'Transition to 50% renewable energy by 2035',
        'Protect national forests and marine ecosystems',
        'Green public transportation and urban infrastructure',
      ]
    },
    th: {
      title: 'อนาคตสีเขียว',
      tagline: 'ปกป้องแผ่นดิน น้ำ และอากาศสำหรับคนรุ่นต่อไป',
      points: [
        'บรรลุการปล่อยคาร์บอนสุทธิเป็นศูนย์ภายในปี 2593',
        'เปลี่ยนผ่านสู่พลังงานหมุนเวียน 50% ภายในปี 2578',
        'ปกป้องป่าแห่งชาติและระบบนิเวศทางทะเล',
        'ขนส่งสาธารณะและโครงสร้างพื้นฐานเมืองสีเขียว',
      ]
    }
  },
  {
    index: '05',
    icon: Heart,
    en: {
      title: 'Universal Healthcare',
      tagline: 'Health is a right, not a privilege.',
      points: [
        'Universal coverage with no out-of-pocket costs for essential care',
        'Expand mental health services nationwide',
        'Invest in public hospitals in underserved regions',
        'Affordable medication through generic drug promotion',
      ]
    },
    th: {
      title: 'การดูแลสุขภาพถ้วนหน้า',
      tagline: 'สุขภาพเป็นสิทธิ ไม่ใช่สิทธิพิเศษ',
      points: [
        'ความครอบคลุมถ้วนหน้าโดยไม่มีค่าใช้จ่ายสำหรับการดูแลที่จำเป็น',
        'ขยายบริการสุขภาพจิตทั่วประเทศ',
        'ลงทุนในโรงพยาบาลรัฐในพื้นที่ที่ขาดแคลน',
        'ยาราคาไม่แพงผ่านการส่งเสริมยาสามัญ',
      ]
    }
  },
  {
    index: '06',
    icon: Scale,
    en: {
      title: 'Rule of Law',
      tagline: 'Justice that is equal, swift, and independent.',
      points: [
        'Judicial independence free from political interference',
        'Transparent prosecution of corruption at all levels',
        'Reform the criminal justice system to protect the accused',
        'Strengthen freedom of press and civil society',
      ]
    },
    th: {
      title: 'หลักนิติธรรม',
      tagline: 'ความยุติธรรมที่เท่าเทียม รวดเร็ว และเป็นอิสระ',
      points: [
        'ความเป็นอิสระของตุลาการจากการแทรกแซงทางการเมือง',
        'การฟ้องร้องคดีทุจริตอย่างโปร่งใสในทุกระดับ',
        'ปฏิรูประบบยุติธรรมทางอาญาเพื่อปกป้องผู้ถูกกล่าวหา',
        'เสริมสร้างเสรีภาพสื่อและภาคประชาสังคม',
      ]
    }
  },
];

function PolicyCard({ policy, lang, index }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const Icon = policy.icon;
  const data = policy[lang];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="border-t border-[#111827]/10 group"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start gap-6 py-8 text-left hover:bg-[#111827]/02 transition-colors duration-200"
      >
        {/* Index */}
        <span className="font-inter font-black text-6xl text-[#111827]/08 leading-none w-20 shrink-0 group-hover:text-[#FF6B00]/20 transition-colors duration-300">
          {policy.index}
        </span>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Icon size={18} className="text-[#FF6B00]" />
            <h3 className={`font-inter font-bold text-xl text-[#111827] ${lang === 'th' ? 'font-kanit' : ''}`}>
              {data.title}
            </h3>
          </div>
          <p className={`text-[#111827]/50 text-sm ${lang === 'th' ? 'font-kanit' : 'font-inter'}`}>
            {data.tagline}
          </p>
        </div>

        {/* Chevron */}
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="mt-2 shrink-0"
        >
          <ChevronDown size={20} className="text-[#111827]/40" />
        </motion.div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="pl-26 pb-8 ml-20">
              <ul className="space-y-3">
                {data.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] mt-2.5 shrink-0" />
                    <span className={`text-[#111827]/70 leading-relaxed ${lang === 'th' ? 'font-kanit text-base' : 'font-inter text-sm'}`}>
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function PoliciesSection({ lang }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const label = lang === 'th' ? '003 — นโยบาย' : '003 — Policies';
  const headline = lang === 'th' ? 'นโยบายของเรา' : 'Our Policy Pillars';
  const sub = lang === 'th'
    ? 'หกเสาหลักที่สร้างประเทศไทยที่ดีกว่า'
    : 'Six pillars building a better Thailand.';

  return (
    <section id="policies" className="bg-white py-28 lg:py-40">
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

        {/* Policy Accordion List */}
        <div>
          {policies.map((policy, i) => (
            <PolicyCard key={policy.index} policy={policy} lang={lang} index={i} />
          ))}
          <div className="border-t border-[#111827]/10" />
        </div>
      </div>
    </section>
  );
}

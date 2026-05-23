import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/party/Navbar';
import PoliciesSection, { policies as allPolicies } from '../components/party/PoliciesSection';
import Footer from '../components/party/Footer';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { 
  Search, ArrowLeft
} from 'lucide-react';

const EXPO_OUT = [0.16, 1, 0.3, 1];

// ─── Animated Counter for policy count ───
function useAnimatedCounter(target, duration = 1.2) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const hasRun = useRef(false);

  useEffect(() => {
    if (!inView || hasRun.current) return;
    hasRun.current = true;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / (duration * 1000), 1);
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setDisplay(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target, duration]);

  return { display, ref };
}

const dimensionsData = {
  economy: {
    th: {
      title: 'พัฒนาผู้เรียน',
      description: 'มุ่งเน้นการส่งเสริมการเรียน กิจกรรม และระเบียบวินัย เพื่อยกระดับศักยภาพของนักเรียนในทุกมิติ ทั้งการแชร์ความรู้ เสียงของนักเรียน กิจกรรมสร้างสรรค์ และการปกครองตนเอง',
    },
    en: {
      title: 'Develop Students',
      description: 'Focus on promoting learning, activities, and discipline to elevate student potential in all dimensions, including knowledge sharing, student voice, creative activities, and self-governance.',
    },
    categories: [
      { id: 'share_shine', th: 'Cru Share & Shine', en: 'Cru Share & Shine', image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80' },
      { id: 'student_voice', th: 'Student Voice', en: 'Student Voice', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80' },
      { id: 'ask_me_anything', th: 'น้องถามพี่ พี่ตอบน้อง', en: 'Ask Me Anything', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80' },
      { id: 'weekly_quiz', th: 'คำถามประจำสัปดาห์', en: 'Weekly Quiz', image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80' },
      { id: 'exam_broadcast', th: 'เสียงตามสายในวันสอบ', en: 'Exam Broadcast', image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80' },
      { id: 'edu_reels', th: 'คลิป Reels ให้ความรู้', en: 'Educational Reels', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80' },
      { id: 'notebook_cover', th: 'ประกวดออกแบบปกสมุด', en: 'Notebook Cover Design', image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&q=80' },
      { id: 'chill_space', th: 'Chill Space', en: 'Chill Space', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80' },
      { id: 'cae', th: 'CAE', en: 'Chonchai Activity Evolution', image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80' },
      { id: 'idea_hub', th: 'น้องเสนอ พี่สนอง', en: 'Idea Hub', image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&q=80' },
      { id: 'cru_market_space', th: 'Cru Market Space', en: 'Cru Market Space', image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800&q=80' },
      { id: 'event_calendar', th: 'Event Calendar', en: 'Event Calendar', image: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=800&q=80' },
      { id: 'one_msg_smile', th: '1 ข้อความ 1 รอยยิ้ม', en: '1 Message 1 Smile', image: 'https://images.unsplash.com/photo-1494178270175-e96de2971df9?w=800&q=80' },
      { id: 'market_space_2', th: 'Market Space', en: 'Market Space', image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80' },
      { id: 'csg', th: 'CSG', en: 'Chonchai Smart Governance', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80' },
      { id: 'birthday_conn', th: 'เดือนสำคัญแห่งความหมาย', en: 'Birthday Connection', image: 'https://images.unsplash.com/photo-1530103862676-de8892bc952f?w=800&q=80' },
      { id: 'actilearning', th: 'ActiLearning Hub', en: 'ActiLearning Hub', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80' },
      { id: 'reading_guide', th: 'หน้าไหน น่าอ่าน', en: 'Reading Guide', image: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=800&q=80' },
      { id: 'music_comp', th: 'Music Competition', en: 'Music Competition', image: 'https://images.unsplash.com/photo-1501612780327-45045538702b?w=800&q=80' },
      { id: 'recycle_runway', th: 'Recycle Runway', en: 'Recycle Runway', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80' },
      { id: 'art_music_week', th: 'ศิลป์สร้างฝัน', en: 'Art & Music Week', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80' },
      { id: 'open_academic', th: 'CRU Open Academic', en: 'CRU Open Academic', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80' },
      { id: 'club_synergy', th: 'เปิดโลกกิจกรรมกับกลุ่มสาระ', en: 'Club Synergy', image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80' },
      { id: 'creative_signage', th: 'มานี่ พี่บอกให้', en: 'Creative Signage', image: 'https://images.unsplash.com/photo-1497215848122-331bedaf2145?w=800&q=80' },
      { id: 'yellow_card', th: 'ขั้นบันได แห่งความหวัง', en: 'Yellow Card System', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80' },
      { id: 'point_recovery', th: 'ประชาสัมพันธ์กิจกรรมเพิ่มคะแนน', en: 'Point Recovery', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80' }
    ]
  },
  security: {
    th: {
      title: 'พัฒนาสังคม',
      description: 'เน้นการทำสาธารณะประโยชน์และนโยบายเพื่อชุมชน สร้างสรรค์สังคมที่เกื้อกูล ปลอดภัย และดูแลสุขภาพกายและใจของทุกคน',
    },
    en: {
      title: 'Develop Society',
      description: 'Emphasize public service and community policies, creating a supportive, safe society, and caring for the physical and mental health of everyone.',
    },
    categories: [
      { id: 'shared_cabinet', th: 'หนูลืมหรอพี่มีให้ (ตู้ปันสุข ชรอ.)', en: 'Shared Cabinet', image: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&q=80' },
      { id: 'sch', th: 'SCH', en: 'SchoolCare Hub', image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80' },
      { id: 'smart_canteen', th: 'โรงอาหารสะอาด หลากหลายด้วยปลายนิ้ว', en: 'Smart Canteen', image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80' },
      { id: 'teacher_dir', th: 'Platform ช่องทางการติดต่อ ห้องพักครู', en: 'Teacher Directory Platform', image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&q=80' },
      { id: 'napkin_wrap', th: 'กระดาษห่อผ้าอนามัย', en: 'Sanitary Napkin Wrapper', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80' },
      { id: 'first_aid', th: 'First Aid Station', en: 'First Aid Station', image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800&q=80' },
      { id: 'water_qc', th: 'ความสะอาดตู้กดน้ำ', en: 'Water Dispenser QC', image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80' },
      { id: 'c_to_c', th: 'C to C', en: 'CRU to CRU', image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80' },
      { id: 'lost_found', th: 'Lost & Found', en: 'Lost & Found', image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80' },
      { id: 'cru_now', th: 'CRU NOW', en: 'CRU NOW Digital Signage', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80' },
      { id: 'happy_toilet', th: 'คืนสุขา สู่ความสุข', en: 'Happy Toilet', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80' },
      { id: 'double_a', th: 'Double A Fastprint', en: 'Fastprint Service', image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80' },
      { id: 'music_room', th: 'ห้องซ้อมดนตรี', en: 'Music Rehearsal Room', image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80' },
      { id: 'mental_health', th: 'เด็กมันคิดเยอะ', en: 'Mental Health Counselors', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80' },
      { id: 'umbrella_exchange', th: 'บัตรแลกร่ม', en: 'Umbrella Exchange', image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&q=80' },
      { id: 'eco_market', th: 'School Eco-Market', en: 'School Eco-Market', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80' },
      { id: 'clear_comm', th: 'ข้อมูลชัดเจน สื่อสารเป็นระบบ', en: 'Clear Communication', image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80' },
      { id: 'heal_guard', th: 'Chonchai Heal Guard', en: 'Health Guard', image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&q=80' },
      { id: 'council_relations', th: 'สภาสานสัมพันธ์', en: 'Council Relations', image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800&q=80' },
      { id: 'cer', th: 'CER Chonchai Emergency Readiness', en: 'Emergency Readiness', image: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=800&q=80' }
    ]
  },
  quality: {
    th: {
      title: 'พัฒนาอนาคต',
      description: 'ให้ความสำคัญกับสิ่งแวดล้อมและการจัดการทรัพยากรอย่างยั่งยืน เพื่อสร้างรากฐานที่ดีให้กับอนาคตของโรงเรียนและสังคม',
    },
    en: {
      title: 'Develop Future',
      description: 'Focus on the environment and sustainable resource management to build a strong foundation for the future of the school and society.',
    },
    categories: [
      { id: 'green_school', th: 'Green School', en: 'Green School', image: 'https://images.unsplash.com/photo-1494178270175-e96de2971df9?w=800&q=80' },
      { id: 'reuse_bank', th: 'CRU Reuse Bank', en: 'CRU Reuse Bank', image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80' },
      { id: 'parking_mgt', th: 'จัดการที่จอดรถ', en: 'Parking Management', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80' },
      { id: 'council_care', th: 'สภาดูแลให้', en: 'Council Care', image: 'https://images.unsplash.com/photo-1530103862676-de8892bc952f?w=800&q=80' },
      { id: 'recycle_fund', th: 'ขวดนี้พี่ขอ', en: 'Recycle Fund', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80' }
    ]
  }
};

function PolicyCounter({ count, lang }) {
  const { display, ref } = useAnimatedCounter(count, 1.5);
  return (
    <div ref={ref} className="lg:col-span-3 flex flex-col items-center lg:items-end justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.4, ease: EXPO_OUT }}
        className="text-center lg:text-right"
      >
        <span className={`text-xs lg:text-sm font-bold tracking-[0.1em] text-white/40 uppercase mb-1 block ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}>
          {lang === 'th' ? 'ที่มีอยู่' : 'Available'}
        </span>
        <div className="flex items-baseline justify-center lg:justify-end gap-2">
          <span className="text-7xl font-black text-white font-inter tracking-tighter tabular-nums">
            {display}
          </span>
          <span className={`text-[#FF6B00] text-lg lg:text-xl font-extrabold uppercase tracking-[0.05em] ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}>
            {lang === 'th' ? 'นโยบาย' : 'Policies'}
          </span>
        </div>
      </motion.div>
    </div>
  );
}

function PolicyCard({ category, lang, index, totalCols = 5 }) {
  const cardRef = useRef(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (e.clientY - centerY) / (rect.height / 2);
    rotateX.set(-y * 6); // tilt toward cursor
    rotateY.set(x * 6);
  }, [rotateX, rotateY]);

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  // Diagonal waterfall: delay based on row + col position
  const row = Math.floor(index / totalCols);
  const col = index % totalCols;
  const diagonalDelay = Math.min((row + col) * 0.03, 0.3);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: diagonalDelay, ease: EXPO_OUT }}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformPerspective: 800,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -12 }}
      className="group relative bg-[#111827] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex flex-col h-[70vw] max-h-[400px] lg:h-[400px] cursor-pointer border border-white/5 will-change-transform"
    >
      {/* Visual Header with parallax image */}
      <div className="relative flex-grow overflow-hidden">
        <img 
          src={category.image} 
          alt="" 
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/20 to-transparent opacity-90" />
      </div>

      {/* Label Footer */}
      <div className="bg-[#111827] p-6 lg:p-8 flex items-center justify-center text-center border-t border-white/5">
        <h3 className={`text-white text-lg lg:text-xl font-bold leading-tight ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}>
          {lang === 'th' ? category.th : category.en}
        </h3>
      </div>

      {/* Hover glow border */}
      <motion.div
        className="absolute inset-0 rounded-3xl border-2 border-[#FF6B00] opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
      />

      {/* Stack decoration */}
      <div className="absolute -z-10 inset-0 bg-white/5 rounded-3xl translate-x-2 translate-y-2 rotate-2 opacity-50 border border-white/10" />
      <div className="absolute -z-20 inset-0 bg-white/10 rounded-3xl translate-x-4 translate-y-4 rotate-6 opacity-30 border border-white/10" />
    </motion.div>
  );
}

export default function PoliciesPage({ lang, setLang }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const activeDimension = dimensionsData[id];
  const activePolicyData = allPolicies.find(p => p.id === id);

  const filteredCategories = activeDimension?.categories.filter(cat => {
    const searchLower = searchTerm.toLowerCase();
    return (
      cat.th.toLowerCase().includes(searchLower) ||
      cat.en.toLowerCase().includes(searchLower)
    );
  }) || [];

  if (!activeDimension) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.3 } }}
        className="min-h-screen bg-[#0B0F17] flex flex-col font-sans"
      >
        <Navbar lang={lang} setLang={setLang} theme="dark" />
        <PoliciesSection lang={lang} />
        <Footer lang={lang} />
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      className="min-h-screen bg-[#0B0F17] text-white flex flex-col font-sans selection:bg-[#FF6B00] selection:text-white"
    >
      <Navbar lang={lang} setLang={setLang} theme="dark" />
      
      <main className="pt-32 lg:pt-48 pb-40 flex-grow relative z-10">
        
        {/* Shared Background Image Transition */}
        {activePolicyData && (
          <motion.div
            className="absolute inset-0 z-0 h-[50vh] lg:h-[70vh] overflow-hidden pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img src={activePolicyData.image} className="w-full h-full object-cover opacity-20" alt="" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F17]/50 via-transparent to-[#0B0F17]" />
          </motion.div>
        )}

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Minimalist Top Nav */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-20 border-b border-white/5 pb-12">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/policies')}
                  className={`flex items-center gap-3 text-white/50 hover:text-white transition-all duration-300 text-xs lg:text-sm font-bold uppercase tracking-[0.1em] group ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}
                >
                  <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-300" />
                  {lang === 'th' ? 'ย้อนกลับ' : 'Back'}
                </button>
                <div className="h-px w-12 bg-white/10" />
                <span className={`text-[#FF6B00] text-xs lg:text-sm font-bold uppercase tracking-[0.1em] ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}>
                  {lang === 'th' ? 'นโยบายพรรค' : 'PARTY POLICY'}
                </span>
              </div>

              {/* Search Field */}
              <div className="relative group max-w-sm w-full">
                <span className="absolute inset-y-0 left-4 flex items-center text-white/20 group-focus-within:text-[#FF6B00] transition-colors">
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  placeholder={lang === 'th' ? 'ค้นหา...' : 'Search...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/20 rounded-full py-3 pl-12 pr-10 text-sm focus:outline-none focus:border-[#FF6B00]/40 transition-all"
                />
              </div>
            </div>

            {/* Editorial Headline — clip-mask reveal */}
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-24 mb-32 items-start">
              <div className="lg:col-span-9">
                <div className="overflow-hidden mb-12">
                  <motion.h1
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.9, delay: 0.1, ease: EXPO_OUT }}
                    className={`text-5xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter ${
                      lang === 'th' ? 'font-anakotmai' : 'font-inter uppercase'
                    }`}
                  >
                    {lang === 'th' ? activeDimension.th.title : activeDimension.en.title}
                  </motion.h1>
                </div>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3, ease: EXPO_OUT }}
                  className={`text-white/50 text-xl lg:text-2xl leading-relaxed max-w-5xl ${
                    lang === 'th' ? 'font-anakotmai' : 'font-inter font-light'
                  }`}
                >
                  {lang === 'th' ? activeDimension.th.description : activeDimension.en.description}
                </motion.p>
              </div>
              
              <PolicyCounter count={filteredCategories.length} lang={lang} />
            </div>

            {/* Cinematic Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8 lg:gap-10">
               {filteredCategories.map((cat, idx) => (
                 <PolicyCard key={cat.id} category={cat} lang={lang} index={idx} />
               ))}
            </div>

          </motion.div>
        </div>
      </main>

      <Footer lang={lang} />
    </motion.div>
  );
}

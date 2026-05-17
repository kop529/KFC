import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/party/Navbar';
import PoliciesSection from '../components/party/PoliciesSection';
import Footer from '../components/party/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, X, ArrowLeft, Heart, AlertCircle, ArrowUpRight, 
  Cpu, Leaf, GraduationCap, ShieldCheck, HeartPulse,
  TrendingUp, Globe2, Landmark, Users2, Zap
} from 'lucide-react';
import { toast } from 'sonner';

const dimensionsData = {
  economy: {
    th: {
      title: 'โมเดลเศรษฐกิจใหม่',
      description: 'สร้างเศรษฐกิจที่เป็นธรรม พัฒนาโครงสร้างพื้นฐานทันสมัย ใช้ดิจิทัลสร้างโอกาส พลิกโฉม SME และทักษะไทย วางยุทธศาสตร์ไทยบนเวทีโลก ดันเศรษฐกิจสร้างสรรค์ และปฏิรูปพลังงานยั่งยืนเพื่อการเติบโต โดยท่านสามารถเข้าไปอ่านชุดนโยบายของพรรคประชาชนได้ที่นี่',
    },
    en: {
      title: 'New Economic Model',
      description: 'Build a fair economy, develop modern infrastructure, use digital tools to create opportunities, transform SMEs and Thai skills, place Thailand on the global stage, push creative economy, and reform sustainable energy for growth.',
    },
    categories: [
      { id: 'fair_econ', th: 'เศรษฐกิจที่เป็นธรรม', en: 'Fair Economy', image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80' },
      { id: 'infra', th: 'โครงสร้างพื้นฐานทันสมัย', en: 'Modern Infrastructure', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80' },
      { id: 'digital_opp', th: 'สร้างโอกาสทางเศรษฐกิจด้วยดิจิทัล', en: 'Digital Opportunity', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80' },
      { id: 'sme_skill', th: 'พลิกโฉม SME และเพิ่มทักษะคนไทย', en: 'SME & Skills', image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80' },
      { id: 'global_stage', th: 'วางยุทธศาสตร์ไทยบนเวทีโลก', en: 'Global Strategy', image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80' },
      { id: 'creative', th: 'เศรษฐกิจสร้างสรรค์', en: 'Creative Economy', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80' },
      { id: 'energy', th: 'พลังงานยั่งยืน', en: 'Sustainable Energy', image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&q=80' }
    ]
  },
  security: {
    th: {
      title: 'ประชาธิปไตยและความมั่นคงใหม่',
      description: 'ทำให้กองทัพทันสมัย ปฏิรูปกระบวนการยุติธรรมที่เป็นธรรม วางนโยบายความมั่นคงใหม่ที่ตอบโจทย์โลกยุคปัจจุบัน และสร้างประชาธิปไตยที่อำนาจสูงสุดเป็นของประชาชนอย่างแท้จริง',
    },
    en: {
      title: 'Democracy & Security',
      description: 'Modernize the military, reform the justice system, establish modern security frameworks for the contemporary world, and secure true democratic power for the people.',
    },
    categories: [
      { id: 'military', th: 'กองทัพทันสมัย', en: 'Modern Military', image: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&q=80' },
      { id: 'justice', th: 'ปฏิรูปกระบวนการยุติธรรม', en: 'Reform Justice', image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80' },
      { id: 'newsec', th: 'ความมั่นคงใหม่', en: 'New Security', image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80' },
      { id: 'democracy', th: 'ประชาธิปไตยแท้จริง', en: 'True Democracy', image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&q=80' }
    ]
  },
  quality: {
    th: {
      title: 'คุณภาพชีวิตที่ดีและเท่าเทียม',
      description: 'ยกระดับคุณภาพชีวิตด้วยสวัสดิการถ้วนหน้า ดูแลรักษาสิ่งแวดล้อมเพื่อส่งต่อโลกที่น่าอยู่ และพัฒนาคุณภาพระบบสาธารณสุขและการศึกษาให้ทุกคนเข้าถึงได้',
    },
    en: {
      title: 'Quality of Life',
      description: 'Improve quality of life with universal welfare, protect the environment for a sustainable future, and elevate healthcare and education access for everyone.',
    },
    categories: [
      { id: 'welfare', th: 'รัฐสวัสดิการถ้วนหน้า', en: 'Universal Welfare', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80' },
      { id: 'environment', th: 'สิ่งแวดล้อมยั่งยืน', en: 'Sustainable Environment', image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800&q=80' },
      { id: 'healthcare', th: 'สาธารณสุขเพื่อทุกคน', en: 'Universal Healthcare', image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80' },
      { id: 'education', th: 'การศึกษาเพื่ออนาคต', en: 'Future Education', image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80' }
    ]
  }
};

function PolicyCard({ category, lang, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -10 }}
      className="group relative bg-white rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.08)] flex flex-col h-[400px] cursor-pointer"
    >
      {/* Visual Header */}
      <div className="relative flex-grow overflow-hidden">
        <img 
          src={category.image} 
          alt="" 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
      </div>

      {/* Label Footer */}
      <div className="bg-white p-6 lg:p-8 flex items-center justify-center text-center">
        <h3 className={`text-[#111827] text-lg lg:text-xl font-bold leading-tight ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}>
          {lang === 'th' ? category.th : category.en}
        </h3>
      </div>

      {/* Hidden Stack Decoration - Replicating the 'Fan' effect from reference */}
      <div className="absolute -z-10 inset-0 bg-gray-200 rounded-3xl translate-x-2 translate-y-2 rotate-2 opacity-50" />
      <div className="absolute -z-20 inset-0 bg-gray-100 rounded-3xl translate-x-4 translate-y-4 rotate-6 opacity-30" />
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

  if (!activeDimension) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-sans">
        <Navbar lang={lang} setLang={setLang} />
        <PoliciesSection lang={lang} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] flex flex-col font-sans selection:bg-[#FF6B00] selection:text-white">
      <Navbar lang={lang} setLang={setLang} />
      
      <main className="pt-32 lg:pt-48 pb-40 flex-grow">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Minimalist Top Nav */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-20 border-b border-[#111827]/05 pb-12">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/policies')}
                  className="flex items-center gap-3 text-[#111827]/40 hover:text-[#111827] transition-all duration-300 text-[10px] font-black uppercase tracking-[0.4em] group"
                >
                  <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-300" />
                  {lang === 'th' ? 'ย้อนกลับ' : 'Back'}
                </button>
                <div className="h-px w-12 bg-[#111827]/10" />
                <span className={`text-[#FF6B00] text-[10px] font-black uppercase tracking-[0.4em] ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}>
                  {lang === 'th' ? 'นโยบายพรรค' : 'PARTY POLICY'}
                </span>
              </div>

              {/* Search Field */}
              <div className="relative group max-w-sm w-full">
                <span className="absolute inset-y-0 left-4 flex items-center text-[#111827]/20 group-focus-within:text-[#FF6B00] transition-colors">
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  placeholder={lang === 'th' ? 'ค้นหา...' : 'Search...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#111827]/03 border border-[#111827]/05 rounded-full py-3 pl-12 pr-10 text-sm focus:outline-none focus:border-[#FF6B00]/40 transition-all"
                />
              </div>
            </div>

            {/* Editorial Headline */}
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-24 mb-32 items-start">
              <div className="lg:col-span-9">
                <h1 className={`text-5xl lg:text-8xl font-black text-[#111827] leading-[0.9] tracking-tighter mb-12 ${
                  lang === 'th' ? 'font-anakotmai' : 'font-inter uppercase'
                }`}>
                  {lang === 'th' ? activeDimension.th.title : activeDimension.en.title}
                </h1>
                <p className={`text-[#111827]/50 text-xl lg:text-2xl leading-relaxed max-w-5xl ${
                  lang === 'th' ? 'font-anakotmai' : 'font-inter font-light'
                }`}>
                  {lang === 'th' ? activeDimension.th.description : activeDimension.en.description}
                </p>
              </div>
              
              <div className="lg:col-span-3 flex flex-col items-center lg:items-end justify-center">
                <div className="text-center lg:text-right">
                  <span className="text-[10px] font-black tracking-[0.5em] text-[#111827]/20 uppercase mb-2 block">Available</span>
                  <div className="flex items-baseline justify-center lg:justify-end gap-2">
                    <span className="text-7xl font-black text-[#111827] font-inter tracking-tighter">
                      {activeDimension.categories.length * 8}
                    </span>
                    <span className="text-[#FF6B00] text-sm font-black font-inter uppercase">Policies</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cinematic Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
               {activeDimension.categories.map((cat, idx) => (
                 <PolicyCard key={cat.id} category={cat} lang={lang} index={idx} />
               ))}
            </div>

          </motion.div>
        </div>
      </main>

      <Footer lang={lang} />
    </div>
  );
}

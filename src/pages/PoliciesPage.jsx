import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/party/Navbar';
import PoliciesSection, { policies as allPolicies } from '../components/party/PoliciesSection';
import Footer from '../components/party/Footer';
import { motion, useInView } from 'framer-motion';
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

import { unifiedPoliciesData } from '../data/unifiedPoliciesData';

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
        <span className={`text-xs lg:text-sm font-bold text-white/40 uppercase mb-1 block ${lang === 'th' ? 'font-anakotmai' : 'font-inter tracking-[0.1em]'}`}>
          {lang === 'th' ? 'ที่มีอยู่' : 'Available'}
        </span>
        <div className="flex items-baseline justify-center lg:justify-end gap-2">
          <span className="text-7xl font-black text-white font-inter tracking-tighter tabular-nums">
            {display}
          </span>
          <span className={`text-[#FF6B00] text-lg lg:text-xl font-extrabold uppercase ${lang === 'th' ? 'font-anakotmai' : 'font-inter tracking-[0.05em]'}`}>
            {lang === 'th' ? 'นโยบาย' : 'Policies'}
          </span>
        </div>
      </motion.div>
    </div>
  );
}

function PolicyCard({ category, lang, index, navigate }) {
  const col = index % 4;
  const row = Math.floor(index / 4);
  const diagonalDelay = Math.min((row + col) * 0.04, 0.3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: diagonalDelay, ease: EXPO_OUT }}
      onClick={() => navigate(`/policy/detail/${category.id}`)}
      className="group relative bg-white/5 hover:bg-white/10 rounded-3xl overflow-hidden cursor-pointer border border-white/10 transition-colors p-8"
    >
      <div className="relative z-20">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 font-anakotmai">
          {lang === 'th' ? category.th : (category.en || category.th)}
        </h3>
        <p className={`text-[#FF6B00] font-semibold text-sm flex items-center gap-2 ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}>
          {lang === 'th' ? 'ดูนโยบาย →' : 'View Policy →'}
        </p>
      </div>
    </motion.div>
  );
}

export default function PoliciesPage({ lang, setLang }) {
  const { subcategoryId } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const scrollRef = useRef(null);

  // Find all policies under this subcategory
  let subcatPoliciesNames = [];
  let currentDimTitle = '';

  for (const [dim, subcats] of Object.entries(unifiedPoliciesData.structure)) {
    if (subcats[subcategoryId]) {
      subcatPoliciesNames = subcats[subcategoryId];
      currentDimTitle = dim;
      break;
    }
  }

  // Map names to actual policy objects
  const allPoliciesList = Object.entries(unifiedPoliciesData.policies).map(([id, policy]) => ({
    id,
    th: policy.title[0] || 'Unknown',
    en: policy.title[1] || '',
    image: 'https://images.unsplash.com/photo-1535401991746-da3d9055713e?w=800&q=80'
  }));

  const dimensionCategories = allPoliciesList.filter(p => {
    // Basic fuzzy matching: check if any part of the policy name is in the th string
    return subcatPoliciesNames.some(name => p.th.includes(name) || name.includes(p.th));
  });

  const filteredCategories = dimensionCategories.filter((cat) =>
    cat.th.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.en.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [subcategoryId]);

  if (!subcategoryId) {
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
        
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Search Field */}
            <div className="flex justify-end mb-12">
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
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-4 mb-4"
                >
                  <button 
                    onClick={() => navigate(`/dimension/${currentDimTitle}`)}
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors group"
                  >
                    <ArrowLeft className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                  </button>
                  <h2 className="text-[#FF6B00] text-sm md:text-base font-bold uppercase font-anakotmai tracking-normal">
                    {currentDimTitle}
                  </h2>
                </motion.div>
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight tracking-tight ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}
                >
                  {subcategoryId}
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`text-lg md:text-xl lg:text-2xl text-white/60 max-w-3xl leading-relaxed ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}
                >
                  นโยบายในหมวดหมู่นี้
                </motion.p>
              </div>
              
              <PolicyCounter count={filteredCategories.length} lang={lang} />
            </div>

            {/* Simple Text Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {filteredCategories.map((cat, idx) => (
                 <PolicyCard key={cat.id} category={cat} lang={lang} index={idx} navigate={navigate} />
               ))}
            </div>

          </motion.div>
        </div>
      </main>

      <Footer lang={lang} />
    </motion.div>
  );
}

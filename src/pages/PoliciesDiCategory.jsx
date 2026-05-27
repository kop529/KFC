import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/party/Navbar';
import Footer from '../components/party/Footer';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowLeft, Search } from 'lucide-react';
import { unifiedPoliciesData } from '../data/unifiedPoliciesData';

const EXPO_OUT = [0.16, 1, 0.3, 1];

function SubcatCard({ subcat, dimensionData, lang, index, navigate }) {
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
    rotateX.set(-y * 6);
    rotateY.set(x * 6);
  }, [rotateX, rotateY]);

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  const col = index % 4;
  const row = Math.floor(index / 4);
  const diagonalDelay = Math.min((row + col) * 0.04, 0.3);

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
      onClick={() => navigate(`/policies/${subcat}`)}
      whileHover={{ y: -12 }}
      className="group relative bg-[#111827] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex flex-col h-[300px] cursor-pointer border border-white/5 will-change-transform"
    >
      {/* Gradient background (no image needed for subcategories) */}
      <div className="relative flex-grow overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B00]/10 via-[#111827] to-[#0B0F17]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent opacity-80" />
      </div>

      {/* Label Footer */}
      <div className="bg-[#111827] p-6 lg:p-8 border-t border-white/5">
        <h3 className="text-white text-lg lg:text-xl font-bold leading-tight font-anakotmai mb-1">
          {subcat}
        </h3>
        <p className={`text-[#FF6B00] text-sm font-semibold ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}>
          {dimensionData[subcat].length} {lang === 'th' ? 'นโยบาย' : 'Policies'}
        </p>
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

const translations = {
  "มิติพัฒนาผู้เรียน": "Develop Students",
  "มิติพัฒนาสังคม": "Develop Society",
  "มิติพัฒนาอนาคต": "Develop Future",
  "ด้านส่งเสริมการเรียน": "Promote Learning",
  "ด้านส่งเสริมกิจกรรม": "Creative Activities",
  "ด้านส่งเสริมระเบียบวินัย": "Positive Discipline",
  "ด้านสาธารณะประโยชน์": "Public Service",
  "นโยบายเพื่อชุมชน": "Community Policies",
  "ด้านสิ่งแวดล้อม": "Environment"
};

export default function PoliciesDiCategory({ lang, setLang }) {
  const { dimensionId } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Find the dimension data
  const dimensionData = unifiedPoliciesData.structure[dimensionId];
  
  // If the dimension has no subcategories (e.g. it only has 'none'), we should ideally skip this page and go straight to policies.
  // But we handle it here anyway just in case.
  const subcategories = dimensionData ? Object.keys(dimensionData) : [];

  const filteredSubcategories = subcategories.filter(subcat => {
    const term = searchTerm.toLowerCase();
    const thMatch = subcat.toLowerCase().includes(term);
    const enMatch = translations[subcat] && translations[subcat].toLowerCase().includes(term);
    return thMatch || enMatch;
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [dimensionId]);

  if (!dimensionData) {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center text-white">
        <h2>Dimension not found</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-[#FF6B00]">Go Back</button>
      </div>
    );
  }

  // Get total policies in this dimension
  const totalPolicies = subcategories.reduce((acc, subcat) => acc + dimensionData[subcat].length, 0);

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
            transition={{ duration: 0.8, ease: EXPO_OUT }}
          >
            {/* Search Field */}
            <div className="flex justify-end mb-12">
              <div className="relative group max-w-sm w-full">
                <span className="absolute inset-y-0 left-4 flex items-center text-white/20 group-focus-within:text-[#FF6B00] transition-colors">
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  placeholder={lang === 'th' ? 'ค้นหาหมวดหมู่...' : 'Search categories...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/20 rounded-full py-3 pl-12 pr-10 text-sm focus:outline-none focus:border-[#FF6B00]/40 transition-all"
                />
              </div>
            </div>

            {/* Headline */}
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-24 mb-20 items-start">
              <div className="lg:col-span-9">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-4 mb-4"
                >
                  <button 
                    onClick={() => navigate('/policies')}
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors group"
                  >
                    <ArrowLeft className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                  </button>
                  <h2 className="text-[#FF6B00] text-sm md:text-base font-bold uppercase font-anakotmai tracking-normal">
                    {dimensionId}
                  </h2>
                </motion.div>
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight tracking-tight font-anakotmai"
                >
                  {dimensionId}
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`text-lg md:text-xl lg:text-2xl text-white/60 max-w-3xl leading-relaxed ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}
                >
                  {totalPolicies} {lang === 'th' ? 'นโยบาย ในหมวดหมู่นี้' : 'Policies in this category'}
                </motion.p>
              </div>
            </div>

            {/* Subcategories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
              {filteredSubcategories.map((subcat, idx) => (
                <SubcatCard
                  key={subcat}
                  subcat={subcat}
                  dimensionData={dimensionData}
                  lang={lang}
                  index={idx}
                  navigate={navigate}
                />
              ))}
            </div>

          </motion.div>
        </div>
      </main>
      
      <Footer lang={lang} />
    </motion.div>
  );
}

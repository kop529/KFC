import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Users, ChevronLeft, ChevronRight, Disc } from 'lucide-react';

const teamsData = [
  {
    id: 'policy',
    number: '01',
    th: { title: 'ทีมนโยบาย', role: 'วางแผนและกำหนดทิศทาง', headRole: 'หัวหน้าทีมนโยบาย', headName: 'รอระบุชื่อ' },
    en: { title: 'Policy Team', role: 'Strategic Planning & Direction', headRole: 'Head of Policy', headName: 'TBA' },
    count: 11,
    color: '#FF6B00',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop&crop=faces&auto=format&q=80', 
  },
  {
    id: 'campaign',
    number: '02',
    th: { title: 'ทีมหาเสียง', role: 'สื่อสารและสร้างการมีส่วนร่วม', headRole: 'หัวหน้าทีมหาเสียง', headName: 'รอระบุชื่อ' },
    en: { title: 'Campaign Team', role: 'Communication & Engagement', headRole: 'Head of Campaign', headName: 'TBA' },
    count: 24,
    color: '#FF6B00',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&h=1000&fit=crop&crop=faces&auto=format&q=80',
  },
  {
    id: 'graphics',
    number: '03',
    th: { title: 'ทีมสื่อกราฟิก', role: 'ออกแบบและสร้างสรรค์ภาพลักษณ์', headRole: 'หัวหน้าทีมสื่อกราฟิก', headName: 'รอระบุชื่อ' },
    en: { title: 'Graphic Media Team', role: 'Visual Design & Branding', headRole: 'Head of Graphics', headName: 'TBA' },
    count: 22,
    color: '#FF6B00',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=1000&fit=crop&crop=faces&auto=format&q=80',
  }
];

export default function MembersSection({ lang }) {
  const [activeIdx, setActiveIdx] = useState(1);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const nextTeam = () => setActiveIdx((prev) => (prev + 1) % teamsData.length);
  const prevTeam = () => setActiveIdx((prev) => (prev - 1 + teamsData.length) % teamsData.length);

  return (
    <section className="bg-[#0B0F17] text-white py-32 lg:py-48 overflow-hidden relative" ref={containerRef}>
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[#FF6B00]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header - Minimalist */}
        <div className="text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="flex items-center justify-center gap-4 mb-6"
          >
            <div className="w-8 h-px bg-[#FF6B00]" />
            <span className="text-[10px] tracking-[0.4em] text-white/40 font-inter uppercase font-bold">
              {lang === 'th' ? 'คณะทำงานหลัก' : 'THE CORE CREW'}
            </span>
            <div className="w-8 h-px bg-[#FF6B00]" />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            className={`text-5xl lg:text-8xl font-black tracking-tighter mb-4 ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}
          >
            {lang === 'th' ? 'ทีมขับเคลื่อน' : 'COVER FLOW'}
          </motion.h2>
        </div>

        {/* Vinyl / Cover Flow Container */}
        <div className="relative h-[500px] lg:h-[650px] flex items-center justify-center perspective-[1500px]">
          
          <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
            {teamsData.map((team, index) => {
              const offset = index - activeIdx;
              const isActive = index === activeIdx;
              
              return (
                <motion.div
                  key={team.id}
                  initial={false}
                  animate={{
                    x: offset * (window.innerWidth < 1024 ? 120 : 280),
                    rotateY: offset * -45,
                    scale: isActive ? 1 : 0.7,
                    z: isActive ? 100 : 0,
                    opacity: Math.abs(offset) > 1 ? 0 : 1,
                  }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => setActiveIdx(index)}
                  className={`absolute w-[300px] lg:w-[450px] h-[400px] lg:h-[550px] cursor-pointer group`}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Vinyl Record - Slides out when active */}
                  <motion.div 
                    className="absolute top-1/2 left-1/2 -translate-y-1/2 w-full aspect-square bg-[#080B12] rounded-full z-0 shadow-2xl border-[10px] border-[#111827] flex items-center justify-center overflow-hidden"
                    animate={{ 
                      x: isActive ? '45%' : '0%',
                      rotate: isActive ? 360 : 0
                    }}
                    transition={{ 
                      x: { duration: 1, ease: [0.16, 1, 0.3, 1] },
                      rotate: { duration: 10, repeat: Infinity, ease: "linear" }
                    }}
                  >
                    {/* Record Grooves */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-radial-gradient(circle at center, transparent, transparent 1px, #fff 1px, #fff 2px)' }} />
                    
                    {/* Record Label (Center) */}
                    <div className="w-1/3 h-1/3 rounded-full bg-[#FF6B00] flex flex-col items-center justify-center text-[#0B0F17] shadow-inner relative z-10">
                      <Disc size={24} className="mb-1" />
                      <span className="text-xl font-black font-inter">{team.count}</span>
                      <span className="text-[8px] font-bold uppercase tracking-widest">{lang === 'th' ? 'คน' : 'MEM'}</span>
                    </div>
                  </motion.div>

                  {/* Album Cover (The Card) */}
                  <div className="relative w-full h-full bg-[#111827] rounded-sm shadow-2xl overflow-hidden border border-white/10 z-10">
                    <img 
                      src={team.image} 
                      className="w-full h-full object-cover transition-all duration-700 grayscale group-hover:grayscale-0"
                      alt=""
                    />
                    
                    {/* Content Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-transparent to-transparent p-8 flex flex-col justify-between">
                      <span className="text-4xl font-black text-white/10 font-mono">
                        {team.number}
                      </span>
                      
                      <div>
                        <h3 className={`text-3xl lg:text-5xl font-black mb-2 transition-colors duration-500 ${isActive ? 'text-[#FF6B00]' : 'text-white'} ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}>
                          {lang === 'th' ? team.th.title : team.en.title}
                        </h3>
                        <p className={`text-sm text-white/50 tracking-wide ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}>
                          {lang === 'th' ? team.th.role : team.en.role}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Detail Panel Reveal - Slides down from bottom of cover */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 10 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute -bottom-24 left-0 right-0 p-6 bg-[#111827]/90 backdrop-blur-xl border border-[#FF6B00]/20 rounded-sm shadow-2xl"
                      >
                         <p className={`text-[10px] text-[#FF6B00] font-black uppercase tracking-[0.2em] mb-1 ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}>
                           {lang === 'th' ? team.th.headRole : team.en.headRole}
                         </p>
                         <p className={`text-xl font-black ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}>
                           {lang === 'th' ? team.th.headName : team.en.headName}
                         </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Controls */}
          <div className="absolute bottom-[-60px] flex items-center gap-8 z-50">
            <button 
              onClick={prevTeam}
              className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-[#0B0F17] transition-all duration-300 group"
            >
              <ChevronLeft size={24} className="group-active:scale-75 transition-transform" />
            </button>
            <div className="flex gap-2">
              {teamsData.map((_, i) => (
                <div 
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${i === activeIdx ? 'w-8 bg-[#FF6B00]' : 'bg-white/20'}`}
                />
              ))}
            </div>
            <button 
              onClick={nextTeam}
              className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-[#0B0F17] transition-all duration-300 group"
            >
              <ChevronRight size={24} className="group-active:scale-75 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

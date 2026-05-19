import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const policies = [
  {
    id: 'economy',
    th: 'พัฒนา\nผู้เรียน',
    en: 'Develop\nStudents',
    detailTh: 'ส่งเสริมการเรียน\nกิจกรรมสร้างสรรค์\nกฎระเบียบเชิงบวก',
    detailEn: 'Promote Learning,\nCreative Activities,\nPositive Discipline.',
    image: 'https://images.unsplash.com/photo-1535401991746-da3d9055713e?w=1200&q=75&auto=format&fit=crop',
    points: "0,0 200,0 100,173",
    textPos: { x: 100, y: 44 },
    detailSide: 'left'
  },
  {
    id: 'security',
    th: 'พัฒนา\nสังคม',
    en: 'Develop\nSociety',
    detailTh: 'สาธารณะประโยชน์\nนโยบายเพื่อชุมชน\nสังคมที่เกื้อกูล',
    detailEn: 'Public Service,\nCommunity Policies,\nSupportive Society.',
    image: 'https://images.unsplash.com/photo-1555848962-6e79363ec18f?w=1200&q=75&auto=format&fit=crop',
    points: "200,0 400,0 300,173",
    textPos: { x: 300, y: 44 },
    detailSide: 'right'
  },
  {
    id: 'quality',
    th: 'พัฒนา\nอนาคต',
    en: 'Develop\nFuture',
    detailTh: 'โรงเรียนสีเขียว\nจัดการทรัพยากร\nเพื่ออนาคตยั่งยืน',
    detailEn: 'Green School,\nResource Management,\nSustainable Future.',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=75&auto=format&fit=crop',
    points: "100,173 300,173 200,346",
    textPos: { x: 200, y: 224 },
    detailSide: 'bottom'
  }
];

const centerTriangle = {
  th: 'นโยบาย\n3 มิติ',
  en: '3 Dimension\nPolicies',
  points: "100,173 300,173 200,0",
  textPos: { x: 200, y: 114 }
};

export default function PoliciesSection({ lang }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);
  const [lastTapped, setLastTapped] = useState(null); // For two-tap mobile UX
  const [isNavigating, setIsNavigating] = useState(false);

  // Preload policy background images exactly once on mount
  useEffect(() => {
    const imgs = policies.map((p) => {
      const img = new Image();
      img.src = p.image;
      return img;
    });
    return () => imgs.forEach(img => { img.src = ''; });
  }, []); // ← empty array = runs once

  const activePolicy = useMemo(() => 
    policies.find(p => p.id === hovered) || policies[0],
    [hovered]
  );

  // 2. Fluidity: Parallax Background
  const { scrollYProgress } = useScroll();
  const rawBgY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
  const rawBgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1]);
  
  const bgY = useSpring(rawBgY, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const bgScale = useSpring(rawBgScale, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const handleInteraction = (id, isClick = false) => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    
    if (isMobile && isClick) {
      if (lastTapped === id) {
        setIsNavigating(true);
        navigate(`/policies/${id}`);
      } else {
        setHovered(id);
        setLastTapped(id);
      }
    } else if (isClick) {
      setIsNavigating(true);
      navigate(`/policies/${id}`);
    } else {
      if (!isNavigating) setHovered(id);
    }
  };

  const handleKeyDown = (e, id) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsNavigating(true);
      navigate(`/policies/${id}`);
    }
  };

  return (
    <section 
      className="relative min-h-[100vh] flex items-center justify-center overflow-hidden bg-[#0B0F17] py-28 lg:py-40" 
      id="policies"
    >
      {/* Immersive Background Transition with Parallax */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            key={hovered}
            layoutId={`policy-bg-${hovered}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{ y: bgY, scale: bgScale }}
            className="absolute inset-0 z-0 origin-center"
          >
            <img 
              src={activePolicy.image} 
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover" 
              alt="" 
            />
            <div className="absolute inset-0 bg-[#0B0F17]/85 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F17] via-transparent to-[#0B0F17]" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        animate={{ 
          y: hovered === 'quality' ? -100 : 0 
        }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center"
      >
        
        {/* Header with tighter Swiss typography */}
        <motion.div 
          animate={{ opacity: (hovered && !isNavigating) ? 0 : 1, y: (hovered && !isNavigating) ? -20 : 0 }}
          className="text-center mb-32"
        >
          <div className={`flex flex-col items-center gap-8 ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}>
            <h2 className="text-white text-5xl lg:text-8xl font-black tracking-tighter uppercase leading-none">
              {lang === 'th' ? 'นโยบาย' : 'Vision'}
            </h2>
            
            <div className="flex flex-col items-center">
              <span className="text-white/30 text-[10px] lg:text-xs font-black tracking-[0.5em] uppercase mb-4">
                CHONCHAI PEOPLE'S
              </span>
              <div className="flex items-center text-[#FF6B00] text-sm lg:text-base font-bold">
                <span className="relative inline-block mr-2">
                  พรรค
                  <span className="absolute inset-x-0 top-[55%] h-[2px] bg-[#FF6B00]" />
                </span>
                <span>ประชาชลชาย</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* The SVG Triangle Grid */}
        <div className="relative w-full max-w-[480px] aspect-[400/346]">
          <svg 
            viewBox="0 0 400 346" 
            className="w-full h-full drop-shadow-2xl"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* 1. STABLE INTERACTION LAYER (Hidden, Does Not Move) */}
            {/* This prevents the "wobble" by keeping the hover targets at fixed coordinates */}
            <g className="opacity-0">
              {policies.map((p) => (
                <polygon
                  key={`hit-${p.id}`}
                  points={p.points}
                  className="cursor-pointer outline-none pointer-events-auto"
                  role="link"
                  tabIndex={0}
                  aria-label={lang === 'th' ? p.th.replace(/\n/g, ' ') : p.en.replace(/\n/g, ' ')}
                  onMouseEnter={() => handleInteraction(p.id)}
                  onMouseLeave={() => { if (!isNavigating) { setHovered(null); setLastTapped(null); } }}
                  onClick={() => handleInteraction(p.id, true)}
                  onKeyDown={(e) => handleKeyDown(e, p.id)}
                />
              ))}
            </g>

            {/* 2. ANIMATED VISUAL LAYER (Moves with Content Lift) */}
            <motion.g
              animate={{ 
                y: hovered === 'quality' ? -80 : 0 
              }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-none"
            >
              {/* Rendering Layer: The Triangles */}
              {policies.map((p) => (
                <motion.polygon
                  key={`poly-${p.id}`}
                  points={p.points}
                  initial={false}
                  animate={{
                    fill: hovered === p.id ? 'rgba(255,255,255,0)' : '#FF6B00',
                    stroke: hovered === p.id ? '#ffffff' : '#0B0F17',
                    strokeWidth: hovered === p.id ? 2 : 4,
                    opacity: hovered && hovered !== p.id ? 0.05 : 1,
                  }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                />
              ))}

              <motion.polygon
                points={centerTriangle.points}
                fill="#FF6B00"
                stroke="#0B0F17"
                strokeWidth="4"
                animate={{ 
                  opacity: hovered ? 0.05 : 1,
                  fill: '#FF6B00'
                }}
                transition={{ duration: 0.4 }}
              />

              {/* Text Layer */}
              <AnimatePresence>
                {!hovered && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {policies.map((p) => (
                      <text
                        key={`label-${p.id}`}
                        x={p.textPos.x}
                        y={p.textPos.y}
                        textAnchor="middle"
                        fill="white"
                        className={`font-black text-[18px] lg:text-[20px] tracking-tighter pointer-events-none ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}
                      >
                        {(lang === 'th' ? p.th : p.en).split('\n').map((line, i) => <tspan key={i} x={p.textPos.x} dy={i === 0 ? 0 : 22}>{line}</tspan>)}
                      </text>
                    ))}
                    <text
                      x={centerTriangle.textPos.x}
                      y={centerTriangle.textPos.y}
                      textAnchor="middle"
                      fill="#111827"
                      className={`font-black pointer-events-none ${
                        lang === 'th' 
                          ? 'font-anakotmai text-[17px] lg:text-[18px]' 
                          : 'font-inter text-[13px] lg:text-[14px] tracking-[0.05em] uppercase'
                      }`}
                    >
                      {(lang === 'th' ? centerTriangle.th : centerTriangle.en).split('\n').map((line, i) => (
                        <tspan 
                          key={i} 
                          x={centerTriangle.textPos.x} 
                          dy={i === 0 ? 0 : (lang === 'th' ? 20 : 16)}
                        >
                          {line}
                        </tspan>
                      ))}
                    </text>
                  </motion.g>
                )}
              </AnimatePresence>

              {/* Active Label */}
              <AnimatePresence>
                {hovered && (
                  <motion.text
                    key={`active-label-${hovered}`}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    x={activePolicy.textPos.x}
                    y={activePolicy.textPos.y}
                    textAnchor="middle"
                    fill="white"
                    className={`font-black text-[18px] lg:text-[20px] tracking-tighter pointer-events-none ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}
                  >
                    {(lang === 'th' ? activePolicy.th : activePolicy.en).split('\n').map((line, i) => <tspan key={i} x={activePolicy.textPos.x} dy={i === 0 ? 0 : 22}>{line}</tspan>)}
                  </motion.text>
                )}
              </AnimatePresence>
            </motion.g>
          </svg>

          {/* 4. Overlay Detail Text - Dynamic Origin Alignment */}
          <AnimatePresence>
            {hovered && (
              <div
                className={`absolute z-20 pointer-events-none flex flex-col
                  left-1/2 -translate-x-1/2 top-[102%] w-[320px] items-center text-center
                  lg:w-[450px]
                  ${activePolicy.detailSide === 'left' 
                    ? 'lg:right-[75%] lg:left-auto lg:top-[25%] lg:-translate-y-1/2 lg:translate-x-0 lg:pr-[140px] lg:items-end lg:text-right' 
                    : ''}
                  ${activePolicy.detailSide === 'right' 
                    ? 'lg:left-[75%] lg:top-[25%] lg:-translate-y-1/2 lg:translate-x-0 lg:pl-[140px] lg:items-start lg:text-left' 
                    : ''}
                  ${activePolicy.detailSide === 'bottom' 
                    ? 'lg:top-[75%] lg:left-[50%] lg:-translate-x-1/2 lg:pt-[130px] lg:items-center lg:text-center' 
                    : ''}
                `}
              >
                <motion.div
                  key={`detail-${hovered}`}
                  initial={{ 
                    opacity: 0, 
                    scale: 0.8,
                    x: activePolicy.detailSide === 'left' ? 80 : activePolicy.detailSide === 'right' ? -80 : 0, 
                    y: activePolicy.detailSide === 'bottom' ? -60 : activePolicy.detailSide === 'left' || activePolicy.detailSide === 'right' ? 0 : 20,
                    filter: 'blur(10px)'
                  }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    x: 0, 
                    y: 0, 
                    filter: 'blur(0px)' 
                  }}
                  exit={{ 
                    opacity: 0, 
                    scale: 0.9,
                    filter: 'blur(10px)', 
                    transition: { duration: 0.3 } 
                  }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className={`flex flex-col w-full
                    ${activePolicy.detailSide === 'left' ? 'lg:origin-right origin-top' : ''}
                    ${activePolicy.detailSide === 'right' ? 'lg:origin-left origin-top' : ''}
                    ${activePolicy.detailSide === 'bottom' ? 'origin-top' : ''}
                  `}
                >
                  <h3 className={`text-white text-xl lg:text-3xl xl:text-4xl font-black leading-[1.2] tracking-tight mb-4 whitespace-pre-line drop-shadow-2xl ${lang === 'th' ? 'font-anakotmai' : 'font-inter uppercase'}`}>
                    {lang === 'th' ? activePolicy.detailTh : activePolicy.detailEn}
                  </h3>

                  {/* Mobile Tap Indicator */}
                  <div className={`lg:hidden mt-4 text-[#FF6B00] text-[10px] font-black tracking-[0.2em] uppercase animate-pulse ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}>
                    {lang === 'th' ? 'แตะอีกครั้งเพื่อสำรวจ' : 'Tap again to explore'}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Hint Text */}
        <motion.div 
          animate={{ opacity: hovered ? 0 : 1 }}
          className="mt-32 flex flex-col items-center gap-6"
        >
          <div className="w-[1px] h-16 bg-gradient-to-b from-[#FF6B00] to-transparent" />
          <span className={`text-white/20 text-[9px] tracking-[0.6em] uppercase font-bold ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}>
            {lang === 'th' ? 'สำรวจมิติต่างๆ' : 'Discover Dimensions'}
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}

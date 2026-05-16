import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const policies = [
  {
    id: 'economy',
    th: 'โมเดล\nเศรษฐกิจ\nใหม่',
    en: 'New\nEconomic\nModel',
    detailTh: 'สร้างเศรษฐกิจใหม่\nสร้างงานคุณภาพ\nสร้างเทคโนโลยีคนไทย',
    detailEn: 'Build New Economy,\nCreate Quality Jobs,\nEmpower Thai Tech.',
    image: 'https://images.unsplash.com/photo-1535401991746-da3d9055713e?w=1920&q=80',
    points: "0,0 200,0 100,173",
    textPos: { x: 100, y: 60 },
    detailSide: 'right'
  },
  {
    id: 'security',
    th: 'ประชาธิปไตย\nความมั่นคง\nใหม่',
    en: 'Democracy\n&\nSecurity',
    detailTh: 'ประชาธิปไตยตั้งมั่น\nกองทัพทันสมัย\nพร้อมรับความมั่นคงใหม่',
    detailEn: 'Firm Democracy,\nModern Military,\nReady for New Security.',
    image: 'https://images.unsplash.com/photo-1555848962-6e79363ec18f?w=1920&q=80',
    points: "200,0 400,0 300,173",
    textPos: { x: 300, y: 60 },
    detailSide: 'left'
  },
  {
    id: 'quality',
    th: 'คุณภาพ\nชีวิต',
    en: 'Quality\nof Life',
    detailTh: 'สวัสดิการดี\nสิ่งแวดล้อมดี\nคนไทยชีวิตดี',
    detailEn: 'Better Welfare, Clean Environment,\nBetter Life for All.',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80',
    points: "100,173 300,173 200,346",
    textPos: { x: 200, y: 240 },
    detailSide: 'top'
  }
];

const centerTriangle = {
  th: 'นโยบาย\n3 มิติ',
  en: '3 Dimension\nPolicies',
  points: "100,173 300,173 200,0",
  textPos: { x: 200, y: 110 }
};

export default function PoliciesSection({ lang }) {
  const [hovered, setHovered] = useState(null);

  const activePolicy = policies.find(p => p.id === hovered);

  return (
    <section 
      className="relative min-h-[100vh] flex items-center justify-center overflow-hidden bg-[#0f172a] pt-48 pb-24" 
      id="policies"
    >
      {/* Immersive Background Transition */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            key={hovered}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 z-0"
          >
            <img 
              src={activePolicy.image} 
              className="w-full h-full object-cover" 
              alt="" 
            />
            <div className="absolute inset-0 bg-[#0f172a]/90 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/50 via-transparent to-[#0f172a]/50" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center">
        
        {/* Subtle Header */}
        <motion.div 
          animate={{ opacity: hovered ? 0 : 1, y: hovered ? -20 : 0 }}
          className="text-center mb-16"
        >
          <div className={`flex flex-col items-center gap-6 ${lang === 'th' ? 'font-kanit' : 'font-inter'}`}>
            <h2 className="text-white text-4xl lg:text-6xl font-black tracking-tighter uppercase leading-none">
              {lang === 'th' ? 'นโยบาย' : 'Our Policies'}
            </h2>
            
            <div className="flex flex-col items-center">
              <span className="text-white/40 text-xs lg:text-sm font-bold tracking-[0.3em] uppercase mb-2">
                CHONCHAI PEOPLE'S
              </span>
              <div className="flex items-center text-[#FF6B00] text-sm lg:text-lg">
                <span className="relative inline-block mr-1">
                  พรรค
                  <span className="absolute inset-x-0 top-[55%] h-[2px] bg-[#FF6B00]" />
                </span>
                <span>ประชาชลชาย</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* The SVG Triangle Grid - Reduced Size */}
        <div className="relative w-full max-w-[400px] aspect-[400/346]">
          <svg 
            viewBox="0 0 400 346" 
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* 1. Rendering Layer: The Triangles */}
            {policies.map((p) => (
              <motion.polygon
                key={`poly-${p.id}`}
                points={p.points}
                initial={false}
                animate={{
                  fill: hovered === p.id ? 'rgba(255,255,255,0)' : '#FF6B00',
                  stroke: hovered === p.id ? '#ffffff' : '#0f172a',
                  strokeWidth: hovered === p.id ? 2 : 4,
                  opacity: hovered && hovered !== p.id ? 0 : 1,
                }}
                transition={{ duration: 0.4 }}
              />
            ))}

            <motion.polygon
              points={centerTriangle.points}
              fill="#FF6B00"
              stroke="#0f172a"
              strokeWidth="4"
              animate={{ opacity: hovered ? 0 : 1 }}
              transition={{ duration: 0.4 }}
            />

            {/* 2. Text Layer: Labels inside triangles */}
            <AnimatePresence>
              {/* Default labels (hidden on hover) */}
              {!hovered && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {policies.map((p) => (
                    <text
                      key={`label-${p.id}`}
                      x={p.textPos.x} y={p.textPos.y}
                      textAnchor="middle"
                      fill="white"
                      className={`font-black text-[14px] pointer-events-none ${lang === 'th' ? 'font-kanit' : 'font-inter'}`}
                    >
                      {(lang === 'th' ? p.th : p.en).split('\n').map((line, i) => <tspan key={i} x={p.textPos.x} dy={i === 0 ? 0 : 16}>{line}</tspan>)}
                    </text>
                  ))}
                  <text
                    x={centerTriangle.textPos.x} y={centerTriangle.textPos.y}
                    textAnchor="middle"
                    fill="#111827"
                    className={`font-black text-[14px] pointer-events-none ${lang === 'th' ? 'font-kanit' : 'font-inter'}`}
                  >
                    {(lang === 'th' ? centerTriangle.th : centerTriangle.en).split('\n').map((line, i) => <tspan key={i} x={centerTriangle.textPos.x} dy={i === 0 ? 0 : 16}>{line}</tspan>)}
                  </text>
                </motion.g>
              )}
            </AnimatePresence>

            {/* Active Label (Stays visible in the outlined triangle) */}
            <AnimatePresence>
              {hovered && (
                <motion.text
                  key={`active-label-${hovered}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  x={activePolicy.textPos.x} y={activePolicy.textPos.y}
                  textAnchor="middle"
                  fill="white"
                  className={`font-black text-[14px] pointer-events-none ${lang === 'th' ? 'font-kanit' : 'font-inter'}`}
                >
                  {(lang === 'th' ? activePolicy.th : activePolicy.en).split('\n').map((line, i) => <tspan key={i} x={activePolicy.textPos.x} dy={i === 0 ? 0 : 16}>{line}</tspan>)}
                </motion.text>
              )}
            </AnimatePresence>

            {/* 3. Interaction Layer: Invisible polygons on top for perfect hit detection */}
            {policies.map((p) => (
              <polygon
                key={`hit-${p.id}`}
                points={p.points}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHovered(p.id)}
                onMouseLeave={() => setHovered(null)}
              />
            ))}
          </svg>

          {/* 4. Overlay Layer: Detail Text that fades in next to the hovered triangle */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                key={`detail-${hovered}`}
                initial={{ opacity: 0, x: activePolicy.detailSide === 'left' ? 30 : activePolicy.detailSide === 'right' ? -30 : 0, y: activePolicy.detailSide === 'top' ? 30 : 0 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0 }}
                className={`absolute z-20 w-[280px] lg:w-[500px] pointer-events-none
                  ${activePolicy.detailSide === 'left' ? 'right-[105%] top-0 lg:top-1/4 text-right' : ''}
                  ${activePolicy.detailSide === 'right' ? 'left-[105%] top-0 lg:top-1/4 text-left' : ''}
                  ${activePolicy.detailSide === 'top' ? 'bottom-[105%] left-1/2 -translate-x-1/2 text-center' : ''}
                `}
              >
                <h3 className={`text-white text-3xl lg:text-6xl font-black leading-tight tracking-tighter mb-4 ${lang === 'th' ? 'font-kanit' : 'font-inter'}`}>
                  {lang === 'th' ? activePolicy.detailTh : activePolicy.detailEn}
                </h3>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: 60 }}
                  className="h-1.5 bg-[#FF6B00] inline-block" 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Hint Text */}
        <motion.div 
          animate={{ opacity: hovered ? 0 : 1 }}
          className="mt-16 flex flex-col items-center gap-2"
        >
          <div className="w-px h-12 bg-gradient-to-b from-[#FF6B00] to-transparent" />
          <span className="text-white/20 text-[10px] tracking-[0.4em] font-inter uppercase">Hover to Explore</span>
        </motion.div>
      </div>
    </section>
  );
}

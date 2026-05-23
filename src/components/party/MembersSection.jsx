import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ipodImage from '@/assets/ipod.jpg';

const teamsData = [
  {
    id: 'policy',
    number: '01',
    th: { title: 'ทีมนโยบาย', role: 'วางแผนและกำหนดทิศทาง', headRole: 'หัวหน้าทีมนโยบาย', headName: 'รอระบุชื่อ' },
    en: { title: 'Policy Team', role: 'Strategic Planning & Direction', headRole: 'Head of Policy', headName: 'TBA' },
    count: 11,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop&crop=faces&auto=format&q=80',
  },
  {
    id: 'campaign',
    number: '02',
    th: { title: 'ทีมหาเสียง', role: 'สื่อสารและสร้างการมีส่วนร่วม', headRole: 'หัวหน้าทีมหาเสียง', headName: 'รอระบุชื่อ' },
    en: { title: 'Campaign Team', role: 'Communication & Engagement', headRole: 'Head of Campaign', headName: 'TBA' },
    count: 24,
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&h=800&fit=crop&crop=faces&auto=format&q=80',
  },
  {
    id: 'graphics',
    number: '03',
    th: { title: 'ทีมสื่อกราฟิก', role: 'ออกแบบและสร้างสรรค์ภาพลักษณ์', headRole: 'หัวหน้าทีมสื่อกราฟิก', headName: 'รอระบุชื่อ' },
    en: { title: 'Graphic Media Team', role: 'Visual Design & Branding', headRole: 'Head of Graphics', headName: 'TBA' },
    count: 22,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=800&fit=crop&crop=faces&auto=format&q=80',
  }
];

const TUTORIAL_STEPS = {
  th: [
    {
      title: 'Tutorial',
      desc: 'ย้อนวันวานสู่ยุคคลาสสิกด้วยระบบจำลองปุ่มคลิกวีลเพื่อนำทางและค้นหาสมาชิกพรรคสภานักเรียน ใช้เวลา 1 นาทีสั้นๆ เพื่อเรียนรู้การใช้งาน',
      actionLabel: 'เริ่ม',
    },
    {
      title: 'หมุนวงล้อเพื่อนำทาง',
      desc: 'ใช้เมาส์สกรอลล์ (Scroll Wheel) ขึ้น-ลง หรือหมุนลากนิ้วเป็นวงกลมบนวงล้อ เพื่อเลื่อนสลับแสดงผลอัลบั้มทีมต่าง ๆ บนหน้าจอ',
      actionLabel: 'ถัดไป',
    },
    {
      title: 'คลิกด้านข้างของวงล้อ',
      desc: 'คุณสามารถคลิกที่ปุ่มบริเวณ "ฝั่งซ้าย" หรือ "ฝั่งขวา" ของวงล้อเพื่อกระโดดย้อนกลับหรือข้ามอัลบั้มทีมถัดไปทีละอัน',
      actionLabel: 'ถัดไป',
    },
    {
      title: 'ปุ่มตรงกลางเพื่อเลือก',
      desc: 'เมื่อเจอทีมสมาชิกที่อยากเข้าชม ให้คลิกที่ "ปุ่มวงกลมตรงกลาง" เพื่อนำทางเข้าไปสู่หน้าข้อมูลและรายชื่อของสมาชิกในทีมทั้งหมดโดยละเอียด',
      actionLabel: 'เข้าใจแล้ว!',
    }
  ],
  en: [
    {
      title: 'Tutorial',
      desc: 'Travel back in time to the classic era with a fully functional click-wheel iPod simulator. Let\'s take a quick 1-minute tour to learn how to navigate.',
      actionLabel: 'Start',
    },
    {
      title: 'Rotate to Navigate',
      desc: 'Scroll your mouse wheel up/down or trace a circle on the click wheel to spin and navigate through the cover flow albums on the screen.',
      actionLabel: 'Next',
    },
    {
      title: 'Click the Sides',
      desc: 'Click on the "Left" or "Right" quadrants of the click wheel to step backward or forward through the teams one by one.',
      actionLabel: 'Next',
    },
    {
      title: 'Center Select Button',
      desc: 'When you find a team you want to explore, click the circular "Center Button" to enter and load its complete list of members instantly.',
      actionLabel: 'Got It!',
    }
  ]
};

export default function MembersSection({ lang }) {
  const navigate = useNavigate();
  const [activeIdx, setActiveIdx] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  const clickWheelRef = useRef(null);
  const scrollTimeout = useRef(null);
  const touchStartX = useRef(null);

  // Precise static positioning constants (calibrated coordinates)
  const SCREEN_POS = { top: 15.9, left: 20.5, width: 54.5, height: 29 };
  const WHEEL_POS = { top: 51.7, left: 26.7, width: 42.6, height: 29.5 };

  const [tutorialStep, setTutorialStep] = useState(null); // null = off, 0 = Welcome, 1 = Scroll, 2 = Click Sides, 3 = Center Select

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); // Check on mount
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const nextTeam = () => setActiveIdx((prev) => Math.min(prev + 1, teamsData.length - 1));
  const prevTeam = () => setActiveIdx((prev) => Math.max(prev - 1, 0));

  useEffect(() => {
    const el = clickWheelRef.current;
    if (!el) return;

    const onWheel = (e) => {
      // Prevent default page scroll behavior
      e.preventDefault();

      if (scrollTimeout.current) return;

      if (e.deltaY > 0) {
        nextTeam();
      } else if (e.deltaY < 0) {
        prevTeam();
      }

      scrollTimeout.current = setTimeout(() => {
        scrollTimeout.current = null;
      }, 400); // 400ms delay between scroll triggers
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
    };
  }, []);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const swipeThreshold = 50; // px
    if (diffX > swipeThreshold) {
      nextTeam();
    } else if (diffX < -swipeThreshold) {
      prevTeam();
    }
    touchStartX.current = null;
  };

  // Apple iTunes Cover Flow — authentic 75° tuck physics
  const getTransform = (offset) => {
    // Side cards rotate ~75° making them nearly paper-thin, tucked tight to center
    const sideRotation = 75;
    // baseSpacing: how far each additional stacked card moves
    const baseSpacing = 22; // tight stacking
    // activeGap: distance between center card and nearest side card edge
    const activeGap = 52;

    if (offset === 0) {
      return { x: '0%', rotateY: 0, scale: 1, z: 50, opacity: 1, filter: 'brightness(1)' };
    } else if (offset < 0) {
      // Left side: rotated away, tucked close
      return {
        x: `${(offset * baseSpacing) - activeGap}%`,
        rotateY: sideRotation,
        scale: 1,
        z: -Math.abs(offset) * 5,
        opacity: 1,
        filter: 'brightness(0.45)',
      };
    } else {
      // Right side: mirror
      return {
        x: `${(offset * baseSpacing) + activeGap}%`,
        rotateY: -sideRotation,
        scale: 1,
        z: -Math.abs(offset) * 5,
        opacity: 1,
        filter: 'brightness(0.45)',
      };
    }
  };

  const activeTeam = teamsData[activeIdx];

  const titleContent = (
    <div className="text-center mb-10 md:mb-16 z-50 mt-10 md:mt-0">
      <h2 className={`text-4xl md:text-5xl font-black mb-2 tracking-tighter`} style={{ fontFamily: lang === 'th' ? "'anakotmai', sans-serif" : "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
        {lang === 'th' ? 'สมาชิกทีม' : 'THE CORE CREW'}
      </h2>
    </div>
  );

  const tutorialToggle = (
    <button 
      onClick={() => setTutorialStep(tutorialStep !== null ? null : 0)}
      className="absolute top-6 right-6 md:top-8 md:right-8 z-50 text-[11px] font-bold text-black/35 hover:text-black/75 transition-all focus:outline-none flex items-center gap-1 cursor-pointer"
      style={{ fontFamily: lang === 'th' ? "'anakotmai', sans-serif" : "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
    >
      <span className="underline underline-offset-2 decoration-black/10 hover:decoration-black/45">
        {lang === 'th' ? 'วิธีใช้งาน?' : "Don't know how to use?"}
      </span>
      <span className={`inline-block text-[8px] transition-transform duration-300 ${tutorialStep !== null ? 'rotate-180 text-[#FF6B00]' : 'text-black/20'}`}>
        ▼
      </span>
    </button>
  );

  const iPodContent = (
    <>
      {/* Interactive Step-by-Step Tutorial overlay anchored absolutely */}
        <AnimatePresence>
          {tutorialStep !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, x: -20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="absolute z-50 flex flex-col gap-4 p-6 bg-white/95 backdrop-blur-md rounded-2xl border border-black/10 shadow-2xl
                lg:left-[105%] lg:right-auto lg:top-1/2 lg:bottom-auto lg:-translate-y-1/2 lg:mx-0 lg:w-[260px] lg:text-left
                bottom-[-330px] left-0 right-0 mx-auto w-[92%] sm:w-[340px] text-center"
            >
              {/* Skip Button */}
              <button
                onClick={() => setTutorialStep(null)}
                className="absolute top-3 right-3 text-black/30 hover:text-black/70 transition-colors cursor-pointer"
                title={lang === 'th' ? 'ข้ามทัวร์' : 'Skip Tour'}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="w-full">
                <span className={`text-[10px] font-black text-black/30 uppercase ${lang === 'th' ? 'font-anakotmai' : 'tracking-[0.25em] font-inter'}`}>
                  {lang === 'th' 
                    ? `การแนะนำขั้นตอนที่ ${tutorialStep + 1}/4` 
                    : `Tutorial Step ${tutorialStep + 1}/4`}
                </span>
                <div className="w-8 h-[1.5px] bg-[#FF6B00] mt-1.5 mx-auto lg:ml-0 lg:mr-auto rounded-full" />
              </div>

              {/* Step Content */}
              <div>
                <h4 className="text-[14px] font-black tracking-tight text-black flex items-center justify-center lg:justify-start gap-1.5" style={{ fontFamily: lang === 'th' ? "'anakotmai', sans-serif" : "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                  <span>{TUTORIAL_STEPS[lang === 'th' ? 'th' : 'en'][tutorialStep].title}</span>
                </h4>
                <p className="text-[11px] text-black/60 mt-1.5 leading-relaxed font-medium" style={{ fontFamily: lang === 'th' ? "'anakotmai', sans-serif" : "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                  {TUTORIAL_STEPS[lang === 'th' ? 'th' : 'en'][tutorialStep].desc}
                </p>
              </div>

              {/* Step mini representation inside card (visual aid) */}
              <div className="flex justify-center my-1">
                {tutorialStep === 1 && (
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FF6B00]/10 text-[#FF6B00] animate-bounce">
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                  </div>
                )}
                {tutorialStep === 2 && (
                  <div className="flex items-center justify-center gap-3 text-[#FF6B00] font-bold text-sm">
                    <span className="animate-[pulse_1s_infinite]">◀</span>
                    <div className="w-8 h-1 bg-black/10 rounded" />
                    <span className="animate-[pulse_1s_infinite_0.5s]">▶</span>
                  </div>
                )}
                {tutorialStep === 3 && (
                  <div className="relative flex items-center justify-center w-8 h-8 rounded-full border border-black/10 bg-white shadow-sm">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#FF6B00] animate-ping absolute" />
                    <div className="w-3.5 h-3.5 rounded-full bg-[#FF6B00]" />
                  </div>
                )}
              </div>

              {/* Navigation Indicators & Buttons */}
              <div className="flex items-center justify-between mt-1 pt-3 border-t border-black/5">
                {/* Back Button */}
                {tutorialStep > 0 ? (
                  <button
                    onClick={() => setTutorialStep((prev) => prev - 1)}
                    className="text-xs font-bold text-black/40 hover:text-black/70 transition-colors cursor-pointer select-none"
                    style={{ fontFamily: lang === 'th' ? "'anakotmai', sans-serif" : "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
                  >
                    {lang === 'th' ? 'ย้อนกลับ' : 'Back'}
                  </button>
                ) : (
                  <button
                    onClick={() => setTutorialStep(null)}
                    className="text-xs font-bold text-black/30 hover:text-black/50 transition-colors cursor-pointer select-none"
                    style={{ fontFamily: lang === 'th' ? "'anakotmai', sans-serif" : "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
                  >
                    {lang === 'th' ? 'ปิด' : 'Close'}
                  </button>
                )}

                {/* Step indicators */}
                <div className="flex gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      onClick={() => setTutorialStep(i)}
                      className={`w-1.5 h-1.5 rounded-full cursor-pointer transition-all ${i === tutorialStep ? 'bg-[#FF6B00] scale-125' : 'bg-black/20 hover:bg-black/35'}`}
                    />
                  ))}
                </div>

                {/* Next / Got It Button */}
                <button
                  onClick={() => {
                    if (tutorialStep < 3) {
                      setTutorialStep((prev) => prev + 1);
                    } else {
                      setTutorialStep(null);
                    }
                  }}
                  className="bg-[#FF6B00] hover:bg-[#ea580c] text-white font-bold text-[11px] px-3.5 py-1.5 rounded-lg shadow-sm shadow-[#FF6B00]/25 transition-transform active:scale-95 cursor-pointer select-none"
                  style={{ fontFamily: lang === 'th' ? "'anakotmai', sans-serif" : "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
                >
                  {TUTORIAL_STEPS[lang === 'th' ? 'th' : 'en'][tutorialStep].actionLabel}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <img
          src={ipodImage}
          alt="iPod Device"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none mix-blend-multiply"
        />

        {/* ── Pulse Overlays for Tutorial Steps ── */}
        {tutorialStep === 1 && (
          <div
            className="absolute rounded-full pointer-events-none z-30 flex items-center justify-center"
            style={{
              top: `${WHEEL_POS.top}%`,
              left: `${WHEEL_POS.left}%`,
              width: `${WHEEL_POS.width}%`,
              height: `${WHEEL_POS.height}%`,
            }}
          >
            {/* Pulsing glow ring */}
            <div className="absolute inset-0 rounded-full border-[3px] border-[#FF6B00] animate-[pulse_1.8s_infinite] shadow-[0_0_20px_rgba(255,107,0,0.6)] pointer-events-none" />
            
            {/* Spinning trace gesture arrow */}
            <svg className="w-[110%] h-[110%] animate-[spin_3.5s_linear_infinite] opacity-80" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="#FF6B00"
                strokeWidth="3.5"
                strokeDasharray="40 140"
                strokeLinecap="round"
              />
              <path
                d="M 86 42 L 95 48 L 89 36"
                fill="none"
                stroke="#FF6B00"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}

        {tutorialStep === 2 && (
          <>
            {/* Left Quadrant Highlight */}
            <div
              className="absolute pointer-events-none z-30 flex items-center justify-center"
              style={{
                top: `${WHEEL_POS.top}%`,
                left: `${WHEEL_POS.left}%`,
                width: `${WHEEL_POS.width / 2}%`,
                height: `${WHEEL_POS.height}%`,
              }}
            >
              <div className="absolute inset-2 border-2 border-dashed border-[#FF6B00] bg-[#FF6B00]/10 rounded-l-full animate-[pulse_1.5s_infinite] shadow-[inset_0_0_15px_rgba(255,107,0,0.3)]" />
              <span className="text-[#FF6B00] text-3xl font-black animate-[ping_1.5s_infinite] pointer-events-none select-none">◀</span>
            </div>
            {/* Right Quadrant Highlight */}
            <div
              className="absolute pointer-events-none z-30 flex items-center justify-center"
              style={{
                top: `${WHEEL_POS.top}%`,
                left: `${WHEEL_POS.left + WHEEL_POS.width / 2}%`,
                width: `${WHEEL_POS.width / 2}%`,
                height: `${WHEEL_POS.height}%`,
              }}
            >
              <div className="absolute inset-2 border-2 border-dashed border-[#FF6B00] bg-[#FF6B00]/10 rounded-r-full animate-[pulse_1.5s_infinite] shadow-[inset_0_0_15px_rgba(255,107,0,0.3)]" />
              <span className="text-[#FF6B00] text-3xl font-black animate-[ping_1.5s_infinite] pointer-events-none select-none">▶</span>
            </div>
          </>
        )}

        {tutorialStep === 3 && (
          <div
            className="absolute rounded-full pointer-events-none z-30 flex items-center justify-center"
            style={{
              top: `${WHEEL_POS.top + WHEEL_POS.height / 3}%`,
              left: `${WHEEL_POS.left + WHEEL_POS.width / 3}%`,
              width: `${WHEEL_POS.width / 3}%`,
              height: `${WHEEL_POS.height / 3}%`,
            }}
          >
            {/* Pulsing ring overlay around the center select button */}
            <div className="absolute inset-0 rounded-full border-[3px] border-[#FF6B00] animate-[ping_1.2s_infinite] shadow-[0_0_20px_rgba(255,107,0,0.8)] pointer-events-none" />
            <div className="absolute inset-0 rounded-full border-[3px] border-[#FF6B00] bg-[#FF6B00]/25 pointer-events-none" />
          </div>
        )}

        {/* 1. SCREEN ZONE — Apple iTunes Cover Flow replica */}
        <div
          className="absolute flex flex-col overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{
            top: `${SCREEN_POS.top}%`,
            left: `${SCREEN_POS.left}%`,
            width: `${SCREEN_POS.width}%`,
            height: `${SCREEN_POS.height}%`,
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            background: 'linear-gradient(180deg, #c8c8c8 0%, #d6d6d6 30%, #e2e2e2 60%, #d0d0d0 100%)',
            borderRadius: '2px',
          }}
        >
          {/* ── Silver title bar (matches iTunes Cover Flow top strip) ── */}
          <div style={{
            flexShrink: 0,
            height: '9%',
            background: 'linear-gradient(180deg, #e8e8e8 0%, #d2d2d2 50%, #c4c4c4 51%, #d8d8d8 100%)',
            borderBottom: '1px solid #a0a0a0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: isMobile ? '3.9cqw' : '14px',
            paddingRight: isMobile ? '2.8cqw' : '10px',
            boxShadow: '0 1px 0 rgba(255,255,255,0.55) inset',
          }}>
            <span style={{
              fontSize: isMobile ? '3.3cqw' : 'clamp(5px, 1.4vw, 12px)',
              fontWeight: 700,
              color: '#1a1a1a',
              letterSpacing: '-0.015em',
              textShadow: '0 1px 0 rgba(255,255,255,0.8)',
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            }}>
              Cover Flow
            </span>

            {/* ── Classic iPod Battery Indicator ── */}
            <svg
              viewBox="0 0 28 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                width: isMobile ? '6.6cqw' : 'clamp(14px, 3.2vw, 24px)',
                height: 'auto',
                flexShrink: 0,
                filter: 'drop-shadow(0 1px 0 rgba(255,255,255,0.6))',
              }}
            >
              {/* Battery body outline */}
              <rect x="0.5" y="0.5" width="23" height="12" rx="2" ry="2"
                stroke="#555" strokeWidth="1.2" fill="none" />
              {/* Battery nub (positive terminal) */}
              <rect x="24.2" y="3.5" width="2.8" height="5.5" rx="1" ry="1"
                fill="#777" />
              {/* Green fill — full charge */}
              <rect x="2" y="2" width="20" height="9" rx="1" ry="1"
                fill="url(#batteryGreen)" />
              {/* Glossy highlight on top half */}
              <rect x="2" y="2" width="20" height="4.5" rx="1" ry="0"
                fill="rgba(255,255,255,0.35)" />
              <defs>
                <linearGradient id="batteryGreen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7ed321" />
                  <stop offset="50%" stopColor="#5cb818" />
                  <stop offset="100%" stopColor="#4aa012" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* ── Cover Flow Stage — silver gradient floor, full-width 3D perspective ── */}
          <div style={{
            flex: '1 1 0',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            // Same silver-grey background as reference; albums float above it
            background: 'linear-gradient(180deg, #c0c0c0 0%, #d5d5d5 50%, #c8c8c8 100%)',
            perspective: '500px',
            perspectiveOrigin: '50% 45%',
            overflow: 'hidden',
          }}>
            {/* Subtle radial vignette to match iTunes depth effect */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(ellipse 90% 70% at 50% 60%, transparent 30%, rgba(0,0,0,0.22) 100%)',
              pointerEvents: 'none', zIndex: 1,
            }} />

            {teamsData.map((team, index) => {
              const offset = index - activeIdx;
              const isActive = offset === 0;
              return (
                <motion.div
                  key={team.id}
                  initial={false}
                  animate={getTransform(offset)}
                  transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
                  onClick={offset < 0 ? prevTeam : offset > 0 ? nextTeam : undefined}
                  style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    // Card occupies ~48% of screen width when centered
                    width: '48%',
                    aspectRatio: '1',
                    transformStyle: 'preserve-3d',
                    zIndex: isActive ? 10 : 5 - Math.abs(offset),
                    // Mirror reflection fades into the silver floor
                    WebkitBoxReflect: 'below 1px linear-gradient(to bottom, transparent 0%, transparent 35%, rgba(0,0,0,0.3) 100%)',
                  }}
                >
                  {/* Card face */}
                  <div style={{
                    width: '100%', height: '100%',
                    overflow: 'hidden',
                    boxShadow: isActive
                      ? '0 8px 30px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.25)'
                      : '0 3px 10px rgba(0,0,0,0.35)',
                    position: 'relative',
                  }}>
                    <img
                      src={team.image}
                      alt={team.en.title}
                      draggable="false"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                    {/* Gloss sheen on top half */}
                    <div style={{
                      position: 'absolute', top: 0, left: 0, width: '100%', height: '50%',
                      background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%)',
                      pointerEvents: 'none', zIndex: 2,
                    }} />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* ── Track Info (iTunes style: bold title + grey artist, Helvetica) ── */}
          <div style={{
            flexShrink: 0,
            background: 'linear-gradient(180deg, #e0e0e0 0%, #ececec 100%)',
            borderTop: '1px solid #afafaf',
            padding: '3% 8% 4%',
            textAlign: 'center',
            boxShadow: '0 -1px 0 rgba(255,255,255,0.6) inset',
          }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <div style={{
                  fontSize: isMobile ? '3.9cqw' : 'clamp(6px, 1.7vw, 14px)',
                  fontWeight: 700,
                  color: '#111',
                  letterSpacing: '-0.02em',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  lineHeight: 1.3,
                }}>
                  {lang === 'th' ? activeTeam.th.title : activeTeam.en.title}
                </div>
                <div style={{
                  fontSize: isMobile ? '3.1cqw' : 'clamp(5px, 1.3vw, 11px)',
                  fontWeight: 400,
                  color: '#444',
                  letterSpacing: '-0.01em',
                  marginTop: '1px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                }}>
                  {lang === 'th' ? activeTeam.th.role : activeTeam.en.role}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* 2. CLICK WHEEL ZONE */}
        <div
          ref={clickWheelRef}
          className="absolute rounded-full cursor-pointer group"
          style={{
            top: `${WHEEL_POS.top}%`,
            left: `${WHEEL_POS.left}%`,
            width: `${WHEEL_POS.width}%`,
            height: `${WHEEL_POS.height}%`,
          }}
        >
          {/* Left / Prev Quadrant */}
          <div
            onClick={prevTeam}
            className="absolute top-0 left-0 w-1/2 h-full rounded-l-full z-10"
            title="Previous"
          />
          {/* Right / Next Quadrant */}
          <div
            onClick={nextTeam}
            className="absolute top-0 right-0 w-1/2 h-full rounded-r-full z-10"
            title="Next"
          />
          {/* Center / Enter Button */}
          <div
            onClick={() => navigate(`/team/${activeTeam.id}`)}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 rounded-full z-20"
            title="Select Team"
          />

        </div>

    </>
  );

  // ─── MOBILE VIEW TRACK ───
  if (isMobile) {
    return (
      <section className="bg-white text-[#111827] py-16 min-h-[100dvh] w-full flex flex-col items-center justify-start relative overflow-hidden overflow-x-hidden">
        {tutorialToggle}
        {titleContent}
        <div className="w-full flex justify-center pb-24">
          <div className="relative w-[92vw] max-w-[480px] aspect-[7/10] select-none origin-top" style={{ containerType: 'inline-size' }}>
            {iPodContent}
          </div>
        </div>
      </section>
    );
  }

  // ─── DESKTOP VIEW TRACK ───
  return (
    <section className="bg-white text-[#111827] py-24 min-h-[100dvh] flex flex-col items-center justify-center relative overflow-hidden">
      {tutorialToggle}
      {titleContent}
      <div className="relative w-[660px] aspect-[7/10] mx-auto select-none">
        {iPodContent}
      </div>
    </section>
  );
}
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X, MapPin, MessageSquarePlus, CheckCircle2 } from 'lucide-react';
import { ZONES } from './zones.config';

/* ─── Bilingual copy ─── */
const COPY = {
  th: {
    skip: 'ข้าม',
    step0: {
      tag: 'เเจ้งปัญหาโรงเรียน',
      headline: 'แจ้งปัญหาในโรงเรียนได้ที่นี่',
      body: 'คลิกพื้นที่บนแผนที่เพื่อดูความคิดเห็นจากเพื่อน ๆ และส่งปัญหาที่คุณพบโดยไม่ระบุตัวตน',
      cta: 'เริ่มเลย',
    },
    step1: {
      label: 'ลองคลิกที่พื้นที่ที่กะพริบ',
    },
    step2: {
      label: 'กดปุ่มนี้เพื่อแจ้งปัญหา',
    },
    step3: {
      label: 'พิมพ์รายละเอียดแล้วกดส่ง',
    },
    step4: {
      label: 'พร้อมใช้งานแล้ว! เริ่มรายงานปัญหาในโรงเรียนได้เลย',
    },
  },
  en: {
    skip: 'Skip',
    step0: {
      tag: 'Problem Report Map',
      headline: 'Report school issues right here',
      body: 'Click any area on the map to view peer feedback and anonymously submit problems you\'ve spotted.',
      cta: 'Get started',
    },
    step1: {
      label: 'Try clicking the flashing area',
    },
    step2: {
      label: 'Press this button to report an issue',
    },
    step3: {
      label: 'Type the details and press submit',
    },
    step4: {
      label: 'Finished. Start reporting school issues now!',
    },
  },
};

/* ─── Helper: compute polygon centroid from a "x,y x,y …" string ─── */
function getPolygonCentroid(pointsStr) {
  const coords = pointsStr.trim().split(/\s+/).map(p => p.split(',').map(Number));
  const n = coords.length;
  if (n === 0) return { cx: 0.5, cy: 0.5 };
  const sum = coords.reduce((acc, [x, y]) => ({ x: acc.x + x, y: acc.y + y }), { x: 0, y: 0 });
  // Return as fraction of the SVG viewBox (1024 × 768)
  return { cx: sum.x / n / 1024, cy: sum.y / n / 768 };
}

/* ─── Step 0 — Welcome card ─── */
function WelcomeStep({ lang, onNext, onSkip }) {
  const c = COPY[lang].step0;
  const skip = COPY[lang].skip;

  return (
    <motion.div
      className="absolute inset-0 z-40 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Soft backdrop — doesn't fully block map */}
      <div className="absolute inset-0 bg-[#0B0F17]/70 backdrop-blur-[2px]" />

      <motion.div
        className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl shadow-black/60"
        initial={{ y: 40, scale: 0.95, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: -20, scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
      >
        {/* Gradient header */}
        <div className="bg-gradient-to-br from-[#FF6B00] to-[#ea580c] px-6 pt-6 pb-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
              <MapPin size={14} className="text-white" />
            </div>
            <span className="text-white/80 text-xs font-anakotmai tracking-wider uppercase">
              {c.tag}
            </span>
          </div>
          <h2 className="text-white font-anakotmai font-black text-2xl leading-tight">
            {c.headline}
          </h2>
        </div>

        {/* Body */}
        <div className="bg-[#111827] px-6 py-5">
          <p className="text-white/70 font-anakotmai text-sm leading-relaxed mb-6">
            {c.body}
          </p>

          {/* Step dots — 3 interactive steps after this welcome card */}
          <div className="flex items-center gap-1.5 mb-6">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${i === 0 ? 'w-6 bg-[#FF6B00]' : 'w-2 bg-white/20'}`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={onSkip}
              className="text-white/40 hover:text-white/70 text-sm font-anakotmai transition-colors"
            >
              {skip}
            </button>
            <motion.button
              onClick={onNext}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 bg-[#FF6B00] hover:bg-[#ea580c] text-white px-5 py-2.5 rounded-xl font-anakotmai font-bold text-sm transition-colors shadow-lg shadow-[#FF6B00]/30"
            >
              {c.cta} <ChevronRight size={16} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Step 1 — Pulsing zone highlight ─── */
function ZoneHighlightStep({ lang, demoZoneId, onNext, onSkip, onZoneSelect }) {
  const c = COPY[lang].step1;
  const skip = COPY[lang].skip;

  const zone = ZONES.find(z => z.id === demoZoneId);
  const { cx, cy } = zone ? getPolygonCentroid(zone.points) : { cx: 0.5, cy: 0.5 };

  /* Auto-advance if user doesn't click within 6 s */
  useEffect(() => {
    const timer = setTimeout(() => {
      onZoneSelect(demoZoneId);
      onNext();
    }, 5000);
    return () => clearTimeout(timer);
  }, [demoZoneId, onNext, onZoneSelect]);

  /* Manual click on pulse ring also advances */
  const handleClick = () => {
    onZoneSelect(demoZoneId);
    onNext();
  };

  return (
    <motion.div
      className="absolute inset-0 z-40 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Pulsing ring — positioned at zone centroid */}
      <div
        className="absolute pointer-events-auto cursor-pointer"
        style={{
          left: `${cx * 100}%`,
          top: `${cy * 100}%`,
          transform: 'translate(-50%, -50%)',
        }}
        onClick={handleClick}
      >
        {/* Outer expanding rings */}
        <div className="absolute inset-0 rounded-full bg-[#FF6B00]/30 animate-[ping_1.2s_cubic-bezier(0,0,0.2,1)_infinite]"
          style={{ width: 72, height: 72, marginLeft: -36, marginTop: -36 }} />
        <div className="absolute inset-0 rounded-full bg-[#FF6B00]/20 animate-[ping_1.2s_cubic-bezier(0,0,0.2,1)_0.4s_infinite]"
          style={{ width: 88, height: 88, marginLeft: -44, marginTop: -44 }} />
        {/* Center dot */}
        <div className="w-8 h-8 rounded-full bg-[#FF6B00] border-2 border-white shadow-lg shadow-[#FF6B00]/60 flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
          <MapPin size={14} className="text-white" />
        </div>
      </div>

      {/* Tooltip chip */}
      <div
        className="absolute pointer-events-auto"
        style={{
          left: `${cx * 100}%`,
          top: `${cy * 100}%`,
          transform: 'translate(-50%, calc(-100% - 52px))',
        }}
      >
        <motion.div
          className="bg-[#111827] border border-white/20 text-white text-xs font-anakotmai px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap"
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          {c.label}
        </motion.div>
        {/* Arrow down */}
        <div className="flex justify-center mt-1">
          <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#111827]" />
        </div>
      </div>

      {/* Skip button */}
      <button
        onClick={onSkip}
        className="pointer-events-auto absolute top-4 right-6 flex items-center gap-1.5 text-white/50 hover:text-white text-xs font-anakotmai transition-colors bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full"
      >
        <X size={12} /> {skip}
      </button>
    </motion.div>
  );
}

/* ─── Step 2 — Panel pointer ─── */
function PanelPointerStep({ lang, onNext, onSkip, isZoneModalOpen }) {
  const c = COPY[lang].step2;
  const skip = COPY[lang].skip;
  const btnRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  /* Locate the feedback button by its data attribute.
     The ZoneDetailPanel slides in with a ~500ms animation, so the button
     may not be in the DOM on first render. We retry every 200ms. */
  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 15; // 15 × 200ms = 3s max wait
    let intervalId;

    const locate = () => {
      const btn = document.querySelector('[data-tutorial="feedback-btn"]');
      if (btn) {
        const rect = btn.getBoundingClientRect();
        setPos({ top: rect.top + rect.height / 2, right: window.innerWidth - rect.left + 12 });
        if (intervalId) clearInterval(intervalId);
        return true;
      }
      return false;
    };

    // Try immediately, then poll
    if (!locate()) {
      intervalId = setInterval(() => {
        attempts++;
        if (locate() || attempts >= maxAttempts) {
          clearInterval(intervalId);
        }
      }, 200);
    }

    // Also reposition on resize
    window.addEventListener('resize', locate);
    return () => {
      if (intervalId) clearInterval(intervalId);
      window.removeEventListener('resize', locate);
    };
  }, []);

  /* Advance when the user opens the modal */
  useEffect(() => {
    if (isZoneModalOpen) {
      onNext();
    }
  }, [isZoneModalOpen, onNext]);

  return (
    <motion.div
      className="fixed inset-0 z-50 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Animated arrow pointing to the button */}
      <motion.div
        className="absolute"
        style={{ top: pos.top - 18, right: pos.right, pointerEvents: 'none' }}
        animate={{ x: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
      >
        <div className="flex items-center gap-2 bg-[#111827] border border-[#FF6B00]/60 text-white text-xs font-anakotmai px-3 py-2 rounded-xl shadow-xl whitespace-nowrap">
          {c.label}
          <ChevronRight size={14} className="text-[#FF6B00]" />
        </div>
      </motion.div>

      {/* Skip */}
      <button
        onClick={onSkip}
        className="pointer-events-auto fixed top-4 right-6 flex items-center gap-1.5 text-white/50 hover:text-white text-xs font-anakotmai transition-colors bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full"
      >
        <X size={12} /> {skip}
      </button>
    </motion.div>
  );
}

/* ─── Step 3 — Modal pointer ─── */
function ModalPointerStep({ lang, onNext, onSkip, isZoneModalOpen }) {
  const c = COPY[lang].step3;
  const skip = COPY[lang].skip;
  const [pos, setPos] = useState({ top: 0, left: 0 });

  /* Locate the textarea inside the modal */
  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 15;
    let intervalId;

    const locate = () => {
      const el = document.querySelector('[data-tutorial="feedback-textarea"]');
      if (el) {
        const rect = el.getBoundingClientRect();
        // Position to the left of the textarea
        setPos({ top: rect.top + 30, right: window.innerWidth - rect.left + 12 });
        if (intervalId) clearInterval(intervalId);
        return true;
      }
      return false;
    };

    if (!locate()) {
      intervalId = setInterval(() => {
        attempts++;
        if (locate() || attempts >= maxAttempts) {
          clearInterval(intervalId);
        }
      }, 200);
    }

    window.addEventListener('resize', locate);
    return () => {
      if (intervalId) clearInterval(intervalId);
      window.removeEventListener('resize', locate);
    };
  }, []);

  /* Advance when the modal is closed (either submitted or cancelled) */
  useEffect(() => {
    if (!isZoneModalOpen) {
      onNext();
    }
  }, [isZoneModalOpen, onNext]);

  return (
    <motion.div
      className="fixed inset-0 z-[60] pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Animated arrow pointing to the textarea */}
      <motion.div
        className="absolute"
        style={{ top: pos.top - 18, right: pos.right, pointerEvents: 'none' }}
        animate={{ x: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
      >
        <div className="flex items-center gap-2 bg-[#111827] border border-[#FF6B00]/60 text-white text-xs font-anakotmai px-3 py-2 rounded-xl shadow-xl whitespace-nowrap">
          {c.label}
          <ChevronRight size={14} className="text-[#FF6B00]" />
        </div>
      </motion.div>

      {/* Skip */}
      <button
        onClick={onSkip}
        className="pointer-events-auto fixed top-4 right-6 flex items-center gap-1.5 text-white/50 hover:text-white text-xs font-anakotmai transition-colors bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full"
      >
        <X size={12} /> {skip}
      </button>
    </motion.div>
  );
}

/* ─── Step 4 — Done banner ─── */
function DoneBanner({ lang }) {
  const c = COPY[lang].step4;
  return (
    <motion.div
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
      initial={{ y: 40, opacity: 0, scale: 0.9 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
    >
      <div className="flex items-center gap-3 bg-[#111827] border border-green-500/30 text-white px-5 py-3 rounded-2xl shadow-2xl shadow-black/50">
        <div className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
          <CheckCircle2 size={16} className="text-green-400" />
        </div>
        <span className="font-anakotmai text-sm">{c.label}</span>
      </div>
    </motion.div>
  );
}

/* ─── Main export ─── */
export default function MapTutorial({ lang = 'th', step, demoZoneId, onNext, onSkip, onZoneSelect, isZoneModalOpen }) {
  const safeLang = lang === 'en' ? 'en' : 'th';

  return (
    <AnimatePresence mode="wait">
      {step === 0 && (
        <WelcomeStep key="step0" lang={safeLang} onNext={onNext} onSkip={onSkip} />
      )}
      {step === 1 && (
        <ZoneHighlightStep
          key="step1"
          lang={safeLang}
          demoZoneId={demoZoneId}
          onNext={onNext}
          onSkip={onSkip}
          onZoneSelect={onZoneSelect}
        />
      )}
      {step === 2 && (
        <PanelPointerStep key="step2" lang={safeLang} onNext={onNext} onSkip={onSkip} isZoneModalOpen={isZoneModalOpen} />
      )}
      {step === 3 && (
        <ModalPointerStep key="step3" lang={safeLang} onNext={onNext} onSkip={onSkip} isZoneModalOpen={isZoneModalOpen} />
      )}
      {step === 4 && (
        <DoneBanner key="step4" lang={safeLang} />
      )}
    </AnimatePresence>
  );
}

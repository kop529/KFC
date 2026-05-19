import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const EXPO_OUT = [0.16, 1, 0.3, 1];

const copy = {
  en: {
    placeholder: 'Group Photo Placeholder',
    cta: 'Enter Site'
  },
  th: {
    placeholder: 'พื้นที่สำหรับรูปภาพกลุ่ม',
    cta: 'เข้าสู่เว็บไซต์'
  }
};

export default function WelcomeModal({ lang }) {
  const [isOpen, setIsOpen] = useState(false);
  const c = copy[lang];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          {/* Backdrop — two-stage: first blur intensifies, then darkens */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.5, ease: EXPO_OUT }}
            onClick={closeModal}
            className="absolute inset-0 bg-[#111827]/60"
          />

          {/* Modal Container — cinematic entrance */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 40, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.95, y: 30, filter: 'blur(6px)' }}
            transition={{ 
              type: 'spring', 
              damping: 22, 
              stiffness: 280,
              delay: 0.15
            }}
            className="relative w-full max-w-xl bg-white shadow-2xl overflow-hidden rounded-sm"
          >
            {/* Close Button with rotation */}
            <motion.button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 p-2 text-[#111827]/40 hover:text-[#FF6B00] transition-colors duration-200"
              whileHover={{ rotate: 90, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              <X size={20} />
            </motion.button>

            {/* Content Area — staggered reveals */}
            <div className="p-8 pt-12 text-center">
              
              {/* Image Container — enters first */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: EXPO_OUT }}
                className="w-full mb-8 flex items-center justify-center bg-[#F9FAFB] border-2 border-dashed border-[#111827]/10 min-h-[300px] overflow-hidden"
              >
                <div className="text-center">
                  <span className={`block text-[#111827]/20 text-sm tracking-widest uppercase ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}>
                    {c.placeholder}
                  </span>
                </div>
              </motion.div>

              {/* Enter Button — enters last with glow */}
              <motion.button
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5, ease: EXPO_OUT }}
                onClick={closeModal}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative w-full bg-[#FF6B00] text-[#111827] font-inter font-bold text-sm tracking-[0.2em] uppercase py-4 hover:bg-[#111827] hover:text-white transition-all duration-300 glow-pulse"
              >
                {lang === 'th' ? <span className="font-anakotmai">{c.cta}</span> : c.cta}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

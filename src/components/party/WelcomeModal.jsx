import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

let hasShownModal = false;

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Only show if it hasn't been shown in this session
    if (!hasShownModal) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        hasShownModal = true;
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="absolute inset-0 bg-[#111827]/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-xl bg-white shadow-2xl overflow-hidden rounded-sm"
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 p-2 text-[#111827]/40 hover:text-[#FF6B00] transition-colors duration-200"
            >
              <X size={20} />
            </button>

            {/* Content Area */}
            <div className="p-8 pt-12 text-center">
              
              {/* Image Container: Ready for your photo */}
              <div className="w-full mb-8 flex items-center justify-center bg-[#F9FAFB] border-2 border-dashed border-[#111827]/10 min-h-[300px]">
                <div className="text-center">
                  <span className="block text-[#111827]/20 font-inter text-sm tracking-widest uppercase">
                    Group Photo Placeholder
                  </span>
                </div>
              </div>

              {/* Enter Button */}
              <button
                onClick={closeModal}
                className="w-full bg-[#FF6B00] text-[#111827] font-inter font-bold text-sm tracking-[0.2em] uppercase py-4 hover:bg-[#111827] hover:text-white transition-all duration-300"
              >
                Enter Site
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

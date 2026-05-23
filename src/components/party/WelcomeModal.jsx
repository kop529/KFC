import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import welcomeRoyal from '../../assets/welcome-royal.jpg';

const copy = {
  en: {
    cta: 'Enter Site'
  },
  th: {
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
    isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop — standard overlay with static blur */}
        <div
          onClick={closeModal}
          className="absolute inset-0 bg-black/85 backdrop-blur-[12px]"
        />

        {/* Modal Container — static centered card, black background, elegant border */}
        <div className="relative w-full max-w-2xl bg-[#050505] shadow-2xl overflow-hidden rounded-sm border border-neutral-900 max-h-[90vh] flex flex-col">
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-20 p-2 text-white/50 hover:text-[#FF6B00] transition-colors duration-200"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>

          {/* Content Area */}
          <div className="flex flex-col overflow-y-auto flex-1 custom-scrollbar">
            
            {/* Image Container - Full width */}
            <div className="w-full overflow-hidden bg-black flex items-center justify-center flex-1 min-h-0">
              <img 
                src={welcomeRoyal} 
                alt="Welcome Royal Commemoration"
                className="w-full h-auto object-contain block select-none"
              />
            </div>

            {/* Bottom Panel with Enter Button */}
            <div className="p-6 bg-[#0a0a0a] border-t border-neutral-900/60 flex justify-center shrink-0">
              <button
                onClick={closeModal}
                className="relative w-full max-w-xs bg-[#FF6B00] text-[#111827] font-inter font-bold text-sm tracking-[0.2em] uppercase py-3.5 hover:bg-white hover:text-[#111827] transition-all duration-300 shadow-md shadow-[#FF6B00]/10 hover:shadow-white/5"
              >
                {lang === 'th' ? <span className="font-anakotmai">{c.cta}</span> : c.cta}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
}


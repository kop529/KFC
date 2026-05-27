import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowUpRight, Instagram } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { candidateData } from '../../data/candidateData';

const EXPO_OUT = [0.16, 1, 0.3, 1];

const copy = {
  en: {
    cta: 'Join the Movement',
    sub: 'Be part of the change Thailand deserves.',
    links: [
      { name: 'Policies', href: '/policies', type: 'link' },
      { name: 'Candidates', href: '/leadership', type: 'link' },
      { name: 'Report Issue', href: '/map', type: 'link' },
    ],
    legal: "© 2026 Chonchai People's. All rights reserved.",
    tagline: "Chonchai People's",
    party: 'Chonchai',
  },
  th: {
    cta: 'ร่วมขบวนการ',
    sub: 'เป็นส่วนหนึ่งของการเปลี่ยนแปลงที่ประเทศไทยสมควรได้รับ',
    links: [
      { name: 'นโยบาย', href: '/policies', type: 'link' },
      { name: 'ผู้สมัคร', href: '/leadership', type: 'link' },
      { name: 'เเจ้งปัญหา', href: '/map', type: 'link' },
    ],
    legal: "© 2026 teamchaehan. All rights reserved.",
    tagline: 'ประชาชลชาย',
    party: 'พรรคประชาชลชาย',
  },
};



export default function Footer({ lang, showCTA = false }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const navigate = useNavigate();
  const location = useLocation();
  const c = copy[lang];


  const handleNav = (link) => {
    if (link.type === 'anchor') {
      if (location.pathname !== '/') {
        navigate('/' + link.href);
      } else {
        const el = document.querySelector(link.href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        else navigate('/' + link.href);
      }
    } else {
      navigate(link.href);
      window.scrollTo(0, 0);
    }
  };

  return (
    <footer>
      {/* ─── CTA Block ─── */}
      {showCTA && (
        <div ref={ref} className="bg-[#FF6B00] py-28 lg:py-40">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: EXPO_OUT }}
              className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-10"
            >
              <div>
                <h2
                  className={`font-black text-[#111827] leading-none mb-4 ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}
                  style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', letterSpacing: '-0.04em' }}
                >
                  {c.cta}
                </h2>
                <p className={`text-[#111827]/60 text-xl font-medium ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}>
                  {c.sub}
                </p>
              </div>

              {/* Magnetic CTA button */}
              <button
                onClick={() =>
                  toast.success(
                    lang === 'th'
                      ? 'ขอบคุณที่สนใจ! ระบบลงทะเบียนจะเปิดให้ใช้งานเร็วๆ นี้'
                      : 'Thank you for your interest! Registration opens soon.'
                  )
                }
                className="flex items-center justify-center w-full lg:w-auto gap-4 bg-[#111827] text-white font-semibold text-lg px-10 py-5 transition-colors duration-300 hover:bg-white hover:text-[#111827] shrink-0 btn-ripple focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111827]"
              >
                {lang === 'th' ? <span className="font-anakotmai">{c.cta}</span> : c.cta}
                <ArrowUpRight size={20} />
              </button>
            </motion.div>
          </div>
        </div>
      )}

      {/* ─── Bottom bar ─── */}
      <div className="bg-[#111827] py-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">

            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-1.5 lg:gap-3 group"
            >
              <span className="font-anakotmai font-black text-base lg:text-xl tracking-[0.2em] uppercase transition-colors duration-300 text-[#FF6B00]">
                #TEAMCHAEHAN
              </span>
              
              {/* Election Number Block */}
              <div className="flex shadow-sm">
                <div className="w-[36px] lg:w-[46px] h-[36px] lg:h-[46px] font-anakotmai text-2xl lg:text-3xl font-black flex items-center justify-center bg-[#FF6DC6] text-black">
                  {candidateData.number}
                </div>
                <div className="w-[36px] lg:w-[46px] h-[36px] lg:h-[46px] bg-white flex items-center justify-center text-black">
                  <svg viewBox="0 0 15 15" className="w-[14px] h-[14px] lg:w-[22px] lg:h-[22px]" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square">
                    <path d="M3 3 L12 12 M12 3 L3 12" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Nav links */}
            <nav className="flex flex-wrap gap-6 lg:gap-8">
              {c.links.map((link, i) => (
                <button
                  key={i}
                  onClick={() => handleNav(link)}
                  className={`text-white/40 hover:text-white transition-colors duration-200 text-sm font-medium ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}
                >
                  {link.name}
                </button>
              ))}

              <div className="w-px h-4 bg-white/10 self-center hidden sm:block" />

              {/* Instagram */}
              <a
                href="https://www.instagram.com/teamchaehan/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-[#FF6B00] transition-colors duration-200 flex items-center gap-1.5 text-sm font-inter font-semibold"
              >
                <Instagram size={15} />
                <span className="tracking-wider">INSTAGRAM</span>
              </a>
            </nav>

            {/* Legal */}
            <p className={`text-white/20 text-[10px] ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}>
              {c.legal}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

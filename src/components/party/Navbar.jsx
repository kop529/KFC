import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValueEvent, useScroll, useMotionValue, useSpring } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const navLinks = [
  { en: 'About', th: 'เกี่ยวกับ', href: '#about', type: 'anchor' },
  { en: 'Policies', th: 'นโยบาย', href: '/policies', type: 'link' },
  { en: 'Candidates', th: 'ผู้สมัคร', href: '/leadership', type: 'link' },
  { en: 'Map', th: 'แผนที่', href: '/map', type: 'link' },
];

const EXPO_OUT = [0.16, 1, 0.3, 1];

export default function Navbar({ lang, setLang, theme = 'light' }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Smooth scroll-based interpolation for glass effect
  const { scrollY } = useScroll();
  const blurAmount = useMotionValue(0);
  const bgOpacity = useMotionValue(0);
  const springBlur = useSpring(blurAmount, { stiffness: 120, damping: 20 });
  const springOpacity = useSpring(bgOpacity, { stiffness: 120, damping: 20 });

  useMotionValueEvent(scrollY, "change", (latest) => {
    const progress = Math.min(latest / 80, 1); // 0→1 over first 80px of scroll
    blurAmount.set(progress * 20);
    bgOpacity.set(progress * 0.85);
    setScrolled(latest > 40);
  });

  // Determine active nav link
  useEffect(() => {
    const active = navLinks.find(link => {
      if (link.type === 'anchor') {
        return location.pathname === '/' && location.hash === link.href;
      }
      return location.pathname.startsWith(link.href);
    });
    setActiveLink(active?.en || null);
  }, [location.pathname, location.hash]);

  // Robust Anchor Scroll Handler
  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [location.pathname, location.hash]);

  const handleNav = useCallback((link) => {
    setMenuOpen(false);
    
    if (link.type === 'anchor') {
      if (location.pathname !== '/') {
        navigate('/' + link.href);
      } else {
        const element = document.querySelector(link.href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
          navigate('/' + link.href);
        }
      }
    } else {
      navigate(link.href);
      window.scrollTo(0, 0);
    }
  }, [location.pathname, navigate]);

  const isDark = theme === 'dark';

  const textColorClass = (scrolled && !isDark) ? 'text-[#111827]' : 'text-white';
  const textMutedClass = (scrolled && !isDark) ? 'text-[#111827]/40 hover:text-[#111827]' : 'text-white/40 hover:text-white';
  const separatorClass = (scrolled && !isDark) ? 'text-[#111827]/20' : 'text-white/20';

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backdropFilter: scrolled ? `blur(${springBlur}px) saturate(1.8)` : 'none',
        WebkitBackdropFilter: scrolled ? `blur(${springBlur}px) saturate(1.8)` : 'none',
        borderBottom: scrolled 
          ? `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(17,24,39,0.08)'}` 
          : '1px solid transparent',
      }}
      animate={{
        backgroundColor: scrolled
          ? (isDark ? `rgba(11, 15, 23, 0.85)` : `rgba(249, 250, 251, 0.85)`)
          : 'rgba(0,0,0,0)',
      }}
      transition={{ duration: 0.5, ease: EXPO_OUT }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-20 lg:h-24">
        {/* Logo with hover glow */}
        <Link 
          to="/" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-6 group"
        >
          <motion.div
            className="flex items-center font-anakotmai font-black text-sm lg:text-lg tracking-widest text-[#FF6B00]"
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <span className="relative inline-block mr-1">
              พรรค
              <span className="absolute inset-x-[-1px] top-[55%] h-[2.5px] bg-white z-10" />
            </span>
            <span>ประชาชลชาย</span>
          </motion.div>
          
          <div className="h-4 w-px bg-white/20 hidden sm:block" />
          
          <span className={`font-inter font-900 text-xs lg:text-sm tracking-[0.2em] uppercase transition-colors duration-300 ${textColorClass}`}>
            #TEAMCH___
          </span>
        </Link>

        {/* Desktop Nav with layoutId sliding indicator */}
        <nav className="hidden lg:flex items-center gap-12 relative">
          {navLinks.map((link) => {
            const isActive = activeLink === link.en;

            return (
              <button
                key={link.en}
                onClick={() => handleNav(link)}
                className={`group relative py-2 transition-colors duration-300 ${
                  isActive ? 'text-[#FF6B00]' : textColorClass
                }`}
              >
                <span className={`block text-base font-semibold tracking-wide ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}>
                  {lang === 'th' ? link.th : link.en}
                </span>

                {/* Sliding active indicator with layoutId */}
                {isActive && (
                  <motion.span
                    layoutId="nav-active-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#FF6B00]"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}

                {/* Hover line (only when not active) */}
                {!isActive && (
                  <span className="absolute -bottom-1 left-0 h-0.5 bg-[#FF6B00] w-0 group-hover:w-full transition-all duration-300" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-8">
          {/* Language Toggle with sliding pill */}
          <div className="flex items-center gap-1 text-sm font-inter font-bold tracking-widest relative">
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-1 transition-all duration-200 relative z-10 ${
                lang === 'en'
                  ? 'text-[#FF6B00]'
                  : textMutedClass
              }`}
            >
              EN
              {lang === 'en' && (
                <motion.span
                  layoutId="lang-indicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FF6B00]"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
            </button>
            <span className={separatorClass}>|</span>
            <button
              onClick={() => setLang('th')}
              className={`px-2 py-1 font-anakotmai transition-all duration-200 relative z-10 ${
                lang === 'th'
                  ? 'text-[#FF6B00]'
                  : textMutedClass
              }`}
            >
              TH
              {lang === 'th' && (
                <motion.span
                  layoutId="lang-indicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FF6B00]"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
            </button>
          </div>

          {/* Mobile Menu Button with morph animation */}
          <motion.button
            className={`lg:hidden transition-colors duration-300 ${textColorClass}`}
            onClick={() => setMenuOpen(!menuOpen)}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={menuOpen ? 'close' : 'menu'}
                initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                transition={{ duration: 0.2 }}
              >
                {menuOpen ? <X size={26} /> : <Menu size={26} />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu — Full-screen with staggered reveals */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`lg:hidden fixed inset-0 top-20 z-40 ${
              isDark 
                ? 'bg-[#0B0F17]/98' 
                : 'bg-[#F9FAFB]/98'
            }`}
            style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
          >
            <div className="flex flex-col justify-center h-full px-8 pb-20">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.en}
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 60 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: i * 0.08, 
                    ease: EXPO_OUT 
                  }}
                  onClick={() => handleNav(link)}
                  className={`block w-full text-left py-4 border-b transition-colors ${
                    isDark 
                      ? 'text-white border-white/5 hover:text-[#FF6B00]' 
                      : 'text-[#111827] border-[#111827]/05 hover:text-[#FF6B00]'
                  }`}
                >
                  <span className={`text-3xl font-black tracking-tight ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}>
                    {lang === 'th' ? link.th : link.en}
                  </span>
                  <span className={`ml-4 text-sm font-normal ${isDark ? 'text-white/30' : 'text-[#111827]/30'}`}>
                    {lang === 'th' ? link.en : link.th}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

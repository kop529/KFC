import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useIsMobile } from '../../hooks/use-mobile';
import { candidateData } from '../../data/candidateData';

const navLinks = [
  { en: 'Policies', th: 'นโยบาย', href: '/policies', type: 'link' },
  { en: 'Candidates', th: 'ผู้สมัคร', href: '/leadership', type: 'link' },
  { en: 'Report Issue', th: 'เเจ้งปัญหา', href: '/map', type: 'link' },
];

const mobileMenuContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
      when: 'afterChildren'
    }
  }
};

const mobileMenuItemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 280, damping: 24 }
  },
  exit: { opacity: 0, y: -15, transition: { duration: 0.15 } }
};

export default function Navbar({ lang, setLang, theme = 'light' }) {
  const [scrolled, setScrolled] = useState(() => {
    if (typeof window !== 'undefined') {
      return (window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0) > 20;
    }
    return false;
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(null);
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      setScrolled(scrollPos > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

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

  const showSolidHeader = scrolled || menuOpen || isMobile;

  const isLightModeHeader = !isDark && showSolidHeader;

  const textColorClass = isLightModeHeader ? 'text-[#111827]' : 'text-white';
  const textMutedClass = isLightModeHeader ? 'text-[#111827]/40 hover:text-[#111827]' : 'text-white/40 hover:text-white';
  const separatorClass = isLightModeHeader ? 'text-[#111827]/20' : 'text-white/20';

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          backdropFilter: showSolidHeader ? 'blur(20px) saturate(1.8)' : 'none',
          WebkitBackdropFilter: showSolidHeader ? 'blur(20px) saturate(1.8)' : 'none',
          backgroundColor: showSolidHeader
            ? (isDark ? 'rgba(11, 15, 23, 0.95)' : 'rgba(249, 250, 251, 0.95)')
            : 'rgba(0,0,0,0)',
          borderBottom: showSolidHeader
            ? `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(17,24,39,0.08)'}`
            : '1px solid transparent',
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-20 lg:h-24">
          {/* Logo with hover glow */}
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

          {/* Desktop Nav with layoutId sliding indicator */}
          <nav className="hidden lg:flex items-center gap-12 relative">
            {navLinks.map((link) => {
              const isActive = activeLink === link.en;

              return (
                <button
                  key={link.en}
                  onClick={() => handleNav(link)}
                  className={`group relative py-2 transition-colors duration-300 ${isActive ? 'text-[#FF6B00]' : textColorClass
                    }`}
                >
                  <span className={`block text-base font-semibold tracking-wide ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}>
                    {lang === 'th' ? link.th : link.en}
                  </span>

                  {/* Static active indicator (fade in) */}
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#FF6B00]"
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
          <div className="flex items-center gap-4 lg:gap-8">
            {/* Language Toggle with sliding pill */}
            <div className="flex items-center gap-1 text-sm font-inter font-bold tracking-widest relative">
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 transition-all duration-200 relative z-10 ${lang === 'en'
                    ? 'text-[#FF6B00]'
                    : textMutedClass
                  }`}
              >
                EN
                {lang === 'en' && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FF6B00]"
                  />
                )}
              </button>
              <span className={separatorClass}>|</span>
              <button
                onClick={() => setLang('th')}
                className={`px-2 py-1 font-anakotmai transition-all duration-200 relative z-10 ${lang === 'th'
                    ? 'text-[#FF6B00]'
                    : textMutedClass
                  }`}
              >
                TH
                {lang === 'th' && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FF6B00]"
                  />
                )}
              </button>
            </div>

            {/* Mobile Menu Button with morph animation */}
            <button
              className={`lg:hidden transition-colors duration-300 ${textColorClass}`}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu — Full-screen with staggered reveals (rendered outside header to avoid backdropFilter containment issues) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mobileMenuContainerVariants}
            className="lg:hidden fixed inset-x-0 top-20 bottom-0 z-40 overflow-y-auto"
            style={{
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              backgroundColor: isDark ? 'rgba(11, 15, 23, 0.98)' : 'rgba(249, 250, 251, 0.98)'
            }}
          >
            <div className="flex flex-col px-8 py-12 min-h-full">
              {navLinks.map((link) => {
                const isActive = activeLink === link.en;
                return (
                  <motion.button
                    key={link.en}
                    variants={mobileMenuItemVariants}
                    onClick={() => handleNav(link)}
                    className={`block w-full text-left py-5 border-b transition-colors ${
                      isActive
                        ? 'text-[#FF6B00]'
                        : isDark
                          ? 'text-white hover:text-[#FF6B00]'
                          : 'text-[#111827] hover:text-[#FF6B00]'
                    } ${isDark ? 'border-white/5' : 'border-[#111827]/10'}`}
                  >
                    <div className="flex items-baseline justify-between">
                      <span className={`text-3xl font-black tracking-tight ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}>
                        {lang === 'th' ? link.th : link.en}
                      </span>
                      <span className={`text-sm font-semibold tracking-wider ${isActive ? 'text-[#FF6B00]/60' : isDark ? 'text-white/30' : 'text-[#111827]/30'}`}>
                        {lang === 'th' ? link.en : link.th}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

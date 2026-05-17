import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const navLinks = [
  { en: 'About', th: 'เกี่ยวกับ', href: '#about', type: 'anchor' },
  { en: 'Policies', th: 'นโยบาย', href: '/policies', type: 'link' },
  { en: 'Candidates', th: 'ผู้สมัคร', href: '/leadership', type: 'link' },
  { en: 'News', th: 'ข่าวสาร', href: '#news', type: 'anchor' },
];

export default function Navbar({ lang, setLang, theme = 'light' }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (link) => {
    setMenuOpen(false);
    
    if (link.type === 'anchor') {
      if (location.pathname !== '/') {
        navigate('/');
        // Wait for navigation then scroll
        setTimeout(() => {
          document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(link.href);
      window.scrollTo(0, 0);
    }
  };

  const isDark = theme === 'dark';
  const navBgClass = scrolled 
    ? (isDark ? 'nav-frosted-dark' : 'nav-frosted') 
    : 'bg-transparent';

  const textColorClass = (scrolled && !isDark) ? 'text-[#111827]' : 'text-white';
  const textHoverClass = (scrolled && !isDark) ? 'hover:text-[#FF6B00]' : 'hover:text-white';
  const textMutedClass = (scrolled && !isDark) ? 'text-[#111827]/40 hover:text-[#111827]' : 'text-white/40 hover:text-white';
  const separatorClass = (scrolled && !isDark) ? 'text-[#111827]/20' : 'text-white/20';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBgClass}`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-20 lg:h-24">
        {/* Logo */}
        <Link 
          to="/" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-6 group"
        >
          <div className="flex items-center font-anakotmai font-black text-sm lg:text-lg tracking-widest text-[#FF6B00]">
            <span className="relative inline-block mr-1">
              พรรค
              <span className="absolute inset-x-[-1px] top-[55%] h-[2.5px] bg-white z-10" />
            </span>
            <span>ประชาชลชาย</span>
          </div>
          
          <div className="h-4 w-px bg-white/20 hidden sm:block" />
          
          <span className={`font-inter font-900 text-xs lg:text-sm tracking-[0.2em] uppercase transition-colors duration-300 ${textColorClass}`}>
            #TEAMCH___
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-12">
          {navLinks.map((link) => (
            <button
              key={link.en}
              onClick={() => handleNav(link)}
              className={`group relative transition-colors duration-300 ${textColorClass}`}
            >
              <span className={`block text-base font-semibold tracking-wide ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}>
                {lang === 'th' ? link.th : link.en}
              </span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF6B00] group-hover:w-full transition-all duration-300" />
            </button>
          ))}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-8">
          {/* Language Toggle */}
          <div className="flex items-center gap-1 text-sm font-inter font-bold tracking-widest">
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-1 transition-all duration-200 ${
                lang === 'en'
                  ? 'text-[#FF6B00] border-b-2 border-[#FF6B00]'
                  : textMutedClass
              }`}
            >
              EN
            </button>
            <span className={separatorClass}>|</span>
            <button
              onClick={() => setLang('th')}
              className={`px-2 py-1 font-anakotmai transition-all duration-200 ${
                lang === 'th'
                  ? 'text-[#FF6B00] border-b-2 border-[#FF6B00]'
                  : textMutedClass
              }`}
            >
              TH
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden transition-colors duration-300 ${textColorClass}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`lg:hidden border-t px-6 py-6 space-y-4 ${
              isDark 
                ? 'nav-frosted-dark border-white/10' 
                : 'nav-frosted border-[#111827]/08'
            }`}
          >
            {navLinks.map((link) => (
              <button
                key={link.en}
                onClick={() => handleNav(link)}
                className={`block w-full text-left text-lg font-inter font-medium transition-colors py-2 ${
                  isDark 
                    ? 'text-white hover:text-[#FF6B00]' 
                    : 'text-[#111827] hover:text-[#FF6B00]'
                }`}
              >
                {link.en}
                <span className={`ml-3 font-anakotmai text-sm ${isDark ? 'text-white/40' : 'text-[#111827]/40'}`}>
                  {link.th}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

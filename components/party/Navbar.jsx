import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { en: 'About', th: 'เกี่ยวกับ', href: '#about' },
  { en: 'Policies', th: 'นโยบาย', href: '#policies' },
  { en: 'Leadership', th: 'ผู้นำ', href: '#leadership' },
  { en: 'News', th: 'ข่าวสาร', href: '#news' },
];

export default function Navbar({ lang, setLang }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (href) => {
    setMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'nav-frosted' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-16 lg:h-20">
        {/* Logo */}
        <a href="#" className="flex flex-col leading-none group">
          <span className="font-inter font-800 text-sm tracking-[0.2em] text-[#111827] uppercase">
            People's Party
          </span>
          <span className="font-kanit font-medium text-xs tracking-widest text-[#FF6B00]">
            พรรคประชาชน
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <button
              key={link.en}
              onClick={() => handleNav(link.href)}
              className="group relative text-[#111827] hover:text-[#FF6B00] transition-colors duration-300"
            >
              <span className={`block text-sm font-medium tracking-wide ${lang === 'th' ? 'font-kanit' : 'font-inter'}`}>
                {lang === 'th' ? link.th : link.en}
              </span>
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#FF6B00] group-hover:w-full transition-all duration-300" />
            </button>
          ))}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-6">
          {/* Language Toggle */}
          <div className="flex items-center gap-1 text-xs font-inter font-semibold tracking-widest">
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-1 transition-all duration-200 ${
                lang === 'en'
                  ? 'text-[#FF6B00] border-b-2 border-[#FF6B00]'
                  : 'text-[#111827]/40 hover:text-[#111827]'
              }`}
            >
              EN
            </button>
            <span className="text-[#111827]/20">|</span>
            <button
              onClick={() => setLang('th')}
              className={`px-2 py-1 font-kanit transition-all duration-200 ${
                lang === 'th'
                  ? 'text-[#FF6B00] border-b-2 border-[#FF6B00]'
                  : 'text-[#111827]/40 hover:text-[#111827]'
              }`}
            >
              TH
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-[#111827]"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
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
            className="lg:hidden nav-frosted border-t border-[#111827]/08 px-6 py-6 space-y-4"
          >
            {navLinks.map((link) => (
              <button
                key={link.en}
                onClick={() => handleNav(link.href)}
                className="block w-full text-left text-lg font-inter font-medium text-[#111827] hover:text-[#FF6B00] transition-colors py-2"
              >
                {link.en}
                <span className="ml-3 font-kanit text-sm text-[#111827]/40">{link.th}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

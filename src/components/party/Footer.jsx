import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const copy = {
  en: {
    cta: 'Join the Movement',
    sub: 'Be part of the change Thailand deserves.',
    links: [
      { name: 'About', href: '#about', type: 'anchor' },
      { name: 'Policies', href: '/policies', type: 'link' },
      { name: 'Leadership', href: '/leadership', type: 'link' },
      { name: 'News', href: '#news', type: 'anchor' },
    ],
    legal: '© 2026 People\'s Party Thailand. All rights reserved.',
    tagline: 'พรรคประชาชน',
  },
  th: {
    cta: 'ร่วมขบวนการ',
    sub: 'เป็นส่วนหนึ่งของการเปลี่ยนแปลงที่ประเทศไทยสมควรได้รับ',
    links: [
      { name: 'เกี่ยวกับ', href: '#about', type: 'anchor' },
      { name: 'นโยบาย', href: '/policies', type: 'link' },
      { name: 'ผู้นำ', href: '/leadership', type: 'link' },
      { name: 'ข่าวสาร', href: '#news', type: 'anchor' },
    ],
    legal: '© 2569 พรรคประชาชน ประเทศไทย สงวนลิขสิทธิ์ทุกประการ',
    tagline: "People's Party",
  }
};

export default function Footer({ lang }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const navigate = useNavigate();
  const location = useLocation();
  const c = copy[lang];

  const handleNav = (link) => {
    if (link.type === 'anchor') {
      if (location.pathname !== '/') {
        navigate('/');
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

  return (
    <footer>
      {/* ... CTA Block ... */}
      <div ref={ref} className="bg-[#FF6B00] py-28 lg:py-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-10"
          >
            <div>
              <h2
                className={`font-inter font-black text-[#111827] leading-none mb-6 ${lang === 'th' ? 'font-kanit' : ''}`}
                style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', letterSpacing: '-0.04em' }}
              >
                {c.cta}
              </h2>
              <p className={`text-[#111827]/60 text-xl font-medium ${lang === 'th' ? 'font-kanit' : 'font-inter'}`}>
                {c.sub}
              </p>
            </div>

            <button className="group flex items-center gap-4 bg-[#111827] text-white font-inter font-semibold text-lg px-10 py-5 hover:bg-white hover:text-[#111827] transition-all duration-300 shrink-0">
              {lang === 'th' ? <span className="font-kanit">{c.cta}</span> : c.cta}
              <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-[#111827] py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            {/* Party name */}
            <Link 
              to="/" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex flex-col group cursor-pointer"
            >
              <div className="font-inter font-black text-white text-sm tracking-widest uppercase mb-1 group-hover:text-[#FF6B00] transition-colors">
                CHONCHAI PEOPLE'S
              </div>
              <div className="font-kanit text-[#FF6B00] text-xs tracking-widest flex items-center">
                <span className="relative inline-block mr-1">
                  พรรค
                  <span className="absolute inset-x-0 top-[55%] h-[2px] bg-[#FF6B00]" />
                </span>
                <span>ประชาชลชาย</span>
              </div>
            </Link>

            {/* Nav links */}
            <nav className="flex flex-wrap gap-6 lg:gap-10">
              {c.links.map((link, i) => (
                <button
                  key={i}
                  onClick={() => handleNav(link)}
                  className={`text-white/40 hover:text-[#FF6B00] transition-colors duration-200 text-sm font-medium ${
                    lang === 'th' ? 'font-kanit' : 'font-inter'
                  }`}
                >
                  {link.name}
                </button>
              ))}
            </nav>

            {/* Legal */}
            <p className={`text-white/20 text-xs ${lang === 'th' ? 'font-kanit' : 'font-inter'}`}>
              {c.legal}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

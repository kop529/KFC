import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { ArrowUpRight, Instagram } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

const copy = {
  en: {
    cta: 'Join the Movement',
    sub: 'Be part of the change Thailand deserves.',
    links: [
      { name: 'About', href: '#about', type: 'anchor' },
      { name: 'Policies', href: '/policies', type: 'link' },
      { name: 'Candidates', href: '/leadership', type: 'link' },
      { name: 'News', href: '#news', type: 'anchor' },
    ],
    legal: '© 2026 Chonchai People\'s. All rights reserved.',
    tagline: 'ประชาชลชาย',
  },
  th: {
    cta: 'ร่วมขบวนการ',
    sub: 'เป็นส่วนหนึ่งของการเปลี่ยนแปลงที่ประเทศไทยสมควรได้รับ',
    links: [
      { name: 'เกี่ยวกับ', href: '#about', type: 'anchor' },
      { name: 'นโยบาย', href: '/policies', type: 'link' },
      { name: 'ผู้สมัคร', href: '/leadership', type: 'link' },
      { name: 'ข่าวสาร', href: '#news', type: 'anchor' },
    ],
    legal: '© 2569 ประชาชลชาย สงวนลิขสิทธิ์ทุกประการ',
    tagline: "Chonchai People's",
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
      {/* CTA Block */}
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
                className={`font-inter font-black text-[#111827] leading-none mb-6 ${lang === 'th' ? 'font-anakotmai' : ''}`}
                style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', letterSpacing: '-0.04em' }}
              >
                {c.cta}
              </h2>
              <p className={`text-[#111827]/60 text-xl font-medium ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}>
                {c.sub}
              </p>
            </div>

            <button 
              onClick={() => toast.success(lang === 'th' ? 'ขอบคุณที่สนใจ! ระบบลงทะเบียนจะเปิดให้ใช้งานเร็วๆ นี้' : 'Thank you for your interest! The registration system will be available soon.')}
              className="group flex items-center gap-4 bg-[#111827] text-white font-inter font-semibold text-lg px-10 py-5 hover:bg-white hover:text-[#111827] transition-all duration-300 shrink-0"
            >
              {lang === 'th' ? <span className="font-anakotmai">{c.cta}</span> : c.cta}
              <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-[#111827] py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            {/* Branding Pivot */}
            <Link 
              to="/" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-6 group cursor-pointer"
            >
              <div className="flex items-center font-anakotmai font-black text-lg tracking-widest text-[#FF6B00]">
                <span className="relative inline-block mr-1">
                  พรรค
                  <span className="absolute inset-x-[-1px] top-[55%] h-[2.5px] bg-white z-10" />
                </span>
                <span>ประชาชลชาย</span>
              </div>
              
              <div className="h-4 w-px bg-white/20" />

              <div className="font-inter font-black text-white text-xs lg:text-sm tracking-[0.25em] uppercase group-hover:text-[#FF6B00] transition-colors">
                #TEAMCH___
              </div>
            </Link>

            {/* Nav links + Social media */}
            <div className="flex flex-wrap items-center gap-6 lg:gap-10">
              <nav className="flex flex-wrap gap-6 lg:gap-10">
                {c.links.map((link, i) => (
                  <button
                    key={i}
                    onClick={() => handleNav(link)}
                    className={`text-white/40 hover:text-[#FF6B00] transition-colors duration-200 text-sm font-medium ${
                      lang === 'th' ? 'font-anakotmai' : 'font-inter'
                    }`}
                  >
                    {link.name}
                  </button>
                ))}
              </nav>

              <div className="h-4 w-px bg-white/10 hidden sm:block" />

              {/* Instagram Link */}
              <a 
                href="https://www.instagram.com/teamch___/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/40 hover:text-[#FF6B00] transition-colors duration-200 flex items-center gap-2 text-sm font-semibold group"
              >
                <Instagram size={18} className="group-hover:scale-110 transition-transform duration-200" />
                <span className="font-inter tracking-wider">INSTAGRAM</span>
              </a>
            </div>

            {/* Legal */}
            <p className={`text-white/20 text-xs ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}>
              {c.legal}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

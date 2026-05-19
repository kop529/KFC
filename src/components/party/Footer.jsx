import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useRef, useCallback } from 'react';
import { useInView } from 'framer-motion';
import { ArrowUpRight, Instagram } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

const EXPO_OUT = [0.16, 1, 0.3, 1];

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

// ─── Magnetic Button Hook ───
function useMagneticHover(strength = 0.35) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const ref = useRef(null);

  const handleMouse = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  }, [x, y, strength]);

  const handleLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  const springX = useSpring(x, { stiffness: 250, damping: 18 });
  const springY = useSpring(y, { stiffness: 250, damping: 18 });

  return { ref, springX, springY, handleMouse, handleLeave };
}

export default function Footer({ lang }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const navigate = useNavigate();
  const location = useLocation();
  const c = copy[lang];
  const magnetic = useMagneticHover(0.3);

  const handleNav = (link) => {
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
  };

  return (
    <footer>
      {/* CTA Block */}
      <div ref={ref} className="bg-[#FF6B00] py-28 lg:py-40 relative overflow-hidden">
        {/* Ambient floating shapes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute -top-20 -right-20 w-[300px] h-[300px] rounded-full bg-white/5"
            animate={{ scale: [1, 1.15, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-[#111827]/5"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: EXPO_OUT }}
            className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-10 will-change-transform"
          >
            <div>
              <div className="overflow-hidden mb-6">
                <motion.h2
                  initial={{ y: '100%' }}
                  animate={inView ? { y: 0 } : {}}
                  transition={{ duration: 0.9, ease: EXPO_OUT }}
                  className={`font-inter font-black text-[#111827] leading-none ${lang === 'th' ? 'font-anakotmai' : ''}`}
                  style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', letterSpacing: '-0.04em' }}
                >
                  {c.cta}
                </motion.h2>
              </div>
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.2, ease: EXPO_OUT }}
                className={`text-[#111827]/60 text-xl font-medium ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}
              >
                {c.sub}
              </motion.p>
            </div>

            {/* Magnetic CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3, ease: EXPO_OUT }}
            >
              <motion.button
                ref={magnetic.ref}
                onMouseMove={magnetic.handleMouse}
                onMouseLeave={magnetic.handleLeave}
                style={{ x: magnetic.springX, y: magnetic.springY }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                onClick={() => toast.success(lang === 'th' ? 'ขอบคุณที่สนใจ! ระบบลงทะเบียนจะเปิดให้ใช้งานเร็วๆ นี้' : 'Thank you for your interest! The registration system will be available soon.')}
                className="group flex items-center gap-4 bg-[#111827] text-white font-inter font-semibold text-lg px-10 py-5 transition-colors duration-300 hover:bg-white hover:text-[#111827] shrink-0 btn-ripple focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111827] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FF6B00]"
              >
                {lang === 'th' ? <span className="font-anakotmai">{c.cta}</span> : c.cta}
                <motion.div
                  className="inline-block"
                  animate={{ x: [0, 3, 0], y: [0, -3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <ArrowUpRight size={20} />
                </motion.div>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom bar — staggered link reveals */}
      <div className="bg-[#111827] py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.06 } }
            }}
          >
            {/* Branding */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EXPO_OUT } } }}
            >
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
            </motion.div>

            {/* Nav links + Social media */}
            <div className="flex flex-wrap items-center gap-6 lg:gap-10">
              <nav className="flex flex-wrap gap-6 lg:gap-10">
                {c.links.map((link, i) => (
                  <motion.button
                    key={i}
                    variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EXPO_OUT } } }}
                    onClick={() => handleNav(link)}
                    className={`text-white/40 hover:text-[#FF6B00] transition-colors duration-200 text-sm font-medium ${
                      lang === 'th' ? 'font-anakotmai' : 'font-inter'
                    }`}
                    whileHover={{ y: -2 }}
                  >
                    {link.name}
                  </motion.button>
                ))}
              </nav>

              <div className="h-4 w-px bg-white/10 hidden sm:block" />

              {/* Instagram Link */}
              <motion.a
                variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EXPO_OUT } } }}
                href="https://www.instagram.com/teamch___/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/40 hover:text-[#FF6B00] transition-colors duration-200 flex items-center gap-2 text-sm font-semibold group"
                whileHover={{ y: -2 }}
              >
                <Instagram size={18} className="group-hover:scale-110 transition-transform duration-200" />
                <span className="font-inter tracking-wider">INSTAGRAM</span>
              </motion.a>
            </div>

            {/* Legal */}
            <motion.p
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5, delay: 0.3 } } }}
              className={`text-white/20 text-xs ${lang === 'th' ? 'font-anakotmai' : 'font-inter'}`}
            >
              {c.legal}
            </motion.p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}

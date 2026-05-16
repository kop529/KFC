import { useState } from 'react';
import Navbar from '../components/party/Navbar';
import LeadershipSection from '../components/party/LeadershipSection';
import Footer from '../components/party/Footer';
import { motion } from 'framer-motion';

export default function LeadershipPage() {
  const [lang, setLang] = useState('en');

  return (
    <div className="min-h-screen bg-white">
      <Navbar lang={lang} setLang={setLang} />
      
      {/* Page Header */}
      <div className="bg-[#111827] pt-32 pb-20 px-6 lg:px-12 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-white text-5xl lg:text-7xl font-inter font-black tracking-tighter ${lang === 'th' ? 'font-kanit' : ''}`}
        >
          {lang === 'th' ? 'คณะผู้บริหารพรรค' : 'Party Leadership'}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`mt-6 text-white/50 text-xl max-w-2xl mx-auto ${lang === 'th' ? 'font-kanit' : 'font-inter'}`}
        >
          {lang === 'th' 
            ? 'ทำความรู้จักกับคนรุ่นใหม่ที่จะขับเคลื่อนประเทศไทยไปสู่อนาคต' 
            : 'Meet the new generation of leaders driving Thailand toward the future.'}
        </motion.p>
      </div>

      <LeadershipSection lang={lang} />
      
      <Footer lang={lang} />
    </div>
  );
}

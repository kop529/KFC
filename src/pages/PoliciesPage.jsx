import { useState } from 'react';
import Navbar from '../components/party/Navbar';
import PoliciesSection from '../components/party/PoliciesSection';
import Footer from '../components/party/Footer';
import { motion } from 'framer-motion';

export default function PoliciesPage() {
  const [lang, setLang] = useState('en');

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <Navbar lang={lang} setLang={setLang} />
      
      <main className="pt-20">
        <PoliciesSection lang={lang} />
      </main>
      
      <Footer lang={lang} />
    </div>
  );
}

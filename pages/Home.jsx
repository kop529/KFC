import { useState } from 'react';
import Navbar from '../components/party/Navbar';
import HeroSection from '../components/party/HeroSection';
import AboutSection from '../components/party/AboutSection';
import PoliciesSection from '../components/party/PoliciesSection';
import LeadershipSection from '../components/party/LeadershipSection';
import NewsSection from '../components/party/NewsSection';
import Footer from '../components/party/Footer';

export default function Home() {
  const [lang, setLang] = useState('en');

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar lang={lang} setLang={setLang} />
      <HeroSection lang={lang} />
      <AboutSection lang={lang} />
      <PoliciesSection lang={lang} />
      <LeadershipSection lang={lang} />
      <NewsSection lang={lang} />
      <Footer lang={lang} />
    </div>
  );
}
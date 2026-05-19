import { motion } from 'framer-motion';
import Navbar from '../components/party/Navbar';
import HeroSection from '../components/party/HeroSection';
import AboutSection from '../components/party/AboutSection';
import PoliciesSection from '../components/party/PoliciesSection';
import LeadershipSection from '../components/party/LeadershipSection';
import Footer from '../components/party/Footer';
import WelcomeModal from '../components/party/WelcomeModal';

export default function Home({ lang, setLang }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      className="min-h-screen bg-[#F9FAFB]"
    >
      <WelcomeModal lang={lang} />
      <Navbar lang={lang} setLang={setLang} />
      <HeroSection lang={lang} />
      <AboutSection lang={lang} />
      <PoliciesSection lang={lang} />
      <LeadershipSection lang={lang} />
      <Footer lang={lang} />
    </motion.div>
  );
}
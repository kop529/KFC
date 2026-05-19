import { motion } from 'framer-motion';
import Navbar from '../components/party/Navbar';
import LeadershipSection from '../components/party/LeadershipSection';
import MembersSection from '../components/party/MembersSection';
import Footer from '../components/party/Footer';

export default function LeadershipPage({ lang, setLang }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      className="min-h-screen bg-[#0B0F17] flex flex-col text-white"
    >
      <Navbar lang={lang} setLang={setLang} theme="dark" />
      <LeadershipSection lang={lang} />
      <MembersSection lang={lang} />
      <Footer lang={lang} />
    </motion.div>
  );
}




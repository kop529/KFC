import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/party/Navbar';
import MapCanvas from '../components/map/MapCanvas';
import ZoneSidebar from '../components/map/ZoneSidebar';
import ZoneDetailPanel from '../components/map/ZoneDetailPanel';
import FeedbackModal from '../components/map/FeedbackModal';
import { useFeedback } from '../hooks/useFeedback';
import { ZONES } from '../components/map/zones.config';

export default function SchoolMapPage({ lang, setLang }) {
  const [activeZoneId, setActiveZoneId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { feedback, addFeedback, getFeedbackForZone, getZoneCounts } = useFeedback();

  const handleZoneSelect = (zoneId) => {
    setActiveZoneId(zoneId);
  };

  const handleBack = () => {
    setActiveZoneId(null);
  };

  const activeZone = ZONES.find(z => z.id === activeZoneId);
  const zoneFeedback = activeZone ? getFeedbackForZone(activeZone.id) : [];
  const zoneCounts = getZoneCounts();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      className="h-screen bg-[#0B0F17] flex flex-col font-sans overflow-hidden"
    >
      <Navbar lang={lang} setLang={setLang} theme="dark" />
      
      <main className="flex-1 relative flex mt-20 lg:mt-24 overflow-hidden">
        {/* Background Canvas */}
        <MapCanvas 
          activeZone={activeZoneId} 
          onZoneSelect={handleZoneSelect} 
          zoneCounts={zoneCounts} 
        />
        
        {/* Overlays */}
        <ZoneSidebar 
          activeZone={activeZoneId} 
          onZoneSelect={handleZoneSelect} 
          zoneCounts={zoneCounts} 
        />

        <AnimatePresence>
          {activeZoneId && (
            <ZoneDetailPanel 
              zone={activeZone} 
              feedback={zoneFeedback} 
              onBack={handleBack} 
              onOpenModal={() => setIsModalOpen(true)}
            />
          )}
        </AnimatePresence>

        <FeedbackModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          zone={activeZone} 
          onSubmit={addFeedback} 
        />
      </main>
    </motion.div>
  );
}

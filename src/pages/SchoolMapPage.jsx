import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, List, Map } from 'lucide-react';
import Navbar from '../components/party/Navbar';
import MapCanvas from '../components/map/MapCanvas';
import ZoneSidebar from '../components/map/ZoneSidebar';
import ZoneDetailPanel from '../components/map/ZoneDetailPanel';
import FeedbackModal from '../components/map/FeedbackModal';
import MapTutorial from '../components/map/MapTutorial';
import { useFeedback } from '../hooks/useFeedback';
import { useMapTutorial } from '../hooks/useMapTutorial';
import { ZONES } from '../components/map/zones.config';

export default function SchoolMapPage({ lang, setLang }) {
  const [activeZoneId, setActiveZoneId] = useState(null);
  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);   // zone-specific modal
  const [isGeneralModalOpen, setIsGeneralModalOpen] = useState(false); // broad school issue modal
  const { feedback, addFeedback, getFeedbackForZone, getZoneCounts, upvoteFeedback, upvotedIds, isOnCooldown } = useFeedback();
  const { showTutorial, step: tutorialStep, demoZoneId, nextStep, skipTutorial, startTutorial } = useMapTutorial();

  // Responsive state for mobile & tablet
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileList, setShowMobileList] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024); // Include tablets (e.g., iPads in portrait)
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleZoneSelect = (zoneId) => { 
    setActiveZoneId(zoneId); 
    setShowMobileList(false); // Auto close sidebar list when a zone is selected
  };

  // Called by tutorial step 1 — only selects the demo zone
  // (the tutorial component itself calls onNext() to advance the step)
  const handleTutorialZoneSelect = (zoneId) => {
    handleZoneSelect(zoneId);
  };

  // Re-launch tutorial: reset zone state first so the welcome card
  // doesn't overlay a zoomed-in map with the detail panel visible
  const handleStartTutorial = () => {
    setActiveZoneId(null);
    startTutorial();
  };
  
  const handleBack = () => { setActiveZoneId(null); };

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
          isMobile={isMobile}
          showMobileList={showMobileList}
          showTutorial={showTutorial}
          tutorialStep={tutorialStep}
          demoZoneId={demoZoneId}
          nextStep={nextStep}
          skipTutorial={skipTutorial}
          handleTutorialZoneSelect={handleTutorialZoneSelect}
          lang={lang}
          onBack={handleBack}
        />

        {/* Zone list sidebar */}
        <ZoneSidebar
          activeZone={activeZoneId}
          onZoneSelect={handleZoneSelect}
          zoneCounts={zoneCounts}
          isMobile={isMobile}
          showMobileList={showMobileList}
          onCloseMobileList={() => setShowMobileList(false)}
        />

        {/* Zone detail panel (slides in from right on zone click) */}
        <AnimatePresence>
          {activeZoneId && (
            <ZoneDetailPanel
              zone={activeZone}
              feedback={zoneFeedback}
              onBack={handleBack}
              onOpenModal={() => setIsZoneModalOpen(true)}
              onUpvote={upvoteFeedback}
              upvotedIds={upvotedIds}
              isMobile={isMobile}
            />
          )}
        </AnimatePresence>

        {/* Help button — visible when no zone is active and not in tutorial */}
        {!activeZoneId && !showTutorial && (
          <button 
            onClick={handleStartTutorial}
            className="absolute top-6 right-6 md:top-8 md:right-8 z-30 text-[11px] font-bold text-white/35 hover:text-white/75 transition-all focus:outline-none flex items-center gap-1.5 cursor-pointer"
            style={{ fontFamily: lang === 'th' ? "'anakotmai', sans-serif" : "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
          >
            <span className="underline underline-offset-2 decoration-white/10 hover:decoration-white/45 font-anakotmai">
              {lang === 'th' ? 'วิธีเเจ้งปัญหา?' : "How to report an issue?"}
            </span>
            <span className="inline-block text-[9px] text-[#FF6B00] animate-pulse">
              ✦
            </span>
          </button>
        )}

        {/* ─── Mobile Floating Toggle Sidebar Button ─── */}
        {isMobile && !activeZoneId && (
          <motion.button
            onClick={() => setShowMobileList(!showMobileList)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="absolute bottom-6 left-6 z-30 flex items-center gap-2 bg-[#111827]/95 hover:bg-[#111827] text-white border border-white/10 px-5 py-3 rounded-full shadow-lg shadow-black/40 font-anakotmai font-bold text-sm transition-all active:scale-95"
          >
            {showMobileList ? <Map size={16} className="text-[#FF6B00]" /> : <List size={16} className="text-[#FF6B00]" />}
            {showMobileList ? 'แสดงแผนที่' : 'ค้นหาพื้นที่'}
          </motion.button>
        )}

        {/* ─── Floating "Broad School Issue" Button ─── */}
        <motion.button
          onClick={() => setIsGeneralModalOpen(true)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="absolute bottom-6 right-6 z-30 flex items-center gap-3 bg-[#FF6B00] hover:bg-[#EA580C] text-white px-5 py-3 rounded-full shadow-lg shadow-[#FF6B00]/30 font-anakotmai font-bold text-sm transition-colors hover:scale-105 active:scale-95"
        >
          <Globe size={18} />
          แจ้งปัญหาโรงเรียนโดยรวม
        </motion.button>

        {/* Zone-specific feedback modal */}
        <FeedbackModal
          isOpen={isZoneModalOpen}
          onClose={() => setIsZoneModalOpen(false)}
          zone={activeZone}
          onSubmit={addFeedback}
          isGeneral={false}
          isOnCooldown={isOnCooldown}
        />

        {/* General / broad school feedback modal */}
        <FeedbackModal
          isOpen={isGeneralModalOpen}
          onClose={() => setIsGeneralModalOpen(false)}
          zone={null}
          onSubmit={addFeedback}
          isGeneral={true}
          isOnCooldown={isOnCooldown}
        />

        {/* ─── First-visit tutorial overlay ─── */}
        {showTutorial && tutorialStep !== 1 && (
          <MapTutorial
            lang={lang}
            step={tutorialStep}
            demoZoneId={demoZoneId}
            onNext={nextStep}
            onSkip={skipTutorial}
            onZoneSelect={handleTutorialZoneSelect}
            isZoneModalOpen={isZoneModalOpen}
          />
        )}
      </main>
    </motion.div>
  );
}

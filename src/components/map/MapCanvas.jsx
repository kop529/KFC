import { useState, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZONES } from './zones.config';
import ZonePolygon from './ZonePolygon';
import ZoneBubble from './ZoneBubble';
import MapImage from '@/assets/school-map.jpg';
import MapTutorial from './MapTutorial';
import { TransformWrapper, TransformComponent, useControls } from 'react-zoom-pan-pinch';

const MapControls = ({ activeZone }) => {
  const { zoomToElement, resetTransform } = useControls();
  
  // Auto-pan to the selected zone when activeZone changes
  // We use the ID on the <g> element to find the center
  useEffect(() => {
    if (activeZone) {
      // Small timeout to ensure DOM is updated
      setTimeout(() => {
        zoomToElement(`zone-${activeZone}`, 1.6, 500);
      }, 50);
    } else {
      resetTransform(500);
    }
  }, [activeZone, zoomToElement, resetTransform]);

  return null;
};

export default function MapCanvas({ 
  activeZone, 
  onZoneSelect, 
  zoneCounts, 
  isMobile,
  showMobileList,
  showTutorial,
  tutorialStep,
  demoZoneId,
  nextStep,
  skipTutorial,
  handleTutorialZoneSelect,
  lang,
  onBack
}) {
  const containerRef = useRef(null);
  const svgRef = useRef(null);

  // viewBox matching the approx aspect ratio of the map
  const viewBox = "0 0 1024 768";

  // Dynamically calculate the center of the active zone for precise zooming
  const { originX, originY } = useMemo(() => {
    if (!activeZone) return { originX: "50%", originY: "50%" };

    const zoneData = ZONES.find(z => z.id === activeZone);
    if (zoneData && zoneData.points) {
      const coords = zoneData.points.split(' ').map(p => p.split(',').map(Number));
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      coords.forEach(([x, y]) => {
        if (!isNaN(x) && x < minX) minX = x;
        if (!isNaN(x) && x > maxX) maxX = x;
        if (!isNaN(y) && y < minY) minY = y;
        if (!isNaN(y) && y > maxY) maxY = y;
      });
      const cx = (minX + maxX) / 2;
      const cy = (minY + maxY) / 2;

      // Convert to percentages based on viewBox
      return {
        originX: `${(cx / 1024) * 100}%`,
        originY: `${(cy / 768) * 100}%`
      };
    }
    return { originX: "50%", originY: "50%" };
  }, [activeZone]);

  const mapContent = (
    <>
      <img
        src={MapImage}
        alt="School Map"
        className="absolute inset-0 w-full h-full object-cover opacity-80 rounded-lg pointer-events-none"
      />
      <svg
        ref={svgRef}
        viewBox={viewBox}
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <AnimatePresence>
          {ZONES.map((zone) => {
            const isSelected = activeZone === zone.id;
            const isHoveredOrNone = !activeZone || isSelected;

            if (!isHoveredOrNone && activeZone) return null; // hide others when focused

            return (
              <g key={zone.id} id={`zone-${zone.id}`}>
                <ZonePolygon
                  zone={zone}
                  isSelected={isSelected}
                  onClick={() => onZoneSelect(zone.id)}
                />
                {!isSelected && zoneCounts[zone.id] > 0 && (
                  <ZoneBubble
                    zone={zone}
                    count={zoneCounts[zone.id]}
                    onClick={() => onZoneSelect(zone.id)}
                  />
                )}
              </g>
            );
          })}
        </AnimatePresence>
      </svg>

      {showTutorial && tutorialStep === 1 && (
        <MapTutorial
          lang={lang}
          activeZone={activeZone}
          step={tutorialStep}
          demoZoneId={demoZoneId}
          onNext={nextStep}
          onSkip={skipTutorial}
          onZoneSelect={handleTutorialZoneSelect}
        />
      )}
    </>
  );

  // ─── MOBILE VIEW TRACK (Pinch-to-Zoom & Pan) ───
  if (isMobile) {
    const isBottomSheetOpen = activeZone || showMobileList;
    return (
      <div 
        className={`relative w-full bg-[#0B0F17] overflow-hidden flex items-center justify-center pt-16 transition-all duration-500 ${isBottomSheetOpen ? 'h-[25vh]' : 'h-[100dvh]'}`} 
        ref={containerRef}
      >
        <TransformWrapper
          initialScale={1}
          initialPositionX={0}
          initialPositionY={0}
          minScale={0.8}
          maxScale={4}
          centerOnInit={true}
          wheel={{ step: 0.1 }}
          pinch={{ step: 5 }}
        >
          <MapControls activeZone={activeZone} />
          <TransformComponent 
            wrapperStyle={{ width: "100%", height: "100%" }} 
            contentStyle={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <div className="relative w-full aspect-[4/3] shadow-2xl">
              {mapContent}
            </div>
          </TransformComponent>
        </TransformWrapper>
      </div>
    );
  }

  const handleWheel = (e) => {
    if (!isMobile && activeZone && e.deltaY > 0) {
      if (onBack) onBack();
    }
  };

  // ─── DESKTOP VIEW TRACK ───
  return (
    <div 
      className="relative w-full h-full bg-[#0B0F17] overflow-hidden flex items-center justify-center" 
      ref={containerRef}
      onWheel={handleWheel}
    >
      <motion.div
        className="relative w-full max-w-6xl aspect-[4/3] shadow-2xl origin-center"
        animate={{
          scale: activeZone ? 1.8 : 1,
          x: activeZone ? -120 : 0, // Shift left slightly to make room for the right detail panel on desktop
        }}
        style={{ transformOrigin: `${originX} ${originY}` }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {mapContent}
      </motion.div>
    </div>
  );
}

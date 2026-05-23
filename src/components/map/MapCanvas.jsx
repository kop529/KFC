import { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZONES } from './zones.config';
import ZonePolygon from './ZonePolygon';
import ZoneBubble from './ZoneBubble';
import MapImage from '@/assets/school-map.jpg';
import MapTutorial from './MapTutorial';

export default function MapCanvas({ 
  activeZone, 
  onZoneSelect, 
  zoneCounts, 
  isMobile,
  showTutorial,
  tutorialStep,
  demoZoneId,
  nextStep,
  skipTutorial,
  handleTutorialZoneSelect,
  lang
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
              <g key={zone.id}>
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
          step={tutorialStep}
          demoZoneId={demoZoneId}
          onNext={nextStep}
          onSkip={skipTutorial}
          onZoneSelect={handleTutorialZoneSelect}
        />
      )}
    </>
  );

  // ─── MOBILE VIEW TRACK ───
  if (isMobile) {
    return (
      <div className="relative w-full h-[100dvh] bg-[#0B0F17] overflow-hidden flex items-center justify-center pt-16" ref={containerRef}>
        {/* On mobile, we limit the scale factor and keep X centered to prevent overflow-breaking zooms */}
        <motion.div
          className="relative w-full aspect-[4/3] shadow-2xl origin-center"
          animate={{
            scale: activeZone ? 1.4 : 1,
            x: 0, 
            y: activeZone ? -40 : 0
          }}
          style={{ transformOrigin: `${originX} ${originY}` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {mapContent}
        </motion.div>
      </div>
    );
  }

  // ─── DESKTOP VIEW TRACK ───
  return (
    <div className="relative w-full h-full bg-[#0B0F17] overflow-hidden flex items-center justify-center" ref={containerRef}>
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

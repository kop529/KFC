import { motion } from 'framer-motion';

export default function ZonePolygon({ zone, isSelected, onClick }) {
  const filterId = `glow-${zone.id}`;

  return (
    <>
      {/* SVG filter for the active glow halo — defined per-zone to avoid conflicts */}
      {isSelected && (
        <defs>
          <filter id={filterId} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow
              dx="0" dy="0"
              stdDeviation="6"
              floodColor="#FF6B00"
              floodOpacity="0.9"
            />
          </filter>
        </defs>
      )}

      <motion.polygon
        points={zone.points}
        onClick={onClick}
        className="cursor-pointer outline-none"
        style={isSelected ? { filter: `url(#${filterId})` } : {}}
        initial={{ fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,107,0,0)', strokeWidth: 1 }}
        animate={{
          fill: isSelected ? 'rgba(255,107,0,0.55)' : 'rgba(255,255,255,0.08)',
          stroke: isSelected ? '#FF6B00' : 'rgba(255,107,0,0.4)',
          strokeWidth: isSelected ? 3 : 1,
        }}
        whileHover={!isSelected ? {
          fill: 'rgba(255,107,0,0.25)',
          stroke: '#FF6B00',
          strokeWidth: 2,
        } : {}}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
    </>
  );
}

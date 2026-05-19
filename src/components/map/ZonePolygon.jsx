import { motion } from 'framer-motion';

export default function ZonePolygon({ zone, isSelected, onClick }) {
  return (
    <motion.polygon
      points={zone.points}
      onClick={onClick}
      className="cursor-pointer outline-none transition-all duration-300"
      initial={{ fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(99,179,237,0)' }}
      animate={{
        fill: isSelected ? 'rgba(99,179,237,0.45)' : 'rgba(255,255,255,0.08)',
        stroke: isSelected ? '#63B3ED' : 'rgba(99,179,237,0.5)',
        strokeWidth: isSelected ? 4 : 1,
      }}
      whileHover={{
        fill: 'rgba(99,179,237,0.25)',
        stroke: '#63B3ED',
        strokeWidth: 2,
      }}
    />
  );
}

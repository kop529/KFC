import { motion } from 'framer-motion';

export default function ZoneBubble({ zone, count, onClick }) {
  // Simple heuristic to place bubble at the center of the polygon
  const coords = zone.points.split(' ').map(p => p.split(',').map(Number));
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  coords.forEach(([x, y]) => {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  });
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;

  return (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <circle cx={cx} cy={cy} r="18" fill="#1E3A5F" stroke="#63B3ED" strokeWidth="2" />
      <motion.circle
        cx={cx} cy={cy} r="22"
        fill="none" stroke="#63B3ED" strokeWidth="1"
        animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0, 0.8] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <text x={cx} y={cy} textAnchor="middle" dy=".3em" fill="white" className="font-bold font-inter text-[12px] pointer-events-none">
        {count}
      </text>
    </motion.g>
  );
}

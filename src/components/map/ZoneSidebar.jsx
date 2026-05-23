import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { ZONES } from './zones.config';

// SEO-like aliases mapping for smarter search
const normalizeText = (text) => {
  return text.toLowerCase()
    .replace(/ตึก/g, 'อาคาร')
    .replace(/กินข้าว/g, 'โรงอาหาร')
    .replace(/เตะบอล|สนามบอล/g, 'สนามกีฬา')
    .replace(/ว่ายน้ำ/g, 'สระน้ำ')
    .replace(/ห้องสมุด/g, 'สำนักงาน');
};

export default function ZoneSidebar({ activeZone, onZoneSelect, zoneCounts, isMobile, showMobileList, onCloseMobileList }) {
  const [search, setSearch] = useState('');

  const sortedZones = [...ZONES]
    .map(z => ({ ...z, count: zoneCounts[z.id] || 0 }))
    .filter(z => {
      const query = normalizeText(search);
      const target = normalizeText(`${z.th} ${z.en}`);
      return target.includes(query);
    })
    .sort((a, b) => b.count - a.count);

  // Responsive x offset logic for sliding
  const xOffset = isMobile 
    ? (showMobileList && !activeZone ? 0 : "-100%") 
    : (activeZone ? "-100%" : 0);

  return (
    <motion.div 
      className="w-full sm:w-80 bg-[#111827] border-r border-white/10 h-full flex flex-col absolute left-0 top-0 z-20 shadow-2xl sm:shadow-none"
      initial={{ x: "-100%" }}
      animate={{ x: xOffset }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="p-6 border-b border-white/10 relative">
        {isMobile && (
          <button 
            onClick={onCloseMobileList}
            className="absolute top-6 right-6 p-2 text-white/50 hover:text-white transition-colors"
            aria-label="Close search list"
          >
            <X size={20} />
          </button>
        )}
        <h2 className="text-white font-anakotmai font-bold text-2xl mb-4">เเจ้งปัญหาโรงเรียน</h2>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input 
            type="text" 
            placeholder="ค้นหาพื้นที่..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-md py-2 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#63B3ED] font-anakotmai"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        {sortedZones.map((zone) => (
          <button
            key={zone.id}
            onClick={() => onZoneSelect(zone.id)}
            className="w-full flex items-center justify-between p-4 rounded-md bg-white/5 hover:bg-white/10 transition-colors border border-white/5 hover:border-[#63B3ED]/50 group text-left"
          >
            <div>
              <div className="text-white font-anakotmai font-bold">{zone.th}</div>
              <div className="text-white/40 text-xs font-inter">{zone.en}</div>
            </div>
            <div className="flex flex-col items-end">
              <span className={`text-lg font-bold font-inter ${zone.count > 0 ? 'text-[#63B3ED]' : 'text-white/20'}`}>
                {zone.count}
              </span>
              <span className="text-[10px] text-white/40 font-anakotmai">เรื่อง</span>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

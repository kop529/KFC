import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MessageSquarePlus, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { th } from 'date-fns/locale';

export default function ZoneDetailPanel({ zone, feedback, onBack, onOpenModal }) {
  if (!zone) return null;

  return (
    <motion.div 
      className="w-96 bg-[#111827] border-l border-white/10 h-full flex flex-col absolute right-0 top-0 z-20 shadow-2xl"
      initial={{ x: 400 }}
      animate={{ x: 0 }}
      exit={{ x: 400 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="p-6 border-b border-white/10 bg-[#0B0F17]">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-white/50 hover:text-white mb-4 text-sm font-anakotmai transition-colors"
        >
          <ArrowLeft size={16} /> ย้อนกลับ
        </button>
        <h2 className="text-white font-anakotmai font-black text-3xl mb-1">{zone.th}</h2>
        <div className="text-[#63B3ED] font-inter text-sm mb-6">{zone.en}</div>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-black text-white font-inter">{feedback.length}</div>
            <div className="text-white/50 text-xs font-anakotmai">ความคิดเห็นทั้งหมด</div>
          </div>
          <button 
            onClick={onOpenModal}
            className="flex items-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white px-4 py-2 rounded-md font-anakotmai font-bold text-sm transition-colors shadow-lg shadow-[#F97316]/20"
          >
            <MessageSquarePlus size={16} /> ส่งความคิดเห็น
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        <AnimatePresence>
          {feedback.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center text-white/30 py-10 font-anakotmai"
            >
              ยังไม่มีความคิดเห็นสำหรับพื้นที่นี้<br/>เป็นคนแรกที่ส่งความคิดเห็นเลย!
            </motion.div>
          ) : (
            feedback.map((f, i) => (
              <motion.div 
                key={f.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 p-4 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-white/70 font-anakotmai">{f.category}</span>
                  <span className="text-[10px] text-white/30 flex items-center gap-1 font-inter">
                    <Clock size={10} /> 
                    {formatDistanceToNow(new Date(f.timestamp), { addSuffix: true, locale: th })}
                  </span>
                </div>
                <p className="text-white text-sm font-anakotmai leading-relaxed">{f.text}</p>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

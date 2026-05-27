import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MessageSquarePlus, Clock, Heart, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { th } from 'date-fns/locale';

export default function ZoneDetailPanel({ zone, feedback, onBack, onOpenModal, onUpvote, upvotedIds, isMobile }) {
  if (!zone) return null;

  return (
    <motion.div
      className={`bg-[#111827] border-white/10 flex flex-col z-20 shadow-2xl
        ${isMobile 
          ? 'fixed bottom-0 left-0 w-full h-[75vh] rounded-t-3xl border-t' 
          : 'absolute right-0 top-0 w-96 h-full border-l'}`}
      initial={{ x: isMobile ? 0 : "100%", y: isMobile ? "100%" : 0 }}
      animate={{ x: 0, y: 0 }}
      exit={{ x: isMobile ? 0 : "100%", y: isMobile ? "100%" : 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Mobile Drag Handle Indicator */}
      {isMobile && (
        <div className="w-full flex justify-center pt-3 bg-[#0B0F17] rounded-t-3xl">
          <div className="w-12 h-1.5 bg-white/20 rounded-full"></div>
        </div>
      )}

      {/* Header */}
      <div className={`p-6 border-b border-white/10 bg-[#0B0F17] relative ${isMobile ? 'pt-2' : ''}`}>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/50 hover:text-white mb-4 text-sm font-anakotmai transition-colors"
        >
          <ArrowLeft size={16} /> ย้อนกลับ
        </button>
        <button
          onClick={onBack}
          className={`absolute p-2 text-white/50 hover:text-[#FF6B00] transition-colors ${isMobile ? 'top-2 right-6' : 'top-6 right-6'}`}
          aria-label="Close panel"
        >
          <X size={20} />
        </button>
        <h2 className="text-white font-anakotmai font-black text-2xl mb-0.5 leading-tight">{zone.th}</h2>
        <div className="text-[#FF6B00] font-inter text-xs mb-5 tracking-wide">{zone.en}</div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-black text-white font-inter">{feedback.length}</div>
            <div className="text-white/50 text-xs font-anakotmai">ความคิดเห็นทั้งหมด</div>
          </div>
          <button
            onClick={onOpenModal}
            data-tutorial="feedback-btn"
            className="flex items-center gap-2 bg-[#FF6B00] hover:bg-[#EA580C] text-white px-4 py-2 rounded-md font-anakotmai font-bold text-sm transition-colors shadow-lg shadow-[#FF6B00]/20"
          >
            <MessageSquarePlus size={16} /> ส่งความคิดเห็น
          </button>
        </div>
      </div>

      {/* Comment list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence>
          {feedback.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center text-white/30 py-12 font-anakotmai text-sm leading-relaxed"
            >
              ยังไม่มีความคิดเห็นสำหรับพื้นที่นี้<br />
              <span className="text-[#FF6B00]/60">เป็นคนแรกที่ส่งความคิดเห็นเลย!</span>
            </motion.div>
          ) : (
            feedback.map((f, i) => {
              const hasUpvoted = upvotedIds?.has(f.id);
              return (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i, 5) * 0.06 }}
                  className="bg-white/5 border border-white/10 hover:border-white/20 p-4 rounded-xl transition-colors"
                >
                  {/* Top row: category chip + timestamp */}
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[10px] bg-white/10 px-2.5 py-1 rounded-full text-white/70 font-anakotmai">
                      {f.category}
                    </span>
                    <span className="text-[10px] text-white/30 flex items-center gap-1 font-inter">
                      <Clock size={9} />
                      {formatDistanceToNow(new Date(f.timestamp), { addSuffix: true, locale: th })}
                    </span>
                  </div>

                  {/* Comment body */}
                  <p className="text-white/90 text-sm font-anakotmai leading-relaxed mb-3">
                    {f.text}
                  </p>

                  {/* Upvote row */}
                  <div className="flex items-center justify-end">
                    <motion.button
                      onClick={() => onUpvote?.(f.id)}
                      whileTap={!hasUpvoted ? { scale: 1.4 } : {}}
                      className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full transition-all duration-200 ${
                        hasUpvoted
                          ? 'text-red-400 bg-red-400/10 cursor-default'
                          : 'text-white/40 hover:text-red-400 hover:bg-red-400/10 cursor-pointer'
                      }`}
                      title={hasUpvoted ? 'ถูกใจแล้ว' : 'กดถูกใจ'}
                    >
                      <Heart
                        size={13}
                        className={hasUpvoted ? 'fill-red-400 text-red-400' : ''}
                      />
                      <span className="font-inter font-semibold tabular-nums">
                        {f.upvotes || 0}
                      </span>
                    </motion.button>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, AlertCircle, Globe } from 'lucide-react';
import { CATEGORIES, ZONES } from './zones.config';
import { filterText } from './wordFilter';

// isGeneral = true means opened from the floating "broad issue" button (no specific zone)
export default function FeedbackModal({ isOpen, onClose, zone, onSubmit, isGeneral = false, isOnCooldown = false }) {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [text, setText] = useState('');
  const [selectedZoneId, setSelectedZoneId] = useState('general');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;
  // Zone-specific mode requires a zone prop
  if (!isGeneral && !zone) return null;

  const effectiveZoneId = isGeneral ? selectedZoneId : zone.id;
  const effectiveZoneName = isGeneral
    ? (selectedZoneId === 'general' ? 'ปัญหาทั่วไป (ไม่ระบุพื้นที่)' : ZONES.find(z => z.id === selectedZoneId)?.th)
    : zone.th;

  const handleClose = () => {
    setText('');
    setError('');
    setSubmitted(false);
    setSelectedZoneId('general');
    setCategory(CATEGORIES[0]);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const { ok, cleaned } = filterText(text);
    if (!ok) {
      setError('ข้อความมีคำที่ไม่เหมาะสม กรุณาแก้ไขก่อนส่ง');
      return;
    }
    
    if (isOnCooldown) {
      setError('กรุณารอสักครู่ก่อนส่งความคิดเห็นใหม่ (Spam Protection)');
      return;
    }

    await onSubmit(effectiveZoneId, category, cleaned);
    setSubmitted(true);
    setTimeout(() => { handleClose(); }, 1800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-[#111827]/80 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          <motion.div
            className="relative bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, y: 80, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <div className={`p-5 text-white flex justify-between items-start ${
              isGeneral ? 'bg-[#FF6B00]' : 'bg-[#0B0F17]'
            }`}>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {isGeneral && <Globe size={16} className="opacity-80" />}
                  <h3 className="font-anakotmai font-bold text-xl">
                    {isGeneral ? 'แจ้งปัญหาของโรงเรียน' : 'ส่งความคิดเห็น'}
                  </h3>
                </div>
                <p className={`text-xs font-anakotmai ${
                  isGeneral ? 'text-white/70' : 'text-[#FF6B00]'
                }`}>
                  {isGeneral ? 'แจ้งปัญหาโดยรวม — ไม่ระบุพื้นที่ก็ได้' : `พื้นที่: ${effectiveZoneName}`}
                </p>
              </div>
              <button onClick={handleClose} className="text-white/60 hover:text-white transition-colors mt-1">
                <X size={20} />
              </button>
            </div>

            {/* Success state */}
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-10 flex flex-col items-center gap-3 text-center"
              >
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                  <Send size={24} className="text-green-600" />
                </div>
                <p className="font-anakotmai font-bold text-[#111827] text-lg">ส่งความคิดเห็นแล้ว!</p>
                <p className="font-anakotmai text-gray-500 text-sm">ขอบคุณที่ช่วยปรับปรุงโรงเรียน</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-5">

                {/* Zone selector — only in general mode */}
                {isGeneral && (
                  <div>
                    <label className="block text-[#111827] text-sm font-bold font-anakotmai mb-2">
                      พื้นที่ที่เกี่ยวข้อง <span className="text-gray-400 font-normal">(ไม่บังคับ)</span>
                    </label>
                    <select
                      value={selectedZoneId}
                      onChange={e => setSelectedZoneId(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-anakotmai text-[#111827] focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] bg-white"
                    >
                      <option value="general">ปัญหาทั่วไป (ไม่ระบุพื้นที่)</option>
                      {ZONES.map(z => (
                        <option key={z.id} value={z.id}>{z.th} — {z.en}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Category chips */}
                <div>
                  <label className="block text-[#111827] text-sm font-bold font-anakotmai mb-2">หมวดหมู่</label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`px-3 py-1.5 text-xs font-anakotmai rounded-full transition-colors ${
                          category === cat
                            ? (isGeneral ? 'bg-[#FF6B00] text-white' : 'bg-[#0B0F17] text-white')
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Text area */}
                <div>
                  <label className="block text-[#111827] text-sm font-bold font-anakotmai mb-2">
                    รายละเอียด <span className="text-gray-400 font-normal text-xs">(ไม่ระบุตัวตน)</span>
                  </label>
                  <textarea
                    data-tutorial="feedback-textarea"
                    value={text}
                    onChange={e => { setText(e.target.value); setError(''); }}
                    placeholder={isGeneral ? 'อธิบายปัญหาหรือข้อเสนอแนะสำหรับโรงเรียน...' : 'พิมพ์ข้อเสนอแนะหรือปัญหาที่พบในพื้นที่นี้...'}
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm font-anakotmai focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] min-h-[120px] resize-none text-[#111827]"
                    maxLength={300}
                  />
                  <div className="flex justify-end mt-1">
                    <span className="text-xs text-gray-400 font-inter">{text.length}/300</span>
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    className="bg-red-50 text-red-500 p-3 rounded-lg text-xs font-anakotmai flex items-center gap-2"
                  >
                    <AlertCircle size={14} /> {error}
                  </motion.div>
                )}

                <button
                  type="submit"
                  data-tutorial="feedback-submit"
                  disabled={!text.trim() || isOnCooldown}
                  className={`w-full disabled:bg-gray-300 disabled:text-gray-500 text-white py-3 rounded-lg font-anakotmai font-bold flex items-center justify-center gap-2 transition-colors ${
                    isGeneral
                      ? 'bg-[#FF6B00] hover:bg-[#EA580C]'
                      : 'bg-[#0B0F17] hover:bg-[#1a2333]'
                  }`}
                >
                  <Send size={16} /> {isOnCooldown ? 'กรุณารอสักครู่...' : 'ส่งความคิดเห็น'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

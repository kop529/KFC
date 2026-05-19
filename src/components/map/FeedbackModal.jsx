import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, AlertCircle } from 'lucide-react';
import { CATEGORIES } from './zones.config';
import { filterText } from './wordFilter';

export default function FeedbackModal({ isOpen, onClose, zone, onSubmit }) {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !zone) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const { ok, cleaned } = filterText(text);
    if (!ok) {
      setError('ข้อความมีคำที่ไม่เหมาะสม กรุณาแก้ไขก่อนส่ง');
      return;
    }

    onSubmit(zone.id, category, cleaned);
    setText('');
    setError('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          className="absolute inset-0 bg-[#111827]/80 backdrop-blur-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        />
        
        <motion.div 
          className="relative bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden"
          initial={{ opacity: 0, y: 100, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <div className="bg-[#0B0F17] p-5 text-white flex justify-between items-center">
            <div>
              <h3 className="font-anakotmai font-bold text-xl">ส่งความคิดเห็น</h3>
              <p className="text-[#63B3ED] text-xs font-anakotmai">พื้นที่: {zone.th}</p>
            </div>
            <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
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
                        ? 'bg-[#1E3A5F] text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[#111827] text-sm font-bold font-anakotmai mb-2">รายละเอียด (ไม่ระบุตัวตน)</label>
              <textarea
                value={text}
                onChange={e => { setText(e.target.value); setError(''); }}
                placeholder="พิมพ์ข้อเสนอแนะหรือปัญหาที่พบ..."
                className="w-full border border-gray-200 rounded-lg p-3 text-sm font-anakotmai focus:outline-none focus:border-[#63B3ED] focus:ring-1 focus:ring-[#63B3ED] min-h-[120px] resize-none text-[#111827]"
                maxLength={200}
              />
              <div className="flex justify-end mt-1">
                <span className="text-xs text-gray-400 font-inter">{text.length}/200</span>
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
              disabled={!text.trim()}
              className="w-full bg-[#F97316] disabled:bg-gray-300 disabled:text-gray-500 hover:bg-[#EA580C] text-white py-3 rounded-lg font-anakotmai font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Send size={16} /> ส่งความคิดเห็น
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

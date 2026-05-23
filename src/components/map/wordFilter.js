export const filterText = (text) => {
  if (!text) return { ok: true, cleaned: '' };
  
  const bannedWords = ['เหี้ย', 'ควาย', 'สัตว์', 'ไอ้', 'อี', 'มึง', 'กู'];
  const hasProfanity = bannedWords.some(word => text.includes(word));
  
  if (hasProfanity) {
    return { ok: false, cleaned: text };
  }
  
  return { ok: true, cleaned: text.trim().substring(0, 300) };
};
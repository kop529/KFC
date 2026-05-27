// S-03 Fix: Normalize text before filtering to prevent trivial bypasses
// (spaces between chars, zero-width chars, Unicode lookalikes)
const normalizeForFilter = (text) => {
  return text
    .normalize('NFKC')                          // Normalize Unicode (collapses lookalikes)
    .replace(/[\u200B-\u200D\uFEFF]/g, '')      // Strip zero-width characters
    .replace(/\s+/g, '')                         // Collapse all whitespace
    .toLowerCase();
};

export const filterText = (text) => {
  if (!text) return { ok: true, cleaned: '' };
  
  const normalized = normalizeForFilter(text);
  const bannedWords = ['เหี้ย', 'ควาย', 'สัตว์', 'ไอ้', 'อี', 'มึง', 'กู'];
  const hasProfanity = bannedWords.some(word => normalized.includes(normalizeForFilter(word)));
  
  if (hasProfanity) {
    return { ok: false, cleaned: text };
  }
  
  return { ok: true, cleaned: text.trim().substring(0, 300) };
};
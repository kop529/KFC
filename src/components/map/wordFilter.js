export function filterText(text) {
  const banned = ['เหี้ย', 'ควาย', 'สัตว์', 'ไอ้', 'อี', 'มึง', 'กู', 'ควย', 'สัส'];
  const found = banned.filter(w => text.includes(w));
  if (found.length > 0) return { ok: false, cleaned: text };
  return { ok: true, cleaned: text.trim() };
}

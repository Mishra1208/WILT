// Stable colour per topic so a category always looks the same across the app.
// Solid, slightly deep tones that read well as small text on white.
const PALETTE = [
  { text: 'text-[#1F4FD1]', dot: 'bg-[#1F4FD1]', chip: 'bg-[#EEF3FF] text-[#1F4FD1]' },
  { text: 'text-[#0F766E]', dot: 'bg-[#0F766E]', chip: 'bg-[#E9F7F5] text-[#0F766E]' },
  { text: 'text-[#B4233C]', dot: 'bg-[#B4233C]', chip: 'bg-[#FCEEF0] text-[#B4233C]' },
  { text: 'text-[#9A5B00]', dot: 'bg-[#D99A1E]', chip: 'bg-[#FFF6E0] text-[#9A5B00]' },
  { text: 'text-[#6B4FBB]', dot: 'bg-[#6B4FBB]', chip: 'bg-[#F2EFFB] text-[#6B4FBB]' },
  { text: 'text-[#2F6B2F]', dot: 'bg-[#3E8E3E]', chip: 'bg-[#EEF7EE] text-[#2F6B2F]' }
];

export const topicColor = (topic = '') => {
  let h = 0;
  for (let i = 0; i < topic.length; i++) h = (h * 31 + topic.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
};

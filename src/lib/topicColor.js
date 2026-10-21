// Stable colour per topic so a category always looks the same across the app.
// Drawn from the same Figma palettes as the rest of the UI.
const PALETTE = [
  { text: 'text-[#1F5E45]', dot: 'bg-[#174C38]', chip: 'bg-[#EEF5F1] text-[#1F5E45]' },  // racing green
  { text: 'text-[#225F73]', dot: 'bg-[#225F73]', chip: 'bg-[#EEF5F7] text-[#225F73]' },  // petrol
  { text: 'text-[#8F3333]', dot: 'bg-[#8F3333]', chip: 'bg-[#FBF1F1] text-[#8F3333]' },  // oxblood
  { text: 'text-[#8A6A12]', dot: 'bg-[#D9A400]', chip: 'bg-[#FFF8DC] text-[#8A6A12]' },  // honey
  { text: 'text-[#515081]', dot: 'bg-[#515081]', chip: 'bg-[#EFEFF6] text-[#515081]' },  // dusk (Blue eclipse)
  { text: 'text-[#723E22]', dot: 'bg-[#723E22]', chip: 'bg-[#F7EFEA] text-[#723E22]' }   // rust (Yacht club)
];

export const topicColor = (topic = '') => {
  let h = 0;
  for (let i = 0; i < topic.length; i++) h = (h * 31 + topic.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
};

import React from 'react';
import { ArrowUpRight, Heart } from 'lucide-react';

const TONES = [
  { panel: 'bg-[#FFE3D6]', dot: 'bg-marker-orange' },
  { panel: 'bg-[#E1EEFC]', dot: 'bg-marker-blue' },
  { panel: 'bg-[#DDF5E6]', dot: 'bg-marker-green' },
  { panel: 'bg-[#FFF4D1]', dot: 'bg-highlight' }
];
const toneFor = (topic = '') => {
  let h = 0;
  for (let i = 0; i < topic.length; i++) h = (h * 31 + topic.charCodeAt(i)) >>> 0;
  return TONES[h % TONES.length];
};

/** The newest real notes, as colourful cards. */
export const FreshNotes = ({ posts = [], onOpen, onSeeAll }) => {
  const items = posts.slice(0, 6);
  return (
    <section className="bg-paper py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <div className="font-hand text-[22px] text-marker-orange" data-reveal="up">Fresh from campus</div>
            <h2 className="mt-2 text-ink font-semibold leading-[1.05] tracking-[-0.05em] text-[clamp(2.2rem,4.6vw,3.6rem)]" data-reveal="words">
              What students learned this week
            </h2>
          </div>
          <button onClick={onSeeAll} className="self-start sm:self-auto px-6 py-3 rounded-full border-2 border-ink text-ink text-[15px] font-semibold hover:bg-ink hover:text-white transition-colors cursor-pointer inline-flex items-center gap-2" data-reveal="up">
            See all notes <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {items.length > 0 ? (
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((p) => {
              const tone = toneFor(p.category || '');
              return (
                <button
                  key={p.id}
                  onClick={() => onOpen(p)}
                  className="group text-left rounded-[24px] bg-white p-3 border border-line hover:shadow-[0_24px_50px_-28px_rgba(30,30,30,0.4)] transition-shadow cursor-pointer flex flex-col"
                  data-reveal="up"
                >
                  <div className={`${tone.panel} rounded-[18px] p-6 min-h-[170px] flex flex-col justify-between`}>
                    <span className="inline-flex items-center gap-2 self-start rounded-full bg-white/80 px-3 py-1 text-[13px] font-semibold text-ink">
                      <span className={`w-2 h-2 rounded-full ${tone.dot}`} />
                      {p.category}
                    </span>
                    <div className="mt-6 text-[21px] font-semibold leading-snug tracking-[-0.03em] text-ink line-clamp-3">{p.title}</div>
                  </div>
                  <div className="px-3 pt-4 pb-2 flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 min-w-0">
                      <img src={p.author?.avatar || ''} alt="" onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }} className="w-7 h-7 rounded-full bg-paper shrink-0" />
                      <span className="text-[14px] font-medium text-ink truncate">@{p.author?.username || 'learner'}</span>
                    </span>
                    <span className="flex items-center gap-1 text-[14px] text-muted shrink-0">
                      <Heart className="w-4 h-4" /> {p.likes || 0}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="mt-10 text-[18px] text-muted">No notes yet this week. Be the first.</p>
        )}
      </div>
    </section>
  );
};

export default FreshNotes;

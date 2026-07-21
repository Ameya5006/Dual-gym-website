// src/pages/boxing/BoxingEquipment.tsx
// SRP: Only renders the equipment grid, grouped by category

import { BOXING_EQUIPMENT } from '../../constants/plans';

const CATEGORY_LABELS: Record<string, string> = {
  boxing:    '🥊 Boxing Equipment',
  machine:   '⚙️ Mechanical Machines',
  freeweight:'🏋️ Free Weights',
};

export default function BoxingEquipment() {
  // Group equipment by category
  const grouped = BOXING_EQUIPMENT.reduce<Record<string, typeof BOXING_EQUIPMENT>>(
    (acc, item) => {
      const cat = item.category ?? 'machine';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    },
    {}
  );

  // Render in this order
  const categoryOrder = ['boxing', 'machine', 'freeweight'];

  return (
    <div className="bg-boxing-dark min-h-screen text-white py-16">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <p className="text-boxing-red text-xs uppercase tracking-[0.3em] font-boxing font-semibold mb-3">
          The Gym
        </p>
        <h1 className="font-boxing font-black uppercase text-5xl md:text-6xl leading-none mb-4">
          Equipment & Facilities
        </h1>

        {/* Callout */}
        <div className="border-l-4 border-boxing-red pl-4 py-2 mb-14 bg-boxing-red/5">
          <p className="font-boxing font-bold uppercase text-boxing-red text-lg">
            No AC. No music. No distractions.
          </p>
          <p className="text-white/50 text-sm mt-1">
            Authentic mechanical machines only. Train the way champions are made — through pure effort.
          </p>
        </div>

        {/* Equipment sections */}
        {categoryOrder.map((cat) => {
          const items = grouped[cat];
          if (!items?.length) return null;
          return (
            <div key={cat} className="mb-14">
              <h2 className="font-boxing font-bold uppercase text-xl text-white/70 mb-6 tracking-widest border-b border-white/10 pb-3">
                {CATEGORY_LABELS[cat] ?? cat}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {items.map((item) => (
                  <div
                    key={item.name}
                    className="group border border-white/10 bg-boxing-gray/30 hover:border-boxing-red/50 transition-all duration-300 overflow-hidden"
                  >
<div className={`overflow-hidden ${item.category === 'boxing' ? 'h-44' : 'h-75'}`}>
  <img
    src={item.imageUrl}
    alt={item.name}
    loading="lazy"
    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
  />
</div>
                    <div className="p-4">
                      <h3 className="font-boxing font-bold uppercase text-white text-base mb-1 leading-tight">
                        {item.name}
                      </h3>
                      <p className="text-white/50 text-xs leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}

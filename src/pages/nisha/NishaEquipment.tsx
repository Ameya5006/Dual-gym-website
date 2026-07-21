// src/pages/nisha/NishaEquipment.tsx

import { NISHA_EQUIPMENT } from '../../constants/plans';

const CATEGORY_LABELS: Record<string, string> = {
  cardio:     '🏃 Cardio Equipment',
  machine:    '⚙️ Strength Machines',
  freeweight: '🏋️ Free Weights',
};

export default function NishaEquipment() {
  const grouped = NISHA_EQUIPMENT.reduce<Record<string, typeof NISHA_EQUIPMENT>>(
    (acc, item) => {
      const cat = item.category ?? 'machine';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {}
  );

  return (
    <div className="bg-nisha-dark min-h-screen text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-nisha-rose text-xs uppercase tracking-[0.3em] font-semibold mb-3 font-body">Facilities</p>
        <h1 className="font-nisha text-5xl text-white mb-4">Equipment & Facilities</h1>

        {/* Highlights */}
        <div className="flex flex-wrap gap-3 mb-12">
          {['Air Conditioned', 'Music System', 'Women Only', 'Quality Machines'].map(tag => (
            <span key={tag} className="px-4 py-1.5 bg-nisha-rose/10 border border-nisha-rose/30 text-nisha-rose text-xs font-semibold uppercase tracking-widest rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {['cardio', 'machine', 'freeweight'].map(cat => {
          const items = grouped[cat];
          if (!items?.length) return null;
          return (
            <div key={cat} className="mb-14">
              <h2 className="text-white/50 text-sm uppercase tracking-widest font-semibold mb-6 border-b border-nisha-rose/20 pb-3">
                {CATEGORY_LABELS[cat]}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {items.map(item => (
                  <div key={item.name}
                    className="group border border-nisha-rose/15 bg-white/5 hover:border-nisha-rose/40 hover:bg-white/8 transition-all duration-300 overflow-hidden rounded">
                    <div className={`overflow-hidden ${
                      ['Full-Size Treadmills', 'Crossfit Machine', 'Lat Pulldown', 'Pec Deck Fly', 'Back Hyperextension', 'Abdominal Bench', 'Parallel Bar Dips'].includes(item.name)
                        ? 'h-80'
                        : item.category === 'cardio' ? 'h-80' : 'h-80'
                    }`}>
                      <img src={item.imageUrl} alt={item.name} loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-body font-semibold text-white text-base mb-1 leading-tight">{item.name}</h3>
                      <p className="text-white/40 text-xs leading-relaxed">{item.description}</p>
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
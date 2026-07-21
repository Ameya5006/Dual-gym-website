// src/components/ui/PlanCard.tsx

import type { MembershipPlan, GymType } from '../../types';

interface PlanCardProps {
  plan: MembershipPlan;
  gym: GymType;
  onSelect: (plan: MembershipPlan) => void;
}

export default function PlanCard({ plan, gym, onSelect }: PlanCardProps) {
  const isBoxing = gym === 'boxing';

  // Duration label
  const durationMap: Record<string, string> = {
    monthly: '1 Month',
    '3month': '3 Months',
    '6month': '6 Months',
    annual: '1 Year',
  };

  return (
    <div
      className={`relative flex flex-col rounded-sm border transition-all duration-300 cursor-pointer group
        ${plan.highlight
          ? isBoxing
            ? 'border-boxing-red bg-boxing-gray scale-105 shadow-xl shadow-red-900/30'
            : 'border-nisha-rose bg-rose-950 scale-105 shadow-xl shadow-rose-900/30'
          : isBoxing
            ? 'border-white/10 bg-boxing-gray/60 hover:border-boxing-red/50'
            : 'border-white/10 bg-rose-950/60 hover:border-nisha-rose/50'
        }
        ${plan.isPersonalTraining
          ? isBoxing
            ? 'border-yellow-600/60 bg-yellow-950/30'
            : 'border-nisha-gold/60 bg-yellow-950/30'
          : ''
        }
      `}
    >
      {/* Popular badge */}
      {plan.highlight && (
        <div
          className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-0.5 text-xs font-bold uppercase tracking-widest ${
            isBoxing ? 'bg-boxing-red text-white' : 'bg-nisha-rose text-white'
          }`}
          style={{ clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)' }}
        >
          Most Popular
        </div>
      )}

      {/* Personal training badge */}
      {plan.isPersonalTraining && (
        <div
          className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-0.5 text-xs font-bold uppercase tracking-widest ${
            isBoxing ? 'bg-yellow-600 text-black' : 'bg-nisha-gold text-black'
          }`}
        >
          ⭐ Personal Training
        </div>
      )}

      <div className="p-6 flex flex-col gap-4 flex-1">
        {/* Plan name + duration */}
        <div>
          <p className={`text-xs uppercase tracking-[0.2em] font-semibold mb-1 ${
            isBoxing ? 'text-boxing-red' : 'text-nisha-rose'
          }`}>
            {durationMap[plan.duration]}
          </p>
          <h3 className="text-white font-boxing font-bold text-2xl uppercase tracking-wide">
            {plan.name}
          </h3>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1">
          <span className="text-white/50 text-sm font-body">₹</span>
          <span className="text-white font-boxing font-black text-5xl leading-none">
            {plan.price.toLocaleString('en-IN')}
          </span>
          <span className="text-white/50 text-xs font-body self-end mb-1">
            /{durationMap[plan.duration].toLowerCase()}
          </span>
        </div>

        {/* No discount tooltip */}
        <div className="text-white/30 text-xs italic">
          Price is fixed. No discounts.
        </div>

        {/* Features */}
        <ul className="flex flex-col gap-2 flex-1">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-white/70">
              <span className={isBoxing ? 'text-boxing-red mt-0.5' : 'text-nisha-rose mt-0.5'}>
                ✓
              </span>
              {feature}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          onClick={() => onSelect(plan)}
          className={`w-full py-3 font-boxing font-bold uppercase tracking-widest text-sm transition-all active:scale-95 mt-2
            ${isBoxing
              ? 'bg-boxing-red text-white hover:bg-red-700'
              : 'bg-nisha-rose text-white hover:bg-rose-700'
            }
          `}
          style={isBoxing
            ? { clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)' }
            : { borderRadius: '2px' }
          }
          title="Price shown is final. No discounts available."
        >
          Join Now →
        </button>
      </div>
    </div>
  );
}

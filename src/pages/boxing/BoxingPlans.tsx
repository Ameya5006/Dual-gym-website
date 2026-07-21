// src/pages/boxing/BoxingPlans.tsx

import { useNavigate } from 'react-router-dom';
import { BOXING_PLANS } from '../../constants/plans';
import PlanCard from '../../components/ui/PlanCard';
import NoDiscountBanner from '../../components/ui/NoDiscountBanner';
import type { MembershipPlan } from '../../types';

export default function BoxingPlans() {
  const navigate = useNavigate();

  function handleSelectPlan(plan: MembershipPlan) {
    navigate('/register', { state: { gym: 'boxing', plan } });
  }

  const regularPlans = BOXING_PLANS.filter((p) => !p.isPersonalTraining);
  const ptPlan = BOXING_PLANS.find((p) => p.isPersonalTraining);

  return (
    <div className="bg-boxing-dark min-h-screen">
      {/* Header */}
      <div className="relative py-20 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-boxing-red/10 via-transparent to-transparent" />
        <p className="relative text-boxing-red text-xs uppercase tracking-[0.3em] font-boxing font-semibold mb-3">
          Membership Plans
        </p>
        <h1 className="relative font-boxing font-black uppercase text-white text-5xl md:text-6xl leading-none">
          Choose Your Fight
        </h1>
        <p className="relative text-white/50 mt-4 max-w-md mx-auto">
          All plans include full gym and boxing ring access. No AC — the authentic way.
        </p>
      </div>

      {/* NO DISCOUNT BANNER */}
      <NoDiscountBanner gym="boxing" />

      {/* Plans grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
          {regularPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} gym="boxing" onSelect={handleSelectPlan} />
          ))}
        </div>

        {/* Personal Training */}
        {ptPlan && (
          <div className="mt-12">
            <h2 className="font-boxing font-bold uppercase text-yellow-500 text-xs tracking-[0.3em] mb-4 text-center">
              ⭐ Premium Add-on
            </h2>
            <div className="max-w-sm mx-auto">
              <PlanCard plan={ptPlan} gym="boxing" onSelect={handleSelectPlan} />
            </div>
          </div>
        )}

        {/* Bottom no-discount banner */}
        <div className="mt-12">
          <NoDiscountBanner gym="boxing" />
        </div>

        {/* FAQ mini-section */}
        <div className="mt-12 border border-white/10 rounded p-6 bg-white/5">
          <h3 className="font-boxing font-bold uppercase text-white text-lg mb-4">Common Questions</h3>
          {[
            { q: 'Can I get a discount?', a: 'No. Prices are fixed and final. This is non-negotiable.' },
            { q: 'Is there a trial day?', a: 'Yes! Fill our trial request form and we\'ll call you to schedule a free session.' },
            { q: 'What do I need to bring?', a: 'Just yourself and determination. We have gloves available, but you can bring your own.' },
            { q: 'What is the minimum age?', a: 'We train members from age 12 and above.' },
            { q: 'Can I pause my membership?', a: 'Contact us on WhatsApp to discuss holds or pauses.' },
          ].map((faq) => (
            <details key={faq.q} className="border-b border-white/10 py-3 last:border-0 cursor-pointer group">
              <summary className="text-white/70 text-sm font-semibold hover:text-white list-none flex justify-between items-center">
                {faq.q}
                <span className="text-boxing-red group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-2 text-white/50 text-sm leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}

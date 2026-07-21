// src/pages/nisha/NishaPlans.tsx — dark theme, correct CSS

import { useNavigate } from 'react-router-dom';
import { NISHA_PLANS, NISHA_FAQS } from '../../constants/plans';
import PlanCard from '../../components/ui/PlanCard';
import NoDiscountBanner from '../../components/ui/NoDiscountBanner';
import type { MembershipPlan } from '../../types';

export default function NishaPlans() {
  const navigate = useNavigate();

  function handleSelectPlan(plan: MembershipPlan) {
    navigate('/register', { state: { gym: 'nisha', plan } });
  }

  const regularPlans = NISHA_PLANS.filter(p => !p.isPersonalTraining);
  const ptPlan       = NISHA_PLANS.find(p => p.isPersonalTraining);

  return (
    <div className="bg-nisha-dark min-h-screen text-white">

      {/* Header */}
      <div className="relative py-20 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-nisha-rose/10 via-transparent to-transparent" />
        <p className="relative text-nisha-rose text-xs uppercase tracking-[0.3em] font-body font-semibold mb-3">
          Membership Plans
        </p>
        <h1 className="relative font-nisha text-white text-5xl md:text-6xl leading-none">
          Choose Your Journey
        </h1>
        <p className="relative text-white/50 mt-4 max-w-md mx-auto font-body">
          Women-only · Air conditioned · Music · Quality machines
        </p>
      </div>

      <NoDiscountBanner gym="nisha" />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
          {regularPlans.map(plan => (
            <PlanCard key={plan.id} plan={plan} gym="nisha" onSelect={handleSelectPlan} />
          ))}
        </div>

        {ptPlan && (
          <div className="mt-14">
            <h2 className="text-center text-yellow-500 text-xs uppercase tracking-[0.3em] font-semibold mb-6 font-body">
              ⭐ Premium Add-on
            </h2>
            <div className="max-w-sm mx-auto">
              <PlanCard plan={ptPlan} gym="nisha" onSelect={handleSelectPlan} />
            </div>
          </div>
        )}

        <div className="mt-12"><NoDiscountBanner gym="nisha" /></div>

        {/* FAQ */}
        <div className="mt-12 border border-nisha-rose/20 rounded p-6 bg-white/5">
          <h3 className="font-nisha text-white text-2xl mb-6">Questions We Get Asked</h3>
          {NISHA_FAQS.map(faq => (
            <details key={faq.q} className="border-b border-white/10 py-3 last:border-0 cursor-pointer group">
              <summary className="text-white/70 text-sm font-semibold hover:text-white list-none flex justify-between items-center font-body">
                {faq.q}
                <span className="text-nisha-rose group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-2 text-white/50 text-sm leading-relaxed font-body">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}

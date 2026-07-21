// src/components/ui/NoDiscountBanner.tsx
// This banner appears on Plans pages AND on the registration form.
// Business requirement: make it impossible to miss.

interface NoDiscountBannerProps {
  gym: 'boxing' | 'nisha';
  compact?: boolean; // smaller version for inside forms
}

export default function NoDiscountBanner({ gym, compact = false }: NoDiscountBannerProps) {
  const isBoxing = gym === 'boxing';

  if (compact) {
    return (
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-semibold tracking-wide border ${
          isBoxing
            ? 'bg-red-950/80 border-boxing-red text-red-300'
            : 'bg-rose-950/80 border-nisha-rose text-rose-300'
        }`}
      >
        <span>⚠️</span>
        <span>Prices shown are FINAL. No discounts. No exceptions.</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Top bar */}
      <div
        className={`w-full py-3 px-6 flex items-center justify-center gap-3 font-boxing font-bold uppercase tracking-widest text-sm ${
          isBoxing
            ? 'bg-boxing-red text-white'
            : 'bg-nisha-rose text-white'
        }`}
      >
        <span className="text-lg">⚠️</span>
        <span>Prices are fixed &mdash; No discounts, no exceptions, no negotiations</span>
        <span className="text-lg">⚠️</span>
      </div>

      {/* Explanation bar */}
      <div
        className={`w-full py-2 px-6 flex items-center justify-center text-xs tracking-wide ${
          isBoxing
            ? 'bg-red-950 text-red-300'
            : 'bg-rose-950 text-rose-300'
        }`}
      >
        The prices shown below are the exact amount you pay. Asking for a discount is respectfully declined.
      </div>
    </div>
  );
}

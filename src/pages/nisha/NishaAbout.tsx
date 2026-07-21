// src/pages/nisha/NishaAbout.tsx

export default function NishaAbout() {
  return (
    <div className="bg-nisha-dark min-h-screen text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-nisha-rose text-xs uppercase tracking-[0.3em] font-semibold mb-3 font-body">About</p>
        <h1 className="font-nisha text-5xl text-white mb-12">The Trainer</h1>

        <div className="max-w-2xl">
          <h2 className="font-nisha text-3xl text-white mb-2">Nisha Thakur</h2>
          <p className="text-nisha-rose text-xs uppercase tracking-widest font-semibold mb-6 font-body">Founder, Nisha Fitness</p>

          <div className="space-y-4 text-white/60 leading-relaxed font-body">
            <p>
              Nisha Thakur is the founder and trainer at Nisha Fitness, a women-only gym she established in 2026
              with the vision of creating a safe, comfortable, and supportive space for women of all fitness levels.
            </p>
            <p>
              With a genuine passion for fitness and health, Nisha brings enthusiasm, patience, and dedication
              to every session. She believes every woman deserves a space where she can work on herself
              without hesitation — and that is exactly what Nisha Fitness offers.
            </p>
            <p>
              Whether you are just starting out or looking to stay consistent, Nisha is here to guide
              and motivate you every step of the way.
            </p>
          </div>

          <div className="mt-8 space-y-3">
            {[
              '100% women-only, judgment-free environment',
              'Personalized attention for every member',
              'Fully air-conditioned with music system',
              'Modern equipment for all fitness levels',
              'Founded in 2026 in Firozabad',
            ].map(point => (
              <div key={point} className="flex items-start gap-2 text-white/60 text-sm font-body">
                <span className="text-nisha-rose mt-1">✓</span>
                {point}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
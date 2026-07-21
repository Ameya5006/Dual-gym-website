// src/pages/boxing/BoxingAbout.tsx
// TODO: Build this page fully — Coach bio, army career, achievements, YouTube embed


const COACH_PHOTO = '/images/boxing/Coach_Army.png';


export default function BoxingAbout() {

  return (
    <div className="bg-boxing-dark min-h-screen text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-boxing-red text-xs uppercase tracking-[0.3em] font-boxing font-semibold mb-3">About</p>
        <h1 className="font-boxing font-black uppercase text-5xl md:text-6xl leading-none mb-12">
          The Coach
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <img src={COACH_PHOTO} alt="Coach" className="w-full grayscale hover:grayscale-0 transition-all duration-700" />
          <div>
            {/* TODO: Replace all placeholder text with real coach bio */}
            <h2 className="font-boxing font-bold text-3xl uppercase mb-4">
              Naveen Chand Thakur
            </h2>
            <div className="space-y-4 text-white/60 leading-relaxed">
              <p>Retired Indian Army veteran with 18 years and 9 months of distinguished service (2000–2018). A soldier who carried the spirit of discipline into every arena he entered.</p>
              <p>A National Medalist in boxing, Naveen Chand Thakur has been coaching since 2015. Under his guidance, students have won 4 gold medals at state level, 8 silver, 11 bronze — and 2 bronze medals at the national level, with 10+ national participations.</p>
              <p>Founded Fitness First Boxing Club in 2019 with the goal of bringing military-grade discipline and authentic boxing training to the community.</p>
            </div>

            {/* Achievements */}
            <div className="mt-8">
              <h3 className="font-boxing font-bold uppercase text-boxing-red text-sm tracking-widest mb-4">Achievements</h3>
              <ul className="space-y-2">
                {[
'National Medalist — Boxing',
'4 State Gold Medals won by students',
'8 State Silver Medals won by students',
'11 State Bronze + 2 National Bronze by students',
'10+ National level participations',
'18 Years 9 Months — Indian Army Service (2000–2018)',
                ].map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-white/60 text-sm">
                    <span className="text-boxing-red mt-1">▸</span> {a}
                  </li>
                ))}
              </ul>
            </div>

            {/* Social */}
            <div className="mt-8 p-4 border border-boxing-red/30 bg-boxing-red/5">
              <p className="text-boxing-red text-xs uppercase tracking-widest mb-3 font-semibold">Follow on Social Media</p>
              <div className="flex gap-4">
                {/* TODO: Replace # with actual links */}
                <a href="https://www.youtube.com/@Boxingguruji" className="text-white/50 hover:text-red-400 text-sm">YouTube (100K+)</a>
                <a href="https://www.facebook.com/share/1LmZ8T6KeF/?mibextid=wwXIfr" className="text-white/50 hover:text-blue-400 text-sm">Facebook (100K+)</a>
                <a href="https://www.instagram.com/boxing_guru_ji/" className="text-white/50 hover:text-pink-400 text-sm">Instagram (~100K)</a>
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
}

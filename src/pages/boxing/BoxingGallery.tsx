// src/pages/boxing/BoxingGallery.tsx
// TODO: Replace placeholder images with actual gym photos

const GALLERY_PHOTOS = [
  '/images/boxing/boxing-ring.jpeg',
  '/images/boxing/heavy-bags.jpeg',
  '/images/boxing/double-end-bag.jpeg',
  '/images/boxing/hero.jpeg',
  '/images/boxing/smith-machine.jpeg',
  '/images/boxing/lat-pulldown.jpeg',
  '/images/boxing/leg-press.jpeg',
  '/images/boxing/dumbbells.jpeg',
  '/images/boxing/machines.jpeg',
  '/images/boxing/photos.jpeg',
  '/images/boxing/platform.jpeg',
  '/images/boxing/ring2.jpeg',
  '/images/boxing/tyre.jpeg',
];

export default function BoxingGallery() {
  return (
    <div className="bg-boxing-dark min-h-screen text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-boxing-red text-xs uppercase tracking-[0.3em] font-boxing font-semibold mb-3">Gallery</p>
        <h1 className="font-boxing font-black uppercase text-5xl leading-none mb-12">The Ring & Beyond</h1>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {GALLERY_PHOTOS.map((src, i) => (
            <div key={i} className="break-inside-avoid overflow-hidden group">
              <img
                src={src}
                alt={`Gallery photo ${i + 1}`}
                className="w-full grayscale group-hover:grayscale-0 transition-all duration-500 hover:scale-105"
              />
            </div>
          ))}
        </div>

        {/* YouTube embed section */}
{/* YouTube Videos */}
<div className="mt-16">
  <h2 className="font-boxing font-bold uppercase text-2xl text-white mb-6">Latest Videos</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="aspect-video">
      <iframe
        className="w-full h-full"
        src="https://www.youtube.com/embed/3hE1C78mGXo"
        title="YouTube video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
    <div className="aspect-video">
      <iframe
        className="w-full h-full"
        src="https://www.youtube.com/embed/_4XY9-4ihhY"
        title="YouTube video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  </div>
</div>
      </div>
    </div>
  );
}

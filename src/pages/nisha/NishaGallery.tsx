// src/pages/nisha/NishaGallery.tsx
// TODO: Replace placeholder images with actual Nisha Fitness photos
// Save photos in public/images/nisha/ and update the array below

const GALLERY_PHOTOS = [
  // TODO: Replace with real photos once available
  // e.g. '/images/nisha/gym-floor.jpg'
  '/images/Nisha/gallery1.jpeg',
  '/images/Nisha/gallery2.jpeg',
  '/images/Nisha/gallery3.jpeg',
  '/images/Nisha/gallery4.jpeg',
  '/images/Nisha/ac.jpeg',
];

export default function NishaGallery() {
  return (
    <div className="bg-nisha-dark min-h-screen text-white py-16">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <p className="text-nisha-rose text-xs uppercase tracking-[0.3em] font-semibold mb-3 font-body">
          Gallery
        </p>
        <h1 className="font-nisha text-5xl text-white mb-4">
          Inside Nisha Fitness
        </h1>
        <p className="text-white/50 mb-12 font-body max-w-xl">
          A clean, air-conditioned space designed for women who are serious about their fitness.
        </p>

        {/* Highlights bar */}
        <div className="flex flex-wrap gap-3 mb-10">
          {['Air Conditioned', 'Music System', 'Women Only', 'Modern Equipment'].map(tag => (
            <span key={tag}
              className="px-4 py-1.5 bg-nisha-rose/10 border border-nisha-rose/30 text-nisha-rose text-xs font-semibold uppercase tracking-widest rounded-full font-body">
              {tag}
            </span>
          ))}
        </div>

        {/* Masonry grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {GALLERY_PHOTOS.map((src, i) => (
            <div key={i} className="break-inside-avoid overflow-hidden group rounded">
              <img
                src={src}
                alt={`Nisha Fitness photo ${i + 1}`}
                loading="lazy"
                className="w-full group-hover:scale-105 transition-all duration-500 brightness-90 group-hover:brightness-100"
              />
            </div>
          ))}
        </div>



      </div>
    </div>
  );
}

import PhotoUpload from '@/components/PhotoUpload';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      {/* Elegant background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_50%)]" />
      
      <div className="relative container mx-auto px-4 py-12">
        <header className="text-center mb-16">
          {/* Monogram Style Header */}
          <div className="mb-8">
            <div className="monogram-style text-6xl md:text-8xl text-white font-light tracking-widest">
              W<span className="mx-4 text-gray-400">|</span>K
            </div>
            <div className="w-32 h-px bg-white mx-auto mt-6 opacity-30"></div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-serif font-light text-white mb-6 tracking-wide">
            Wedding Photos
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-light">
            Share your beautiful moments from our special day.<br />
            Help us capture every magical memory of our celebration.
          </p>
          
          {/* Elegant divider */}
          <div className="flex items-center justify-center mt-8 mb-2">
            <div className="w-12 h-px bg-gray-400"></div>
            <div className="mx-4 text-gray-400">♦</div>
            <div className="w-12 h-px bg-gray-400"></div>
          </div>
          
          <p className="text-sm text-gray-400 uppercase tracking-widest font-light">
            Black Tie Celebration
          </p>
        </header>
        
        <main className="max-w-4xl mx-auto">
          <PhotoUpload />
        </main>
        
        <footer className="text-center mt-20 text-gray-400 font-light">
          <div className="flex items-center justify-center mb-4">
            <div className="w-8 h-px bg-gray-600"></div>
            <div className="mx-3 text-gray-500">✦</div>
            <div className="w-8 h-px bg-gray-600"></div>
          </div>
          <p className="text-sm tracking-wide">
            Thank you for being part of our celebration
          </p>
          <p className="text-xs mt-2 text-gray-500">
            Saturday, August Sixteenth 2025
          </p>
        </footer>
      </div>
    </div>
  );
}

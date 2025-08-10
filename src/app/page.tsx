import PhotoUpload from '@/components/PhotoUpload';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-serif font-light text-gray-800 mb-4">
            Wedding Photos
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Share your beautiful moments from our special day! Upload your photos to help us relive every magical moment.
          </p>
        </header>
        
        <main className="max-w-4xl mx-auto">
          <PhotoUpload />
        </main>
        
        <footer className="text-center mt-16 text-gray-500">
          <p>Thank you for being part of our celebration! 💕</p>
        </footer>
      </div>
    </div>
  );
}

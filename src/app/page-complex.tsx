'use client';

import { useState, Suspense } from 'react';
import PhotoUpload from '@/components/PhotoUpload';
import TabNavigation from '@/components/TabNavigation';
import AddToHomeScreen from '@/components/AddToHomeScreen';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Lazy load the slideshow to prevent initial load issues
import dynamic from 'next/dynamic';

const PhotoSlideshow = dynamic(() => import('@/components/PhotoSlideshow'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white/60 font-light">Loading gallery...</p>
      </div>
    </div>
  )
});

export default function Home() {
  const [activeTab, setActiveTab] = useState<'upload' | 'gallery'>('upload');

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
        {/* Add to Home Screen Prompt */}
        <ErrorBoundary>
          <AddToHomeScreen />
        </ErrorBoundary>
        
        {activeTab === 'upload' ? (
          <>
            {/* Elegant background pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_50%)]" />
            
            <div className="relative container mx-auto px-4 py-12 pb-24">
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
                <ErrorBoundary>
                  <PhotoUpload />
                </ErrorBoundary>
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
          </>
        ) : (
          <ErrorBoundary>
            <Suspense fallback={
              <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-white/60 font-light">Loading gallery...</p>
                </div>
              </div>
            }>
              <PhotoSlideshow />
            </Suspense>
          </ErrorBoundary>
        )}

        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </ErrorBoundary>
  );
}

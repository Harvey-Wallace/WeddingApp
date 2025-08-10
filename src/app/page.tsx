'use client';

import { useState } from 'react';
import PhotoUpload from '@/components/PhotoUpload';
import AddToHomeScreen from '@/components/AddToHomeScreen';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'upload' | 'gallery'>('upload');

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
        {/* Add to Home Screen Prompt */}
        <ErrorBoundary>
          <AddToHomeScreen />
        </ErrorBoundary>
        
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

          {/* Simple tab navigation */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-black/60 backdrop-blur-sm border border-white/20 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('upload')}
                className={`px-6 py-2 rounded-md transition-all ${
                  activeTab === 'upload'
                    ? 'bg-white/20 text-white border border-white/30'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                Upload
              </button>
              <button
                onClick={() => setActiveTab('gallery')}
                className={`px-6 py-2 rounded-md transition-all ${
                  activeTab === 'gallery'
                    ? 'bg-white/20 text-white border border-white/30'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                Gallery
              </button>
            </div>
          </div>

          {/* Content */}
          <main className="max-w-4xl mx-auto">
            {activeTab === 'upload' ? (
              <ErrorBoundary>
                <PhotoUpload />
              </ErrorBoundary>
            ) : (
              <div className="text-center py-20">
                <div className="mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                    <span className="text-2xl">📸</span>
                  </div>
                </div>
                <h3 className="text-2xl font-light text-white mb-4" style={{fontFamily: 'Playfair Display, serif'}}>
                  Gallery Coming Soon
                </h3>
                <p className="text-gray-400 text-lg mb-2">
                  Upload some photos first!
                </p>
                <p className="text-gray-500 text-sm">
                  Your beautiful memories will appear here
                </p>
              </div>
            )}
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
    </ErrorBoundary>
  );
}

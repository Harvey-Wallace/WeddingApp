'use client';

import { useState } from 'react';
import PhotoUpload from '@/components/PhotoUpload';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'upload' | 'gallery'>('upload');

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-black text-white">
        {/* Simple header */}
        <div className="text-center pt-12 pb-8 px-6">
          <h1 className="text-4xl font-bold text-white mb-4">
            W|K Wedding Photos
          </h1>
          <p className="text-gray-300 mb-8">
            Share your beautiful moments from our special day
          </p>
        </div>

        {/* Simple tab navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-6 py-2 rounded-md transition-all ${
                activeTab === 'upload'
                  ? 'bg-white text-black'
                  : 'text-white hover:bg-gray-700'
              }`}
            >
              Upload
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-6 py-2 rounded-md transition-all ${
                activeTab === 'gallery'
                  ? 'bg-white text-black'
                  : 'text-white hover:bg-gray-700'
              }`}
            >
              Gallery
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 pb-20">
          {activeTab === 'upload' ? (
            <ErrorBoundary>
              <PhotoUpload />
            </ErrorBoundary>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">
                Gallery coming soon...
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Upload some photos first!
              </p>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}

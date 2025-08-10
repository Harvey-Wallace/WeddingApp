'use client';

import { Upload, Images } from 'lucide-react';

interface TabNavigationProps {
  activeTab: 'upload' | 'gallery';
  onTabChange: (tab: 'upload' | 'gallery') => void;
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-t border-white/10">
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex items-center justify-center gap-8">
          <button
            onClick={() => onTabChange('upload')}
            className={`flex flex-col items-center gap-1 px-6 py-3 rounded-lg transition-all duration-300 ${
              activeTab === 'upload'
                ? 'bg-white/20 text-white'
                : 'text-white/60 hover:text-white/80 hover:bg-white/10'
            }`}
          >
            <Upload className="w-6 h-6" />
            <span className="text-xs font-light">Upload</span>
          </button>
          
          <button
            onClick={() => onTabChange('gallery')}
            className={`flex flex-col items-center gap-1 px-6 py-3 rounded-lg transition-all duration-300 ${
              activeTab === 'gallery'
                ? 'bg-white/20 text-white'
                : 'text-white/60 hover:text-white/80 hover:bg-white/10'
            }`}
          >
            <Images className="w-6 h-6" />
            <span className="text-xs font-light">Gallery</span>
          </button>
        </div>
      </div>
    </div>
  );
}

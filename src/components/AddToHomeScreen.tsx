'use client';

import { useState, useEffect } from 'react';
import { X, Download, Share, Plus } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export default function AddToHomeScreen() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [deviceType, setDeviceType] = useState<'ios' | 'android' | 'desktop' | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Detect device type
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    
    if (isIOS) {
      setDeviceType('ios');
    } else if (isAndroid) {
      setDeviceType('android');
    } else {
      setDeviceType('desktop');
    }

    // Handle beforeinstallprompt for Android/Desktop
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show prompt after a short delay (not immediately)
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS, show prompt after delay since there's no beforeinstallprompt
    if (isIOS && !isInstalled) {
      setTimeout(() => {
        setShowPrompt(true);
      }, 5000);
    }

    // Check if user has already dismissed this session
    const dismissed = sessionStorage.getItem('addToHomeScreenDismissed');
    if (dismissed) {
      setShowPrompt(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [isInstalled]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowPrompt(false);
      }
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('addToHomeScreenDismissed', 'true');
  };

  if (isInstalled || !showPrompt || !deviceType) {
    return null;
  }

  const getInstructions = () => {
    switch (deviceType) {
      case 'ios':
        return {
          title: 'Add to Home Screen',
          steps: [
            'Tap the Share button',
            'Scroll down and tap "Add to Home Screen"',
            'Tap "Add" to save the app'
          ],
          icon: <Share className="w-6 h-6" />,
          note: 'Quick access to wedding photos!'
        };
      case 'android':
        return {
          title: 'Install App',
          steps: [
            'Tap "Add to Home Screen" below',
            'Confirm installation when prompted',
            'Find the app on your home screen'
          ],
          icon: <Download className="w-6 h-6" />,
          note: 'Works offline and loads faster!'
        };
      case 'desktop':
        return {
          title: 'Install App',
          steps: [
            'Click "Install" below',
            'Confirm in the popup dialog',
            'Access from your desktop or taskbar'
          ],
          icon: <Download className="w-6 h-6" />,
          note: 'Quick access anytime!'
        };
      default:
        return null;
    }
  };

  const instructions = getInstructions();
  if (!instructions) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom duration-500">
      <div className="wedding-card rounded-lg p-4 mx-auto max-w-sm border border-white/30 shadow-xl">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-full">
              {instructions.icon}
            </div>
            <div>
              <h3 className="font-serif font-medium text-white text-lg">
                {instructions.title}
              </h3>
              <p className="text-gray-300 text-sm">
                {instructions.note}
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {deviceType === 'ios' ? (
          <div className="space-y-2 mb-4">
            <div className="text-sm text-gray-300 space-y-1">
              {instructions.steps.map((step, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center mt-3 text-gray-400">
              <Share className="w-4 h-4 mr-1" />
              <span className="text-xs">Look for the share icon in your browser</span>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-sm text-gray-300">
              <p>Get quick access to wedding photos right from your home screen!</p>
            </div>
            <button
              onClick={handleInstallClick}
              className="w-full bg-white text-black py-3 px-4 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Home Screen</span>
            </button>
          </div>
        )}

        <div className="flex items-center justify-center mt-3">
          <div className="w-8 h-px bg-gray-600"></div>
          <span className="mx-2 text-gray-500 text-xs">W|K</span>
          <div className="w-8 h-px bg-gray-600"></div>
        </div>
      </div>
    </div>
  );
}

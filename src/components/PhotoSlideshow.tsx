'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Play, Pause, Heart } from 'lucide-react';

interface Photo {
  id: string;
  url: string;
  thumbnail: string;
  uploadedAt: string;
  tags: string[];
}

interface PhotoSlideshowProps {
  autoPlay?: boolean;
  interval?: number;
}

export default function PhotoSlideshow({ autoPlay = true, interval = 4000 }: PhotoSlideshowProps) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  // Fetch photos from API
  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/photos?limit=50');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch photos');
      }
      
      setPhotos(data.photos);
      setError(null);
    } catch (err) {
      setError('Unable to load photos');
      console.error('Error fetching photos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
    
    // Refresh photos every 30 seconds to show new uploads
    const refreshInterval = setInterval(fetchPhotos, 30000);
    return () => clearInterval(refreshInterval);
  }, []);

  // Auto-advance slideshow
  useEffect(() => {
    if (!isPlaying || photos.length === 0) {
      setProgress(0);
      return;
    }

    const startTime = Date.now();
    
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progressPercent = (elapsed / interval) * 100;
      setProgress(Math.min(progressPercent, 100));
    }, 50);

    const slideInterval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
      setProgress(0);
    }, interval);

    return () => {
      clearInterval(slideInterval);
      clearInterval(progressInterval);
    };
  }, [isPlaying, photos.length, interval, currentIndex]);

  const goToPrevious = () => {
    if (photos.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
    setProgress(0);
  };

  const goToNext = () => {
    if (photos.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % photos.length);
    setProgress(0);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60 font-light">Loading photos...</p>
        </div>
      </div>
    );
  }

  if (error || photos.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <Heart className="w-16 h-16 text-white/40 mx-auto mb-4" />
          <h3 className="text-xl font-light text-white mb-2">
            {error ? 'Unable to load photos' : 'No photos yet'}
          </h3>
          <p className="text-white/60 font-light leading-relaxed">
            {error 
              ? 'Please check your connection and try again.' 
              : 'Be the first to share a beautiful moment from Kelly & William\'s celebration!'
            }
          </p>
          {!error && (
            <button
              onClick={fetchPhotos}
              className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white font-light transition-all duration-300"
            >
              Refresh
            </button>
          )}
        </div>
      </div>
    );
  }

  const currentPhoto = photos[currentIndex];

  // Safety check for current photo
  if (!currentPhoto && photos.length > 0) {
    setCurrentIndex(0);
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Main Photo Display */}
      <div className="relative h-screen flex items-center justify-center">
        <div className="relative max-w-4xl max-h-[80vh] w-full mx-4">
          <div className="relative w-full h-full">
            <Image
              src={currentPhoto.url}
              alt="Wedding photo"
              fill
              className="object-contain rounded-lg shadow-2xl"
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>
          
          {/* Photo overlay with metadata */}
          <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-4">
            <div className="flex justify-between items-center text-white">
              <div>
                <p className="text-sm font-light opacity-80">
                  Photo {currentIndex + 1} of {photos.length}
                </p>
                <p className="text-xs opacity-60 mt-1">
                  {new Date(currentPhoto.uploadedAt).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {currentPhoto.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-white/20 rounded-full text-xs font-light"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        {photos.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 group"
            >
              <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 group"
            >
              <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>
          </>
        )}

        {/* Play/Pause Button */}
        <button
          onClick={togglePlayPause}
          className="absolute top-6 right-6 w-12 h-12 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 group"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 group-hover:scale-110 transition-transform" />
          ) : (
            <Play className="w-5 h-5 ml-1 group-hover:scale-110 transition-transform" />
          )}
        </button>
      </div>

      {/* Thumbnail Navigation */}
      {photos.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 max-w-md w-full px-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {photos.map((photo, index) => (
              <button
                key={photo.id}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                  index === currentIndex
                    ? 'border-white shadow-lg scale-110'
                    : 'border-white/30 hover:border-white/60'
                }`}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={photo.thumbnail}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Progress Indicator */}
      {photos.length > 1 && isPlaying && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/20">
          <div
            className="h-full bg-white transition-all duration-100 ease-linear"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      )}
    </div>
  );
}

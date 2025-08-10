'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';

interface UploadStatus {
  uploading: boolean;
  success: boolean;
  error: string | null;
}

export default function PhotoUpload() {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    uploading: false,
    success: false,
    error: null
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploadStatus({ uploading: true, success: false, error: null });

    try {
      const formData = new FormData();
      acceptedFiles.forEach((file) => {
        formData.append('photos', file);
      });

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.failed > 0) {
        setUploadStatus({
          uploading: false,
          success: false,
          error: `${result.failed} photo(s) failed to upload. ${result.successful} uploaded successfully.`
        });
      } else {
        setUploadedFiles(prev => [...prev, ...acceptedFiles]);
        setUploadStatus({ uploading: false, success: true, error: null });
        
        // Reset success message after 3 seconds
        setTimeout(() => {
          setUploadStatus(prev => ({ ...prev, success: false }));
        }, 3000);
      }

    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus({
        uploading: false,
        success: false,
        error: 'Failed to upload photos. Please try again.'
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.heic']
    },
    multiple: true,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div className="space-y-8">
      {/* Elegant Upload Area */}
      <div
        {...getRootProps()}
        className={`
          wedding-card rounded-lg p-16 text-center cursor-pointer transition-all duration-500 relative overflow-hidden
          ${isDragActive 
            ? 'border-white/40 bg-black/60 transform scale-[1.02]' 
            : 'border-white/20 hover:border-white/30 hover:bg-black/50'
          }
          ${uploadStatus.uploading ? 'pointer-events-none opacity-60' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.02),transparent_70%)]" />
        
        <div className="relative space-y-6">
          {uploadStatus.uploading ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin w-12 h-12 text-white/60">
                <Upload size={48} />
              </div>
              <div className="w-16 h-px bg-white/20"></div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <ImageIcon className="w-12 h-12 text-white/40" />
              <div className="w-16 h-px bg-white/20"></div>
            </div>
          )}
          
          <div>
            <h3 className="text-2xl font-serif font-light text-white mb-4 tracking-wide">
              {uploadStatus.uploading 
                ? 'Uploading Your Memories...' 
                : isDragActive 
                  ? 'Drop Your Photos Here' 
                  : 'Share Your Photos'
              }
            </h3>
            
            {!uploadStatus.uploading && (
              <p className="text-gray-300 font-light leading-relaxed">
                Drag and drop your photos here, or{' '}
                <span className="text-white underline underline-offset-4 font-medium">click to browse</span>
              </p>
            )}
          </div>
          
          {!uploadStatus.uploading && (
            <div className="text-sm text-gray-400 space-y-2 font-light">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-px bg-gray-600"></div>
                <span className="px-2">JPEG, PNG, WebP, HEIC</span>
                <div className="w-3 h-px bg-gray-600"></div>
              </div>
              <p className="text-xs">Maximum 10MB per photo</p>
            </div>
          )}
        </div>
      </div>

      {/* Elegant Status Messages */}
      {uploadStatus.success && (
        <div className="wedding-card rounded-lg p-6">
          <div className="flex items-center justify-center space-x-4">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <div className="text-center">
              <p className="text-white font-light">Photos uploaded successfully!</p>
              <p className="text-gray-400 text-sm mt-1">Thank you for sharing these beautiful moments</p>
            </div>
          </div>
        </div>
      )}

      {uploadStatus.error && (
        <div className="wedding-card rounded-lg p-6 border-red-500/30">
          <div className="flex items-center justify-center space-x-4">
            <AlertCircle className="w-6 h-6 text-red-400" />
            <div className="text-center">
              <p className="text-red-300 font-light">{uploadStatus.error}</p>
              <p className="text-gray-400 text-sm mt-1">Please try again</p>
            </div>
          </div>
        </div>
      )}

      {/* Elegant Upload Progress */}
      {uploadStatus.uploading && (
        <div className="wedding-card rounded-lg p-6 space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-300 font-light">Processing your photos...</span>
            <span className="text-gray-400">{acceptedFiles.length} file{acceptedFiles.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1">
            <div className="bg-gradient-to-r from-white/60 to-white/80 h-1 rounded-full transition-all duration-1000 animate-pulse w-3/4"></div>
          </div>
        </div>
      )}

      {/* Uploaded Files Gallery */}
      {uploadedFiles.length > 0 && (
        <div className="wedding-card rounded-lg p-8">
          <div className="text-center mb-6">
            <h4 className="font-serif font-light text-xl text-white mb-2 tracking-wide">
              Uploaded Memories
            </h4>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-8 h-px bg-gray-600"></div>
              <span className="text-gray-400 text-sm">({uploadedFiles.length})</span>
              <div className="w-8 h-px bg-gray-600"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {uploadedFiles.slice(-12).map((file, index) => (
              <div key={index} className="aspect-square bg-gray-800/50 rounded-lg border border-white/10 flex items-center justify-center hover:border-white/20 transition-colors">
                <ImageIcon className="w-6 h-6 text-gray-500" />
              </div>
            ))}
            {uploadedFiles.length > 12 && (
              <div className="aspect-square bg-gray-800/30 rounded-lg border border-white/10 flex items-center justify-center">
                <span className="text-sm text-gray-400 font-light">+{uploadedFiles.length - 12}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

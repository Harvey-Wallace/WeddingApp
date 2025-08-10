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
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300
          ${isDragActive 
            ? 'border-rose-400 bg-rose-50' 
            : 'border-gray-300 hover:border-rose-300 hover:bg-rose-25'
          }
          ${uploadStatus.uploading ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-4">
          {uploadStatus.uploading ? (
            <div className="animate-spin mx-auto w-12 h-12 text-rose-400">
              <Upload size={48} />
            </div>
          ) : (
            <ImageIcon className="mx-auto w-12 h-12 text-gray-400" />
          )}
          
          <div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              {uploadStatus.uploading 
                ? 'Uploading your photos...' 
                : isDragActive 
                  ? 'Drop your photos here!' 
                  : 'Upload Wedding Photos'
              }
            </h3>
            
            {!uploadStatus.uploading && (
              <p className="text-gray-600">
                Drag and drop your photos here, or{' '}
                <span className="text-rose-600 font-medium">click to browse</span>
              </p>
            )}
          </div>
          
          {!uploadStatus.uploading && (
            <div className="text-sm text-gray-500 space-y-1">
              <p>Supports: JPEG, PNG, WebP, HEIC</p>
              <p>Max file size: 10MB per photo</p>
            </div>
          )}
        </div>
      </div>

      {/* Status Messages */}
      {uploadStatus.success && (
        <div className="flex items-center space-x-2 p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-green-800">Photos uploaded successfully! Thank you for sharing! 🎉</p>
        </div>
      )}

      {uploadStatus.error && (
        <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-800">{uploadStatus.error}</p>
        </div>
      )}

      {/* Upload Progress */}
      {uploadStatus.uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Uploading photos...</span>
            <span>{acceptedFiles.length} file{acceptedFiles.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-rose-400 h-2 rounded-full transition-all duration-300 animate-pulse w-2/3"></div>
          </div>
        </div>
      )}

      {/* Uploaded Files Summary */}
      {uploadedFiles.length > 0 && (
        <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
          <h4 className="font-medium text-gray-800 mb-3">
            Uploaded Photos ({uploadedFiles.length})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {uploadedFiles.slice(-8).map((file, index) => (
              <div key={index} className="aspect-square bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-gray-400" />
              </div>
            ))}
            {uploadedFiles.length > 8 && (
              <div className="aspect-square bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
                <span className="text-sm text-gray-500">+{uploadedFiles.length - 8} more</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

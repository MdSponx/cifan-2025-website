import React, { useState, useRef } from 'react';
import { Camera, Upload, X, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PhotoUploadState } from '../../types/profile.types';

interface PhotoUploadProps {
  currentPhotoURL?: string;
  onPhotoChange: (file: File | null) => void;
  uploadState?: PhotoUploadState;
  error?: string;
  className?: string;
  userName?: string; // For generating initials
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({
  currentPhotoURL,
  onPhotoChange,
  uploadState,
  error,
  className = '',
  userName
}) => {
  const { t } = useTranslation();
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate initials from user name
  const generateInitials = (name?: string): string => {
    if (!name) return '';
    
    const words = name.trim().split(/\s+/);
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    
    return words
      .slice(0, 2) // Take first two words
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  };

  const userInitials = generateInitials(userName);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      // Validate file
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

      if (file.size > maxSize) {
        onPhotoChange(null);
        return;
      }

      if (!allowedTypes.includes(file.type)) {
        onPhotoChange(null);
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewURL(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      onPhotoChange(file);
    }
  };

  const handleRemovePhoto = () => {
    setPreviewURL(null);
    onPhotoChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const displayURL = previewURL || currentPhotoURL;
  const isUploading = uploadState?.status === 'uploading';

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      {/* Photo Display */}
      <div className="relative">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-white/10 border-2 border-white/20 flex items-center justify-center">
          {displayURL ? (
            <img
              src={displayURL}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : userInitials ? (
            <div className="w-full h-full bg-gradient-to-br from-[#AA4626] to-[#FCB283] flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {userInitials}
              </span>
            </div>
          ) : (
            <User className="w-12 h-12 text-white/50" />
          )}
          
          {/* Upload Progress Overlay */}
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center">
                <div className="loading-spinner mb-2"></div>
                <p className="text-xs text-white">
                  {uploadState?.progress}%
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Remove Button */}
        {displayURL && !isUploading && (
          <button
            type="button"
            onClick={handleRemovePhoto}
            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        )}

        {/* Camera Icon Overlay */}
        <button
          type="button"
          onClick={handleClick}
          disabled={isUploading}
          className="absolute bottom-0 right-0 w-10 h-10 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 rounded-full flex items-center justify-center transition-colors"
        >
          <Camera className="w-5 h-5 text-white" />
        </button>
      </div>


      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Error Message */}
      {error && (
        <p className="text-red-400 text-sm text-center">{error}</p>
      )}

      {/* Upload State Message */}
      {uploadState?.error && (
        <p className="text-red-400 text-sm text-center">{uploadState.error}</p>
      )}

      {/* File Requirements */}
      <div className="text-xs text-white/60 text-center max-w-xs">
        <p>{t('profile.photoRequirements')}</p>
        <p>JPEG, PNG, WebP • Max 5MB</p>
      </div>
    </div>
  );
};

export default PhotoUpload;

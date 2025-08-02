import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTypography } from '../../utils/typography';
import AnimatedButton from '../ui/AnimatedButton';

interface ApplicationData {
  filmTitle: string;
  files: {
    filmFile: {
      url: string;
      name: string;
      size: number;
    };
    posterFile?: {
      url: string;
      name: string;
      size: number;
    };
  };
  duration: number;
  status: 'draft' | 'submitted';
}

interface VideoSectionProps {
  application: ApplicationData;
  isEditMode: boolean;
  canEdit: boolean;
}

const VideoSection: React.FC<VideoSectionProps> = ({ 
  application, 
  isEditMode, 
  canEdit 
}) => {
  const { i18n } = useTranslation();
  const { getClass } = useTypography();
  const currentLanguage = i18n.language as 'en' | 'th';

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-hide controls after 3 seconds of no interaction
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isPlaying && !isHovered) {
      timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    } else {
      setShowControls(true);
    }
    return () => clearTimeout(timeout);
  }, [isPlaying, isHovered]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (videoRef.current) {
      videoRef.current.volume = vol;
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        if (videoRef.current.requestFullscreen) {
          videoRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 MB';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const handleVideoReplace = () => {
    // TODO: Implement video replacement functionality
    console.log('Replace video clicked');
  };

  return (
    <div className="glass-container rounded-2xl p-6 sm:p-8">
      {/* Video Player Only */}
      <div>
        <div 
          className="relative bg-black rounded-xl overflow-hidden group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Video Element */}
          {application.files.filmFile.url ? (
            <video
              ref={videoRef}
              src={application.files.filmFile.url}
              className="w-full aspect-video object-contain"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              poster={application.files?.posterFile?.url}
              onError={(e) => {
                console.error('Video loading error:', e);
                const target = e.target as HTMLVideoElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div class="w-full aspect-video flex flex-col items-center justify-center text-white/60 bg-black/50">
                      <div class="text-6xl mb-4">🎬</div>
                      <div class="text-lg mb-2">${currentLanguage === 'th' ? 'ไม่สามารถโหลดวิดีโอได้' : 'Video not available'}</div>
                      <div class="text-sm text-center px-4 max-w-md">
                        ${currentLanguage === 'th' ? 'ไฟล์วิดีโออาจเสียหายหรือไม่สามารถเข้าถึงได้' : 'The video file may be corrupted or inaccessible'}
                      </div>
                    </div>
                  `;
                }
              }}
            />
          ) : (
            <div className="w-full aspect-video flex flex-col items-center justify-center text-white/60 bg-black/50">
              <div className="text-6xl mb-4">🎬</div>
              <div className="text-lg mb-2">
                {currentLanguage === 'th' ? 'ไม่มีวิดีโอ' : 'No video available'}
              </div>
              <div className="text-sm text-center px-4 max-w-md">
                {currentLanguage === 'th' ? 'ยังไม่ได้อัปโหลดไฟล์วิดีโอ' : 'Video file has not been uploaded yet'}
              </div>
            </div>
          )}

          {/* Video Replace Overlay (Edit Mode) */}
          {canEdit && isEditMode && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <AnimatedButton
                variant="primary"
                size="medium"
                icon="🎬"
                onClick={handleVideoReplace}
              >
                {currentLanguage === 'th' ? 'เปลี่ยนวิดีโอ' : 'Replace Video'}
              </AnimatedButton>
            </div>
          )}

          {/* Custom Controls */}
          <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #FCB283 0%, #FCB283 ${(currentTime / duration) * 100}%, rgba(255,255,255,0.2) ${(currentTime / duration) * 100}%, rgba(255,255,255,0.2) 100%)`
                }}
              />
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Play/Pause Button */}
                <button
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-full bg-[#FCB283] hover:bg-[#AA4626] flex items-center justify-center text-white transition-colors"
                >
                  {isPlaying ? '⏸️' : '▶️'}
                </button>

                {/* Time Display */}
                <div className={`text-white text-sm ${getClass('body')}`}>
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>

                {/* Volume Control */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleVolumeChange({ target: { value: volume === 0 ? '1' : '0' } } as any)}
                    className="text-white hover:text-[#FCB283] transition-colors"
                  >
                    {volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* Fullscreen Button */}
                <button
                  onClick={toggleFullscreen}
                  className="text-white hover:text-[#FCB283] transition-colors p-2"
                >
                  {isFullscreen ? '🗗' : '⛶'}
                </button>
              </div>
            </div>
          </div>

          {/* Loading/Play Overlay */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={togglePlay}
                className="w-16 h-16 rounded-full bg-[#FCB283]/80 hover:bg-[#FCB283] flex items-center justify-center text-white text-2xl transition-all duration-300 hover:scale-110"
              >
                ▶️
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoSection;

import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useTypography } from '../../utils/typography';
import { validateFileForUpload, formatFileSize, isImageFile, isVideoFile, createFilePreview, cleanupFilePreview } from '../../utils/fileUpload';
import { FILE_TYPES } from '../../utils/formConstants';
import { ApplicationService, FileReplaceRequest } from '../../services/applicationService';
import AnimatedButton from '../ui/AnimatedButton';
import ErrorMessage from './ErrorMessage';

type FileUploadMode = 'upload' | 'progress' | 'replace';
type FileUploadStatus = 'idle' | 'uploading' | 'success' | 'error';

interface BaseFileUploadProps {
  name: string;
  label: string;
  accept: string;
  fileType: keyof typeof FILE_TYPES;
  required?: boolean;
  error?: string;
  className?: string;
}

interface UploadModeProps extends BaseFileUploadProps {
  mode: 'upload';
  onFileChange: (file: File | null) => void;
  currentFile?: File | null;
}

interface ProgressModeProps extends BaseFileUploadProps {
  mode: 'progress';
  fileName: string;
  progress: number;
  status: FileUploadStatus;
  progressError?: string;
}

interface ReplaceModeProps extends BaseFileUploadProps {
  mode: 'replace';
  applicationId: string;
  currentFileName: string;
  onFileReplaced: (newFileMetadata: any) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

type UnifiedFileUploadProps = UploadModeProps | ProgressModeProps | ReplaceModeProps;

const UnifiedFileUpload: React.FC<UnifiedFileUploadProps> = (props) => {
  const { i18n } = useTranslation();
  const { getClass } = useTypography();
  const currentLanguage = i18n.language as 'en' | 'th';
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State for upload mode
  const [dragOver, setDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // State for replace mode
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const config = FILE_TYPES[props.fileType];
  const maxSizeMB = Math.round(config.maxSize / (1024 * 1024));

  // Common file type configurations
  const getFileTypeConfig = () => {
    const configs = {
      VIDEO: {
        icon: '🎬',
        defaultIcon: '🎬'
      },
      IMAGE: {
        icon: '🖼️',
        defaultIcon: '🖼️'
      },
      DOCUMENT: {
        icon: '📄',
        defaultIcon: '📄'
      }
    };
    return configs[props.fileType] || { icon: '📁', defaultIcon: '📁' };
  };

  const typeConfig = getFileTypeConfig();

  const getFileIcon = (file: File) => {
    if (isImageFile(file)) return '🖼️';
    if (isVideoFile(file)) return '🎬';
    if (file.type === 'application/pdf') return '📄';
    return '📄';
  };

  const getStatusIcon = (status: FileUploadStatus) => {
    switch (status) {
      case 'uploading': return '⏳';
      case 'success': return '✅';
      case 'error': return '❌';
      default: return '📁';
    }
  };

  const getStatusColor = (status: FileUploadStatus) => {
    switch (status) {
      case 'uploading': return 'text-blue-400';
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      default: return 'text-white/70';
    }
  };

  const getProgressBarColor = (status: FileUploadStatus) => {
    switch (status) {
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-[#FCB283]';
    }
  };

  const getStatusText = (status: FileUploadStatus) => {
    const statusTexts = {
      th: {
        idle: 'รอการอัปโหลด',
        uploading: 'กำลังอัปโหลด',
        success: 'อัปโหลดสำเร็จ',
        error: 'อัปโหลดล้มเหลว'
      },
      en: {
        idle: 'Ready to upload',
        uploading: 'Uploading',
        success: 'Upload complete',
        error: 'Upload failed'
      }
    };
    return statusTexts[currentLanguage][status];
  };

  // Upload mode handlers
  const handleFileChange = (file: File | null) => {
    if (props.mode !== 'upload') return;

    // Cleanup previous preview
    if (previewUrl) {
      cleanupFilePreview(previewUrl);
      setPreviewUrl(null);
    }

    if (!file) {
      props.onFileChange(null);
      return;
    }

    // Validate file
    const validation = validateFileForUpload(file, props.fileType);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    // Create preview for images
    if (isImageFile(file)) {
      const preview = createFilePreview(file);
      setPreviewUrl(preview);
    }

    props.onFileChange(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileChange(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileChange(files[0]);
    }
  };

  const handleRemoveFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    handleFileChange(null);
  };

  // Replace mode handlers
  const handleFileSelect = () => {
    if (props.mode !== 'replace' || props.disabled || isUploading) return;
    fileInputRef.current?.click();
  };

  const handleReplaceFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (props.mode !== 'replace') return;
    
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const applicationService = new ApplicationService();
      
      const request: FileReplaceRequest = {
        applicationId: props.applicationId,
        fileType: props.name as 'filmFile' | 'posterFile' | 'proofFile',
        newFile: file,
        onProgress: (progress) => {
          setUploadProgress(progress);
        }
      };

      const newFileMetadata = await applicationService.replaceFile(request);
      
      props.onFileReplaced(newFileMetadata);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      console.error('Error replacing file:', error);
      props.onError(error instanceof Error ? error.message : 'Failed to replace file');
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Render upload mode
  if (props.mode === 'upload') {
    return (
      <div className={props.className}>
        <label className={`block text-white/90 ${getClass('body')} mb-2`}>
          {props.label} {props.required && <span className="text-red-400">*</span>}
        </label>
        
        {/* File Input Area */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
            dragOver
              ? 'border-[#FCB283] bg-[#FCB283]/10'
              : props.error
              ? 'border-red-400'
              : 'border-white/20 hover:border-white/40'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            name={props.name}
            accept={props.accept}
            onChange={handleInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            required={props.required}
          />
          
          {props.currentFile ? (
            /* File Selected */
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-3">
                <span className="text-2xl">{getFileIcon(props.currentFile)}</span>
                <div className="text-left">
                  <div className={`text-white ${getClass('body')} font-medium`}>
                    {props.currentFile.name}
                  </div>
                  <div className="text-white/60 text-sm">
                    {formatFileSize(props.currentFile.size)}
                  </div>
                </div>
              </div>
              
              {/* Image Preview */}
              {previewUrl && (
                <div className="mb-3">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-full max-h-32 mx-auto rounded-lg object-cover"
                  />
                </div>
              )}
              
              <button
                type="button"
                onClick={handleRemoveFile}
                className="text-red-400 hover:text-red-300 text-sm underline"
              >
                {currentLanguage === 'th' ? 'ลบไฟล์' : 'Remove File'}
              </button>
            </div>
          ) : (
            /* No File Selected */
            <div className="text-center">
              <div className="text-4xl mb-3">{typeConfig.defaultIcon}</div>
              <div className={`text-white/80 ${getClass('body')} mb-2`}>
                {currentLanguage === 'th' 
                  ? 'คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวางที่นี่'
                  : 'Click to select file or drag and drop here'
                }
              </div>
              <div className="text-white/60 text-sm">
                {currentLanguage === 'th' 
                  ? `ไฟล์ที่รองรับ: ${props.accept} (สูงสุด ${maxSizeMB}MB)`
                  : `Supported files: ${props.accept} (max ${maxSizeMB}MB)`
                }
              </div>
            </div>
          )}
        </div>
        
        <ErrorMessage error={props.error} />
      </div>
    );
  }

  // Render progress mode
  if (props.mode === 'progress') {
    return (
      <div className={`glass-card p-4 rounded-lg border border-white/10 ${props.className}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <span className="text-xl flex-shrink-0">{typeConfig.icon}</span>
            <div className="flex-1 min-w-0">
              <p className={`${getClass('body')} text-white text-sm truncate`}>
                {props.fileName}
              </p>
              <p className={`${getClass('body')} text-xs ${getStatusColor(props.status)}`}>
                {getStatusText(props.status)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 flex-shrink-0">
            <span className="text-lg">{getStatusIcon(props.status)}</span>
            {props.status === 'uploading' && (
              <span className={`${getClass('body')} text-white/80 text-sm`}>
                {Math.round(props.progress)}%
              </span>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {(props.status === 'uploading' || props.status === 'success') && (
          <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden mb-2">
            <div 
              className={`h-full transition-all duration-300 ${getProgressBarColor(props.status)}`}
              style={{ width: `${props.status === 'success' ? 100 : props.progress}%` }}
            />
          </div>
        )}

        {/* Error Message */}
        {props.status === 'error' && props.progressError && (
          <div className="mt-2 p-2 bg-red-500/20 border border-red-500/30 rounded text-red-300">
            <p className={`${getClass('body')} text-xs`}>
              {props.progressError}
            </p>
          </div>
        )}
      </div>
    );
  }

  // Render replace mode
  if (props.mode === 'replace') {
    return (
      <div className={`space-y-4 ${props.className}`}>
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={props.accept}
          onChange={handleReplaceFileChange}
          className="hidden"
        />

        {/* Current file info */}
        <div className="glass-card p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{typeConfig.icon}</span>
              <div>
                <h4 className={`text-sm ${getClass('subtitle')} text-white/80`}>
                  {props.label}
                </h4>
                <p className={`text-xs ${getClass('body')} text-white/60 truncate max-w-48`}>
                  {props.currentFileName}
                </p>
              </div>
            </div>

            {/* Replace button */}
            <AnimatedButton
              variant="secondary"
              size="small"
              icon="🔄"
              onClick={handleFileSelect}
              className={props.disabled || isUploading ? 'opacity-50 cursor-not-allowed' : ''}
            >
              {currentLanguage === 'th' ? 'เปลี่ยน' : 'Replace'}
            </AnimatedButton>
          </div>

          {/* Upload progress */}
          {isUploading && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className={`text-xs ${getClass('body')} text-white/80`}>
                  {currentLanguage === 'th' ? 'กำลังอัปโหลด...' : 'Uploading...'}
                </span>
                <span className={`text-xs ${getClass('body')} text-[#FCB283]`}>
                  {Math.round(uploadProgress)}%
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-[#FCB283] to-[#AA4626] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* File requirements */}
        <div className="text-xs text-white/60">
          <p>
            {currentLanguage === 'th' ? 'รองรับ: ' : 'Supported: '}
            {props.accept.replace(/\./g, '').toUpperCase()}
          </p>
          <p>
            {currentLanguage === 'th' ? 'ขนาดสูงสุด: ' : 'Max size: '}
            {maxSizeMB}MB
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default UnifiedFileUpload;

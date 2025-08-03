import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTypography } from '../../utils/typography';
import { SubmissionProgress as SubmissionProgressType } from '../../services/submissionService';

interface SubmissionProgressProps {
  progress: SubmissionProgressType;
  className?: string;
}

const SubmissionProgress: React.FC<SubmissionProgressProps> = ({
  progress,
  className = ''
}) => {
  const { i18n } = useTranslation();
  const { getClass } = useTypography();
  const currentLanguage = i18n.language as 'en' | 'th';

  const getStageIcon = (stage: SubmissionProgressType['stage']) => {
    switch (stage) {
      case 'validating': return '🔍';
      case 'uploading': return '📤';
      case 'saving': return '💾';
      case 'complete': return '✅';
      case 'error': return '❌';
      default: return '⏳';
    }
  };

  const getStageText = (stage: SubmissionProgressType['stage']) => {
    const stageTexts = {
      th: {
        validating: 'กำลังตรวจสอบข้อมูล',
        uploading: 'กำลังอัปโหลดไฟล์',
        saving: 'กำลังบันทึกข้อมูล',
        complete: 'เสร็จสิ้น',
        error: 'เกิดข้อผิดพลาด'
      },
      en: {
        validating: 'Validating',
        uploading: 'Uploading',
        saving: 'Saving',
        complete: 'Complete',
        error: 'Error'
      }
    };
    return stageTexts[currentLanguage][stage];
  };

  const getProgressColor = (stage: SubmissionProgressType['stage']) => {
    switch (stage) {
      case 'complete': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-[#FCB283]';
    }
  };

  return (
    <div className={`glass-container rounded-xl p-6 ${className}`}>
      {/* Main Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getStageIcon(progress.stage)}</span>
            <span className={`${getClass('subtitle')} text-white`}>
              {getStageText(progress.stage)}
            </span>
          </div>
          <span className={`${getClass('body')} text-white/80`}>
            {Math.round(progress.progress)}%
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${getProgressColor(progress.stage)}`}
            style={{ width: `${progress.progress}%` }}
          />
        </div>
        
        {/* Progress Message */}
        <p className={`${getClass('body')} text-white/70 mt-2 text-sm`}>
          {progress.message}
        </p>
      </div>

      {/* File Upload Progress */}
      {progress.fileProgress && progress.stage === 'uploading' && (
        <>
          {/* Auto-scroll to top when uploading starts */}
          {React.useEffect(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, [])}
          
        <div className="space-y-4">
          <h4 className={`${getClass('subtitle')} text-white mb-3`}>
            {currentLanguage === 'th' ? 'ความคืบหน้าการอัปโหลด' : 'Upload Progress'}
          </h4>
          
          {Object.entries(progress.fileProgress).map(([fileType, fileProgress]) => {
            const fileLabels = {
              th: {
                film: 'ไฟล์ภาพยนตร์',
                poster: 'โปสเตอร์',
                proof: 'หลักฐาน'
              },
              en: {
                film: 'Film File',
                poster: 'Poster',
                proof: 'Proof Document'
              }
            };

            const fileIcons = {
              film: '🎬',
              poster: '🖼️',
              proof: '📄'
            };

            return (
              <div key={fileType} className="glass-card p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{fileIcons[fileType as keyof typeof fileIcons]}</span>
                    <span className={`${getClass('body')} text-white text-sm`}>
                      {fileLabels[currentLanguage][fileType as keyof typeof fileLabels.en]}
                    </span>
                  </div>
                  <span className={`${getClass('body')} text-white/80 text-sm`}>
                    {Math.round(fileProgress)}%
                  </span>
                </div>
                
                <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-[#FCB283] transition-all duration-300"
                    style={{ width: `${fileProgress}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        </>
      )}

      {/* Error Details */}
      {progress.stage === 'error' && (
        <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-red-400">⚠️</span>
            <span className={`${getClass('subtitle')} text-red-400`}>
              {currentLanguage === 'th' ? 'รายละเอียดข้อผิดพลาด' : 'Error Details'}
            </span>
          </div>
          <p className={`${getClass('body')} text-red-300 text-sm`}>
            {progress.message}
          </p>
        </div>
      )}

      {/* Success Message */}
      {progress.stage === 'complete' && (
        <div className="mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-green-400">🎉</span>
            <span className={`${getClass('subtitle')} text-green-400`}>
              {currentLanguage === 'th' ? 'สำเร็จ!' : 'Success!'}
            </span>
          </div>
          <p className={`${getClass('body')} text-green-300 text-sm`}>
            {currentLanguage === 'th' 
              ? 'ส่งผลงานเรียบร้อยแล้ว ทางเทศกาลจะติดต่อกลับภายใน 30 วัน'
              : 'Your submission has been received successfully. The festival will contact you within 30 days.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default SubmissionProgress;
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTypography } from '../../utils/typography';
import AnimatedButton from '../ui/AnimatedButton';

interface DraftSuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitNow: () => void;
  onReviewLater: () => void;
  applicationId: string;
  isDraft?: boolean;
}

const DraftSuccessDialog: React.FC<DraftSuccessDialogProps> = ({
  isOpen,
  onClose,
  onSubmitNow,
  onReviewLater,
  applicationId,
  isDraft = true
}) => {
  const { i18n } = useTranslation();
  const { getClass } = useTypography();
  const currentLanguage = i18n.language as 'en' | 'th';
  const [isProcessing, setIsProcessing] = useState(false);

  const content = {
    th: {
      title: 'บันทึกร่างสำเร็จ!',
      subtitle: 'การสมัครของคุณเกือบสำเร็จแล้ว',
      message: 'ร่างใบสมัครได้รับการบันทึกการบันทึกเรียบร้อยแล้ว กรุณาตรวจทานข้อมูลอีกครั้งก่อนส่งในสมัครจริง',
      deadline: 'เวลาสิ้นสุดการรับสมัคร: 5 กันยายน 2568',
      timeRemaining: 'เหลือเวลาอีก:',
      submitNow: 'ส่งใบสมัครเลย',
      submitNowDesc: 'ตรวจสอบข้อมูลและส่งใบสมัครทันที',
      reviewLater: 'ตรวจทานทีหลัง',
      reviewLaterDesc: 'ไปยังหน้า "ใบสมัครของฉัน" เพื่อแก้ไขและส่งในภายหลัง',
      important: 'สำคัญ:',
      importantNote: 'ใบสมัครจะไม่สมบูรณ์จนกว่าคุณจะกดปุ่ม "ส่งใบสมัคร" ในหน้า Application Detail',
      applicationId: 'รหัสใบสมัคร:'
    },
    en: {
      title: 'Draft Saved Successfully!',
      subtitle: 'Your application is almost complete',
      message: 'Your application draft has been saved successfully. Please review your information once more before submitting your final application.',
      deadline: 'Submission Deadline: September 5, 2025',
      timeRemaining: 'Time Remaining:',
      submitNow: 'Submit Now',
      submitNowDesc: 'Review and submit your application immediately',
      reviewLater: 'Review Later',
      reviewLaterDesc: 'Go to "My Applications" to edit and submit later',
      important: 'Important:',
      importantNote: 'Your application will not be complete until you click "Submit Application" on the Application Detail page',
      applicationId: 'Application ID:'
    }
  };

  const currentContent = content[currentLanguage];

  // Calculate time remaining until September 5, 2025
  const getTimeRemaining = () => {
    const deadline = new Date('2025-09-05T23:59:59+07:00');
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();

    if (diff <= 0) {
      return currentLanguage === 'th' ? 'หมดเวลาแล้ว' : 'Deadline passed';
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return currentLanguage === 'th' 
        ? `${days} วัน ${hours} ชั่วโมง`
        : `${days} days ${hours} hours`;
    } else {
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return currentLanguage === 'th' 
        ? `${hours} ชั่วโมง ${minutes} นาที`
        : `${hours} hours ${minutes} minutes`;
    }
  };

  const handleSubmitNow = async () => {
    setIsProcessing(true);
    try {
      await onSubmitNow();
    } catch (error) {
      console.error('Error during submit:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReviewLater = () => {
    setIsProcessing(true);
    onReviewLater();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-container rounded-2xl max-w-lg w-full">
        <div className="p-6">
          
          {/* Header with Close Button */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              {/* Success Icon and Title */}
              <div className="flex items-center space-x-3 mb-2">
                <div className="text-3xl animate-bounce">✅</div>
                <div>
                  <h2 className={`text-xl ${getClass('header')} text-white leading-tight`}>
                    {currentContent.title}
                  </h2>
                  <p className={`text-sm ${getClass('body')} text-[#FCB283]`}>
                    {currentContent.subtitle}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="text-white/40 hover:text-white/60 transition-colors p-1"
              disabled={isProcessing}
            >
              ✕
            </button>
          </div>

          {/* Message */}
          <p className={`text-sm ${getClass('body')} text-white/80 mb-4 leading-relaxed`}>
            {currentContent.message}
          </p>

          {/* Compact Info Cards */}
          <div className="space-y-3 mb-4">
            
            {/* Deadline Information - Compact */}
            <div className="glass-card p-3 rounded-lg border border-orange-400/30 bg-orange-500/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">⏰</span>
                  <div>
                    <p className={`text-xs ${getClass('subtitle')} text-orange-300`}>
                      {currentContent.deadline}
                    </p>
                    <p className={`text-xs ${getClass('body')} text-white/60`}>
                      {currentContent.timeRemaining} <span className="text-orange-400 font-medium">{getTimeRemaining()}</span>
                    </p>
                  </div>
                </div>
                <span className="text-lg">⚡</span>
              </div>
            </div>

            {/* Important Notice - Compact */}
            <div className="glass-card p-3 rounded-lg border border-red-400/30 bg-red-500/5">
              <div className="flex items-start space-x-2">
                <span className="text-lg mt-0.5">⚠️</span>
                <div className="flex-1">
                  <p className={`text-xs ${getClass('subtitle')} text-red-300 mb-1`}>
                    {currentContent.important}
                  </p>
                  <p className={`text-xs ${getClass('body')} text-white/70 leading-relaxed`}>
                    {currentContent.importantNote}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons - Compact Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            
            {/* Submit Now Option */}
            <div className="glass-card p-3 rounded-lg border border-green-400/30 hover:border-green-400/50 transition-colors">
              <div className="text-center">
                <div className="text-2xl mb-2">🚀</div>
                <h4 className={`text-sm ${getClass('subtitle')} text-green-300 mb-1`}>
                  {currentContent.submitNow}
                </h4>
                <p className={`text-xs ${getClass('body')} text-white/60 mb-3 leading-tight`}>
                  {currentContent.submitNowDesc}
                </p>
                <AnimatedButton
                  variant="primary"
                  size="small"
                  onClick={handleSubmitNow}
                  disabled={isProcessing}
                  className={`w-full text-xs ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isProcessing ? '...' : (currentLanguage === 'th' ? 'ส่งเลย' : 'Submit')}
                </AnimatedButton>
              </div>
            </div>

            {/* Review Later Option */}
            <div className="glass-card p-3 rounded-lg border border-blue-400/30 hover:border-blue-400/50 transition-colors">
              <div className="text-center">
                <div className="text-2xl mb-2">📋</div>
                <h4 className={`text-sm ${getClass('subtitle')} text-blue-300 mb-1`}>
                  {currentContent.reviewLater}
                </h4>
                <p className={`text-xs ${getClass('body')} text-white/60 mb-3 leading-tight`}>
                  {currentContent.reviewLaterDesc}
                </p>
                <AnimatedButton
                  variant="secondary"
                  size="small"
                  onClick={handleReviewLater}
                  disabled={isProcessing}
                  className={`w-full text-xs ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isProcessing ? '...' : (currentLanguage === 'th' ? 'ทีหลัง' : 'Later')}
                </AnimatedButton>
              </div>
            </div>
          </div>

          {/* Application ID - Compact */}
          <div className="text-center pt-3 border-t border-white/10">
            <p className={`text-xs ${getClass('body')} text-white/50`}>
              {currentContent.applicationId} 
              <span className="font-mono text-[#FCB283] ml-1">{applicationId}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DraftSuccessDialog;
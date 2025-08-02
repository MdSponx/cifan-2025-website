import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTypography } from '../../utils/typography';
import AnimatedButton from '../ui/AnimatedButton';
import SubmissionConfirm from './SubmissionConfirm';
import { ApplicationService, FilmApplication } from '../../services/applicationService';

interface ApplicationData {
  id: string;
  status: 'draft' | 'submitted';
  submittedAt?: any;
  lastModified?: any;
}

interface ActionSectionProps {
  application: ApplicationData & FilmApplication;
  isEditMode: boolean;
  canEdit: boolean;
  onEditToggle: () => void;
  onSave: () => void;
  onApplicationUpdated: () => void;
}

const ActionSection: React.FC<ActionSectionProps> = ({ 
  application, 
  isEditMode, 
  canEdit, 
  onEditToggle, 
  onSave,
  onApplicationUpdated
}) => {
  const { i18n } = useTranslation();
  const { getClass } = useTypography();
  const currentLanguage = i18n.language as 'en' | 'th';

  const [showSubmissionConfirm, setShowSubmissionConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString(currentLanguage === 'th' ? 'th-TH' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSubmitApplication = () => {
    setShowSubmissionConfirm(true);
  };

  const handleWithdrawApplication = async () => {
    if (isProcessing) return;
    
    const confirmed = window.confirm(
      currentLanguage === 'th' 
        ? 'คุณแน่ใจหรือไม่ที่จะถอนใบสมัครนี้?'
        : 'Are you sure you want to withdraw this application?'
    );
    
    if (!confirmed) return;

    setIsProcessing(true);
    try {
      const applicationService = new ApplicationService();
      await applicationService.withdrawApplication(application.id);
      onApplicationUpdated();
    } catch (error) {
      console.error('Error withdrawing application:', error);
      alert(error instanceof Error ? error.message : 'Failed to withdraw application');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteDraft = async () => {
    if (isProcessing) return;
    
    const confirmed = window.confirm(
      currentLanguage === 'th' 
        ? 'คุณแน่ใจหรือไม่ที่จะลบร่างนี้? การกระทำนี้ไม่สามารถยกเลิกได้'
        : 'Are you sure you want to delete this draft? This action cannot be undone.'
    );
    
    if (!confirmed) return;

    setIsProcessing(true);
    try {
      const applicationService = new ApplicationService();
      await applicationService.deleteApplication(application.id);
      onApplicationUpdated();
    } catch (error) {
      console.error('Error deleting application:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete application');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadApplication = () => {
    // TODO: Implement download functionality
    console.log('Download application clicked');
    alert(currentLanguage === 'th' 
      ? 'ฟีเจอร์ดาวน์โหลดจะเปิดให้ใช้งานเร็วๆ นี้'
      : 'Download feature coming soon'
    );
  };

  const handleSubmissionComplete = () => {
    onApplicationUpdated();
  };

  return (
    <div className="glass-container rounded-2xl p-6 sm:p-8">
      <div className="space-y-6">
        
        {/* Section Header */}
        <div className="text-center">
          <h3 className={`text-xl ${getClass('header')} text-white mb-2`}>
            {currentLanguage === 'th' ? 'การจัดการใบสมัคร' : 'Application Management'}
          </h3>
          <p className={`${getClass('body')} text-white/60`}>
            {application.status === 'submitted' 
              ? (currentLanguage === 'th' ? 'ใบสมัครนี้ได้ส่งแล้ว' : 'This application has been submitted')
              : (currentLanguage === 'th' ? 'ใบสมัครนี้ยังเป็นร่าง' : 'This application is still a draft')
            }
          </p>
        </div>

        {/* Status Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-card p-4 rounded-xl text-center">
            <h4 className={`text-sm ${getClass('subtitle')} text-white/80 mb-2`}>
              {currentLanguage === 'th' ? 'สถานะ' : 'Status'}
            </h4>
            <div className="flex items-center justify-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${
                application.status === 'submitted' ? 'bg-green-400' : 'bg-yellow-400'
              }`}></span>
              <span className={`${getClass('body')} ${
                application.status === 'submitted' ? 'text-green-400' : 'text-yellow-400'
              }`}>
                {application.status === 'submitted' 
                  ? (currentLanguage === 'th' ? 'ส่งแล้ว' : 'Submitted')
                  : (currentLanguage === 'th' ? 'ร่าง' : 'Draft')
                }
              </span>
            </div>
          </div>

          <div className="glass-card p-4 rounded-xl text-center">
            <h4 className={`text-sm ${getClass('subtitle')} text-white/80 mb-2`}>
              {application.status === 'submitted' 
                ? (currentLanguage === 'th' ? 'ส่งเมื่อ' : 'Submitted')
                : (currentLanguage === 'th' ? 'แก้ไขล่าสุด' : 'Last Modified')
              }
            </h4>
            <p className={`text-xs ${getClass('body')} text-white/60`}>
              {application.status === 'submitted' 
                ? formatDate(application.submittedAt)
                : formatDate(application.lastModified)
              }
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          
          {/* Primary Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            
            {/* Edit Mode Actions */}
            {isEditMode ? (
              <>
                <AnimatedButton
                  variant="outline"
                  size="large"
                  icon="❌"
                  onClick={onEditToggle}
                >
                  {currentLanguage === 'th' ? 'ยกเลิกการแก้ไข' : 'Cancel Edit'}
                </AnimatedButton>
                <AnimatedButton
                  variant="primary"
                  size="large"
                  icon="💾"
                  onClick={onSave}
                >
                  {currentLanguage === 'th' ? 'บันทึกการเปลี่ยนแปลง' : 'Save Changes'}
                </AnimatedButton>
              </>
            ) : (
              <>
                {/* Draft Actions */}
                {application.status === 'draft' && (
                  <>
                    {canEdit && (
                      <AnimatedButton
                        variant="secondary"
                        size="medium"
                        icon="✏️"
                        onClick={onEditToggle}
                      >
                        {currentLanguage === 'th' ? 'แก้ไขใบสมัคร' : 'Edit Application'}
                      </AnimatedButton>
                    )}
                    <AnimatedButton
                      variant="primary"
                      size="medium"
                      icon="📤"
                      onClick={handleSubmitApplication}
                    >
                      {currentLanguage === 'th' ? 'ส่งใบสมัคร' : 'Submit Application'}
                    </AnimatedButton>
                  </>
                )}

                {/* Submitted Actions */}
                {application.status === 'submitted' && (
                  <AnimatedButton
                    variant="secondary"
                    size="medium"
                    icon="📄"
                    onClick={handleDownloadApplication}
                  >
                    {currentLanguage === 'th' ? 'ดาวน์โหลดใบสมัคร' : 'Download Application'}
                  </AnimatedButton>
                )}
              </>
            )}
          </div>

          {/* Secondary Actions */}
          {!isEditMode && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              
              {/* Draft Secondary Actions */}
              {application.status === 'draft' && (
                <AnimatedButton
                  variant="outline"
                  size="small"
                  icon="🗑️"
                  onClick={handleDeleteDraft}
                >
                  {currentLanguage === 'th' ? 'ลบร่าง' : 'Delete Draft'}
                </AnimatedButton>
              )}

              {/* Submitted Secondary Actions */}
              {application.status === 'submitted' && (
                <AnimatedButton
                  variant="outline"
                  size="small"
                  icon="↩️"
                  onClick={handleWithdrawApplication}
                >
                  {currentLanguage === 'th' ? 'ถอนใบสมัคร' : 'Withdraw Application'}
                </AnimatedButton>
              )}
            </div>
          )}
        </div>

        {/* Warning Messages */}
        {application.status === 'submitted' && (
          <div className="glass-card p-4 rounded-xl border-l-4 border-green-400">
            <div className="flex items-start space-x-3">
              <span className="text-green-400 text-xl">✅</span>
              <div>
                <h4 className={`${getClass('subtitle')} text-green-400 mb-1`}>
                  {currentLanguage === 'th' ? 'ส่งใบสมัครเรียบร้อย' : 'Application Submitted'}
                </h4>
                <p className={`text-sm ${getClass('body')} text-white/80`}>
                  {currentLanguage === 'th' 
                    ? 'ใบสมัครของคุณได้รับการส่งเรียบร้อยแล้ว ทางเทศกาลจะแจ้งผลการคัดเลือกภายในเวลาที่กำหนด'
                    : 'Your application has been successfully submitted. The festival will announce selection results within the specified timeframe.'
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Application ID */}
        <div className="text-center pt-4 border-t border-white/10">
          <p className={`text-xs ${getClass('body')} text-white/60`}>
            {currentLanguage === 'th' ? 'รหัสใบสมัคร: ' : 'Application ID: '}
            <span className="font-mono text-[#FCB283]">{application.id}</span>
          </p>
        </div>
      </div>

      {/* Submission Confirmation Modal */}
      <SubmissionConfirm
        application={application}
        isOpen={showSubmissionConfirm}
        onClose={() => setShowSubmissionConfirm(false)}
        onSubmitted={handleSubmissionComplete}
      />
    </div>
  );
};

export default ActionSection;

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTypography } from '../../utils/typography';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import AnimatedButton from '../ui/AnimatedButton';
import { ApplicationService, FilmApplication, ValidationResult, SubmissionProgress } from '../../services/applicationService';

interface SubmissionConfirmProps {
  application: FilmApplication;
  isOpen: boolean;
  onClose: () => void;
  onSubmitted: () => void;
}

interface DetailedApplicationData {
  id: string;
  filmTitle: string;
  filmTitleTh?: string;
  competitionCategory: 'youth' | 'future' | 'world';
  format: string;
  duration: number;
  synopsis: string;
  genres: string[];
  submitterName?: string;
  directorName?: string;
  files: {
    filmFile: {
      fileName: string;
      fileSize: number;
      downloadURL: string;
    };
    posterFile: {
      fileName: string;
      fileSize: number;
      downloadURL: string;
    };
    proofFile?: {
      fileName: string;
      fileSize: number;
      downloadURL: string;
    };
  };
}

const SubmissionConfirm: React.FC<SubmissionConfirmProps> = ({
  application,
  isOpen,
  onClose,
  onSubmitted
}) => {
  const { i18n } = useTranslation();
  const { getClass } = useTypography();
  const currentLanguage = i18n.language as 'en' | 'th';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionProgress, setSubmissionProgress] = useState<SubmissionProgress | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [detailedData, setDetailedData] = useState<DetailedApplicationData | null>(null);
  const [loadingData, setLoadingData] = useState(false);

  // Fetch detailed application data when modal opens
  useEffect(() => {
    if (isOpen && application.id) {
      fetchDetailedApplicationData();
    }
  }, [isOpen, application.id]);

  const fetchDetailedApplicationData = async () => {
    setLoadingData(true);
    setError(null);
    
    try {
      const docRef = doc(db, 'submissions', application.id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        const detailedApp: DetailedApplicationData = {
          id: docSnap.id,
          filmTitle: data.filmTitle || '',
          filmTitleTh: data.filmTitleTh,
          competitionCategory: data.competitionCategory || data.category,
          format: data.format || '',
          duration: data.duration || 0,
          synopsis: data.synopsis || '',
          genres: data.genres || [],
          submitterName: data.submitterName,
          directorName: data.directorName,
          files: {
            filmFile: {
              fileName: data.files?.filmFile?.fileName || 'Film file',
              fileSize: data.files?.filmFile?.fileSize || 0,
              downloadURL: data.files?.filmFile?.downloadURL || ''
            },
            posterFile: {
              fileName: data.files?.posterFile?.fileName || 'Poster file',
              fileSize: data.files?.posterFile?.fileSize || 0,
              downloadURL: data.files?.posterFile?.downloadURL || ''
            },
            proofFile: data.files?.proofFile ? {
              fileName: data.files?.proofFile?.fileName || 'Proof file',
              fileSize: data.files?.proofFile?.fileSize || 0,
              downloadURL: data.files?.proofFile?.downloadURL || ''
            } : undefined
          }
        };
        
        setDetailedData(detailedApp);
        
        // Validate with fresh data
        const applicationService = new ApplicationService();
        const validation = applicationService.validateBeforeSubmit(application);
        setValidationResult(validation);
      } else {
        setError(currentLanguage === 'th' ? 'ไม่พบข้อมูลใบสมัคร' : 'Application data not found');
      }
    } catch (error) {
      console.error('Error fetching application data:', error);
      setError(currentLanguage === 'th' ? 'เกิดข้อผิดพลาดในการโหลดข้อมูล' : 'Error loading application data');
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async () => {
    if (!validationResult?.isValid) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const applicationService = new ApplicationService((progress) => {
        setSubmissionProgress(progress);
      });

      await applicationService.submitApplication(application.id);
      
      // Wait a moment to show completion
      setTimeout(() => {
        onSubmitted();
        onClose();
      }, 1500);

    } catch (error) {
      console.error('Submission error:', error);
      setError(error instanceof Error ? error.message : 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes || isNaN(bytes)) return '0 MB';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const getCategoryTitle = (category: string) => {
    const titles = {
      youth: {
        th: 'เยาวชน',
        en: 'Youth'
      },
      future: {
        th: 'อนาคต',
        en: 'Future'
      },
      world: {
        th: 'โลก',
        en: 'World'
      }
    };
    return titles[category as keyof typeof titles]?.[currentLanguage] || category;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="glass-container rounded-xl sm:rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
        
        {/* Header - Fixed */}
        <div className="flex-shrink-0 p-4 sm:p-6 border-b border-white/20">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">📤</div>
            <h2 className={`text-xl sm:text-2xl ${getClass('header')} text-white mb-2`}>
              {currentLanguage === 'th' ? 'ยืนยันการส่งใบสมัคร' : 'Confirm Submission'}
            </h2>
            <p className={`${getClass('body')} text-white/80 text-sm sm:text-base px-2`}>
              {currentLanguage === 'th' 
                ? 'กรุณาตรวจสอบข้อมูลก่อนส่งใบสมัคร หลังจากส่งแล้วจะไม่สามารถแก้ไขได้'
                : 'Please review your application before submitting. Once submitted, it cannot be edited.'
              }
            </p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="space-y-4 sm:space-y-6">

            {/* Loading State */}
            {loadingData && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FCB283] mb-4"></div>
                <p className={`${getClass('body')} text-white/80`}>
                  {currentLanguage === 'th' ? 'กำลังโหลดข้อมูล...' : 'Loading application data...'}
                </p>
              </div>
            )}

            {/* Submission Progress */}
            {submissionProgress && (
              <div className="glass-card p-4 rounded-xl">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#FCB283]"></div>
                  <span className={`${getClass('body')} text-white text-sm sm:text-base`}>
                    {submissionProgress.message}
                  </span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-[#FCB283] to-[#AA4626] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${submissionProgress.progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="glass-card p-4 rounded-xl border-l-4 border-red-400">
                <div className="flex items-start space-x-3">
                  <span className="text-red-400 text-xl flex-shrink-0">❌</span>
                  <div className="min-w-0">
                    <h4 className={`${getClass('subtitle')} text-red-400 mb-1`}>
                      {currentLanguage === 'th' ? 'เกิดข้อผิดพลาด' : 'Submission Error'}
                    </h4>
                    <p className={`text-sm ${getClass('body')} text-white/80 break-words`}>
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Validation Results */}
            {validationResult && (
              <div className="space-y-4">
                
                {/* Validation Errors */}
                {validationResult.errors.length > 0 && (
                  <div className="glass-card p-4 rounded-xl border-l-4 border-red-400">
                    <h4 className={`${getClass('subtitle')} text-red-400 mb-3`}>
                      {currentLanguage === 'th' ? 'ข้อมูลที่จำเป็นยังไม่ครบ' : 'Required Information Missing'}
                    </h4>
                    <ul className="space-y-1">
                      {validationResult.errors.map((error, index) => (
                        <li key={index} className={`text-sm ${getClass('body')} text-white/80 flex items-start`}>
                          <span className="text-red-400 mr-2 flex-shrink-0">•</span>
                          <span className="break-words">{error}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Validation Warnings */}
                {validationResult.warnings.length > 0 && (
                  <div className="glass-card p-4 rounded-xl border-l-4 border-yellow-400">
                    <h4 className={`${getClass('subtitle')} text-yellow-400 mb-3`}>
                      {currentLanguage === 'th' ? 'คำแนะนำ' : 'Recommendations'}
                    </h4>
                    <ul className="space-y-1">
                      {validationResult.warnings.map((warning, index) => (
                        <li key={index} className={`text-sm ${getClass('body')} text-white/80 flex items-start`}>
                          <span className="text-yellow-400 mr-2 flex-shrink-0">•</span>
                          <span className="break-words">{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Success State */}
                {validationResult.isValid && validationResult.errors.length === 0 && (
                  <div className="glass-card p-4 rounded-xl border-l-4 border-green-400">
                    <div className="flex items-center space-x-3">
                      <span className="text-green-400 text-xl flex-shrink-0">✅</span>
                      <div className="min-w-0">
                        <h4 className={`${getClass('subtitle')} text-green-400 mb-1`}>
                          {currentLanguage === 'th' ? 'พร้อมส่งใบสมัคร' : 'Ready to Submit'}
                        </h4>
                        <p className={`text-sm ${getClass('body')} text-white/80`}>
                          {currentLanguage === 'th' 
                            ? 'ข้อมูลครบถ้วนและพร้อมส่งใบสมัคร'
                            : 'All required information is complete and ready for submission.'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Application Summary */}
            {validationResult?.isValid && detailedData && (
              <div>
                <h3 className={`text-lg ${getClass('header')} text-white mb-4`}>
                  {currentLanguage === 'th' ? 'สรุปใบสมัคร' : 'Application Summary'}
                </h3>
                
                <div className="space-y-4">
                  {/* Basic Information */}
                  <div className="glass-card p-4 rounded-xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="min-w-0">
                        <h4 className={`text-sm ${getClass('subtitle')} text-white/80 mb-1`}>
                          {currentLanguage === 'th' ? 'ชื่อภาพยนตร์' : 'Film Title'}
                        </h4>
                        <p className={`${getClass('body')} text-white break-words`}>
                          {currentLanguage === 'th' && detailedData.filmTitleTh 
                            ? detailedData.filmTitleTh 
                            : detailedData.filmTitle}
                        </p>
                        {detailedData.filmTitleTh && (
                          <p className={`${getClass('body')} text-white/60 text-sm break-words`}>
                            {currentLanguage === 'th' ? detailedData.filmTitle : detailedData.filmTitleTh}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <h4 className={`text-sm ${getClass('subtitle')} text-white/80 mb-1`}>
                          {currentLanguage === 'th' ? 'ประเภท' : 'Category'}
                        </h4>
                        <p className={`${getClass('body')} text-[#FCB283]`}>
                          {getCategoryTitle(detailedData.competitionCategory)}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className={`text-sm ${getClass('subtitle')} text-white/80 mb-1`}>
                          {currentLanguage === 'th' ? 'รูปแบบ' : 'Format'}
                        </h4>
                        <p className={`${getClass('body')} text-white capitalize`}>
                          {detailedData.format.replace('-', ' ')}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className={`text-sm ${getClass('subtitle')} text-white/80 mb-1`}>
                          {currentLanguage === 'th' ? 'ความยาว' : 'Duration'}
                        </h4>
                        <p className={`${getClass('body')} text-white`}>
                          {detailedData.duration} {currentLanguage === 'th' ? 'นาที' : 'minutes'}
                        </p>
                      </div>
                    </div>

                    {/* Genres */}
                    {detailedData.genres && detailedData.genres.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-white/20">
                        <h4 className={`text-sm ${getClass('subtitle')} text-white/80 mb-2`}>
                          {currentLanguage === 'th' ? 'แนวภาพยนตร์' : 'Genres'}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {detailedData.genres.map((genre, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-[#FCB283]/20 text-[#FCB283] rounded-lg text-xs border border-[#FCB283]/30"
                            >
                              {genre}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Director/Submitter */}
                    {(detailedData.directorName || detailedData.submitterName) && (
                      <div className="mt-4 pt-4 border-t border-white/20">
                        <h4 className={`text-sm ${getClass('subtitle')} text-white/80 mb-1`}>
                          {currentLanguage === 'th' ? 'ผู้กำกับ/ผู้ส่งผลงาน' : 'Director/Submitter'}
                        </h4>
                        <p className={`${getClass('body')} text-white break-words`}>
                          {detailedData.directorName || detailedData.submitterName}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Files Summary */}
                  <div className="glass-card p-4 rounded-xl">
                    <h4 className={`text-sm ${getClass('subtitle')} text-white/80 mb-3`}>
                      {currentLanguage === 'th' ? 'ไฟล์ที่แนบ' : 'Attached Files'}
                    </h4>
                    <div className="space-y-3">
                      {/* Film File */}
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center space-x-2 min-w-0 flex-1">
                          <span className="text-lg flex-shrink-0">🎬</span>
                          <span className={`text-sm ${getClass('body')} text-white/80 truncate`}>
                            {detailedData.files.filmFile.fileName}
                          </span>
                        </div>
                        <span className={`text-xs ${getClass('body')} text-[#FCB283] flex-shrink-0`}>
                          {formatFileSize(detailedData.files.filmFile.fileSize)}
                        </span>
                      </div>

                      {/* Poster File */}
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center space-x-2 min-w-0 flex-1">
                          <span className="text-lg flex-shrink-0">🖼️</span>
                          <span className={`text-sm ${getClass('body')} text-white/80 truncate`}>
                            {detailedData.files.posterFile.fileName}
                          </span>
                        </div>
                        <span className={`text-xs ${getClass('body')} text-[#FCB283] flex-shrink-0`}>
                          {formatFileSize(detailedData.files.posterFile.fileSize)}
                        </span>
                      </div>

                      {/* Proof File */}
                      {detailedData.files.proofFile && (
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center space-x-2 min-w-0 flex-1">
                            <span className="text-lg flex-shrink-0">📄</span>
                            <span className={`text-sm ${getClass('body')} text-white/80 truncate`}>
                              {detailedData.files.proofFile.fileName}
                            </span>
                          </div>
                          <span className={`text-xs ${getClass('body')} text-[#FCB283] flex-shrink-0`}>
                            {formatFileSize(detailedData.files.proofFile.fileSize)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Synopsis Preview */}
                  {detailedData.synopsis && (
                    <div className="glass-card p-4 rounded-xl">
                      <h4 className={`text-sm ${getClass('subtitle')} text-white/80 mb-2`}>
                        {currentLanguage === 'th' ? 'เรื่องย่อ' : 'Synopsis'}
                      </h4>
                      <p className={`${getClass('body')} text-white/90 text-sm leading-relaxed break-words`}>
                        {detailedData.synopsis.length > 200 
                          ? `${detailedData.synopsis.substring(0, 200)}...`
                          : detailedData.synopsis
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons - Fixed */}
        <div className="flex-shrink-0 p-4 sm:p-6 border-t border-white/20">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <AnimatedButton
              variant="outline"
              size="medium"
              onClick={onClose}
              className={`flex-1 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {currentLanguage === 'th' ? 'ยกเลิก' : 'Cancel'}
            </AnimatedButton>
            
            <AnimatedButton
              variant="primary"
              size="medium"
              icon="📤"
              onClick={handleSubmit}
              className={`flex-1 ${(!validationResult?.isValid || isSubmitting || loadingData) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting 
                ? (currentLanguage === 'th' ? 'กำลังส่ง...' : 'Submitting...')
                : (currentLanguage === 'th' ? 'ยืนยันส่งใบสมัคร' : 'Confirm Submission')
              }
            </AnimatedButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionConfirm;
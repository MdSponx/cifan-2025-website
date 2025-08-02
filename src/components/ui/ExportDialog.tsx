import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTypography } from '../../utils/typography';
import { ExportOptions, ExportProgress } from '../../services/exportService';
import { Download, Calendar, Filter, FileText, X } from 'lucide-react';
import AnimatedButton from './AnimatedButton';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (options: ExportOptions) => Promise<void>;
  exportType: 'applications' | 'dashboard';
  availableCategories?: string[];
  availableStatuses?: string[];
  progress?: ExportProgress;
}

const ExportDialog: React.FC<ExportDialogProps> = ({
  isOpen,
  onClose,
  onExport,
  exportType,
  availableCategories = ['youth', 'future', 'world'],
  availableStatuses = ['draft', 'submitted', 'under-review', 'accepted', 'rejected'],
  progress
}) => {
  const { i18n } = useTranslation();
  const { getClass } = useTypography();
  const currentLanguage = i18n.language as 'en' | 'th';

  const [options, setOptions] = useState<ExportOptions>({
    format: 'csv',
    includeScores: true,
    includeNotes: false,
    categories: [],
    statuses: []
  });

  const content = {
    th: {
      title: "ส่งออกข้อมูล",
      subtitle: "เลือกรูปแบบและตัวเลือกการส่งออก",
      format: "รูปแบบไฟล์",
      csv: "CSV (Excel)",
      excel: "Excel",
      pdf: "PDF Report",
      options: "ตัวเลือกการส่งออก",
      includeScores: "รวมคะแนนการประเมิน",
      includeNotes: "รวมหมายเหตุผู้ดูแล",
      dateRange: "ช่วงวันที่",
      startDate: "วันที่เริ่มต้น",
      endDate: "วันที่สิ้นสุด",
      categories: "หมวดหมู่",
      statuses: "สถานะ",
      allCategories: "ทุกหมวด",
      allStatuses: "ทุกสถานะ",
      youth: "เยาวชน",
      future: "อนาคต",
      world: "โลก",
      draft: "ร่าง",
      submitted: "ส่งแล้ว",
      underReview: "กำลังพิจารณา",
      accepted: "ผ่าน",
      rejected: "ไม่ผ่าน",
      export: "ส่งออก",
      cancel: "ยกเลิก",
      exporting: "กำลังส่งออก...",
      preparing: "กำลังเตรียมข้อมูล...",
      processing: "กำลังประมวลผล...",
      generating: "กำลังสร้างไฟล์...",
      complete: "เสร็จสิ้น!",
      error: "เกิดข้อผิดพลาด"
    },
    en: {
      title: "Export Data",
      subtitle: "Choose format and export options",
      format: "File Format",
      csv: "CSV (Excel)",
      excel: "Excel",
      pdf: "PDF Report",
      options: "Export Options",
      includeScores: "Include Evaluation Scores",
      includeNotes: "Include Admin Notes",
      dateRange: "Date Range",
      startDate: "Start Date",
      endDate: "End Date",
      categories: "Categories",
      statuses: "Statuses",
      allCategories: "All Categories",
      allStatuses: "All Statuses",
      youth: "Youth",
      future: "Future",
      world: "World",
      draft: "Draft",
      submitted: "Submitted",
      underReview: "Under Review",
      accepted: "Accepted",
      rejected: "Rejected",
      export: "Export",
      cancel: "Cancel",
      exporting: "Exporting...",
      preparing: "Preparing data...",
      processing: "Processing...",
      generating: "Generating file...",
      complete: "Complete!",
      error: "Error occurred"
    }
  };

  const currentContent = content[currentLanguage];

  const handleOptionChange = (key: keyof ExportOptions, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const handleArrayOptionToggle = (key: 'categories' | 'statuses', value: string) => {
    setOptions(prev => {
      const currentArray = prev[key] || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      return { ...prev, [key]: newArray };
    });
  };

  const handleExport = async () => {
    try {
      await onExport(options);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const getProgressMessage = () => {
    if (!progress) return '';
    
    switch (progress.stage) {
      case 'preparing':
        return currentContent.preparing;
      case 'processing':
        return currentContent.processing;
      case 'generating':
        return currentContent.generating;
      case 'complete':
        return currentContent.complete;
      case 'error':
        return currentContent.error;
      default:
        return progress.message;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-container rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 sm:p-8">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={`text-2xl ${getClass('header')} text-white mb-2 flex items-center space-x-2`}>
                <Download className="w-6 h-6 text-[#FCB283]" />
                <span>{currentContent.title}</span>
              </h2>
              <p className={`${getClass('body')} text-white/80`}>
                {currentContent.subtitle}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              disabled={progress?.stage === 'processing' || progress?.stage === 'generating'}
            >
              <X className="w-5 h-5 text-white/80" />
            </button>
          </div>

          {/* Export Progress */}
          {progress && progress.stage !== 'complete' && (
            <div className="mb-6">
              <div className="glass-card p-4 rounded-xl">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#FCB283]"></div>
                  <span className={`${getClass('body')} text-white`}>
                    {getProgressMessage()}
                  </span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-[#FCB283] to-[#AA4626] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress.progress}%` }}
                  ></div>
                </div>
                {progress.total && progress.current && (
                  <p className={`text-xs ${getClass('body')} text-white/60 mt-2`}>
                    {progress.current} / {progress.total} items processed
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Format Selection */}
          <div className="mb-6">
            <h3 className={`text-lg ${getClass('subtitle')} text-white mb-4 flex items-center space-x-2`}>
              <FileText className="w-5 h-5 text-[#FCB283]" />
              <span>{currentContent.format}</span>
            </h3>
            
            <div className="grid grid-cols-3 gap-4">
              {(['csv', 'excel', 'pdf'] as const).map((format) => (
                <button
                  key={format}
                  onClick={() => handleOptionChange('format', format)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    options.format === format
                      ? 'bg-gradient-to-r from-[#AA4626] to-[#FCB283] border-[#FCB283] text-white'
                      : 'bg-white/5 border-white/20 text-white/80 hover:border-[#FCB283]/50'
                  }`}
                  disabled={progress?.stage === 'processing' || progress?.stage === 'generating'}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">
                      {format === 'csv' && '📊'}
                      {format === 'excel' && '📈'}
                      {format === 'pdf' && '📄'}
                    </div>
                    <span className={`text-sm ${getClass('body')} font-medium`}>
                      {currentContent[format as keyof typeof currentContent]}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div className="mb-6">
            <h3 className={`text-lg ${getClass('subtitle')} text-white mb-4 flex items-center space-x-2`}>
              <Filter className="w-5 h-5 text-[#FCB283]" />
              <span>{currentContent.options}</span>
            </h3>
            
            <div className="space-y-4">
              {/* Include Options */}
              {exportType === 'applications' && (
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.includeScores}
                      onChange={(e) => handleOptionChange('includeScores', e.target.checked)}
                      className="w-4 h-4 text-[#FCB283] bg-white/10 border-white/20 rounded focus:ring-[#FCB283]"
                      disabled={progress?.stage === 'processing' || progress?.stage === 'generating'}
                    />
                    <span className={`${getClass('body')} text-white`}>
                      {currentContent.includeScores}
                    </span>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.includeNotes}
                      onChange={(e) => handleOptionChange('includeNotes', e.target.checked)}
                      className="w-4 h-4 text-[#FCB283] bg-white/10 border-white/20 rounded focus:ring-[#FCB283]"
                      disabled={progress?.stage === 'processing' || progress?.stage === 'generating'}
                    />
                    <span className={`${getClass('body')} text-white`}>
                      {currentContent.includeNotes}
                    </span>
                  </label>
                </div>
              )}

              {/* Date Range */}
              <div>
                <h4 className={`${getClass('body')} text-white/90 mb-3 flex items-center space-x-2`}>
                  <Calendar className="w-4 h-4" />
                  <span>{currentContent.dateRange}</span>
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm ${getClass('body')} text-white/80 mb-2`}>
                      {currentContent.startDate}
                    </label>
                    <input
                      type="date"
                      value={options.dateRange?.start ? options.dateRange.start.toISOString().split('T')[0] : ''}
                      onChange={(e) => handleOptionChange('dateRange', {
                        ...options.dateRange,
                        start: e.target.value ? new Date(e.target.value) : undefined
                      })}
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-[#FCB283] focus:outline-none"
                      disabled={progress?.stage === 'processing' || progress?.stage === 'generating'}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm ${getClass('body')} text-white/80 mb-2`}>
                      {currentContent.endDate}
                    </label>
                    <input
                      type="date"
                      value={options.dateRange?.end ? options.dateRange.end.toISOString().split('T')[0] : ''}
                      onChange={(e) => handleOptionChange('dateRange', {
                        ...options.dateRange,
                        end: e.target.value ? new Date(e.target.value) : undefined
                      })}
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-[#FCB283] focus:outline-none"
                      disabled={progress?.stage === 'processing' || progress?.stage === 'generating'}
                    />
                  </div>
                </div>
              </div>

              {/* Categories Filter */}
              {exportType === 'applications' && (
                <div>
                  <h4 className={`${getClass('body')} text-white/90 mb-3`}>
                    {currentContent.categories}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {availableCategories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleArrayOptionToggle('categories', category)}
                        className={`px-3 py-2 rounded-lg border transition-colors ${
                          options.categories?.includes(category)
                            ? 'bg-[#FCB283] border-[#FCB283] text-white'
                            : 'bg-white/10 border-white/20 text-white/80 hover:border-[#FCB283]/50'
                        }`}
                        disabled={progress?.stage === 'processing' || progress?.stage === 'generating'}
                      >
                        {currentContent[category as keyof typeof currentContent]}
                      </button>
                    ))}
                  </div>
                  {options.categories?.length === 0 && (
                    <p className={`text-xs ${getClass('body')} text-white/60 mt-2`}>
                      {currentContent.allCategories}
                    </p>
                  )}
                </div>
              )}

              {/* Statuses Filter */}
              {exportType === 'applications' && (
                <div>
                  <h4 className={`${getClass('body')} text-white/90 mb-3`}>
                    {currentContent.statuses}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {availableStatuses.map((status) => (
                      <button
                        key={status}
                        onClick={() => handleArrayOptionToggle('statuses', status)}
                        className={`px-3 py-2 rounded-lg border transition-colors ${
                          options.statuses?.includes(status)
                            ? 'bg-[#FCB283] border-[#FCB283] text-white'
                            : 'bg-white/10 border-white/20 text-white/80 hover:border-[#FCB283]/50'
                        }`}
                        disabled={progress?.stage === 'processing' || progress?.stage === 'generating'}
                      >
                        {currentContent[status.replace('-', '') as keyof typeof currentContent]}
                      </button>
                    ))}
                  </div>
                  {options.statuses?.length === 0 && (
                    <p className={`text-xs ${getClass('body')} text-white/60 mt-2`}>
                      {currentContent.allStatuses}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <AnimatedButton
              variant="outline"
              size="large"
              onClick={onClose}
              className={progress?.stage === 'processing' || progress?.stage === 'generating' ? 'opacity-50 cursor-not-allowed' : ''}
            >
              {currentContent.cancel}
            </AnimatedButton>
            
            <AnimatedButton
              variant="primary"
              size="large"
              icon={<Download className="w-4 h-4" />}
              onClick={handleExport}
              className={progress?.stage === 'processing' || progress?.stage === 'generating' ? 'opacity-50 cursor-not-allowed' : ''}
            >
              {progress?.stage === 'processing' || progress?.stage === 'generating' 
                ? currentContent.exporting 
                : currentContent.export
              }
            </AnimatedButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportDialog;
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTypography } from '../../utils/typography';
import { AdminApplicationData, AdminControlsPanelProps } from '../../types/admin.types';
import { 
  Shield, 
  Flag, 
  Download, 
  Printer, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertTriangle,
  Save
} from 'lucide-react';
import AnimatedButton from '../ui/AnimatedButton';

const AdminControlsPanel: React.FC<AdminControlsPanelProps> = ({
  application,
  onStatusChange,
  onNotesChange,
  onFlagToggle,
  onExport,
  onPrint,
  isUpdating = false
}) => {
  const { i18n } = useTranslation();
  const { getClass } = useTypography();
  const currentLanguage = i18n.language as 'en' | 'th';

  const [notes, setNotes] = useState(application.adminNotes || '');
  const [showFlagDialog, setShowFlagDialog] = useState(false);
  const [flagReason, setFlagReason] = useState('');
  const [hasNotesChanges, setHasNotesChanges] = useState(false);

  const content = {
    th: {
      title: "การควบคุมผู้ดูแล",
      subtitle: "จัดการสถานะและบันทึกของใบสมัคร",
      
      // Status management
      statusManagement: "การจัดการสถานะ",
      currentStatus: "สถานะปัจจุบัน",
      changeStatus: "เปลี่ยนสถานะ",
      pending: "รอการพิจารณา",
      inProgress: "กำลังพิจารณา",
      reviewed: "พิจารณาแล้ว",
      approved: "อนุมัติ",
      rejected: "ปฏิเสธ",
      
      // Admin notes
      adminNotes: "บันทึกผู้ดูแล",
      notesPlaceholder: "เขียนบันทึกส่วนตัวเกี่ยวกับใบสมัครนี้...",
      saveNotes: "บันทึกหมายเหตุ",
      saving: "กำลังบันทึก...",
      
      // Flag system
      flagApplication: "ตั้งค่าสถานะพิเศษ",
      unflagApplication: "ยกเลิกสถานะพิเศษ",
      flagReason: "เหตุผลในการตั้งค่าสถานะพิเศษ",
      flagReasonPlaceholder: "ระบุเหตุผล...",
      flagged: "ตั้งค่าสถานะพิเศษแล้ว",
      
      // Actions
      quickActions: "การดำเนินการด่วน",
      exportData: "ส่งออกข้อมูล",
      printView: "พิมพ์",
      
      // Confirmations
      confirmStatusChange: "คุณแน่ใจหรือไม่ที่จะเปลี่ยนสถานะ?",
      confirmFlag: "ตั้งค่าสถานะพิเศษ",
      confirmUnflag: "ยกเลิกสถานะพิเศษ",
      cancel: "ยกเลิก",
      confirm: "ยืนยัน"
    },
    en: {
      title: "Admin Controls",
      subtitle: "Manage application status and notes",
      
      // Status management
      statusManagement: "Status Management",
      currentStatus: "Current Status",
      changeStatus: "Change Status",
      pending: "Pending",
      inProgress: "In Progress",
      reviewed: "Reviewed",
      approved: "Approved",
      rejected: "Rejected",
      
      // Admin notes
      adminNotes: "Admin Notes",
      notesPlaceholder: "Write private notes about this application...",
      saveNotes: "Save Notes",
      saving: "Saving...",
      
      // Flag system
      flagApplication: "Flag Application",
      unflagApplication: "Unflag Application",
      flagReason: "Flag Reason",
      flagReasonPlaceholder: "Specify reason...",
      flagged: "Flagged",
      
      // Actions
      quickActions: "Quick Actions",
      exportData: "Export Data",
      printView: "Print View",
      
      // Confirmations
      confirmStatusChange: "Are you sure you want to change the status?",
      confirmFlag: "Flag Application",
      confirmUnflag: "Unflag Application",
      cancel: "Cancel",
      confirm: "Confirm"
    }
  };

  const currentContent = content[currentLanguage];

  const statusOptions = [
    { value: 'pending', label: currentContent.pending, icon: <Clock className="w-4 h-4" />, color: 'text-yellow-400' },
    { value: 'in-progress', label: currentContent.inProgress, icon: <AlertTriangle className="w-4 h-4" />, color: 'text-blue-400' },
    { value: 'reviewed', label: currentContent.reviewed, icon: <Shield className="w-4 h-4" />, color: 'text-purple-400' },
    { value: 'approved', label: currentContent.approved, icon: <CheckCircle className="w-4 h-4" />, color: 'text-green-400' },
    { value: 'rejected', label: currentContent.rejected, icon: <XCircle className="w-4 h-4" />, color: 'text-red-400' }
  ];

  const currentStatusOption = statusOptions.find(option => option.value === application.reviewStatus);

  const handleNotesChange = (value: string) => {
    setNotes(value);
    setHasNotesChanges(value !== application.adminNotes);
  };

  const handleSaveNotes = async () => {
    await onNotesChange(notes);
    setHasNotesChanges(false);
  };

  const handleStatusChange = async (newStatus: AdminApplicationData['reviewStatus']) => {
    const confirmed = window.confirm(currentContent.confirmStatusChange);
    if (confirmed) {
      await onStatusChange(newStatus);
    }
  };

  const handleFlagToggle = async () => {
    if (application.flagged) {
      // Unflag
      const confirmed = window.confirm(currentContent.confirmUnflag);
      if (confirmed) {
        await onFlagToggle(false);
      }
    } else {
      // Flag - show dialog
      setShowFlagDialog(true);
    }
  };

  const handleConfirmFlag = async () => {
    await onFlagToggle(true, flagReason);
    setShowFlagDialog(false);
    setFlagReason('');
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* Admin Controls - Single Flexible Container */}
      <div className="glass-container rounded-2xl p-6 sm:p-8 min-h-fit">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className={`text-xl ${getClass('header')} text-white mb-2 flex items-center space-x-2`}>
              <Shield className="w-6 h-6 text-[#FCB283]" />
              <span>{currentContent.title}</span>
            </h3>
            <p className={`${getClass('body')} text-white/70 text-sm`}>
              {currentContent.subtitle}
            </p>
          </div>
          
          {/* Flag Status */}
          {application.flagged && (
            <div className="flex items-center space-x-2 px-3 py-2 bg-red-500/20 border border-red-500/30 rounded-lg">
              <Flag className="w-4 h-4 text-red-400" />
              <span className={`text-red-400 text-sm ${getClass('body')}`}>
                {currentContent.flagged}
              </span>
            </div>
          )}
        </div>

        {/* Status Management */}
        <div className="mb-8">
          <h4 className={`${getClass('subtitle')} text-white mb-4`}>
            {currentContent.statusManagement}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Status */}
            <div className="glass-card p-4 rounded-xl">
              <h5 className={`${getClass('body')} text-white/80 mb-3 text-sm`}>
                {currentContent.currentStatus}
              </h5>
              <div className="flex items-center space-x-3">
                {currentStatusOption && (
                  <>
                    <span className={currentStatusOption.color}>
                      {currentStatusOption.icon}
                    </span>
                    <span className={`${getClass('body')} text-white font-medium`}>
                      {currentStatusOption.label}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Status Change */}
            <div className="glass-card p-4 rounded-xl">
              <h5 className={`${getClass('body')} text-white/80 mb-3 text-sm`}>
                {currentContent.changeStatus}
              </h5>
              <select
                value={application.reviewStatus}
                onChange={(e) => handleStatusChange(e.target.value as AdminApplicationData['reviewStatus'])}
                disabled={isUpdating}
                className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-[#FCB283] focus:outline-none"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value} className="bg-[#110D16]">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Admin Notes Log */}
        <div className="mb-8">
          <h4 className={`${getClass('subtitle')} text-white mb-4 flex items-center space-x-2`}>
            <MessageSquare className="w-5 h-5 text-[#FCB283]" />
            <span>{currentContent.adminNotes}</span>
          </h4>
          
          {/* Add New Note - Moved to Top */}
          <div className="space-y-4 mb-6">
            <h5 className={`${getClass('body')} text-white/80 mb-3 text-sm`}>
              {currentLanguage === 'th' ? 'เพิ่มบันทึกใหม่' : 'Add New Note'}
            </h5>
            <textarea
              value={notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder={currentContent.notesPlaceholder}
              rows={4}
              className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-[#FCB283] focus:outline-none resize-vertical"
            />
            
            {hasNotesChanges && (
              <div className="flex justify-end">
                <AnimatedButton
                  variant="primary"
                  size="small"
                  icon="💾"
                  onClick={handleSaveNotes}
                  className={isUpdating ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  {isUpdating ? currentContent.saving : currentContent.saveNotes}
                </AnimatedButton>
              </div>
            )}
          </div>

          {/* Notes History/Log - Mock Data for UI Preview */}
          <div className="mb-6">
            <h5 className={`${getClass('body')} text-white/80 mb-3 text-sm`}>
              {currentLanguage === 'th' ? 'บันทึกการทำงานของผู้ดูแล' : 'Admin Activity Log'}
            </h5>
            <div className="space-y-3">
              {/* Mock Note 1 */}
              <div className="glass-card p-4 rounded-xl border-l-4 border-blue-400">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs">
                      JD
                    </div>
                    <div>
                      <p className={`${getClass('body')} text-white font-medium text-sm`}>
                        {currentLanguage === 'th' ? 'จอห์น โดว์' : 'John Doe'}
                      </p>
                      <p className={`text-xs ${getClass('body')} text-white/60`}>
                        {currentLanguage === 'th' ? 'ผู้ดูแลระบบหลัก' : 'Senior Admin'}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs ${getClass('body')} text-white/60`}>
                    {currentLanguage === 'th' ? '2 ชั่วโมงที่แล้ว' : '2 hours ago'}
                  </span>
                </div>
                <p className={`${getClass('body')} text-white/90 text-sm leading-relaxed`}>
                  {currentLanguage === 'th' 
                    ? 'ได้ตรวจสอบเอกสารหลักฐานแล้ว ทุกอย่างครบถ้วนและถูกต้อง พร้อมส่งต่อให้คณะกรรมการตัดสินแล้ว'
                    : 'Reviewed all documentation. Everything is complete and accurate. Ready to forward to the judging panel.'
                  }
                </p>
              </div>

              {/* Mock Note 2 */}
              <div className="glass-card p-4 rounded-xl border-l-4 border-green-400">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold text-xs">
                      MS
                    </div>
                    <div>
                      <p className={`${getClass('body')} text-white font-medium text-sm`}>
                        {currentLanguage === 'th' ? 'มารี สมิธ' : 'Marie Smith'}
                      </p>
                      <p className={`text-xs ${getClass('body')} text-white/60`}>
                        {currentLanguage === 'th' ? 'ผู้ประสานงาน' : 'Coordinator'}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs ${getClass('body')} text-white/60`}>
                    {currentLanguage === 'th' ? '1 วันที่แล้ว' : '1 day ago'}
                  </span>
                </div>
                <p className={`${getClass('body')} text-white/90 text-sm leading-relaxed`}>
                  {currentLanguage === 'th' 
                    ? 'ติดต่อผู้สมัครเพื่อขอเอกสารเพิ่มเติมแล้ว คาดว่าจะได้รับภายใน 2-3 วันทำการ'
                    : 'Contacted applicant for additional documentation. Expected to receive within 2-3 business days.'
                  }
                </p>
              </div>

              {/* Mock Note 3 */}
              <div className="glass-card p-4 rounded-xl border-l-4 border-purple-400">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs">
                      RJ
                    </div>
                    <div>
                      <p className={`${getClass('body')} text-white font-medium text-sm`}>
                        {currentLanguage === 'th' ? 'โรเบิร์ต จอห์นสัน' : 'Robert Johnson'}
                      </p>
                      <p className={`text-xs ${getClass('body')} text-white/60`}>
                        {currentLanguage === 'th' ? 'ผู้ตรวจสอบเทคนิค' : 'Technical Reviewer'}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs ${getClass('body')} text-white/60`}>
                    {currentLanguage === 'th' ? '3 วันที่แล้ว' : '3 days ago'}
                  </span>
                </div>
                <p className={`${getClass('body')} text-white/90 text-sm leading-relaxed`}>
                  {currentLanguage === 'th' 
                    ? 'ตรวจสอบคุณภาพไฟล์วิดีโอแล้ว ความละเอียดและรูปแบบไฟล์เป็นไปตามข้อกำหนด ไม่พบปัญหาด้านเทคนิค'
                    : 'Video file quality check completed. Resolution and format meet requirements. No technical issues found.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h4 className={`${getClass('subtitle')} text-white mb-4`}>
            {currentContent.quickActions}
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Flag/Unflag Button */}
            <AnimatedButton
              variant={application.flagged ? "outline" : "secondary"}
              size="medium"
              icon="🚩"
              onClick={handleFlagToggle}
              className={`w-full ${application.flagged ? 'border-red-400 text-red-400' : ''}`}
            >
              {application.flagged ? currentContent.unflagApplication : currentContent.flagApplication}
            </AnimatedButton>

            {/* Export Button */}
            <AnimatedButton
              variant="secondary"
              size="medium"
              icon="📥"
              onClick={onExport}
              className="w-full"
            >
              {currentContent.exportData}
            </AnimatedButton>

            {/* Print Button */}
            <AnimatedButton
              variant="secondary"
              size="medium"
              icon="🖨️"
              onClick={onPrint}
              className="w-full"
            >
              {currentContent.printView}
            </AnimatedButton>

            {/* Back to Gallery */}
            <AnimatedButton
              variant="outline"
              size="medium"
              icon="📋"
              onClick={() => window.location.hash = '#admin/gallery'}
              className="w-full"
            >
              {currentLanguage === 'th' ? 'กลับแกลเลอรี่' : 'Back to Gallery'}
            </AnimatedButton>
          </div>
        </div>
      </div>

      {/* Flag Dialog */}
      {showFlagDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-container rounded-2xl max-w-md w-full p-6">
            <h3 className={`text-lg ${getClass('header')} text-white mb-4 flex items-center space-x-2`}>
              <Flag className="w-5 h-5 text-red-400" />
              <span>{currentContent.confirmFlag}</span>
            </h3>
            
            <div className="mb-6">
              <label className={`block text-white/90 ${getClass('body')} mb-2`}>
                {currentContent.flagReason}
              </label>
              <textarea
                value={flagReason}
                onChange={(e) => setFlagReason(e.target.value)}
                placeholder={currentContent.flagReasonPlaceholder}
                rows={3}
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-[#FCB283] focus:outline-none resize-vertical"
              />
            </div>
            
            <div className="flex gap-4 justify-end">
              <AnimatedButton
                variant="outline"
                size="medium"
                onClick={() => setShowFlagDialog(false)}
              >
                {currentContent.cancel}
              </AnimatedButton>
              <AnimatedButton
                variant="primary"
                size="medium"
                icon="🚩"
                onClick={handleConfirmFlag}
                className={!flagReason.trim() ? 'opacity-50 cursor-not-allowed' : ''}
              >
                {currentContent.confirm}
              </AnimatedButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminControlsPanel;

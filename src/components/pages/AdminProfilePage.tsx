import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTypography } from '../../utils/typography';
import { useAuth } from '../auth/AuthContext';
import { useAdmin } from '../admin/AdminContext';
import { AdminProfile, AdminProfileFormData, AdminProfileFormErrors } from '../../types/admin.types';
import AdminZoneHeader from '../layout/AdminZoneHeader';
import PhotoUpload from '../profile/PhotoUpload';
import ErrorMessage from '../forms/ErrorMessage';
import { Shield, Calendar, Users, Settings, CheckCircle, Edit, Save, X } from 'lucide-react';

interface AdminProfilePageProps {
  onSidebarToggle?: () => void;
}

const AdminProfilePage: React.FC<AdminProfilePageProps> = ({ onSidebarToggle }) => {
  const { t, i18n } = useTranslation();
  const { getClass } = useTypography();
  const { user, userProfile } = useAuth();
  const { adminProfile: contextAdminProfile, refreshAdminData } = useAdmin();
  const currentLanguage = i18n.language as 'en' | 'th';

  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<AdminProfileFormErrors>({});

  // Mock admin profile data - replace with actual service
  const [adminProfile, setAdminProfile] = useState<AdminProfile>(
    contextAdminProfile || {
      uid: user?.uid || '',
      email: user?.email || '',
      emailVerified: user?.emailVerified || false,
      photoURL: userProfile?.photoURL,
      fullNameEN: userProfile?.fullNameEN || 'Admin User',
      fullNameTH: userProfile?.fullNameTH,
      birthDate: userProfile?.birthDate || new Date('1990-01-01'),
      age: userProfile?.age || 34,
      phoneNumber: userProfile?.phoneNumber || '+66 86-346-6425',
    
      // Admin-specific fields
      adminRole: 'admin',
      adminLevel: 'senior',
      department: 'Festival Management',
      responsibility: 'Film Submissions & Competition Management',
      adminSince: new Date('2023-01-15'),
      permissions: [
        { id: '1', name: 'View Applications', description: 'View all film submissions', category: 'applications', granted: true },
        { id: '2', name: 'Edit Applications', description: 'Modify application details', category: 'applications', granted: true },
        { id: '3', name: 'Manage Users', description: 'User account management', category: 'users', granted: true },
        { id: '4', name: 'Content Management', description: 'Manage festival content', category: 'content', granted: false },
        { id: '5', name: 'System Settings', description: 'Access system configuration', category: 'system', granted: false },
        { id: '6', name: 'Generate Reports', description: 'Export and generate reports', category: 'reports', granted: true }
      ],
      lastActiveAt: new Date(),
    
      isProfileComplete: true,
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date()
    }
  );

  // Update local state when context admin profile changes
  useEffect(() => {
    if (contextAdminProfile) {
      setAdminProfile(contextAdminProfile);
      setFormData({
        fullNameEN: contextAdminProfile.fullNameEN,
        fullNameTH: contextAdminProfile.fullNameTH || '',
        birthDate: contextAdminProfile.birthDate.toISOString().split('T')[0],
        phoneNumber: contextAdminProfile.phoneNumber,
        department: contextAdminProfile.department,
        responsibility: contextAdminProfile.responsibility
      });
    }
  }, [contextAdminProfile]);

  const [formData, setFormData] = useState<AdminProfileFormData>({
    fullNameEN: adminProfile.fullNameEN,
    fullNameTH: adminProfile.fullNameTH || '',
    birthDate: adminProfile.birthDate.toISOString().split('T')[0],
    phoneNumber: adminProfile.phoneNumber,
    department: adminProfile.department,
    responsibility: adminProfile.responsibility
  });

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const content = {
    th: {
      pageTitle: "โปรไฟล์ผู้ดูแลระบบ",
      subtitle: "จัดการข้อมูลส่วนตัวและสิทธิ์การเข้าถึง",
      editProfile: "แก้ไขโปรไฟล์",
      saveChanges: "บันทึกการเปลี่ยนแปลง",
      cancel: "ยกเลิก",
      saving: "กำลังบันทึก...",
      
      // Personal Information
      personalInfo: "ข้อมูลส่วนตัว",
      fullNameEN: "ชื่อ-นามสกุล (ภาษาอังกฤษ)",
      fullNameTH: "ชื่อ-นามสกุล (ภาษาไทย)",
      birthDate: "วันเกิด",
      phoneNumber: "หมายเลขโทรศัพท์",
      age: "อายุ",
      yearsOld: "ปี",
      
      // Admin Information
      adminInfo: "ข้อมูลผู้ดูแลระบบ",
      adminRole: "บทบาทผู้ดูแล",
      adminLevel: "ระดับผู้ดูแล",
      department: "แผนก",
      responsibility: "ความรับผิดชอบ",
      adminSince: "ผู้ดูแลตั้งแต่",
      lastActive: "ใช้งานล่าสุด",
      
      // Permissions
      permissions: "สิทธิ์การเข้าถึง",
      permissionCategories: {
        applications: "การจัดการใบสมัคร",
        users: "การจัดการผู้ใช้",
        content: "การจัดการเนื้อหา",
        system: "การตั้งค่าระบบ",
        reports: "รายงานและสถิติ"
      },
      granted: "อนุญาต",
      denied: "ไม่อนุญาต",
      
      // Status
      profileComplete: "โปรไฟล์สมบูรณ์",
      updateComplete: "อัปเดตโปรไฟล์เรียบร้อย",
      updateCompleteMessage: "ข้อมูลโปรไฟล์ได้รับการอัปเดตเรียบร้อยแล้ว",
      
      // Errors
      updateFailed: "ไม่สามารถอัปเดตโปรไฟล์ได้ กรุณาลองใหม่อีกครั้ง",
      fullNameENRequired: "จำเป็นต้องกรอกชื่อ-นามสกุลภาษาอังกฤษ",
      phoneRequired: "จำเป็นต้องกรอกหมายเลขโทรศัพท์",
      departmentRequired: "จำเป็นต้องกรอกแผนก",
      responsibilityRequired: "จำเป็นต้องกรอกความรับผิดชอบ"
    },
    en: {
      pageTitle: "Admin Profile",
      subtitle: "Manage your personal information and access permissions",
      editProfile: "Edit Profile",
      saveChanges: "Save Changes",
      cancel: "Cancel",
      saving: "Saving...",
      
      // Personal Information
      personalInfo: "Personal Information",
      fullNameEN: "Full Name (English)",
      fullNameTH: "Full Name (Thai)",
      birthDate: "Birth Date",
      phoneNumber: "Phone Number",
      age: "Age",
      yearsOld: "years old",
      
      // Admin Information
      adminInfo: "Admin Information",
      adminRole: "Admin Role",
      adminLevel: "Admin Level",
      department: "Department",
      responsibility: "Responsibility",
      adminSince: "Admin Since",
      lastActive: "Last Active",
      
      // Permissions
      permissions: "Access Permissions",
      permissionCategories: {
        applications: "Applications Management",
        users: "User Management",
        content: "Content Management",
        system: "System Settings",
        reports: "Reports & Analytics"
      },
      granted: "Granted",
      denied: "Denied",
      
      // Status
      profileComplete: "Profile Complete",
      updateComplete: "Profile Updated!",
      updateCompleteMessage: "Your profile has been successfully updated.",
      
      // Errors
      updateFailed: "Failed to update profile. Please try again.",
      fullNameENRequired: "Full name in English is required",
      phoneRequired: "Phone number is required",
      departmentRequired: "Department is required",
      responsibilityRequired: "Responsibility is required"
    }
  };

  const currentContent = content[currentLanguage];

  const validateForm = (): AdminProfileFormErrors => {
    const errors: AdminProfileFormErrors = {};

    if (!formData.fullNameEN.trim()) {
      errors.fullNameEN = currentContent.fullNameENRequired;
    }

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = currentContent.phoneRequired;
    }

    if (!formData.department.trim()) {
      errors.department = currentContent.departmentRequired;
    }

    if (!formData.responsibility.trim()) {
      errors.responsibility = currentContent.responsibilityRequired;
    }

    return errors;
  };

  const handleInputChange = (field: keyof AdminProfileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePhotoChange = (file: File | null) => {
    setFormData(prev => ({ ...prev, photoFile: file || undefined }));
    if (formErrors.photoFile) {
      setFormErrors(prev => ({ ...prev, photoFile: undefined }));
    }
  };

  const handleSubmit = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // TODO: Implement actual admin profile update service
      await new Promise(resolve => setTimeout(resolve, 1500)); // Mock API call
      
      // Update local state
      setAdminProfile(prev => ({
        ...prev,
        fullNameEN: formData.fullNameEN,
        fullNameTH: formData.fullNameTH,
        birthDate: new Date(formData.birthDate),
        phoneNumber: formData.phoneNumber,
        department: formData.department,
        responsibility: formData.responsibility,
        updatedAt: new Date()
      }));

      // Refresh admin context data
      await refreshAdminData();

      setIsComplete(true);
      setIsEditMode(false);
      
      // Reset success state after delay
      setTimeout(() => {
        setIsComplete(false);
      }, 3000);
    } catch (error: any) {
      console.error('Admin profile update error:', error);
      setError(error.message || currentContent.updateFailed);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullNameEN: adminProfile.fullNameEN,
      fullNameTH: adminProfile.fullNameTH || '',
      birthDate: adminProfile.birthDate.toISOString().split('T')[0],
      phoneNumber: adminProfile.phoneNumber,
      department: adminProfile.department,
      responsibility: adminProfile.responsibility
    });
    setFormErrors({});
    setIsEditMode(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(currentLanguage === 'th' ? 'th-TH' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPermissionsByCategory = () => {
    const categories = ['applications', 'users', 'content', 'system', 'reports'] as const;
    return categories.map(category => ({
      category,
      permissions: adminProfile.permissions.filter(p => p.category === category)
    }));
  };

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      'super-admin': 'from-red-500 to-red-600',
      'admin': 'from-[#FCB283] to-[#AA4626]',
      'moderator': 'from-blue-500 to-blue-600'
    };
    return colors[role as keyof typeof colors] || colors.admin;
  };

  const getLevelBadgeColor = (level: string) => {
    const colors = {
      'director': 'from-purple-500 to-purple-600',
      'lead': 'from-green-500 to-green-600',
      'senior': 'from-[#FCB283] to-[#AA4626]',
      'junior': 'from-blue-500 to-blue-600'
    };
    return colors[level as keyof typeof colors] || colors.senior;
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Admin Zone Header */}
      <AdminZoneHeader
        title={currentContent.pageTitle}
        subtitle={currentContent.subtitle}
        onSidebarToggle={onSidebarToggle || (() => {})}
      >
        {!isEditMode ? (
          <button
            onClick={() => setIsEditMode(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-[#FCB283] hover:bg-[#AA4626] rounded-lg text-white transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span className={`${getClass('menu')} text-sm`}>
              {currentContent.editProfile}
            </span>
          </button>
        ) : (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCancel}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
            >
              <X className="w-4 h-4" />
              <span className={`${getClass('menu')} text-sm`}>
                {currentContent.cancel}
              </span>
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-4 py-2 bg-[#FCB283] hover:bg-[#AA4626] disabled:opacity-50 rounded-lg text-white transition-colors"
            >
              <Save className="w-4 h-4" />
              <span className={`${getClass('menu')} text-sm`}>
                {isSubmitting ? currentContent.saving : currentContent.saveChanges}
              </span>
            </button>
          </div>
        )}
      </AdminZoneHeader>

      {/* Success Message */}
      {isComplete && (
        <div className="glass-container rounded-xl p-6 border-l-4 border-green-400">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <div>
              <h3 className={`${getClass('subtitle')} text-green-400 mb-1`}>
                {currentContent.updateComplete}
              </h3>
              <p className={`text-sm ${getClass('body')} text-white/80`}>
                {currentContent.updateCompleteMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="glass-container rounded-xl p-6 border-l-4 border-red-400">
          <div className="flex items-center space-x-3">
            <span className="text-red-400 text-xl">❌</span>
            <div>
              <h3 className={`${getClass('subtitle')} text-red-400 mb-1`}>
                Update Error
              </h3>
              <p className={`text-sm ${getClass('body')} text-white/80`}>
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Admin Status Overview */}
      <div className="glass-container rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-lg ${getClass('header')} text-white flex items-center space-x-2`}>
            <Shield className="w-5 h-5 text-[#FCB283]" />
            <span>{currentContent.adminInfo}</span>
          </h3>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border bg-green-500/20 text-green-400 border-green-500/30`}>
              <span className="w-2 h-2 rounded-full bg-current mr-2 inline-block"></span>
              {currentContent.profileComplete}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Admin Role */}
          <div className="glass-card p-4 rounded-xl text-center">
            <div className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r ${getRoleBadgeColor(adminProfile.adminRole)} flex items-center justify-center`}>
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h4 className={`text-sm ${getClass('subtitle')} text-white/80 mb-1`}>
              {currentContent.adminRole}
            </h4>
            <p className={`${getClass('body')} text-[#FCB283] capitalize font-medium`}>
              {adminProfile.adminRole.replace('-', ' ')}
            </p>
          </div>

          {/* Admin Level */}
          <div className="glass-card p-4 rounded-xl text-center">
            <div className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r ${getLevelBadgeColor(adminProfile.adminLevel)} flex items-center justify-center`}>
              <Users className="w-6 h-6 text-white" />
            </div>
            <h4 className={`text-sm ${getClass('subtitle')} text-white/80 mb-1`}>
              {currentContent.adminLevel}
            </h4>
            <p className={`${getClass('body')} text-white capitalize font-medium`}>
              {adminProfile.adminLevel}
            </p>
          </div>

          {/* Admin Since */}
          <div className="glass-card p-4 rounded-xl text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h4 className={`text-sm ${getClass('subtitle')} text-white/80 mb-1`}>
              {currentContent.adminSince}
            </h4>
            <p className={`${getClass('body')} text-white text-sm`}>
              {formatDate(adminProfile.adminSince)}
            </p>
          </div>

          {/* Last Active */}
          <div className="glass-card p-4 rounded-xl text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <h4 className={`text-sm ${getClass('subtitle')} text-white/80 mb-1`}>
              {currentContent.lastActive}
            </h4>
            <p className={`${getClass('body')} text-white text-sm`}>
              {formatDate(adminProfile.lastActiveAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="glass-container rounded-xl p-6 sm:p-8">
        <h3 className={`text-lg ${getClass('header')} text-white mb-6`}>
          👤 {currentContent.personalInfo}
        </h3>

        {/* Profile Photo */}
        <div className="text-center mb-8">
          <PhotoUpload
            currentPhotoURL={adminProfile.photoURL}
            onPhotoChange={handlePhotoChange}
            error={formErrors.photoFile}
          />
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name EN */}
            <div>
              <label className={`block text-sm font-medium text-white mb-2 ${getClass('body')}`}>
                {currentContent.fullNameEN} *
              </label>
              {isEditMode ? (
                <input
                  type="text"
                  value={formData.fullNameEN}
                  onChange={(e) => handleInputChange('fullNameEN', e.target.value)}
                  className={`w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#FCB283] focus:border-transparent ${getClass('body')}`}
                  disabled={isSubmitting}
                />
              ) : (
                <p className={`${getClass('body')} text-white bg-white/5 px-4 py-3 rounded-lg`}>
                  {adminProfile.fullNameEN}
                </p>
              )}
              <ErrorMessage error={formErrors.fullNameEN} />
            </div>

            {/* Full Name TH */}
            <div>
              <label className={`block text-sm font-medium text-white mb-2 ${getClass('body')}`}>
                {currentContent.fullNameTH}
              </label>
              {isEditMode ? (
                <input
                  type="text"
                  value={formData.fullNameTH}
                  onChange={(e) => handleInputChange('fullNameTH', e.target.value)}
                  className={`w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#FCB283] focus:border-transparent ${getClass('body')}`}
                  disabled={isSubmitting}
                />
              ) : (
                <p className={`${getClass('body')} text-white bg-white/5 px-4 py-3 rounded-lg`}>
                  {adminProfile.fullNameTH || '-'}
                </p>
              )}
              <ErrorMessage error={formErrors.fullNameTH} />
            </div>

            {/* Birth Date */}
            <div>
              <label className={`block text-sm font-medium text-white mb-2 ${getClass('body')}`}>
                {currentContent.birthDate}
              </label>
              {isEditMode ? (
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  className={`w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FCB283] focus:border-transparent ${getClass('body')}`}
                  disabled={isSubmitting}
                />
              ) : (
                <p className={`${getClass('body')} text-white bg-white/5 px-4 py-3 rounded-lg`}>
                  {formatDate(adminProfile.birthDate)} ({adminProfile.age} {currentContent.yearsOld})
                </p>
              )}
              <ErrorMessage error={formErrors.birthDate} />
            </div>

            {/* Phone Number */}
            <div>
              <label className={`block text-sm font-medium text-white mb-2 ${getClass('body')}`}>
                {currentContent.phoneNumber} *
              </label>
              {isEditMode ? (
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className={`w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#FCB283] focus:border-transparent ${getClass('body')}`}
                  disabled={isSubmitting}
                />
              ) : (
                <p className={`${getClass('body')} text-white bg-white/5 px-4 py-3 rounded-lg`}>
                  {adminProfile.phoneNumber}
                </p>
              )}
              <ErrorMessage error={formErrors.phoneNumber} />
            </div>

            {/* Department */}
            <div>
              <label className={`block text-sm font-medium text-white mb-2 ${getClass('body')}`}>
                {currentContent.department} *
              </label>
              {isEditMode ? (
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  className={`w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#FCB283] focus:border-transparent ${getClass('body')}`}
                  disabled={isSubmitting}
                />
              ) : (
                <p className={`${getClass('body')} text-white bg-white/5 px-4 py-3 rounded-lg`}>
                  {adminProfile.department}
                </p>
              )}
              <ErrorMessage error={formErrors.department} />
            </div>

            {/* Responsibility */}
            <div>
              <label className={`block text-sm font-medium text-white mb-2 ${getClass('body')}`}>
                {currentContent.responsibility} *
              </label>
              {isEditMode ? (
                <textarea
                  value={formData.responsibility}
                  onChange={(e) => handleInputChange('responsibility', e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#FCB283] focus:border-transparent resize-vertical ${getClass('body')}`}
                  disabled={isSubmitting}
                />
              ) : (
                <p className={`${getClass('body')} text-white bg-white/5 px-4 py-3 rounded-lg`}>
                  {adminProfile.responsibility}
                </p>
              )}
              <ErrorMessage error={formErrors.responsibility} />
            </div>
          </div>
        </div>
      </div>

      {/* Permissions Summary */}
      <div className="glass-container rounded-xl p-6 sm:p-8">
        <h3 className={`text-lg ${getClass('header')} text-white mb-6 flex items-center space-x-2`}>
          <Settings className="w-5 h-5 text-[#FCB283]" />
          <span>{currentContent.permissions}</span>
        </h3>

        <div className="space-y-6">
          {getPermissionsByCategory().map(({ category, permissions }) => (
            <div key={category} className="glass-card p-4 rounded-xl">
              <h4 className={`text-base ${getClass('subtitle')} text-[#FCB283] mb-4`}>
                {currentContent.permissionCategories[category]}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {permissions.map((permission) => (
                  <div key={permission.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex-1">
                      <h5 className={`text-sm ${getClass('body')} text-white font-medium`}>
                        {permission.name}
                      </h5>
                      <p className={`text-xs ${getClass('body')} text-white/60`}>
                        {permission.description}
                      </p>
                    </div>
                    <div className="ml-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                        permission.granted
                          ? 'bg-green-500/20 text-green-400 border-green-500/30'
                          : 'bg-red-500/20 text-red-400 border-red-500/30'
                      }`}>
                        {permission.granted ? currentContent.granted : currentContent.denied}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
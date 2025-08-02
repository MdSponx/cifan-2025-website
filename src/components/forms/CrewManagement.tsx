import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTypography } from '../../utils/typography';
import { FILM_ROLES } from '../../utils/formConstants';
import { validateEmail, validateAge, getValidationMessages } from '../../utils/formValidation';
import { CrewMember, CrewFormData, FormErrors } from '../../types/form.types';
import AnimatedButton from '../ui/AnimatedButton';
import ErrorMessage from './ErrorMessage';

interface CrewManagementProps {
  crewMembers: CrewMember[];
  onCrewMembersChange: (crewMembers: CrewMember[]) => void;
  isThaiNationality: boolean;
  submitterSchoolName?: string;
  submitterUniversityName?: string;
  error?: string;
  isWorldForm?: boolean;
  className?: string;
  competitionCategory?: 'youth' | 'future' | 'world';
}

const CrewManagement: React.FC<CrewManagementProps> = ({
  crewMembers,
  onCrewMembersChange,
  isThaiNationality,
  submitterSchoolName,
  submitterUniversityName,
  error,
  isWorldForm = false,
  className = '',
  competitionCategory
}) => {
  const { i18n } = useTranslation();
  const { getClass } = useTypography();
  const currentLanguage = i18n.language as 'en' | 'th';
  const validationMessages = getValidationMessages(currentLanguage);

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<'auto' | number>('auto');
  const [showCrewForm, setShowCrewForm] = useState(false);
  const [editingCrewId, setEditingCrewId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [crewFormErrors, setCrewFormErrors] = useState<FormErrors>({});

  // Dynamic height calculation when content changes
  useEffect(() => {
    if (containerRef.current) {
      const observer = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const { height } = entry.contentRect;
          setContainerHeight(height);
        }
      });

      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, [showCrewForm, crewMembers.length]);

  const [crewFormData, setCrewFormData] = useState<CrewFormData>({
    fullName: '',
    fullNameTh: '',
    role: '',
    customRole: '',
    age: '',
    phone: '',
    email: '',
    schoolName: submitterSchoolName || submitterUniversityName || '',
    studentId: ''
  });

  const content = {
    th: {
      crewInfoTitle: "ข้อมูลทีมงาน (ไม่บังคับ)",
      addCrewMember: "เพิ่มสมาชิกทีมงาน",
      crewMemberForm: "ข้อมูลสมาชิกทีมงาน",
      addMember: "เพิ่มสมาชิก",
      editMember: "แก้ไขสมาชิก",
      updateMember: "อัปเดตสมาชิก",
      cancel: "ยกเลิก",
      submitterName: "ชื่อ-นามสกุล",
      submitterNameTh: "ชื่อ-นามสกุล (ภาษาไทย)",
      age: "อายุ",
      phone: "เบอร์โทรศัพท์",
      email: "อีเมล",
      roleInFilm: "บทบาทในภาพยนตร์",
      schoolName: "ชื่อโรงเรียน/มหาวิทยาลัย",
      studentId: "รหัสนักเรียน/นักศึกษา",
      selectRole: "เลือกบทบาท",
      specifyRole: "ระบุบทบาท",
      optional: "(ไม่บังคับ)",
      tableHeaders: {
        name: "ชื่อ",
        role: "บทบาท",
        age: "อายุ",
        phone: "โทรศัพท์",
        email: "อีเมล",
        school: "โรงเรียน",
        studentId: "รหัสนักเรียน",
        actions: "การดำเนินการ"
      },
      edit: "แก้ไข",
      delete: "ลบ",
      noCrewMembers: "ยังไม่มีสมาชิกทีมงาน",
      confirmDelete: "คุณแน่ใจหรือไม่ที่จะลบสมาชิกคนนี้?"
    },
    en: {
      crewInfoTitle: "Crew Information (Optional)",
      addCrewMember: "Add Crew Member",
      crewMemberForm: "Crew Member Information",
      addMember: "Add Member",
      editMember: "Edit Member",
      updateMember: "Update Member",
      cancel: "Cancel",
      submitterName: "Full Name",
      submitterNameTh: "Full Name (Thai)",
      age: "Age",
      phone: "Phone Number",
      email: "Email",
      roleInFilm: "Role in Film",
      schoolName: "School/University Name",
      studentId: "Student ID",
      selectRole: "Select Role",
      specifyRole: "Specify Role",
      optional: "(Optional)",
      tableHeaders: {
        name: "Name",
        role: "Role",
        age: "Age",
        phone: "Phone",
        email: "Email",
        school: "School",
        studentId: "Student ID",
        actions: "Actions"
      },
      edit: "Edit",
      delete: "Delete",
      noCrewMembers: "No crew members added yet",
      confirmDelete: "Are you sure you want to delete this crew member?"
    }
  };

  const currentContent = content[currentLanguage];

  // Smart age category detection with priority system
  const getAgeCategory = (): 'YOUTH' | 'FUTURE' | 'WORLD' => {
    // Priority 1: Use competitionCategory prop (for edit mode)
    if (competitionCategory) {
      return competitionCategory.toUpperCase() as 'YOUTH' | 'FUTURE' | 'WORLD';
    }
    
    // Priority 2: Check isWorldForm prop
    if (isWorldForm) {
      return 'WORLD';
    }
    
    // Priority 3: Fallback to URL hash (for new submissions)
    return window.location.hash.includes('future') ? 'FUTURE' : 'YOUTH';
  };

  const validateCrewForm = (): FormErrors => {
    const errors: FormErrors = {};
    
    if (!crewFormData.fullName.trim()) errors.fullName = validationMessages.required;
    // Thai name is now optional for all cases
    // if (isThaiNationality && !crewFormData.fullNameTh.trim()) {
    //   errors.fullNameTh = validationMessages.required;
    // }
    if (!crewFormData.role) errors.role = validationMessages.required;
    if (crewFormData.role === 'Other' && !crewFormData.customRole.trim()) {
      errors.customRole = validationMessages.required;
    }
    
    // Age validation - only for non-world forms
    if (!isWorldForm) {
      if (!crewFormData.age) {
        errors.age = validationMessages.required;
      } else {
        const age = parseInt(crewFormData.age);
        // Age validation based on competition category
        const ageCategory = getAgeCategory();
        if (!validateAge(age, ageCategory)) {
          errors.age = validationMessages.invalidAge(ageCategory);
        }
      }
    } else {
      // For world form, age is still required but no restrictions
      if (!crewFormData.age) {
        errors.age = validationMessages.required;
      }
    }
    
    if (crewFormData.email && !validateEmail(crewFormData.email)) {
      errors.email = validationMessages.invalidEmail;
    }
    
    // School name only required for non-world forms
    if (!isWorldForm) {
      if (!crewFormData.schoolName.trim()) {
        errors.schoolName = validationMessages.required;
      }
    }
    // Student ID is not required for crew members
    
    return errors;
  };

  const handleCrewInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCrewFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (crewFormErrors[name]) {
      setCrewFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const addCrewMember = () => {
    // Prevent form submission
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    const errors = validateCrewForm();
    if (Object.keys(errors).length > 0) {
      setCrewFormErrors(errors);
      return;
    }

    const newMember: CrewMember = {
      id: editingCrewId || Date.now().toString(),
      fullName: crewFormData.fullName,
      fullNameTh: isThaiNationality ? crewFormData.fullNameTh : undefined,
      role: crewFormData.role,
      customRole: crewFormData.role === 'Other' ? crewFormData.customRole : undefined,
      age: parseInt(crewFormData.age),
      phone: crewFormData.phone || undefined,
      email: crewFormData.email || undefined,
      schoolName: isWorldForm ? '' : crewFormData.schoolName,
      studentId: isWorldForm ? '' : crewFormData.studentId
    };

    if (editingCrewId) {
      // Update existing member
      const updatedMembers = crewMembers.map(member =>
        member.id === editingCrewId ? newMember : member
      );
      onCrewMembersChange(updatedMembers);
      setEditingCrewId(null);
    } else {
      // Add new member
      onCrewMembersChange([...crewMembers, newMember]);
    }

    // Reset form
    resetCrewForm();

    // Scroll to crew management section after adding/updating member
    setTimeout(() => {
      const crewSection = document.querySelector('[data-crew-section]');
      if (crewSection) {
        crewSection.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }, 100);
  };

  const resetCrewForm = () => {
    setCrewFormData({
      fullName: '',
      fullNameTh: '',
      role: '',
      customRole: '',
      age: '',
      phone: '',
      email: '',
      schoolName: isWorldForm ? '' : (submitterSchoolName || submitterUniversityName || ''),
      studentId: ''
    });
    setCrewFormErrors({});
    setShowCrewForm(false);
  };

  const editCrewMember = (member: CrewMember) => {
    setCrewFormData({
      fullName: member.fullName,
      fullNameTh: member.fullNameTh || '',
      role: member.role,
      customRole: member.customRole || '',
      age: member.age.toString(),
      phone: member.phone || '',
      email: member.email || '',
      schoolName: isWorldForm ? '' : member.schoolName,
      studentId: isWorldForm ? '' : member.studentId
    });
    setEditingCrewId(member.id);
    setShowCrewForm(true);
    setCrewFormErrors({});

    // Enhanced scroll behavior with better positioning
    setTimeout(() => {
      const crewForm = document.querySelector('[data-crew-form]');
      if (crewForm) {
        const rect = crewForm.getBoundingClientRect();
        const offsetTop = window.pageYOffset + rect.top - 120; // More buffer space
        
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    }, 150);
  };

  const deleteCrewMember = (id: string) => {
    const updatedMembers = crewMembers.filter(member => member.id !== id);
    onCrewMembersChange(updatedMembers);
    setShowDeleteConfirm(null);
  };

  return (
    <div 
      ref={containerRef}
      className={`crew-management-container ${className}`}
      style={{
        position: 'relative',
        zIndex: 1,
        marginBottom: '2rem',
        overflow: 'visible',
        minHeight: 'fit-content',
        height: 'auto',
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '1rem',
        padding: '1.5rem',
        contain: 'none',
        isolation: 'isolate'
      }}
      data-crew-section
    >
      <h3 className={`text-lg sm:text-xl ${getClass('subtitle')} text-white mb-6`}>
        👥 {currentContent.crewInfoTitle}
      </h3>
      
      {/* Crew Members Error */}
      {error && (
        <div className="mb-4">
          <ErrorMessage error={error} />
        </div>
      )}
      
      {/* Add Crew Member Button */}
      <div className="mb-6">
        <AnimatedButton
          type="button"
          variant="secondary"
          size="medium"
          icon="➕"
          onClick={() => {
            setShowCrewForm(true);
            // Scroll to crew form when opening
            setTimeout(() => {
              const crewForm = document.querySelector('[data-crew-form]');
              if (crewForm) {
                crewForm.scrollIntoView({ 
                  behavior: 'smooth', 
                  block: 'center' 
                });
              }
            }, 100);
          }}
          className={getClass('menu')}
        >
          {currentContent.addCrewMember}
        </AnimatedButton>
      </div>

      {/* Crew Member Form */}
      {showCrewForm && (
        <div 
          className="crew-form-container mb-6" 
          data-crew-form
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            position: 'relative',
            zIndex: 10,
            overflow: 'visible',
            minHeight: 'fit-content',
            height: 'auto'
          }}
        >
          <h4 className={`text-lg ${getClass('subtitle')} text-white mb-4`}>
            {editingCrewId ? currentContent.editMember : currentContent.crewMemberForm}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-white/90 ${getClass('body')} mb-2`}>
                {currentContent.submitterName} <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={crewFormData.fullName}
                onChange={handleCrewInputChange}
                className={`w-full p-3 rounded-lg bg-white/10 border ${crewFormErrors.fullName ? 'border-red-400' : 'border-white/20'} text-white placeholder-white/50 focus:border-[#FCB283] focus:outline-none`}
              />
              <ErrorMessage error={crewFormErrors.fullName} />
            </div>
            
            {/* Thai Name for crew - only for Thai nationality */}
            {isThaiNationality && (
              <div>
                <label className={`block text-white/90 ${getClass('body')} mb-2`}>
                  {currentContent.submitterNameTh} {currentContent.optional}
                </label>
                <input
                  type="text"
                  name="fullNameTh"
                  value={crewFormData.fullNameTh}
                  onChange={handleCrewInputChange}
                  className={`w-full p-3 rounded-lg bg-white/10 border ${crewFormErrors.fullNameTh ? 'border-red-400' : 'border-white/20'} text-white placeholder-white/50 focus:border-[#FCB283] focus:outline-none`}
                />
                <ErrorMessage error={crewFormErrors.fullNameTh} />
              </div>
            )}
            
            <div>
              <label className={`block text-white/90 ${getClass('body')} mb-2`}>
                {currentContent.roleInFilm} <span className="text-red-400">*</span>
              </label>
              <select
                name="role"
                value={crewFormData.role}
                onChange={handleCrewInputChange}
                className={`w-full p-3 rounded-lg bg-white/10 border ${crewFormErrors.role ? 'border-red-400' : 'border-white/20'} text-white focus:border-[#FCB283] focus:outline-none`}
              >
                <option value="" className="bg-[#110D16]">{currentContent.selectRole}</option>
                {FILM_ROLES.map(role => (
                  <option key={role} value={role} className="bg-[#110D16]">
                    {role}
                  </option>
                ))}
              </select>
              <ErrorMessage error={crewFormErrors.role} />
            </div>
            
            {crewFormData.role === 'Other' && (
              <div>
                <label className={`block text-white/90 ${getClass('body')} mb-2`}>
                  {currentContent.specifyRole} <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="customRole"
                  value={crewFormData.customRole}
                  onChange={handleCrewInputChange}
                  className={`w-full p-3 rounded-lg bg-white/10 border ${crewFormErrors.customRole ? 'border-red-400' : 'border-white/20'} text-white placeholder-white/50 focus:border-[#FCB283] focus:outline-none`}
                />
                <ErrorMessage error={crewFormErrors.customRole} />
              </div>
            )}
            
            <div>
              <label className={`block text-white/90 ${getClass('body')} mb-2`}>
                {currentContent.age} <span className="text-red-400">*</span>
                {(() => {
                  const category = getAgeCategory();
                  if (category === 'WORLD') {
                    return currentLanguage === 'th' ? ' (อายุไม่น้อยกว่า 20 ปี - ประชาชนทั่วไป)' : ' (Age 20+ years - General public)';
                  } else if (category === 'FUTURE') {
                    return currentLanguage === 'th' ? ' (อายุ 18-25 ปี - นักศึกษาอุดมศึกษา)' : ' (Age 18-25 years - University students)';
                  } else {
                    return currentLanguage === 'th' ? ' (อายุ 12-18 ปี - นักเรียนมัธยมศึกษา)' : ' (Age 12-18 years - High school students)';
                  }
                })()}
              </label>
              <input
                type="number"
                name="age"
                value={crewFormData.age}
                onChange={handleCrewInputChange}
                {...(() => {
                  const category = getAgeCategory();
                  if (category === 'WORLD') {
                    return { min: "20", max: "100" };
                  } else if (category === 'FUTURE') {
                    return { min: "18", max: "25" };
                  } else {
                    return { min: "12", max: "18" };
                  }
                })()}
                className={`w-full p-3 rounded-lg bg-white/10 border ${crewFormErrors.age ? 'border-red-400' : 'border-white/20'} text-white placeholder-white/50 focus:border-[#FCB283] focus:outline-none`}
              />
              {(() => {
                const age = parseInt(crewFormData.age);
                if (!age || isNaN(age)) return null;
                
                let isValidAge = true;
                let warningMessage = '';
                
                const category = getAgeCategory();
                if (category === 'YOUTH') {
                  if (age < 12 || age > 18) {
                    isValidAge = false;
                    warningMessage = currentLanguage === 'th' 
                      ? 'อายุต้องอยู่ระหว่าง 12-18 ปี สำหรับหมวดเยาวชน' 
                      : 'Age must be between 12-18 years for Youth category';
                  }
                } else if (category === 'FUTURE') {
                  if (age < 18 || age > 25) {
                    isValidAge = false;
                    warningMessage = currentLanguage === 'th' 
                      ? 'อายุต้องอยู่ระหว่าง 18-25 ปี สำหรับหมวดอนาคต' 
                      : 'Age must be between 18-25 years for Future category';
                  }
                } else {
                  // World category: 20+
                  if (age < 20) {
                    isValidAge = false;
                    warningMessage = currentLanguage === 'th' 
                      ? 'อายุต้องไม่น้อยกว่า 20 ปี สำหรับหมวดโลก' 
                      : 'Age must be at least 20 years for World category';
                  }
                }
                
                if (!isValidAge && warningMessage) {
                  return (
                    <p className={`text-xs ${getClass('body')} text-red-400 mt-1 flex items-center`}>
                      <span className="mr-1">⚠️</span>
                      {warningMessage}
                    </p>
                  );
                }
                
                return null;
              })()}
              <ErrorMessage error={crewFormErrors.age} />
            </div>
            
            <div>
              <label className={`block text-white/90 ${getClass('body')} mb-2`}>
                {currentContent.phone} {currentContent.optional}
              </label>
              <input
                type="tel"
                name="phone"
                value={crewFormData.phone}
                onChange={handleCrewInputChange}
                className={`w-full p-3 rounded-lg bg-white/10 border ${crewFormErrors.phone ? 'border-red-400' : 'border-white/20'} text-white placeholder-white/50 focus:border-[#FCB283] focus:outline-none`}
              />
              <ErrorMessage error={crewFormErrors.phone} />
            </div>
            
            <div>
              <label className={`block text-white/90 ${getClass('body')} mb-2`}>
                {currentContent.email} {currentContent.optional}
              </label>
              <input
                type="email"
                name="email"
                value={crewFormData.email}
                onChange={handleCrewInputChange}
                className={`w-full p-3 rounded-lg bg-white/10 border ${crewFormErrors.email ? 'border-red-400' : 'border-white/20'} text-white placeholder-white/50 focus:border-[#FCB283] focus:outline-none`}
              />
              <ErrorMessage error={crewFormErrors.email} />
            </div>
            
            {/* School Name - only for non-world forms */}
            {!isWorldForm && (
              <div>
                <label className={`block text-white/90 ${getClass('body')} mb-2`}>
                  {currentContent.schoolName} <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="schoolName"
                  value={crewFormData.schoolName}
                  onChange={handleCrewInputChange}
                  className={`w-full p-3 rounded-lg bg-white/10 border ${crewFormErrors.schoolName ? 'border-red-400' : 'border-white/20'} text-white placeholder-white/50 focus:border-[#FCB283] focus:outline-none`}
                />
                <ErrorMessage error={crewFormErrors.schoolName} />
              </div>
            )}
            
            {/* Student ID - only for non-world forms */}
            {!isWorldForm && (
              <div>
                <label className={`block text-white/90 ${getClass('body')} mb-2`}>
                  {currentContent.studentId} {currentContent.optional}
                </label>
                <input
                  type="text"
                  name="studentId"
                  value={crewFormData.studentId}
                  onChange={handleCrewInputChange}
                  className={`w-full p-3 rounded-lg bg-white/10 border ${crewFormErrors.studentId ? 'border-red-400' : 'border-white/20'} text-white placeholder-white/50 focus:border-[#FCB283] focus:outline-none`}
                />
                <ErrorMessage error={crewFormErrors.studentId} />
              </div>
            )}
          </div>
          <div className="flex gap-4 mt-4">
            <AnimatedButton
              type="button"
              variant="primary"
              size="small"
              icon="✅"
              onClick={addCrewMember}
              className={getClass('menu')}
            >
              {editingCrewId ? currentContent.updateMember : currentContent.addMember}
            </AnimatedButton>
            <AnimatedButton
              type="button"
              variant="outline"
              size="small"
              icon="❌"
              onClick={() => {
                resetCrewForm();
                setEditingCrewId(null);
              }}
              className={getClass('menu')}
            >
              {currentContent.cancel}
            </AnimatedButton>
          </div>
        </div>
      )}

      {/* Crew Members Table */}
      {crewMembers.length > 0 && (
        <div 
          className="crew-table-container"
          style={{
            position: 'relative',
            zIndex: 5,
            overflow: 'visible',
            minHeight: 'fit-content',
            height: 'auto'
          }}
        >
          <h4 className={`text-md ${getClass('subtitle')} text-white/90 mb-4`}>
            {currentContent.tableHeaders.name} ({crewMembers.length})
          </h4>
          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
              <table className="w-full table-fixed">
                <thead>
                  <tr className="bg-gradient-to-r from-[#AA4626] to-[#FCB283]">
                    <th className={`px-4 py-3 text-left ${getClass('subtitle')} text-white text-sm whitespace-nowrap`}>
                      {currentContent.tableHeaders.name}
                    </th>
                    <th className={`px-4 py-3 text-left ${getClass('subtitle')} text-white text-sm whitespace-nowrap`}>
                      {currentContent.tableHeaders.role}
                    </th>
                    <th className={`px-4 py-3 text-left ${getClass('subtitle')} text-white text-sm whitespace-nowrap`}>
                      {currentContent.tableHeaders.age}
                    </th>
                    {!isWorldForm && (
                      <th className={`px-4 py-3 text-left ${getClass('subtitle')} text-white text-sm whitespace-nowrap`}>
                        {currentContent.tableHeaders.school}
                      </th>
                    )}
                    <th className={`px-4 py-3 text-center ${getClass('subtitle')} text-white text-sm whitespace-nowrap`}>
                      {currentContent.tableHeaders.actions}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {crewMembers.map((member) => (
                    <tr key={member.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className={`px-4 py-3 ${getClass('body')} text-white/90 text-sm`}>
                        <div>
                          <div className="font-medium">{member.fullName}</div>
                          {member.fullNameTh && (
                            <div className="text-xs text-white/60 mt-1">{member.fullNameTh}</div>
                          )}
                        </div>
                      </td>
                      <td className={`px-4 py-3 ${getClass('body')} text-white/90 text-sm`}>
                        <div className="max-w-[120px] truncate" title={member.role === 'Other' ? member.customRole : member.role}>
                          {member.role === 'Other' ? member.customRole : member.role}
                        </div>
                      </td>
                      <td className={`px-4 py-3 ${getClass('body')} text-white/90 text-sm`}>
                        <div className="flex items-center space-x-2">
                          <span>{member.age}</span>
                        </div>
                      </td>
                      {!isWorldForm && (
                        <td className={`px-4 py-3 ${getClass('body')} text-white/90 text-sm`}>
                          <div>
                            <div className="max-w-[150px] truncate font-medium" title={member.schoolName}>
                              {member.schoolName}
                            </div>
                            {member.studentId && (
                              <div className="text-xs text-white/60 mt-1 max-w-[150px] truncate" title={member.studentId}>
                                {member.studentId}
                              </div>
                            )}
                          </div>
                        </td>
                      )}
                      <td className="px-4 py-3 text-center">
                        <div className="flex gap-2 justify-center">
                          <button
                            type="button"
                            onClick={() => editCrewMember(member)}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-xs transition-colors whitespace-nowrap"
                          >
                            {currentContent.edit}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowDeleteConfirm(member.id)}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-xs transition-colors whitespace-nowrap"
                          >
                            {currentContent.delete}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {crewMembers.map((member) => (
              <div key={member.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h5 className={`${getClass('subtitle')} text-white font-medium`}>
                      {member.fullName}
                    </h5>
                    {member.fullNameTh && (
                      <p className="text-xs text-white/60 mt-1">{member.fullNameTh}</p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      type="button"
                      onClick={() => editCrewMember(member)}
                      className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-xs transition-colors"
                    >
                      {currentContent.edit}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(member.id)}
                      className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-xs transition-colors"
                    >
                      {currentContent.delete}
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-white/60">{currentContent.tableHeaders.role}:</span>
                    <p className={`${getClass('body')} text-white/90 mt-1`}>
                      {member.role === 'Other' ? member.customRole : member.role}
                    </p>
                  </div>
                  <div>
                    <span className="text-white/60">{currentContent.tableHeaders.age}:</span>
                    <p className={`${getClass('body')} text-white/90 mt-1`}>{member.age}</p>
                  </div>
                  {!isWorldForm && (
                    <>
                      <div>
                        <span className="text-white/60">{currentContent.tableHeaders.school}:</span>
                        <p className={`${getClass('body')} text-white/90 mt-1 break-words`}>
                          {member.schoolName}
                        </p>
                      </div>
                      {member.studentId && (
                        <div>
                          <span className="text-white/60">{currentContent.tableHeaders.studentId}:</span>
                          <p className={`${getClass('body')} text-white/90 mt-1`}>
                            {member.studentId}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Crew Members Message */}
      {crewMembers.length === 0 && (
        <div className="mt-6">
          <div className="glass-card p-8 rounded-xl border border-white/10 text-center">
            <p className={`text-white/60 ${getClass('body')}`}>
              {currentContent.noCrewMembers}
            </p>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glass-container rounded-xl p-6 max-w-md mx-4">
            <h4 className={`text-lg ${getClass('subtitle')} text-white mb-4`}>
              {currentContent.confirmDelete}
            </h4>
            <div className="flex gap-4">
              <AnimatedButton
                type="button"
                variant="primary"
                size="small"
                onClick={() => deleteCrewMember(showDeleteConfirm)}
                className={getClass('menu')}
              >
                {currentContent.delete}
              </AnimatedButton>
              <AnimatedButton
                type="button"
                variant="outline"
                size="small"
                onClick={() => setShowDeleteConfirm(null)}
                className={getClass('menu')}
              >
                {currentContent.cancel}
              </AnimatedButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrewManagement;
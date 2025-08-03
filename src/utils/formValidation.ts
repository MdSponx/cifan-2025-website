import { AGE_LIMITS, DURATION_LIMITS } from './formConstants';

export interface FormErrors {
  [key: string]: string;
}

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Age validation for different categories
export const validateAge = (age: number, category: 'YOUTH' | 'FUTURE' | 'WORLD'): boolean => {
  const limits = AGE_LIMITS[category];
  return age >= limits.min && age <= limits.max;
};

// File size validation
export const validateFileSize = (file: File, maxSize: number): boolean => {
  return file.size <= maxSize;
};

// File type validation
export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

// Generic required field validation
export const validateRequired = (value: string | number | boolean | string[]): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  if (typeof value === 'number') {
    return !isNaN(value) && value > 0;
  }
  if (typeof value === 'boolean') {
    return value === true;
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return false;
};

// Word count validation
export const validateWordCount = (text: string, maxWords: number): boolean => {
  const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
  return wordCount <= maxWords;
};

// Common validation messages
export const getValidationMessages = (language: 'th' | 'en') => {
  return {
    required: language === 'th' ? 'กรุณากรอกข้อมูลนี้' : 'This field is required',
    invalidEmail: language === 'th' ? 'รูปแบบอีเมลไม่ถูกต้อง' : 'Please enter a valid email address',
    formatRequired: language === 'th' ? 'กรุณาเลือกรูปแบบภาพยนตร์' : 'Please select film format',
    filmLanguagesRequired: language === 'th' ? 'กรุณาเลือกภาษาในภาพยนตร์อย่างน้อย 1 ภาษา' : 'Please select at least one film language',
    invalidAge: (category: 'YOUTH' | 'FUTURE' | 'WORLD') => {
      const limits = AGE_LIMITS[category];
      return language === 'th' 
        ? `อายุต้องอยู่ระหว่าง ${limits.min}-${limits.max} ปี`
        : `Age must be between ${limits.min}-${limits.max} years`;
    },
    fileTooLarge: (maxSize: number) => {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024));
      return language === 'th' 
        ? `ไฟล์มีขนาดใหญ่เกินไป (สูงสุด ${maxSizeMB}MB)`
        : `File size too large (max ${maxSizeMB}MB)`;
    },
    invalidFileType: language === 'th' 
      ? 'ประเภทไฟล์ไม่ถูกต้อง'
      : 'Invalid file type',
    wordCountExceeded: (maxWords: number) => language === 'th'
      ? `จำนวนคำเกิน ${maxWords} คำ`
      : `Word count exceeds ${maxWords} words`,
    minCrewMembers: language === 'th' 
      ? 'สมาชิกทีมงาน (ไม่บังคับ)'
      : 'Crew members (optional)',
    allAgreementsRequired: language === 'th' 
      ? 'กรุณายอมรับข้อตกลงทั้งหมด'
      : 'Please accept all terms and conditions'
  };
};

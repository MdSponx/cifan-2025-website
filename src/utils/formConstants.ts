// Film roles for dropdown
export const FILM_ROLES = [
  'Director', 'Producer', 'Cinematographer', 'Editor', 'Sound Designer',
  'Production Designer', 'Costume Designer', 'Makeup Artist', 'Screenwriter',
  'Composer', 'Casting Director', 'Visual Effects Supervisor', 'Location Manager',
  'Script Supervisor', 'Assistant Director', 'Other'
];

// Genre options with multi-language support
export const GENRE_OPTIONS = [
  { value: 'horror', label: { th: 'สยองขวัญ', en: 'Horror' } },
  { value: 'scifi', label: { th: 'วิทยาศศ', en: 'Science Fiction' } },
  { value: 'fantasy', label: { th: 'แฟนตาซี', en: 'Fantasy' } },
  { value: 'dark-comedy', label: { th: 'ตลกร้าย', en: 'Dark Comedy' } },
  { value: 'folklore', label: { th: 'เรื่องเล่าพื้นบ้าน', en: 'Folklore' } },
  { value: 'action', label: { th: 'แอ็กชัน', en: 'Action' } },
  { value: 'surreal', label: { th: 'เหนือจริง / อาร์ตแฟนตาสติก', en: 'Surreal / Art Fantastic' } },
  { value: 'monster', label: { th: 'สัตว์ประหลาด / มอนสเตอร์', en: 'Monster' } },
  { value: 'magic', label: { th: 'เวทมนตร์ / ไสยศาสตร์', en: 'Magic / Supernatural' } },
    { value: 'mีusical', label: { th: 'เพลง', en: 'Musical' } },
  { value: 'thriller', label: { th: 'ระทึกขวัญ', en: 'Thriller' } },
];

// File type configurations
export const FILE_TYPES = {
  VIDEO: {
    accept: '.mp4,.mov',
    maxSize: 500 * 1024 * 1024, // 500MB
    types: ['video/mp4', 'video/quicktime']
  },
  IMAGE: {
    accept: '.jpg,.jpeg,.png',
    maxSize: 10 * 1024 * 1024, // 10MB
    types: ['image/jpeg', 'image/png']
  },
  DOCUMENT: {
    accept: '.pdf,.jpg,.jpeg,.png',
    maxSize: 10 * 1024 * 1024, // 10MB
    types: ['application/pdf', 'image/jpeg', 'image/png']
  }
};

// Age limits for different categories
export const AGE_LIMITS = {
  YOUTH: { min: 12, max: 18 },
  FUTURE: { min: 18, max: 25 },
  WORLD: { min: 20, max: 100 }
};

// Duration limits (in minutes)
export const DURATION_LIMITS = {
  min: 5,
  max: 10
};

// Agreement texts
export const AGREEMENT_CONTENT = {
  th: {
    agreement1: "ข้าพเจ้ายืนยันว่าเป็นเจ้าของลิขสิทธิ์ของผลงานนี้ทั้งหมด",
    agreement2: "ข้าพเจ้าเข้าใจและยอมรับเงื่อนไขการประกวดทั้งหมด",
    agreement3: "ข้าพเจ้ายินยอมให้ทางเทศกาลใช้ผลงานในการประชาสัมพันธ์",
    agreement4: "ข้าพเจ้ารับทราบว่าการตัดสินของคณะกรรมการถือเป็นที่สิ้นสุด"
  },
  en: {
    agreement1: "I confirm that I own all copyrights to this work",
    agreement2: "I understand and accept all competition terms and conditions",
    agreement3: "I consent to the festival using my work for promotional purposes",
    agreement4: "I acknowledge that the judges' decision is final"
  }
};

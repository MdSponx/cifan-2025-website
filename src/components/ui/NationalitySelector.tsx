import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

// Comprehensive list of countries
const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Argentina', 'Armenia', 'Australia',
  'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium',
  'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil',
  'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada',
  'Cape Verde', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros',
  'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti',
  'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea',
  'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon',
  'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea',
  'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia',
  'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan',
  'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho',
  'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi',
  'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius',
  'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco',
  'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand',
  'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman',
  'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru',
  'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda',
  'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa',
  'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles',
  'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia',
  'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname',
  'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand',
  'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan',
  'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States',
  'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen',
  'Zambia', 'Zimbabwe'
];

// Country flag emojis mapping
const countryFlags: { [key: string]: string } = {
  'Afghanistan': '🇦🇫', 'Albania': '🇦🇱', 'Algeria': '🇩🇿', 'Andorra': '🇦🇩', 'Angola': '🇦🇴',
  'Argentina': '🇦🇷', 'Armenia': '🇦🇲', 'Australia': '🇦🇺', 'Austria': '🇦🇹', 'Azerbaijan': '🇦🇿',
  'Bahamas': '🇧🇸', 'Bahrain': '🇧🇭', 'Bangladesh': '🇧🇩', 'Barbados': '🇧🇧', 'Belarus': '🇧🇾',
  'Belgium': '🇧🇪', 'Belize': '🇧🇿', 'Benin': '🇧🇯', 'Bhutan': '🇧🇹', 'Bolivia': '🇧🇴',
  'Bosnia and Herzegovina': '🇧🇦', 'Botswana': '🇧🇼', 'Brazil': '🇧🇷', 'Brunei': '🇧🇳',
  'Bulgaria': '🇧🇬', 'Burkina Faso': '🇧🇫', 'Burundi': '🇧🇮', 'Cambodia': '🇰🇭',
  'Cameroon': '🇨🇲', 'Canada': '🇨🇦', 'Cape Verde': '🇨🇻', 'Central African Republic': '🇨🇫',
  'Chad': '🇹🇩', 'Chile': '🇨🇱', 'China': '🇨🇳', 'Colombia': '🇨🇴', 'Comoros': '🇰🇲',
  'Congo': '🇨🇬', 'Costa Rica': '🇨🇷', 'Croatia': '🇭🇷', 'Cuba': '🇨🇺', 'Cyprus': '🇨🇾',
  'Czech Republic': '🇨🇿', 'Denmark': '🇩🇰', 'Djibouti': '🇩🇯', 'Dominica': '🇩🇲',
  'Dominican Republic': '🇩🇴', 'Ecuador': '🇪🇨', 'Egypt': '🇪🇬', 'El Salvador': '🇸🇻',
  'Equatorial Guinea': '🇬🇶', 'Eritrea': '🇪🇷', 'Estonia': '🇪🇪', 'Eswatini': '🇸🇿',
  'Ethiopia': '🇪🇹', 'Fiji': '🇫🇯', 'Finland': '🇫🇮', 'France': '🇫🇷', 'Gabon': '🇬🇦',
  'Gambia': '🇬🇲', 'Georgia': '🇬🇪', 'Germany': '🇩🇪', 'Ghana': '🇬🇭', 'Greece': '🇬🇷',
  'Grenada': '🇬🇩', 'Guatemala': '🇬🇹', 'Guinea': '🇬🇳', 'Guinea-Bissau': '🇬🇼',
  'Guyana': '🇬🇾', 'Haiti': '🇭🇹', 'Honduras': '🇭🇳', 'Hungary': '🇭🇺', 'Iceland': '🇮🇸',
  'India': '🇮🇳', 'Indonesia': '🇮🇩', 'Iran': '🇮🇷', 'Iraq': '🇮🇶', 'Ireland': '🇮🇪',
  'Israel': '🇮🇱', 'Italy': '🇮🇹', 'Jamaica': '🇯🇲', 'Japan': '🇯🇵', 'Jordan': '🇯🇴',
  'Kazakhstan': '🇰🇿', 'Kenya': '🇰🇪', 'Kiribati': '🇰🇮', 'Kuwait': '🇰🇼',
  'Kyrgyzstan': '🇰🇬', 'Laos': '🇱🇦', 'Latvia': '🇱🇻', 'Lebanon': '🇱🇧', 'Lesotho': '🇱🇸',
  'Liberia': '🇱🇷', 'Libya': '🇱🇾', 'Liechtenstein': '🇱🇮', 'Lithuania': '🇱🇹',
  'Luxembourg': '🇱🇺', 'Madagascar': '🇲🇬', 'Malawi': '🇲🇼', 'Malaysia': '🇲🇾',
  'Maldives': '🇲🇻', 'Mali': '🇲🇱', 'Malta': '🇲🇹', 'Marshall Islands': '🇲🇭',
  'Mauritania': '🇲🇷', 'Mauritius': '🇲🇺', 'Mexico': '🇲🇽', 'Micronesia': '🇫🇲',
  'Moldova': '🇲🇩', 'Monaco': '🇲🇨', 'Mongolia': '🇲🇳', 'Montenegro': '🇲🇪',
  'Morocco': '🇲🇦', 'Mozambique': '🇲🇿', 'Myanmar': '🇲🇲', 'Namibia': '🇳🇦',
  'Nauru': '🇳🇷', 'Nepal': '🇳🇵', 'Netherlands': '🇳🇱', 'New Zealand': '🇳🇿',
  'Nicaragua': '🇳🇮', 'Niger': '🇳🇪', 'Nigeria': '🇳🇬', 'North Korea': '🇰🇵',
  'North Macedonia': '🇲🇰', 'Norway': '🇳🇴', 'Oman': '🇴🇲', 'Pakistan': '🇵🇰',
  'Palau': '🇵🇼', 'Palestine': '🇵🇸', 'Panama': '🇵🇦', 'Papua New Guinea': '🇵🇬',
  'Paraguay': '🇵🇾', 'Peru': '🇵🇪', 'Philippines': '🇵🇭', 'Poland': '🇵🇱',
  'Portugal': '🇵🇹', 'Qatar': '🇶🇦', 'Romania': '🇷🇴', 'Russia': '🇷🇺', 'Rwanda': '🇷🇼',
  'Saint Kitts and Nevis': '🇰🇳', 'Saint Lucia': '🇱🇨', 'Saint Vincent and the Grenadines': '🇻🇨',
  'Samoa': '🇼🇸', 'San Marino': '🇸🇲', 'Sao Tome and Principe': '🇸🇹',
  'Saudi Arabia': '🇸🇦', 'Senegal': '🇸🇳', 'Serbia': '🇷🇸', 'Seychelles': '🇸🇨',
  'Sierra Leone': '🇸🇱', 'Singapore': '🇸🇬', 'Slovakia': '🇸🇰', 'Slovenia': '🇸🇮',
  'Solomon Islands': '🇸🇧', 'Somalia': '🇸🇴', 'South Africa': '🇿🇦', 'South Korea': '🇰🇷',
  'South Sudan': '🇸🇸', 'Spain': '🇪🇸', 'Sri Lanka': '🇱🇰', 'Sudan': '🇸🇩',
  'Suriname': '🇸🇷', 'Sweden': '🇸🇪', 'Switzerland': '🇨🇭', 'Syria': '🇸🇾',
  'Taiwan': '🇹🇼', 'Tajikistan': '🇹🇯', 'Tanzania': '🇹🇿', 'Thailand': '🇹🇭',
  'Timor-Leste': '🇹🇱', 'Togo': '🇹🇬', 'Tonga': '🇹🇴', 'Trinidad and Tobago': '🇹🇹',
  'Tunisia': '🇹🇳', 'Turkey': '🇹🇷', 'Turkmenistan': '🇹🇲', 'Tuvalu': '🇹🇻',
  'Uganda': '🇺🇬', 'Ukraine': '🇺🇦', 'United Arab Emirates': '🇦🇪', 'United Kingdom': '🇬🇧',
  'United States': '🇺🇸', 'Uruguay': '🇺🇾', 'Uzbekistan': '🇺🇿', 'Vanuatu': '🇻🇺',
  'Vatican City': '🇻🇦', 'Venezuela': '🇻🇪', 'Vietnam': '🇻🇳', 'Yemen': '🇾🇪',
  'Zambia': '🇿🇲', 'Zimbabwe': '🇿🇼'
};

interface NationalitySelectorProps {
  onNationalityChange: (nationality: string) => void;
  onNationalityTypeChange: (isThaiNationality: boolean) => void;
  onFilmLanguagesChange: (languages: string[]) => void;
  filmLanguages?: string[];
  className?: string;
}

const NationalitySelector: React.FC<NationalitySelectorProps> = ({
  onNationalityChange,
  onNationalityTypeChange,
  onFilmLanguagesChange,
  filmLanguages = ['Thai'],
  className = ''
}) => {
  const { i18n } = useTranslation();
  const [nationalityType, setNationalityType] = useState<'thai' | 'international'>('thai');
  const [countrySearch, setCountrySearch] = useState('');
  const [showCountrySuggestions, setShowCountrySuggestions] = useState(false);
  const [showOtherLanguageInput, setShowOtherLanguageInput] = useState(false);
  const [customLanguage, setCustomLanguage] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(filmLanguages || ['Thai']);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Dynamic typography classes based on language
  const getTypographyClass = (baseClass: string) => {
    return i18n.language === 'th' ? `${baseClass}-th` : `${baseClass}-en`;
  };

  const currentLanguage = i18n.language as 'en' | 'th';

  const content = {
    th: {
      nationalityTitle: "สัญชาติ",
      thaiOption: "ไทย",
      internationalOption: "นานาชาติ",
      searchCountry: "ค้นหาประเทศ...",
      filmLanguageTitle: "ภาษาในภาพยนตร์",
      filmLanguageDesc: "ภาษาที่ใช้ในภาพยนตร์ของคุณ (เลือกได้หลายภาษา)",
      selectedLanguages: "ภาษาที่เลือก:",
      addCustomLanguage: "เพิ่มภาษาอื่น",
      customLanguagePlaceholder: "ระบุภาษาอื่น..."
    },
    en: {
      nationalityTitle: "Nationality",
      thaiOption: "THAI",
      internationalOption: "International",
      searchCountry: "Search country...",
      filmLanguageTitle: "Film Language",
      filmLanguageDesc: "Languages used in your film (multiple selection allowed)",
      selectedLanguages: "Selected Languages:",
      addCustomLanguage: "Add Other Language",
      customLanguagePlaceholder: "Specify other language..."
    }
  };

  const currentContent = content[currentLanguage];

  // Film language options
  const majorLanguages = [
    { value: 'Thai', label: { th: 'ภาษาไทย', en: 'Thai' }, flag: '🇹🇭' },
    { value: 'English', label: { th: 'ภาษาอังกฤษ', en: 'English' }, flag: '🇺🇸' },
    { value: 'Mandarin', label: { th: 'ภาษาจีนกลาง', en: 'Mandarin' }, flag: '🇨🇳' },
    { value: 'Japanese', label: { th: 'ภาษาญี่ปุ่น', en: 'Japanese' }, flag: '🇯🇵' },
    { value: 'Korean', label: { th: 'ภาษาเกาหลี', en: 'Korean' }, flag: '🇰🇷' },
    { value: 'Vietnamese', label: { th: 'ภาษาเวียดนาม', en: 'Vietnamese' }, flag: '🇻🇳' },
    { value: 'Malay', label: { th: 'ภาษามาเลย์', en: 'Malay' }, flag: '🇲🇾' },
    { value: 'Indonesian', label: { th: 'ภาษาอินโดนีเซีย', en: 'Indonesian' }, flag: '🇮🇩' },
    { value: 'Hindi', label: { th: 'ภาษาฮินดี', en: 'Hindi' }, flag: '🇮🇳' },
    { value: 'Spanish', label: { th: 'ภาษาสเปน', en: 'Spanish' }, flag: '🇪🇸' },
    { value: 'French', label: { th: 'ภาษาฝรั่งเศส', en: 'French' }, flag: '🇫🇷' },
    { value: 'German', label: { th: 'ภาษาเยอรมัน', en: 'German' }, flag: '🇩🇪' },
    { value: 'Portuguese', label: { th: 'ภาษาโปรตุเกส', en: 'Portuguese' }, flag: '🇵🇹' },
    { value: 'Russian', label: { th: 'ภาษารัสเซีย', en: 'Russian' }, flag: '🇷🇺' },
    { value: 'Arabic', label: { th: 'ภาษาอาหรับ', en: 'Arabic' }, flag: '🇸🇦' },
    { value: 'Italian', label: { th: 'ภาษาอิตาลี', en: 'Italian' }, flag: '🇮🇹' },
    { value: 'Dutch', label: { th: 'ภาษาดัตช์', en: 'Dutch' }, flag: '🇳🇱' },
    { value: 'Swedish', label: { th: 'ภาษาสวีเดน', en: 'Swedish' }, flag: '🇸🇪' },
    { value: 'Norwegian', label: { th: 'ภาษานอร์เวย์', en: 'Norwegian' }, flag: '🇳🇴' }
  ];
  // Filter countries based on search
  const filteredCountries = COUNTRIES.filter(country =>
    country.toLowerCase().includes(countrySearch.toLowerCase())
  ).slice(0, 10); // Show top 10 matches

  // Enhanced blur handling with delay
  const handleInputBlur = () => {
    setTimeout(() => {
      setShowCountrySuggestions(false);
    }, 200);
  };

  // Prevent blur when clicking dropdown items
  const handleDropdownMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  // Handle nationality type change
  const handleNationalityTypeChange = (type: 'thai' | 'international') => {
    setNationalityType(type);
    
    if (type === 'thai') {
      // Auto-set to Thailand for Thai nationality
      onNationalityChange('Thailand');
      onNationalityTypeChange(true);
      setCountrySearch('');
      // Default to Thai language for Thai nationality
      onFilmLanguagesChange(['Thai']);
    } else {
      // CRITICAL FIX: When switching to 'international', immediately set parent nationality to empty
      // and clear the local country search state.
      onNationalityChange(''); // Set parent form's nationality to empty string
      onNationalityTypeChange(false);
      setCountrySearch(''); // Clear local search input
      // Default to English for international
      onFilmLanguagesChange(['English']);
    }
  };

  // Handle country selection
  const handleCountrySelect = (country: string) => {
    setCountrySearch(country);
    onNationalityChange(country);
    setShowCountrySuggestions(false);
  };

  // Handle country search input change
  const handleCountrySearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCountrySearch(value);
    onNationalityChange(value);
    setShowCountrySuggestions(true);
  };

  // Handle input focus
  const handleInputFocus = () => {
    setShowCountrySuggestions(true);
  };

  // Click outside detection
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowCountrySuggestions(false);
      }
    };

    if (showCountrySuggestions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCountrySuggestions]);

  // Sync with parent prop changes
  useEffect(() => {
    if (filmLanguages && JSON.stringify(filmLanguages) !== JSON.stringify(selectedLanguages)) {
      setSelectedLanguages(filmLanguages);
    }
  }, [filmLanguages]);

  // Initialize with Thai nationality on mount
  useEffect(() => {
    onNationalityChange('Thailand');
    onNationalityTypeChange(true);
    if (!filmLanguages || filmLanguages.length === 0) {
      const initialLanguages = ['Thai'];
      setSelectedLanguages(initialLanguages);
      onFilmLanguagesChange(initialLanguages);
    }
  }, [onNationalityChange, onNationalityTypeChange, onFilmLanguagesChange]);

  // Handle language selection
  const handleLanguageToggle = (languageValue: string) => {
    const currentLanguages = [...selectedLanguages];
    const index = currentLanguages.indexOf(languageValue);
    
    if (index > -1) {
      // Remove language
      currentLanguages.splice(index, 1);
    } else {
      // Add language
      currentLanguages.push(languageValue);
    }
    
    setSelectedLanguages(currentLanguages);
    onFilmLanguagesChange(currentLanguages);
  };

  const handleOtherLanguageToggle = () => {
    if (showOtherLanguageInput) {
      // Remove custom languages and hide input
      const standardLanguages = selectedLanguages.filter(lang => 
        majorLanguages.find(option => option.value === lang)
      );
      setSelectedLanguages(standardLanguages);
      onFilmLanguagesChange(standardLanguages);
      setShowOtherLanguageInput(false);
      setCustomLanguage('');
    } else {
      // Show input
      setShowOtherLanguageInput(true);
    }
  };

  const handleCustomLanguageAdd = () => {
    if (customLanguage.trim()) {
      const currentLanguages = [...selectedLanguages];
      // Remove any existing custom languages first
      const standardLanguages = currentLanguages.filter(lang => 
        majorLanguages.find(option => option.value === lang)
      );
      // Add the new custom language
      standardLanguages.push(customLanguage.trim());
      setSelectedLanguages(standardLanguages);
      onFilmLanguagesChange(standardLanguages);
      setCustomLanguage('');
    }
  };

  const isLanguageSelected = (languageValue: string) => {
    return selectedLanguages.includes(languageValue);
  };

  const hasCustomLanguages = () => {
    return selectedLanguages.some(lang => 
      !majorLanguages.find(option => option.value === lang)
    );
  };

  return (
    <div className={`glass-container form-section-container rounded-xl sm:rounded-2xl p-6 sm:p-8 ${className}`} style={{ overflow: 'visible' }}>
      <h3 className={`text-lg sm:text-xl ${getTypographyClass('subtitle')} text-white mb-6`}>
        🌍 {currentContent.nationalityTitle}
      </h3>
      
      {/* Nationality Type Radio Buttons */}
      <div className="mb-6 overflow-visible">
        <div className="flex flex-col sm:flex-row gap-4">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="nationalityType"
              value="thai"
              checked={nationalityType === 'thai'}
              onChange={() => handleNationalityTypeChange('thai')}
              className="w-4 h-4 text-[#FCB283] bg-white/10 border-white/20 focus:ring-[#FCB283] focus:ring-2"
            />
            <span className={`${getTypographyClass('body')} text-white flex items-center space-x-2`}>
              <span>🇹🇭</span>
              <span>{currentContent.thaiOption}</span>
            </span>
          </label>
          
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="nationalityType"
              value="international"
              checked={nationalityType === 'international'}
              onChange={() => handleNationalityTypeChange('international')}
              className="w-4 h-4 text-[#FCB283] bg-white/10 border-white/20 focus:ring-[#FCB283] focus:ring-2"
            />
            <span className={`${getTypographyClass('body')} text-white flex items-center space-x-2`}>
              <span>🌍</span>
              <span>{currentContent.internationalOption}</span>
            </span>
          </label>
        </div>
      </div>

      {/* International Country Selector */}
      {nationalityType === 'international' && (
        <div className="relative mb-6" style={{ zIndex: 1000, overflow: 'visible' }}>
          <label className={`block text-white/90 ${getTypographyClass('body')} mb-2`}>
            {currentContent.searchCountry.replace('...', '')} <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            ref={inputRef}
            value={countrySearch}
            onChange={handleCountrySearchChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder={currentContent.searchCountry}
            autoComplete="off"
            required
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-[#FCB283] focus:outline-none relative z-10"
          />
          
          {/* Country Suggestions */}
          {showCountrySuggestions && countrySearch && filteredCountries.length > 0 && (
            <div 
              ref={dropdownRef}
              className="nationality-dropdown absolute left-0 right-0 mt-1 bg-gray-900/95 backdrop-blur-lg border border-white/20 rounded-lg shadow-2xl overflow-hidden"
              style={{ 
                zIndex: 9999,
                maxHeight: '240px',
                overflowY: 'auto',
                top: '100%',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)'
              }}
            >
              {filteredCountries.map((country, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleCountrySelect(country)}
                  onMouseDown={handleDropdownMouseDown}
                  className="nationality-dropdown-item w-full text-left px-4 py-3 hover:bg-white/10 active:bg-white/20 transition-colors text-white flex items-center space-x-3 border-none focus:outline-none focus:bg-white/10"
                >
                  <span className="text-lg">{countryFlags[country] || '🏳️'}</span>
                  <span>{country}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Film Language Selector */}
      <div className="mb-6">
        <label className={`block text-white/90 ${getTypographyClass('body')} mb-2`}>
          {currentContent.filmLanguageTitle} <span className="text-red-400">*</span>
        </label>
        <p className={`text-xs ${getTypographyClass('body')} text-white/60 mb-3`}>
          {currentContent.filmLanguageDesc}
        </p>
        
        {/* Language Selection Grid - Compact Pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {majorLanguages.map((language) => (
            <button
              key={language.value}
              type="button"
              onClick={() => handleLanguageToggle(language.value)}
              className={`px-3 py-2 rounded-full border-2 transition-all duration-200 flex items-center space-x-2 ${
                isLanguageSelected(language.value)
                  ? 'bg-gradient-to-r from-[#AA4626] to-[#FCB283] border-[#FCB283] text-white shadow-lg'
                  : 'bg-white/5 border-white/20 text-white/80 hover:border-[#FCB283]/50 hover:bg-white/10'
              }`}
            >
              <span className="text-sm">{language.flag}</span>
              <span className={`text-xs ${getTypographyClass('body')} whitespace-nowrap`}>
                {language.label[currentLanguage]}
              </span>
            </button>
          ))}
          
          {/* Others Button - Pill Shape */}
          <button
            type="button"
            onClick={handleOtherLanguageToggle}
            className={`px-3 py-2 rounded-full border-2 transition-all duration-200 flex items-center space-x-2 ${
              showOtherLanguageInput || hasCustomLanguages()
                ? 'bg-gradient-to-r from-[#AA4626] to-[#FCB283] border-[#FCB283] text-white shadow-lg'
                : 'bg-white/5 border-white/20 text-white/80 hover:border-[#FCB283]/50 hover:bg-white/10'
            }`}
          >
            <span className="text-sm">🌍</span>
            <span className={`text-xs ${getTypographyClass('body')} whitespace-nowrap`}>
              {currentLanguage === 'th' ? 'อื่นๆ' : 'Others'}
            </span>
          </button>
        </div>

        {/* Custom Language Input */}
        {showOtherLanguageInput && (
          <div className="mb-4">
            <label className={`block text-white/90 ${getTypographyClass('body')} mb-2`}>
              {currentContent.addCustomLanguage}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customLanguage}
                onChange={(e) => setCustomLanguage(e.target.value)}
                placeholder={currentContent.customLanguagePlaceholder}
                className="flex-1 p-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-[#FCB283] focus:outline-none text-sm"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleCustomLanguageAdd();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleCustomLanguageAdd}
                disabled={!customLanguage.trim()}
                className="px-4 py-2 bg-[#FCB283] hover:bg-[#AA4626] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white transition-colors text-sm"
              >
                {currentLanguage === 'th' ? 'เพิ่ม' : 'Add'}
              </button>
            </div>
          </div>
        )}

        {/* Selected Languages Display */}
        {selectedLanguages && selectedLanguages.length > 0 && (
          <div className="mt-4">
            <p className={`text-white/70 ${getTypographyClass('body')} mb-2 text-sm`}>
              {currentContent.selectedLanguages}
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedLanguages.map((language) => {
                const standardLanguage = majorLanguages.find(lang => lang.value === language);
                const displayName = standardLanguage 
                  ? standardLanguage.label[currentLanguage] 
                  : language;
                const flag = standardLanguage ? standardLanguage.flag : '🌍';
                
                return (
                  <span
                    key={language}
                    className="inline-flex items-center space-x-2 px-3 py-1 bg-[#FCB283]/20 text-[#FCB283] rounded-full text-sm border border-[#FCB283]/30"
                  >
                    <span>{flag}</span>
                    <span>{displayName}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const newLanguages = selectedLanguages.filter(lang => lang !== language);
                        setSelectedLanguages(newLanguages);
                        onFilmLanguagesChange(newLanguages);
                      }}
                      className="ml-1 text-[#FCB283] hover:text-white transition-colors text-sm font-bold"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
            
            {/* Language count indicator */}
            <p className={`text-xs ${getTypographyClass('body')} text-white/50`}>
              {selectedLanguages.length} {currentLanguage === 'th' ? 'ภาษาที่เลือก' : 'languages selected'}
            </p>
          </div>
        )}
        
        {/* Language Note */}
        <div className="mt-3 p-3 bg-blue-500/10 border border-blue-400/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <div className="text-blue-400 text-sm mt-0.5">💡</div>
            <p className={`text-blue-300 ${getTypographyClass('menu')} text-sm leading-relaxed`}>
              {currentLanguage === 'th' 
                ? 'หากภาพยนตร์ของคุณใช้ภาษาอื่นที่ไม่ใช่ภาษาไทยหรือภาษาอังกฤษ กรุณาเตรียมซับไตเติลภาษาไทยหรือภาษาอังกฤษ'
                : 'If your film uses a language other than Thai or English, please prepare Thai or English subtitles'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NationalitySelector;
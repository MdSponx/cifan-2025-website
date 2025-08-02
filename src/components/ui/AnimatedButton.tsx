import React from 'react';

interface AnimatedButtonProps {
  type?: 'button' | 'submit' | 'reset';
  variant: 'primary' | 'secondary' | 'outline';
  size: 'small' | 'medium' | 'large';
  icon?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ 
  type = 'button',
  variant, 
  size, 
  icon, 
  children, 
  className = '',
  onClick 
}) => {
  const baseClasses = "relative overflow-hidden font-medium transition-all duration-300 transform hover:scale-105 active:scale-95";
  
  const variantClasses = {
    primary: "glass-button-primary text-white shadow-lg hover:shadow-[#AA4626]/30 menu-en",
    secondary: "glass-button-secondary text-[#FCB283] hover:text-white border border-[#3B6891]/40 hover:border-[#FCB283]/60 menu-en",
    outline: "glass-button border-2 border-white/30 text-white hover:border-[#FCB283] hover:bg-white/10 menu-en"
  };

  const sizeClasses = {
    small: "px-3 py-2 text-xs sm:text-sm rounded-lg sm:px-4",
    medium: "px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-base rounded-lg sm:rounded-xl",
    large: "px-6 py-3 text-base sm:px-8 sm:py-4 sm:text-lg rounded-xl sm:rounded-2xl"
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent form submission for type="button"
    if (type === 'button') {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (onClick) {
      onClick(e);
    }
  };
  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={handleClick}
    >
      <span className="relative z-10 flex items-center justify-center space-x-2">
        {icon && <span>{icon}</span>}
        <span>{children}</span>
      </span>
      
      {/* Shine effect for primary buttons */}
      {variant === 'primary' && (
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>
        </div>
      )}
    </button>
  );
};

export default AnimatedButton;
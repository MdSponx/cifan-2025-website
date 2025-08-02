import React from 'react';

interface ErrorMessageProps {
  error?: string;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, className = '' }) => {
  if (!error) return null;
  
  return (
    <div className={`text-red-400 text-sm mt-1 ${className}`}>
      {error}
    </div>
  );
};

export default ErrorMessage;

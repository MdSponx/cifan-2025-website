import React, { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessAnimationProps {
  show: boolean;
  title: string;
  message: string;
  onComplete?: () => void;
  duration?: number;
}

const SuccessAnimation: React.FC<SuccessAnimationProps> = ({
  show,
  title,
  message,
  onComplete,
  duration = 2000
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    if (show && !hasCompleted) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 100);
      
      // Single animation cycle then complete
      setTimeout(() => {
        setIsAnimating(false);
        setHasCompleted(true);
        setTimeout(() => {
          setIsVisible(false);
          if (onComplete) {
            onComplete();
          }
        }, 300);
      }, duration);
    }
  }, [show, duration, onComplete, hasCompleted]);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
      isAnimating ? 'opacity-100' : 'opacity-0'
    }`}>
      <div className={`glass-container rounded-2xl p-8 text-center max-w-md mx-auto transform transition-all duration-500 ${
        isAnimating ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
      }`}>
        
        {/* Animated Success Icon */}
        <div className="relative mb-6">
          <div className={`w-20 h-20 mx-auto rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center transition-all duration-700 ${
            isAnimating ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
          }`}>
            <CheckCircle className={`w-10 h-10 text-green-400 transition-all duration-500 delay-300 ${
              isAnimating ? 'scale-100' : 'scale-0'
            }`} />
          </div>
          
          {/* Ripple Effect */}
          <div className={`absolute inset-0 rounded-full border-2 border-green-400 transition-all duration-1000 ${
            isAnimating ? 'scale-150 opacity-0' : 'scale-100 opacity-100'
          }`}></div>
        </div>

        {/* Success Text */}
        <div className={`transition-all duration-500 delay-500 ${
          isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <h2 className="text-2xl font-bold text-green-400 mb-3">
            {title}
          </h2>
          <p className="text-white/80 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Animated Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 bg-green-400 rounded-full transition-all duration-1000 ${
                isAnimating ? 'opacity-0' : 'opacity-100'
              }`}
              style={{
                left: `${20 + (i * 12)}%`,
                top: `${30 + (i % 2) * 40}%`,
                transform: isAnimating ? `translate(${(i % 2 ? 1 : -1) * 100}px, ${(i % 2 ? -1 : 1) * 100}px) scale(0)` : 'translate(0, 0) scale(1)',
                transitionDelay: `${i * 100}ms`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuccessAnimation;
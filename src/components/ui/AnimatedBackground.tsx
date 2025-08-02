import React from 'react';

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Gradient Blobs */}
      <div className="gradient-blob blob-1"></div>
      <div className="gradient-blob blob-2"></div>
      <div className="gradient-blob blob-3"></div>
      <div className="gradient-blob blob-4"></div>
      
      {/* Additional floating elements */}
      <div className="gradient-blob blob-special-1"></div>
      <div className="gradient-blob blob-special-2"></div>
    </div>
  );
};

export default AnimatedBackground;
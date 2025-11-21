// ComingSoon.jsx
import React from 'react';

const ComingSoon = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      </div>

      {/* Main Text */}
      <div className="relative z-10 text-center px-4">
        <div className="mt-8 md:mt-12">
          <span className="inline-block text-8xl font-black text-white relative">
            COMING
            <span className="absolute -inset-2 bg-cyan-500 opacity-50 blur-3xl -z-10 animate-pulse"></span>
          </span>
          <span className="inline-block ml-8 md:ml-12 text-8xl font-black bg-clip-text text-transparent bg-gradient-to-br from-pink-500 to-purple-600 animate-gradient-fast">
            SOON
          </span>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
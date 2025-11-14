'use client';

import React from 'react';
import ThemeSwitch from './ThemeSwitch';

const FloatingThemeSwitch: React.FC = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="scale-75 hover:scale-90 transition-transform duration-200 drop-shadow-lg">
        <ThemeSwitch />
      </div>
    </div>
  );
};

export default FloatingThemeSwitch;


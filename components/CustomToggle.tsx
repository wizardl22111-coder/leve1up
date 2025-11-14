'use client';

import React, { useState } from 'react';

interface CustomToggleProps {
  label?: string;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
}

const CustomToggle: React.FC<CustomToggleProps> = ({
  label,
  defaultChecked = false,
  onChange,
  className = '',
  disabled = false
}) => {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  const handleToggle = () => {
    if (disabled) return;
    
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    
    if (onChange) {
      onChange(newChecked);
    }
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {label && (
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {label}
        </span>
      )}
      
      <label className={`relative inline-flex items-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
        <input 
          className="sr-only peer" 
          type="checkbox" 
          checked={isChecked}
          onChange={handleToggle}
          disabled={disabled}
        />
        <div 
          className={`
            peer ring-2 ring-gray-500 
            ${isChecked 
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-900' 
              : 'bg-gradient-to-r from-rose-400 to-red-900'
            }
            rounded-full outline-none duration-500 
            after:duration-300 w-20 h-8 shadow-inner 
            shadow-gray-900 
            peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-500  
            after:content-[''] after:rounded-full after:absolute 
            after:outline-none after:h-12 after:w-12 
            after:bg-gray-900 after:-top-2 after:-left-2 
            after:flex after:justify-center after:items-center 
            after:border-4 after:border-gray-500
            ${isChecked ? 'after:translate-x-14' : ''}
            transition-all duration-300 ease-in-out
            hover:shadow-lg
            ${disabled ? 'pointer-events-none' : ''}
          `}
        />
      </label>
    </div>
  );
};

export default CustomToggle;

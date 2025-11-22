'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { supportedCountries, getDefaultCountry, type Country } from '@/lib/tax';

interface CountrySelectorProps {
  selectedCountry: Country;
  onCountryChange: (country: Country) => void;
  className?: string;
}

export default function CountrySelector({ 
  selectedCountry, 
  onCountryChange, 
  className = '' 
}: CountrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.country-selector')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCountrySelect = (country: Country) => {
    onCountryChange(country);
    setIsOpen(false);
  };

  return (
    <div className={`relative country-selector ${className}`}>
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        <Globe className="w-4 h-4 inline-block ml-1" />
        الدولة / المنطقة
      </label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-right hover:border-primary-500 dark:hover:border-primary-400 focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 transition-colors flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{selectedCountry.flag}</span>
          <span className="font-medium">{selectedCountry.nameAr}</span>
          {selectedCountry.vatRate > 0 && (
            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
              ضريبة {selectedCountry.vatRate}%
            </span>
          )}
        </div>
        <ChevronDown 
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {supportedCountries.map((country) => (
            <button
              key={country.code}
              type="button"
              onClick={() => handleCountrySelect(country)}
              className={`w-full px-4 py-3 text-right hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center justify-between ${
                selectedCountry.code === country.code 
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' 
                  : 'text-gray-900 dark:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{country.flag}</span>
                <div className="text-right">
                  <div className="font-medium">{country.nameAr}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {country.name}
                  </div>
                </div>
              </div>
              <div className="text-left">
                {country.vatRate > 0 ? (
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                    ضريبة {country.vatRate}%
                  </span>
                ) : (
                  <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                    معفى
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* نص توضيحي */}
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        اختر دولتك لحساب الضرائب المطبقة بدقة
      </p>
    </div>
  );
}

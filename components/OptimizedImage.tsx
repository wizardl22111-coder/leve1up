'use client';

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;
  showBackground?: boolean;
  backgroundType?: 'gradient' | 'solid' | 'none';
  backgroundColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
  rounded?: boolean;
  loading?: 'lazy' | 'eager';
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  objectFit = 'contain',
  objectPosition = 'center',
  showBackground = true,
  backgroundType = 'gradient',
  backgroundColor = '#f8fafc',
  gradientFrom = 'gray-50',
  gradientTo = 'gray-100',
  rounded = false,
  loading = 'lazy',
  quality = 85,
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  onError
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // تحديد نوع الخلفية
  const getBackgroundClass = () => {
    if (!showBackground) return '';
    
    switch (backgroundType) {
      case 'gradient':
        return `bg-gradient-to-br from-${gradientFrom} to-${gradientTo}`;
      case 'solid':
        return backgroundColor ? `bg-[${backgroundColor}]` : 'bg-gray-100';
      case 'none':
      default:
        return '';
    }
  };

  // تحديد object-fit
  const getObjectFitClass = () => {
    switch (objectFit) {
      case 'contain':
        return 'object-contain';
      case 'cover':
        return 'object-cover';
      case 'fill':
        return 'object-fill';
      case 'none':
        return 'object-none';
      case 'scale-down':
        return 'object-scale-down';
      default:
        return 'object-contain';
    }
  };

  // تحديد object-position
  const getObjectPositionClass = () => {
    if (objectPosition === 'center') return 'object-center';
    if (objectPosition === 'top') return 'object-top';
    if (objectPosition === 'bottom') return 'object-bottom';
    if (objectPosition === 'left') return 'object-left';
    if (objectPosition === 'right') return 'object-right';
    return 'object-center';
  };

  // دالة معالجة تحميل الصورة
  const handleLoad = () => {
    setImageLoaded(true);
    if (onLoad) onLoad();
  };

  // دالة معالجة خطأ الصورة
  const handleError = () => {
    setImageError(true);
    if (onError) onError();
  };

  // تجميع الكلاسات
  const imageClasses = [
    getObjectFitClass(),
    getObjectPositionClass(),
    'transition-all duration-300',
    className
  ].filter(Boolean).join(' ');

  const containerClasses = [
    'relative overflow-hidden',
    getBackgroundClass(),
    rounded ? 'rounded-lg' : '',
    'flex items-center justify-center'
  ].filter(Boolean).join(' ');

  // في حالة خطأ في تحميل الصورة
  if (imageError) {
    return (
      <div className={`${containerClasses} ${fill ? 'w-full h-full' : ''}`} style={{ width, height }}>
        <div className="flex flex-col items-center justify-center text-gray-400 p-4">
          <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs text-center">فشل تحميل الصورة</span>
        </div>
      </div>
    );
  }

  // عرض الصورة العادي
  if (fill) {
    return (
      <div className={containerClasses}>
        <Image
          src={src}
          alt={alt}
          fill
          className={imageClasses}
          priority={priority}
          sizes={sizes}
          loading={loading}
          quality={quality}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          onLoad={handleLoad}
          onError={handleError}
        />
        {/* طبقة تحميل */}
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-primary-500 rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={containerClasses} style={{ width, height }}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={imageClasses}
        priority={priority}
        sizes={sizes}
        loading={loading}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onLoad={handleLoad}
        onError={handleError}
      />
      {/* طبقة تحميل */}
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-primary-500 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}

// مكونات مساعدة لحالات استخدام محددة
export function ProductImage({ src, alt, className = '', ...props }: Omit<OptimizedImageProps, 'objectFit' | 'showBackground'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={className}
      objectFit="contain"
      showBackground={true}
      backgroundType="gradient"
      gradientFrom="gray-50"
      gradientTo="gray-100"
      rounded={true}
      {...props}
    />
  );
}

export function BannerImage({ src, alt, className = '', ...props }: Omit<OptimizedImageProps, 'objectFit' | 'objectPosition'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={className}
      objectFit="cover"
      objectPosition="center"
      showBackground={false}
      {...props}
    />
  );
}

export function LogoImage({ src, alt, className = '', ...props }: Omit<OptimizedImageProps, 'objectFit' | 'showBackground'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={className}
      objectFit="contain"
      showBackground={false}
      {...props}
    />
  );
}

export function AvatarImage({ src, alt, className = '', ...props }: Omit<OptimizedImageProps, 'objectFit' | 'rounded'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={`rounded-full ${className}`}
      objectFit="cover"
      showBackground={true}
      backgroundType="solid"
      backgroundColor="#e5e7eb"
      {...props}
    />
  );
}


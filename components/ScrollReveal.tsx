'use client';

import { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
  once?: boolean;
  disabled?: boolean; // إضافة خيار لتعطيل الأنيميشن
}

export default function ScrollReveal({
  children,
  delay = 0,
  duration = 800,
  distance = 60,
  direction = 'up',
  className = '',
  once = true,
  disabled = false // افتراضياً مفعل
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(disabled); // إذا كان معطل، اظهر فوراً
  const [hasAnimated, setHasAnimated] = useState(disabled);
  const elementRef = useRef<HTMLDivElement>(null);

  // إصلاح للصور: إظهار فوري إذا كان العنصر يحتوي على صور
  const [hasImages, setHasImages] = useState(false);
  const [forceVisible, setForceVisible] = useState(false);

  useEffect(() => {
    // فحص إذا كان العنصر يحتوي على صور
    if (elementRef.current) {
      const images = elementRef.current.querySelectorAll('img, [role="img"]');
      if (images.length > 0) {
        setHasImages(true);
        // إظهار الصور فوراً بعد 500ms
        setTimeout(() => {
          setForceVisible(true);
        }, 500);
      }
    }
  }, []);

  // إذا كان الأنيميشن معطل، لا تفعل شيء
  if (disabled) {
    return <div className={className}>{children}</div>;
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!once || !hasAnimated)) {
          setTimeout(() => {
            setIsVisible(true);
            if (once) setHasAnimated(true);
          }, delay);
        } else if (!once && !entry.isIntersecting) {
          setIsVisible(false);
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [delay, once, hasAnimated]);

  const getTransform = () => {
    if (isVisible) return 'translate3d(0, 0, 0)';
    
    switch (direction) {
      case 'up':
        return `translate3d(0, ${distance}px, 0)`;
      case 'down':
        return `translate3d(0, -${distance}px, 0)`;
      case 'left':
        return `translate3d(${distance}px, 0, 0)`;
      case 'right':
        return `translate3d(-${distance}px, 0, 0)`;
      default:
        return `translate3d(0, ${distance}px, 0)`;
    }
  };

  // استخدام الحل الاحتياطي للصور أو الرؤية العادية
  const shouldShow = isVisible || forceVisible || (hasImages && forceVisible);

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        opacity: shouldShow ? 1 : 0,
        transform: shouldShow ? 'translate3d(0, 0, 0)' : getTransform(),
        transition: `all ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
        willChange: 'transform, opacity'
      }}
    >
      {children}
    </div>
  );
}

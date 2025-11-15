'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface UseLoadingAnimationOptions {
  duration?: number;
  message?: string;
}

export const useLoadingAnimation = (options: UseLoadingAnimationOptions = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const { duration = 2500, message = 'جاري التحميل...' } = options;

  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const navigateWithLoading = useCallback((path: string, customDuration?: number) => {
    setIsLoading(true);
    
    setTimeout(() => {
      router.push(path);
      setIsLoading(false);
    }, customDuration || duration);
  }, [router, duration]);

  const executeWithLoading = useCallback(async (
    action: () => Promise<void> | void,
    customDuration?: number
  ) => {
    setIsLoading(true);
    
    try {
      await action();
      
      // إضافة تأخير إضافي للتأثير البصري
      setTimeout(() => {
        setIsLoading(false);
      }, customDuration || duration);
    } catch (error) {
      console.error('Error during loading action:', error);
      setIsLoading(false);
    }
  }, [duration]);

  return {
    isLoading,
    message,
    startLoading,
    stopLoading,
    navigateWithLoading,
    executeWithLoading
  };
};


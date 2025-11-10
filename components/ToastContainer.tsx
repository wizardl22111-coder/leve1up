"use client";

import { toast } from "../hooks/use-toast";

export const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  toast({
    title: type === 'success' ? 'نجح' : type === 'error' ? 'خطأ' : 'معلومات',
    description: message,
    variant: type === 'error' ? 'destructive' : 'default',
  });
};

export const ToastContainer = () => {
  return null; // The toast system is handled by the Toaster component
};


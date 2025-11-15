'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoadingAnimationProps {
  isLoading: boolean;
  duration?: number;
  message?: string;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  isLoading,
  duration = 2500,
  message = 'جاري التحميل...'
}) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700"
          >
            <div className="flex flex-col items-center gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="w-12 h-12 text-primary-600 dark:text-primary-400" />
              </motion.div>
              
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {message}
                </h3>
                <div className="flex gap-1 justify-center">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-primary-600 dark:bg-primary-400 rounded-full"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingAnimation;


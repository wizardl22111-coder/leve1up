'use client';

import React, { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Check, AlertCircle } from 'lucide-react';

interface ProductImage {
  id: string;
  url: string;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
}

interface ProductImageManagerProps {
  productId?: string;
  existingImages?: ProductImage[];
  onImagesChange?: (images: ProductImage[]) => void;
  maxImages?: number;
  maxFileSize?: number; // in MB
  allowedTypes?: string[];
}

export default function ProductImageManager({
  productId,
  existingImages = [],
  onImagesChange,
  maxImages = 10,
  maxFileSize = 5,
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
}: ProductImageManagerProps) {
  const [images, setImages] = useState<ProductImage[]>(existingImages);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle file validation
  const validateFile = (file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return `نوع الملف غير مدعوم. الأنواع المدعومة: ${allowedTypes.map(type => type.split('/')[1]).join(', ')}`;
    }
    
    if (file.size > maxFileSize * 1024 * 1024) {
      return `حجم الملف كبير جداً. الحد الأقصى: ${maxFileSize}MB`;
    }
    
    if (images.length >= maxImages) {
      return `تم الوصول للحد الأقصى من الصور (${maxImages})`;
    }
    
    return null;
  };

  // Handle file upload
  const handleFileUpload = useCallback(async (files: FileList) => {
    setError(null);
    setUploading(true);

    try {
      const newImages: ProductImage[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const validationError = validateFile(file);
        
        if (validationError) {
          setError(validationError);
          continue;
        }

        // Create object URL for preview
        const url = URL.createObjectURL(file);
        
        const newImage: ProductImage = {
          id: `${Date.now()}-${i}`,
          url,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadDate: new Date()
        };
        
        newImages.push(newImage);
      }

      if (newImages.length > 0) {
        const updatedImages = [...images, ...newImages];
        setImages(updatedImages);
        onImagesChange?.(updatedImages);
      }
    } catch (err) {
      setError('حدث خطأ أثناء رفع الصور');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  }, [images, maxImages, maxFileSize, allowedTypes, onImagesChange]);

  // Handle drag and drop
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  }, [handleFileUpload]);

  // Handle file input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files);
    }
  };

  // Remove image
  const removeImage = (imageId: string) => {
    const updatedImages = images.filter(img => img.id !== imageId);
    setImages(updatedImages);
    onImagesChange?.(updatedImages);
    
    // Revoke object URL to prevent memory leaks
    const imageToRemove = images.find(img => img.id === imageId);
    if (imageToRemove && imageToRemove.url.startsWith('blob:')) {
      URL.revokeObjectURL(imageToRemove.url);
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">إدارة صور المنتجات</h3>
        <div className="text-sm text-gray-400">
          {images.length} / {maxImages} صور
        </div>
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          dragActive
            ? 'border-primary-400 bg-primary-500/10'
            : 'border-gray-600 hover:border-gray-500'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept={allowedTypes.join(',')}
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading || images.length >= maxImages}
        />
        
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
            {uploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400"></div>
            ) : (
              <Upload className="w-8 h-8 text-gray-400" />
            )}
          </div>
          
          <div>
            <p className="text-lg font-semibold text-white mb-2">
              {uploading ? 'جاري رفع الصور...' : 'اسحب الصور هنا أو انقر للاختيار'}
            </p>
            <p className="text-sm text-gray-400">
              الأنواع المدعومة: JPG, PNG, WebP, GIF | الحد الأقصى: {maxFileSize}MB لكل صورة
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="mr-auto text-red-400 hover:text-red-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">الصور المرفوعة</h4>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="relative group bg-dark-400 rounded-lg overflow-hidden border border-gray-600 hover:border-gray-500 transition-all duration-300"
              >
                {/* Image Preview */}
                <div className="relative aspect-square bg-black">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-full object-contain object-center"
                    style={{ 
                      display: 'block',
                      visibility: 'visible',
                      opacity: 1
                    }}
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button
                      onClick={() => removeImage(image.id)}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Image Info */}
                <div className="p-3 space-y-1">
                  <p className="text-sm font-medium text-white truncate" title={image.name}>
                    {image.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatFileSize(image.size)}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-green-400">
                    <Check className="w-3 h-3" />
                    <span>تم الرفع</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Guidelines */}
      <div className="bg-dark-400/50 rounded-lg p-4 space-y-2">
        <h5 className="font-semibold text-white flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          إرشادات الصور
        </h5>
        <ul className="text-sm text-gray-400 space-y-1">
          <li>• استخدم صور عالية الجودة (1080x1080 أو أكبر)</li>
          <li>• تأكد من وضوح النصوص والتفاصيل في الصورة</li>
          <li>• استخدم خلفية شفافة أو بيضاء للحصول على أفضل نتيجة</li>
          <li>• تجنب الصور المضغوطة بشدة أو ذات الجودة المنخفضة</li>
          <li>• الصورة الأولى ستكون الصورة الرئيسية للمنتج</li>
        </ul>
      </div>
    </div>
  );
}

// Export types for use in other components
export type { ProductImage, ProductImageManagerProps };

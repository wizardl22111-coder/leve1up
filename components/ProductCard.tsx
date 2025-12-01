'use client';

import { Star, ShoppingCart } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { showToast } from '@/components/ToastContainer';
import { calculatePrice } from '@/lib/currency';
import Link from 'next/link';
import Image from 'next/image';
import PriceDisplay from './PriceDisplay';

interface ProductCardProps {
  product: {
    id: number;
    title: string;
    image: string;
    price: number;
    originalPrice?: number;
    currency: string;
    badge?: string;
    badgeColor?: string;
    category: string;
    rating: number;
    link: string;
  };
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

export default function ProductCard({ product, className = '', size = 'medium' }: ProductCardProps) {
  const { currency, addToCart } = useApp();

  // Size configurations
  const sizeConfig = {
    small: {
      container: 'p-3',
      image: 'aspect-[4/3]',
      title: 'text-sm font-semibold line-clamp-2',
      badge: 'text-xs px-2 py-1',
      rating: 'text-xs',
      button: 'p-2'
    },
    medium: {
      container: 'p-4',
      image: 'aspect-[4/3]',
      title: 'text-base font-bold line-clamp-2',
      badge: 'text-xs px-2.5 py-1',
      rating: 'text-sm',
      button: 'p-2.5'
    },
    large: {
      container: 'p-6',
      image: 'aspect-[4/3]',
      title: 'text-lg font-bold line-clamp-2',
      badge: 'text-sm px-3 py-1.5',
      rating: 'text-base',
      button: 'p-3'
    }
  };

  const config = sizeConfig[size];

  // Calculate price using the existing system
  const productForCalc = {
    price: product.price,
    originalPrice: product.originalPrice || product.price,
    currency: product.currency
  };
  const priceCalc = calculatePrice(productForCalc, currency);

  const handleAddToCart = (e: React.MouseEvent) => {
    console.log('🛒 ProductCard: Add to Cart clicked!', product.title);
    e.preventDefault();
    e.stopPropagation();
    
    try {
      console.log('🔍 ProductCard: Product data:', {
        id: product.id,
        title: product.title,
        finalPrice: priceCalc.finalPrice,
        addToCart: typeof addToCart
      });
      
      addToCart({
        id: product.id,
        name: product.title,
        price: priceCalc.finalPrice,
        image: product.image
      });
      
      console.log('📢 ProductCard: Showing toast notification');
      showToast(`تمت إضافة ${product.title} إلى السلة! 🛒`, 'cart');
      console.log('✅ ProductCard: Add to cart completed successfully');
    } catch (error) {
      console.error('❌ ProductCard: Error in handleAddToCart:', error);
    }
  };

  return (
    <Link href={product.link} className={`block ${className}`}>
      <div className="bg-gradient-to-br from-dark-300/80 to-dark-400/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-primary-300/10 hover:border-primary-300/30 transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full group">
        
        {/* Product Image */}
        <div className={`relative overflow-hidden rounded-t-2xl ${config.image}`}>
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
          
          {/* Badge */}
          {product.badge && (
            <div className="absolute top-3 right-3">
              <span className={`inline-block ${config.badge} rounded-lg font-medium border ${product.badgeColor || 'bg-primary-500/20 text-primary-300 border-primary-500/30'}`}>
                {product.badge}
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className={`${config.container} flex-1 flex flex-col`}>
          
          {/* Product Title */}
          <h3 className={`text-white mb-2 hover:text-primary-300 transition-colors duration-200 ${config.title}`}>
            {product.title}
          </h3>

          {/* Rating */}
          <div className={`flex items-center gap-2 mb-3 ${config.rating}`}>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-400">
              ({product.rating})
            </span>
          </div>

          {/* Price */}
          <div className="mb-4 mt-auto">
            <PriceDisplay 
              amount={priceCalc.finalPrice}
              oldPrice={priceCalc.originalPrice > priceCalc.finalPrice ? priceCalc.originalPrice : undefined}
              currency={currency}
              className="text-lg font-bold"
            />
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className={`w-full bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white ${config.button} rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>إضافة للسلة</span>
          </button>
        </div>
      </div>
    </Link>
  );
}

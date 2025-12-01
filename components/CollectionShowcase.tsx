'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import ProductCarousel from './ProductCarousel';
import ProductCard from './ProductCard';
import ScrollReveal from './ScrollReveal';

interface CollectionShowcaseProps {
  collection: {
    id: string;
    title: string;
    subtitle: string;
    slug: string;
    heroImage: string;
    heroImageAlt: string;
    excerpt: string;
    ctaText: string;
    ctaLink: string;
    backgroundColor: string;
    badgeText: string;
    badgeColor: string;
    items: Array<{
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
    }>;
  };
  className?: string;
  layout?: 'horizontal' | 'vertical';
}

export default function CollectionShowcase({ 
  collection, 
  className = '',
  layout = 'horizontal'
}: CollectionShowcaseProps) {

  return (
    <section className={`py-12 sm:py-16 lg:py-20 ${className}`}>
      <div className="container-mobile">
        
        {/* Hero Banner */}
        <ScrollReveal delay={0} duration={800}>
          <div className={`relative rounded-3xl overflow-hidden mb-12 sm:mb-16 bg-gradient-to-br ${collection.backgroundColor} backdrop-blur-sm border border-primary-300/10`}>
            
            {/* Background Image */}
            <div className="absolute inset-0 opacity-20">
              <Image
                src={collection.heroImage}
                alt={collection.heroImageAlt}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                priority={false}
              />
            </div>

            {/* Content */}
            <div className="relative z-10 p-8 sm:p-12 lg:p-16">
              <div className="max-w-4xl">
                
                {/* Badge */}
                <div className="mb-6">
                  <span className={`inline-block px-4 py-2 rounded-xl text-sm font-bold border ${collection.badgeColor}`}>
                    {collection.badgeText}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
                  {collection.title}
                </h2>
                
                <p className="text-lg sm:text-xl text-gray-300 mb-6 leading-relaxed max-w-2xl">
                  {collection.subtitle}
                </p>

                {/* Description */}
                <p className="text-base sm:text-lg text-gray-400 mb-8 leading-relaxed max-w-3xl">
                  {collection.excerpt}
                </p>

                {/* CTA Button */}
                <Link
                  href={collection.ctaLink}
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group"
                >
                  <span>{collection.ctaText}</span>
                  <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary-400/10 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-accent-400/10 to-transparent rounded-full blur-3xl"></div>
          </div>
        </ScrollReveal>

        {/* Products Section */}
        <ScrollReveal delay={200} duration={800}>
          <div className="mb-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  المنتجات المميزة
                </h3>
                <p className="text-gray-400 text-base sm:text-lg">
                  اكتشف أفضل المنتجات في هذه الفئة
                </p>
              </div>
              
              {/* View All Link */}
              <Link
                href={collection.ctaLink}
                className="hidden sm:inline-flex items-center gap-2 text-primary-300 hover:text-primary-200 font-medium transition-colors duration-300 group"
              >
                <span>عرض الكل</span>
                <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
              </Link>
            </div>

            {/* Products Display */}
            {layout === 'horizontal' ? (
              // Horizontal Carousel Layout
              <ProductCarousel 
                products={collection.items}
                cardSize="medium"
                className="mb-8"
              />
            ) : (
              // Vertical Grid Layout
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {collection.items.map((product, index) => (
                  <ScrollReveal
                    key={product.id}
                    delay={index * 100}
                    duration={600}
                    distance={40}
                    direction="up"
                  >
                    <ProductCard 
                      product={product}
                      size="medium"
                      className="h-full"
                    />
                  </ScrollReveal>
                ))}
              </div>
            )}

            {/* Mobile View All Button */}
            <div className="sm:hidden text-center">
              <Link
                href={collection.ctaLink}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-700/50 to-gray-600/50 hover:from-gray-600/60 hover:to-gray-500/60 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border border-gray-600/40 hover:border-gray-500/60"
              >
                <span>عرض جميع المنتجات</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

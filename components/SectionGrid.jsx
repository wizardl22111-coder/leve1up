'use client';

import ProductCard from './ProductCard';

/**
 * SectionGrid Component
 * 
 * @param {Object} props
 * @param {string} props.title - Section title
 * @param {Array} props.items - Array of product items
 */
export default function SectionGrid({ title, items }) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {title}
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {items.map((item, index) => (
            <div 
              key={item.id || index}
              className="animate-fade-in-up"
              style={{ 
                animationDelay: `${index * 0.1}s`,
                animationFillMode: 'both'
              }}
            >
              <ProductCard
                id={item.id}
                title={item.title}
                excerpt={item.excerpt}
                image={item.image}
                price={item.price}
                href={item.href}
                badge={item.badge}
              />
            </div>
          ))}
        </div>

        {/* View All Button */}
        {items.length >= 4 && (
          <div className="text-center mt-12">
            <button className="inline-flex items-center px-8 py-3 bg-transparent border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 font-semibold rounded-lg hover:bg-blue-600 hover:text-white dark:hover:bg-blue-400 dark:hover:text-gray-900 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50">
              عرض المزيد
              <svg 
                className="mr-2 h-5 w-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 19l-7-7 7-7" 
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
    </section>
  );
}

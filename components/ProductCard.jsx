import Image from 'next/image';
import Link from 'next/link';

/**
 * ProductCard Component
 * 
 * @param {Object} props
 * @param {number} props.id - Product ID
 * @param {string} props.title - Product title
 * @param {string} props.excerpt - Product description/excerpt
 * @param {string} props.image - Product image path
 * @param {number} props.price - Product price
 * @param {string} props.href - Product link
 * @param {string} [props.badge] - Optional badge text
 */
export default function ProductCard({ 
  id, 
  title, 
  excerpt, 
  image, 
  price, 
  href, 
  badge 
}) {
  return (
    <Link 
      href={href}
      className="group block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
      aria-label={`عرض تفاصيل ${title} - ${price} ريال`}
    >
      <article className="h-full">
        {/* Image Container */}
        <div className="relative bg-black overflow-hidden h-48 md:h-56 lg:h-64 rounded-t-lg">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          
          {/* Badge */}
          {badge && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                {badge}
              </span>
            </div>
          )}
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
            {title}
          </h3>
          
          {/* Excerpt */}
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
            {excerpt}
          </p>
          
          {/* Price and Action */}
          <div className="flex items-center justify-between">
            {price && (
              <div className="text-right">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {price}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 mr-1">
                  ريال
                </span>
              </div>
            )}
            
            {/* View Button */}
            <div className="flex items-center text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">
              <span className="text-sm font-medium ml-2">عرض التفاصيل</span>
              <svg 
                className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform duration-300" 
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
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

/* CSS for line-clamp utility classes */

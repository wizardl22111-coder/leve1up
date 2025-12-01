'use client';

import CollectionShowcase from './CollectionShowcase';
import { collectionsData } from '@/data/collections-sections';

interface SectionsReplaceProps {
  className?: string;
  sections?: ('editingTools' | 'subscriptions')[];
  layout?: 'horizontal' | 'vertical';
}

export default function SectionsReplace({ 
  className = '',
  sections = ['editingTools', 'subscriptions'],
  layout = 'horizontal'
}: SectionsReplaceProps) {

  return (
    <div className={`bg-dark-500 ${className}`}>
      {sections.map((sectionKey, index) => {
        const collection = collectionsData[sectionKey];
        
        if (!collection) {
          console.warn(`Collection "${sectionKey}" not found in collectionsData`);
          return null;
        }

        return (
          <CollectionShowcase
            key={collection.id}
            collection={collection}
            layout={layout}
            className={index === sections.length - 1 ? '' : 'border-b border-gray-800/50'}
          />
        );
      })}
    </div>
  );
}

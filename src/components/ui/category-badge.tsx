
import { cn } from '@/lib/utils';
import { Category } from '@/lib/types';
import React from 'react';

interface CategoryBadgeProps {
  category: Category | null;
  className?: string;
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  if (!category) return null;
  
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-all',
        className
      )}
      style={{
        backgroundColor: `${category.color}20`, // 20% opacity
        color: category.color,
        borderColor: `${category.color}30`, // 30% opacity
      }}
    >
      {category.name}
    </div>
  );
}

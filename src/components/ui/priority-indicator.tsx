
import { cn } from '@/lib/utils';
import { getPriorityColor, getPriorityLabel } from '@/lib/store';
import { Priority } from '@/lib/types';
import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon } from 'lucide-react';
import React from 'react';

interface PriorityIndicatorProps {
  priority: Priority;
  showIcon?: boolean;
  showLabel?: boolean;
  className?: string;
}

export function PriorityIndicator({
  priority,
  showIcon = true,
  showLabel = true,
  className,
}: PriorityIndicatorProps) {
  const iconMap = {
    low: ArrowDownIcon,
    medium: ArrowRightIcon,
    high: ArrowUpIcon,
  };
  
  const Icon = iconMap[priority];
  
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-all',
        getPriorityColor(priority),
        className
      )}
    >
      {showIcon && <Icon className="h-3 w-3" />}
      {showLabel && <span>{getPriorityLabel(priority)}</span>}
    </div>
  );
}

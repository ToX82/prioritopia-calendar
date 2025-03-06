
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CalendarIcon, ListIcon, PlusIcon } from 'lucide-react';
import React from 'react';

interface EmptyStateProps {
  type: 'tasks' | 'calendar' | 'category';
  title?: string;
  description?: string;
  showAddButton?: boolean;
  onAddClick?: () => void;
  className?: string;
}

export function EmptyState({
  type,
  title,
  description,
  showAddButton = true,
  onAddClick,
  className,
}: EmptyStateProps) {
  const iconMap = {
    tasks: ListIcon,
    calendar: CalendarIcon,
    category: PlusIcon,
  };
  
  const Icon = iconMap[type];
  
  const defaultTitles = {
    tasks: 'No tasks yet',
    calendar: 'No tasks for this day',
    category: 'No categories yet',
  };
  
  const defaultDescriptions = {
    tasks: 'Get started by creating a new task',
    calendar: 'Tasks will appear here when scheduled for this day',
    category: 'Create categories to organize your tasks',
  };
  
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center',
        className
      )}
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-medium">{title || defaultTitles[type]}</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {description || defaultDescriptions[type]}
      </p>
      {showAddButton && (
        <Button
          onClick={onAddClick}
          size="sm"
          className="mt-4"
        >
          <PlusIcon className="mr-1 h-4 w-4" />
          <span>Add {type === 'category' ? 'Category' : 'Task'}</span>
        </Button>
      )}
    </div>
  );
}

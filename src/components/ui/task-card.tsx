
import { cn } from '@/lib/utils';
import { formatRelativeDate } from '@/lib/date-utils';
import { getCategory } from '@/lib/store';
import { Task } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import { CategoryBadge } from './category-badge';
import { PriorityIndicator } from './priority-indicator';
import { StatusBadge } from './status-badge';
import { CalendarIcon } from 'lucide-react';
import React from 'react';
import { motion } from 'framer-motion';

interface TaskCardProps {
  task: Task;
  onToggleComplete?: (taskId: string) => void;
  onClick?: (taskId: string) => void;
  className?: string;
}

export function TaskCard({
  task,
  onToggleComplete,
  onClick,
  className,
}: TaskCardProps) {
  const category = getCategory(task.categoryId);
  
  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleComplete?.(task.id);
  };
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'flex cursor-pointer flex-col gap-2 rounded-lg border bg-card p-4 shadow-sm task-card',
        task.completed && 'opacity-70',
        className
      )}
      onClick={() => onClick?.(task.id)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={task.completed}
            onClick={handleToggleComplete}
            className="mt-1.5 h-4 w-4 transition-transform hover:scale-110"
          />
          <div className="flex flex-col gap-1">
            <h3
              className={cn(
                'font-medium line-clamp-2',
                task.completed && 'text-muted-foreground line-through'
              )}
            >
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
        </div>
        <PriorityIndicator priority={task.priority} showLabel={false} />
      </div>
      
      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
        <div className="flex flex-wrap gap-2">
          {category && <CategoryBadge category={category} />}
          <StatusBadge status={task.status} showLabel={false} />
        </div>
        
        {task.dueDate && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarIcon className="h-3 w-3" />
            <span>{formatRelativeDate(task.dueDate)}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

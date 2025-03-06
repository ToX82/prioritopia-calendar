
import { useAppStore } from '@/lib/store';
import { Task } from '@/lib/types';
import { formatDate, getDaysInMonth } from '@/lib/date-utils';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { TaskCard } from '@/components/ui/task-card';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface CalendarViewProps {
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
  onAddTask: () => void;
}

export function CalendarView({
  tasks,
  onTaskClick,
  onToggleComplete,
  onAddTask,
}: CalendarViewProps) {
  const { setSelectedDate } = useAppStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const days = getDaysInMonth(currentYear, currentMonth);
  
  // Get the first day of the week (0 = Sunday)
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  // Format the month for display
  const monthName = formatDate(currentDate, 'MMMM yyyy');
  
  // Navigate to previous/next month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };
  
  // Check if a date has tasks
  const hasTasksOnDate = (date: Date) => {
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    
    return tasks.some((task) => {
      if (!task.dueDate) return false;
      
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === day &&
        taskDate.getMonth() === month &&
        taskDate.getFullYear() === year
      );
    });
  };
  
  // Get tasks for a specific date
  const getTasksForDate = (date: Date) => {
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    
    return tasks.filter((task) => {
      if (!task.dueDate) return false;
      
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === day &&
        taskDate.getMonth() === month &&
        taskDate.getFullYear() === year
      );
    });
  };
  
  // Select a day to view tasks
  const selectDay = (date: Date) => {
    setSelectedDate(date.toISOString());
  };
  
  // Calculate the index of the selected day
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{monthName}</h2>
        <div className="flex space-x-1">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPreviousMonth}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous Month</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={goToNextMonth}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next Month</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="rounded-md bg-secondary py-2 text-xs font-medium"
          >
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const isCurrentMonth = day.getMonth() === currentMonth;
          const isToday =
            day.getDate() === new Date().getDate() &&
            day.getMonth() === new Date().getMonth() &&
            day.getFullYear() === new Date().getFullYear();
          
          const hasEvents = hasTasksOnDate(day);
          
          const isSelected =
            selectedDay &&
            day.getDate() === selectedDay.getDate() &&
            day.getMonth() === selectedDay.getMonth() &&
            day.getFullYear() === selectedDay.getFullYear();
          
          return (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              layout
            >
              <button
                type="button"
                className={cn(
                  'flex h-full w-full flex-col items-center justify-center rounded-md py-2 hover:bg-secondary',
                  !isCurrentMonth && 'text-muted-foreground opacity-50',
                  isToday && 'bg-primary text-white hover:bg-primary/90',
                  isSelected && !isToday && 'bg-accent',
                  'transition-colors'
                )}
                onClick={() => {
                  setSelectedDay(day);
                  selectDay(day);
                }}
              >
                <span
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-full text-sm',
                    (isToday || isSelected) && ''
                  )}
                >
                  {day.getDate()}
                </span>
                {hasEvents && (
                  <span
                    className={cn(
                      'mt-1 h-1 w-1 rounded-full',
                      isToday ? 'bg-white' : 'bg-primary'
                    )}
                  />
                )}
              </button>
            </motion.div>
          );
        })}
      </div>
      
      <div className="mt-4">
        {selectedDay ? (
          <>
            <h3 className="mb-2 font-medium">
              Tasks for {formatDate(selectedDay, 'PPP')}
            </h3>
            
            <div className="space-y-2">
              {getTasksForDate(selectedDay).length > 0 ? (
                getTasksForDate(selectedDay).map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={onTaskClick}
                    onToggleComplete={onToggleComplete}
                  />
                ))
              ) : (
                <EmptyState
                  type="calendar"
                  showAddButton
                  onAddClick={onAddTask}
                />
              )}
            </div>
          </>
        ) : (
          <div className="py-4 text-center text-sm text-muted-foreground">
            Select a day to view tasks
          </div>
        )}
      </div>
    </div>
  );
}

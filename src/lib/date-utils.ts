
import { format, isToday, isTomorrow, isYesterday, isThisWeek, isThisMonth } from 'date-fns';

// Format a date for display
export const formatDate = (date: string | Date | null, formatStr = 'PPP'): string => {
  if (!date) return '';
  return format(new Date(date), formatStr);
};

// Format a date for display with relative terms (Today, Tomorrow, etc.)
export const formatRelativeDate = (date: string | Date | null): string => {
  if (!date) return '';
  
  const d = new Date(date);
  
  if (isToday(d)) return 'Today';
  if (isTomorrow(d)) return 'Tomorrow';
  if (isYesterday(d)) return 'Yesterday';
  
  return format(d, 'EEE, MMM d');
};

// Get days in the current month for the calendar
export const getDaysInMonth = (year: number, month: number): Date[] => {
  const days: Date[] = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  // Add dates from previous month to fill the first week
  const firstDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
  for (let i = firstDayOfWeek; i > 0; i--) {
    const day = new Date(year, month, 1 - i);
    days.push(day);
  }
  
  // Add all days in the current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const day = new Date(year, month, i);
    days.push(day);
  }
  
  // Add dates from next month to complete the last week
  const lastDayOfWeek = lastDay.getDay();
  for (let i = 1; i < 7 - lastDayOfWeek; i++) {
    const day = new Date(year, month + 1, i);
    days.push(day);
  }
  
  return days;
};

// Group tasks by date
export const groupTasksByDate = (tasks: any[]) => {
  const grouped: { [key: string]: any[] } = {};
  
  tasks.forEach((task) => {
    if (!task.dueDate) {
      if (!grouped['No Date']) {
        grouped['No Date'] = [];
      }
      grouped['No Date'].push(task);
      return;
    }
    
    const dateKey = format(new Date(task.dueDate), 'yyyy-MM-dd');
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(task);
  });
  
  return grouped;
};

// Check if a date is in the past
export const isPastDate = (date: string | Date | null): boolean => {
  if (!date) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  
  return d < today;
};

// Format a time for display
export const formatTime = (date: string | Date | null): string => {
  if (!date) return '';
  return format(new Date(date), 'h:mm a');
};

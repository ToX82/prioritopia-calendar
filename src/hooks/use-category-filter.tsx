
import { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';

export function useCategoryFilter(searchQuery: string) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryManagementOpen, setCategoryManagementOpen] = useState(false);
  
  const { tasks, viewMode, selectedDate } = useAppStore();
  
  // Filter tasks by selected category and search query
  const filteredTasks = useMemo(() => {
    let filtered = tasks;
    
    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((task) => task.categoryId === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query)
      );
    }
    
    // Filter by selected date in calendar view
    if (viewMode === 'calendar' && selectedDate) {
      const date = new Date(selectedDate);
      date.setHours(0, 0, 0, 0);
      
      filtered = filtered.filter((task) => {
        if (!task.dueDate) return false;
        
        const taskDate = new Date(task.dueDate);
        taskDate.setHours(0, 0, 0, 0);
        
        return taskDate.getTime() === date.getTime();
      });
    }
    
    return filtered;
  }, [tasks, selectedCategory, searchQuery, viewMode, selectedDate]);

  return {
    selectedCategory,
    setSelectedCategory,
    categoryManagementOpen,
    setCategoryManagementOpen,
    filteredTasks,
  };
}

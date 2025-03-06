
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, Category, Priority, Task, ViewMode } from './types';

const defaultCategories: Category[] = [
  { id: '1', name: 'Personal', color: '#3b82f6' },
  { id: '2', name: 'Work', color: '#10b981' },
  { id: '3', name: 'Shopping', color: '#f59e0b' },
  { id: '4', name: 'Health', color: '#ef4444' },
];

const initialState: AppState = {
  tasks: [],
  categories: defaultCategories,
  viewMode: 'list',
  selectedDate: null,
};

export const useAppStore = create<
  AppState & {
    // Task actions
    addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
    updateTask: (taskId: string, updates: Partial<Task>) => void;
    deleteTask: (taskId: string) => void;
    toggleTaskCompletion: (taskId: string) => void;
    
    // Category actions
    addCategory: (category: Omit<Category, 'id'>) => void;
    updateCategory: (categoryId: string, updates: Partial<Category>) => void;
    deleteCategory: (categoryId: string) => void;
    
    // View actions
    setViewMode: (mode: ViewMode) => void;
    setSelectedDate: (date: string | null) => void;
  }
>(
  persist(
    (set) => ({
      ...initialState,
      
      // Task actions
      addTask: (task) => set((state) => ({
        tasks: [
          ...state.tasks,
          {
            ...task,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
          },
        ],
      })),
      
      updateTask: (taskId, updates) => set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId ? { ...task, ...updates } : task
        ),
      })),
      
      deleteTask: (taskId) => set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== taskId),
      })),
      
      toggleTaskCompletion: (taskId) => set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        ),
      })),
      
      // Category actions
      addCategory: (category) => set((state) => ({
        categories: [
          ...state.categories,
          {
            ...category,
            id: crypto.randomUUID(),
          },
        ],
      })),
      
      updateCategory: (categoryId, updates) => set((state) => ({
        categories: state.categories.map((category) =>
          category.id === categoryId ? { ...category, ...updates } : category
        ),
      })),
      
      deleteCategory: (categoryId) => set((state) => {
        // Update tasks with this category to have no category
        const updatedTasks = state.tasks.map((task) =>
          task.categoryId === categoryId ? { ...task, categoryId: null } : task
        );
        
        return {
          categories: state.categories.filter((category) => category.id !== categoryId),
          tasks: updatedTasks,
        };
      }),
      
      // View actions
      setViewMode: (mode) => set({ viewMode: mode }),
      setSelectedDate: (date) => set({ selectedDate: date }),
    }),
    {
      name: 'task-manager-storage',
    }
  )
);

// Helper functions to work with the store
export const getTasksByDate = (date: string | null) => {
  const state = useAppStore.getState();
  if (!date) return state.tasks;
  
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  
  return state.tasks.filter((task) => {
    if (!task.dueDate) return false;
    const taskDate = new Date(task.dueDate);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate.getTime() === targetDate.getTime();
  });
};

export const getCategory = (categoryId: string | null) => {
  if (!categoryId) return null;
  const state = useAppStore.getState();
  return state.categories.find((category) => category.id === categoryId) || null;
};

export const getPriorityLabel = (priority: Priority) => {
  return {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
  }[priority];
};

export const getPriorityColor = (priority: Priority) => {
  return {
    low: 'bg-emerald-100 text-emerald-800',
    medium: 'bg-amber-100 text-amber-800',
    high: 'bg-rose-100 text-rose-800',
  }[priority];
};

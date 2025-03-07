
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, Category, Priority, Task, TaskStatus, TaskStatusConfig, ViewMode } from './types';

const defaultCategories: Category[] = [
  { id: '1', name: 'Personal', color: '#3b82f6' },
  { id: '2', name: 'Work', color: '#10b981' },
  { id: '3', name: 'Shopping', color: '#f59e0b' },
  { id: '4', name: 'Health', color: '#ef4444' },
];

const defaultStatuses: TaskStatusConfig[] = [
  { id: 'new', name: 'New', color: '#3b82f6', order: 0 },
  { id: 'in-progress', name: 'In Progress', color: '#8b5cf6', order: 1 },
  { id: 'testing', name: 'Testing', color: '#f59e0b', order: 2 },
  { id: 'awaiting-feedback', name: 'Awaiting Feedback', color: '#f97316', order: 3 },
  { id: 'completed', name: 'Completed', color: '#10b981', order: 4 },
];

const initialState: AppState = {
  tasks: [],
  categories: defaultCategories,
  statuses: defaultStatuses,
  viewMode: 'list',
  selectedDate: null,
};

// Define the store type
type AppStore = AppState & {
  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  toggleTaskCompletion: (taskId: string) => void;
  
  // Category actions
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (categoryId: string, updates: Partial<Category>) => void;
  deleteCategory: (categoryId: string) => void;
  
  // Status actions
  addStatus: (status: Omit<TaskStatusConfig, 'id'>) => void;
  updateStatus: (statusId: string, updates: Partial<TaskStatusConfig>) => void;
  deleteStatus: (statusId: string) => void;
  
  // View actions
  setViewMode: (mode: ViewMode) => void;
  setSelectedDate: (date: string | null) => void;
};

export const useAppStore = create<AppStore>(
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
            status: task.status || 'new', // Default to 'new' if not provided
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
          task.id === taskId 
            ? { 
                ...task, 
                completed: !task.completed,
                status: !task.completed ? 'completed' : 'in-progress'
              } 
            : task
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

      // Status actions
      addStatus: (status) => set((state) => {
        const newStatusId = crypto.randomUUID();
        return {
          statuses: [
            ...state.statuses,
            {
              ...status,
              id: newStatusId,
            },
          ],
        };
      }),
      
      updateStatus: (statusId, updates) => set((state) => ({
        statuses: state.statuses.map((status) =>
          status.id === statusId ? { ...status, ...updates } : status
        ),
      })),
      
      deleteStatus: (statusId) => set((state) => {
        // We can't delete default statuses
        if (['new', 'in-progress', 'testing', 'awaiting-feedback', 'completed'].includes(statusId)) {
          return state;
        }
        
        // Update tasks with this status to have 'new' status
        const updatedTasks = state.tasks.map((task) => {
          if (task.status === statusId) {
            return { ...task, status: 'new' as TaskStatus };
          }
          return task;
        });
        
        return {
          statuses: state.statuses.filter((status) => status.id !== statusId),
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

export const getStatus = (statusId: string | null) => {
  if (!statusId) return null;
  const state = useAppStore.getState();
  return state.statuses.find((status) => status.id === statusId) || null;
};

export const getStatusByCode = (statusCode: TaskStatus): TaskStatusConfig | null => {
  const state = useAppStore.getState();
  return state.statuses.find((status) => status.id === statusCode) || null;
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

export const getStatusLabel = (status: TaskStatus) => {
  const statusConfig = getStatusByCode(status);
  return statusConfig ? statusConfig.name : {
    'new': 'New',
    'in-progress': 'In Progress',
    'testing': 'Testing',
    'awaiting-feedback': 'Awaiting Feedback',
    'completed': 'Completed',
  }[status];
};

export const getStatusColor = (status: TaskStatus) => {
  const statusConfig = getStatusByCode(status);
  if (statusConfig) {
    return `bg-opacity-15 text-opacity-90 bg-${statusConfig.color} text-${statusConfig.color}`;
  }
  
  return {
    'new': 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-purple-100 text-purple-800',
    'testing': 'bg-amber-100 text-amber-800',
    'awaiting-feedback': 'bg-orange-100 text-orange-800',
    'completed': 'bg-emerald-100 text-emerald-800',
  }[status];
};

export const getOrderedStatuses = () => {
  const state = useAppStore.getState();
  return [...state.statuses].sort((a, b) => a.order - b.order);
};

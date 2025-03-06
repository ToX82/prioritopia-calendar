
export type Priority = 'low' | 'medium' | 'high';

export type TaskStatus = 'new' | 'in-progress' | 'testing' | 'awaiting-feedback' | 'completed';

export type Category = {
  id: string;
  name: string;
  color: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string; // ISO date string
  dueDate: string | null; // ISO date string
  priority: Priority;
  categoryId: string | null;
  status: TaskStatus;
};

export type ViewMode = 'list' | 'calendar';

export type AppState = {
  tasks: Task[];
  categories: Category[];
  viewMode: ViewMode;
  selectedDate: string | null; // ISO date string for calendar view
};

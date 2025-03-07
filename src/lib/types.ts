
export type Priority = 'low' | 'medium' | 'high';

export type TaskStatus = 'new' | 'in-progress' | 'testing' | 'awaiting-feedback' | 'completed';

export type Category = {
  id: string;
  name: string;
  color: string;
};

export type TaskStatusConfig = {
  id: string;
  name: string;
  color: string;
  order: number;
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
  statusId?: string; // For custom statuses
};

export type ViewMode = 'list' | 'calendar' | 'kanban';

export type AppState = {
  tasks: Task[];
  categories: Category[];
  statuses: TaskStatusConfig[];
  viewMode: ViewMode;
  selectedDate: string | null; // ISO date string for calendar view
};

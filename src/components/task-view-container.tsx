
import { Task } from '@/lib/types';
import { ListIcon, CalendarIcon, KanbanIcon } from 'lucide-react';
import { ListIcon, CalendarIcon, KanbanIcon } from 'lucide-react';
import { ListView } from './list-view';
import { CalendarView } from './calendar-view';
import { KanbanView } from './kanban-view';

interface TaskViewContainerProps {
  viewMode: 'list' | 'calendar' | 'kanban';
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
  onAddTask: () => void;
}

export function TaskViewContainer({
  viewMode,
  tasks,
  onTaskClick,
  onToggleComplete,
  onAddTask,
}: TaskViewContainerProps) {
  const views = {
    list: ListView,
    calendar: CalendarView,
    kanban: KanbanView,
  };

  const ViewComponent = views[viewMode];

  return (
    <ViewComponent
      tasks={tasks}
      onTaskClick={onTaskClick}
      onToggleComplete={onToggleComplete}
      onAddTask={onAddTask}
    />
  );
}

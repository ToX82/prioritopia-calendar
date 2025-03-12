
import { ReactNode } from 'react';
import { ViewMode, Task } from '@/lib/types';
import { ListView } from '@/components/list-view';
import { CalendarView } from '@/components/calendar-view';
import { KanbanView } from '@/components/kanban-view';

interface TaskViewContainerProps {
  viewMode: ViewMode;
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
}: TaskViewContainerProps): ReactNode {
  switch (viewMode) {
    case 'calendar':
      return (
        <CalendarView
          tasks={tasks}
          onTaskClick={onTaskClick}
          onToggleComplete={onToggleComplete}
          onAddTask={onAddTask}
        />
      );
    case 'kanban':
      return (
        <KanbanView
          tasks={tasks}
          onTaskClick={onTaskClick}
          onToggleComplete={onToggleComplete}
          onAddTask={onAddTask}
        />
      );
    default:
      return (
        <ListView
          tasks={tasks}
          onTaskClick={onTaskClick}
          onToggleComplete={onToggleComplete}
          onAddTask={onAddTask}
        />
      );
  }
}

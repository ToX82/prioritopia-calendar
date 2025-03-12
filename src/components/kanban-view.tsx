import React from 'react';
import { useAppStore, getStatusLabel } from '@/lib/store';
import { Task } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Circle } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface KanbanViewProps {
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
}

export function KanbanView({ tasks, onTaskClick, onToggleComplete }: KanbanViewProps) {
  const { statuses, updateTask } = useAppStore();
  const { t } = useTranslation();

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, statusId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    updateTask(taskId, { status: statusId });
    const target = e.target as HTMLElement;
    if (target.classList.contains('droppable-zone')) {
      target.classList.remove('bg-primary/10');
    }
    toast.success(`Task moved to ${getStatusLabel(statusId)}`);
  };

  // Inside the KanbanView component
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    if (target.classList.contains('droppable-zone')) {
      target.classList.add('bg-primary/10');
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    if (target.classList.contains('droppable-zone')) {
      target.classList.remove('bg-primary/10');
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {statuses
        .sort((a, b) => a.order - b.order)
        .map((status) => (
          <div
            key={status.id}
            className="flex flex-col h-full"
          >
            <h2 className="text-lg font-semibold mb-2 px-2 py-1 rounded-md sticky top-0 z-10 bg-background/90 backdrop-blur-sm border-b">
              {status.name}
            </h2>
            <div
              className="flex-1 min-h-16 p-2 rounded-md bg-muted/30 overflow-y-auto droppable-zone"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, status.id)}
            >
              {tasks
                .filter((task) => task.status === status.id)
                .map((task) => (
                  <Card
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    className="mb-2 cursor-grab hover:bg-accent transition-colors"
                    onClick={() => onTaskClick(task.id)}
                  >
                    <div className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleComplete(task.id);
                          }}
                        >
                          {task.completed ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Circle className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                        <h3 className="text-sm font-medium">{task.title}</h3>
                      </div>
                    </div>
                  </Card>
                ))}
              {tasks.filter((task) => task.status === status.id).length === 0 && (
                <div className="text-sm text-muted-foreground text-center py-4">
                  No tasks in this status
                </div>
              )}
            </div>
          </div>
        ))}
    </div>
  );
}

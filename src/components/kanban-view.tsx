
import React, { useMemo } from 'react';
import { Task } from '@/lib/types';
import { EmptyState } from '@/components/ui/empty-state';
import { TaskCard } from '@/components/ui/task-card';
import { getOrderedStatuses, useAppStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';

interface KanbanViewProps {
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
  onAddTask: () => void;
}

export function KanbanView({
  tasks,
  onTaskClick,
  onToggleComplete,
  onAddTask,
}: KanbanViewProps) {
  const { updateTask } = useAppStore();
  const statuses = getOrderedStatuses();

  // Group tasks by status
  const tasksByStatus = useMemo(() => {
    const grouped: Record<string, Task[]> = {};
    
    // Initialize with all statuses
    statuses.forEach(status => {
      grouped[status.id] = [];
    });
    
    // Populate with tasks
    tasks.forEach(task => {
      const statusId = task.status;
      if (grouped[statusId]) {
        grouped[statusId].push(task);
      } else {
        // If the status doesn't exist (legacy data), put in 'new'
        grouped['new'].push(task);
      }
    });
    
    return grouped;
  }, [tasks, statuses]);

  // Handle drag-and-drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetStatus: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      updateTask(taskId, { status: targetStatus as any });
    }
  };

  if (tasks.length === 0) {
    return <EmptyState type="tasks" onAddClick={onAddTask} />;
  }

  return (
    <div className="h-full overflow-x-auto pb-4">
      <div className="flex gap-4 min-h-[calc(100vh-12rem)]">
        {statuses.map((status) => (
          <div
            key={status.id}
            className="flex-shrink-0 w-80 flex flex-col bg-secondary/50 rounded-lg"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status.id)}
          >
            <div 
              className="p-3 font-medium flex items-center justify-between sticky top-0 bg-secondary/70 backdrop-blur-sm rounded-t-lg z-10"
              style={{ color: status.color }}
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: status.color }}
                />
                <span>{status.name}</span>
              </div>
              <span className="text-xs px-2 rounded-full bg-secondary">
                {tasksByStatus[status.id].length}
              </span>
            </div>
            
            <div className="flex-1 p-2 space-y-2 min-h-[200px]">
              {tasksByStatus[status.id].map((task) => (
                <motion.div
                  key={task.id}
                  layoutId={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  draggable
                  onDragStart={(e: React.DragEvent<HTMLDivElement>) => {
                    e.dataTransfer.setData('taskId', task.id);
                  }}
                >
                  <TaskCard
                    task={task}
                    onClick={onTaskClick}
                    onToggleComplete={onToggleComplete}
                    className="bg-background"
                  />
                </motion.div>
              ))}
            </div>
            
            <div className="p-2 border-t border-border/50">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-muted-foreground" 
                onClick={onAddTask}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Task
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

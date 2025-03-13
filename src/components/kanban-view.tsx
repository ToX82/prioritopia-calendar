
import React, { useMemo } from 'react';
import { Task } from '@/lib/types';
import { EmptyState } from '@/components/ui/empty-state';
import { TaskCard } from '@/components/ui/task-card';
import { getOrderedStatuses, useAppStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

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
        // If the status doesn't exist (legacy data), put in first available status
        const firstStatusId = statuses[0]?.id || 'new';
        if (!grouped[firstStatusId]) grouped[firstStatusId] = [];
        grouped[firstStatusId].push(task);
      }
    });
    
    return grouped;
  }, [tasks, statuses]);

  // Handle drag-and-drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-secondary/70');
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('bg-secondary/70');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetStatus: string) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-secondary/70');
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      updateTask(taskId, { status: targetStatus });
    }
  };

  if (tasks.length === 0) {
    return <EmptyState type="tasks" onAddClick={onAddTask} />;
  }

  return (
    <div className="h-full overflow-x-auto pb-4">
      <motion.div 
        className="flex gap-4 min-h-[calc(100vh-12rem)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence>
          {statuses.map((status) => (
            <motion.div
              key={status.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="flex-shrink-0 w-80 flex flex-col bg-secondary/30 dark:bg-secondary/20 rounded-lg border border-border shadow-sm"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, status.id)}
            >
              <div 
                className="p-3 font-medium flex items-center justify-between sticky top-0 bg-secondary/50 dark:bg-secondary/30 backdrop-blur-sm rounded-t-lg z-10"
                style={{ color: status.color }}
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: status.color }}
                  />
                  <span>{status.name}</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/70 dark:bg-secondary/40 text-foreground">
                  {tasksByStatus[status.id].length}
                </span>
              </div>
              
              <div className="flex-1 p-2 space-y-2 min-h-[200px]">
                <AnimatePresence>
                  {tasksByStatus[status.id].map((task) => (
                    <motion.div
                      key={task.id}
                      draggable
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      whileDrag={{ scale: 1.02, boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}
                      className="cursor-grab active:cursor-grabbing"
                      onDragStart={(e: React.DragEvent<HTMLDivElement>) => {
                        e.dataTransfer.setData('taskId', task.id);
                        e.currentTarget.classList.add('opacity-50');
                      }}
                      onDragEnd={(e) => {
                        e.currentTarget.classList.remove('opacity-50');
                      }}
                    >
                      <TaskCard
                        task={task}
                        onClick={onTaskClick}
                        onToggleComplete={onToggleComplete}
                        className="bg-background hover:shadow-md transition-all"
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {tasksByStatus[status.id].length === 0 && (
                  <div className="flex items-center justify-center h-20 border border-dashed border-muted-foreground/30 rounded-md my-4 text-muted-foreground/50">
                    <p className="text-sm">Drop tasks here</p>
                  </div>
                )}
              </div>
              
              <div className="p-2 border-t border-border/50">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-muted-foreground hover:text-foreground transition-colors" 
                  onClick={() => {
                    onAddTask();
                    // Pre-select this status for the new task
                    localStorage.setItem('preSelectedStatus', status.id);
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  {t('app.addTask')}
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

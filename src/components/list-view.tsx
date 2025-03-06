
import { Task } from '@/lib/types';
import { formatRelativeDate, groupTasksByDate } from '@/lib/date-utils';
import { EmptyState } from '@/components/ui/empty-state';
import { TaskCard } from '@/components/ui/task-card';
import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ListViewProps {
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
  onAddTask: () => void;
}

export function ListView({
  tasks,
  onTaskClick,
  onToggleComplete,
  onAddTask,
}: ListViewProps) {
  const groupedTasks = useMemo(() => {
    return groupTasksByDate(tasks);
  }, [tasks]);
  
  const sortedDates = useMemo(() => {
    return Object.keys(groupedTasks)
      .filter((date) => date !== 'No Date')
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  }, [groupedTasks]);
  
  if (tasks.length === 0) {
    return <EmptyState type="tasks" onAddClick={onAddTask} />;
  }
  
  return (
    <div className="space-y-6">
      {/* Tasks with due dates */}
      <AnimatePresence>
        {sortedDates.map((date) => (
          <motion.div
            key={date}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-2 text-sm font-medium">
              {formatRelativeDate(date)}
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {groupedTasks[date].map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={onTaskClick}
                  onToggleComplete={onToggleComplete}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {/* Tasks without due dates */}
      {groupedTasks['No Date'] && (
        <motion.div
          layout
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="mb-2 text-sm font-medium">No Due Date</div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {groupedTasks['No Date'].map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={onTaskClick}
                onToggleComplete={onToggleComplete}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}


import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Task } from '@/lib/types';
import { toast } from 'sonner';

export function useTaskManager() {
  const [newTaskDialogOpen, setNewTaskDialogOpen] = useState(false);
  const [taskDetailOpen, setTaskDetailOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const {
    tasks,
    viewMode,
    toggleTaskCompletion,
  } = useAppStore();
  
  // Handle task toggling
  const handleToggleTaskCompletion = (taskId: string) => {
    toggleTaskCompletion(taskId);
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      toast(task.completed ? 'Task marked as incomplete' : 'Task completed', {
        description: task.title,
      });
    }
  };
  
  // Handle task clicking
  const handleTaskClick = (taskId: string) => {
    setSelectedTask(taskId);
    setTaskDetailOpen(true);
  };
  
  // Handle task editing
  const handleEditTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setEditingTask(task);
      setNewTaskDialogOpen(true);
      setTaskDetailOpen(false);
    }
  };
  
  // Handle adding a new task
  const handleAddTask = () => {
    setEditingTask(null);
    setNewTaskDialogOpen(true);
  };

  return {
    newTaskDialogOpen,
    setNewTaskDialogOpen,
    taskDetailOpen,
    setTaskDetailOpen,
    selectedTask,
    editingTask,
    searchQuery,
    setSearchQuery,
    handleToggleTaskCompletion,
    handleTaskClick,
    handleEditTask,
    handleAddTask,
  };
}

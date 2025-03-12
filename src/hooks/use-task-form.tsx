
import { useEffect, useState } from 'react';
import { Priority, Task, TaskStatus } from '@/lib/types';
import { useAppStore } from '@/lib/store';

export function useTaskForm(initialTask: Task | null, onClose: () => void) {
  const { addTask, updateTask } = useAppStore();
  const [task, setTask] = useState<Omit<Task, 'id' | 'createdAt'>>({
    title: '',
    description: '',
    completed: false,
    dueDate: null,
    priority: 'medium',
    categoryId: null,
    status: 'new',
  });
  const [date, setDate] = useState<Date | undefined>(undefined);

  // Reset form when dialog opens/closes or initialTask changes
  useEffect(() => {
    // Check for pre-selected status from Kanban view
    const preSelectedStatus = localStorage.getItem('preSelectedStatus');
    
    if (initialTask) {
      setTask({
        title: initialTask.title,
        description: initialTask.description,
        completed: initialTask.completed,
        dueDate: initialTask.dueDate,
        priority: initialTask.priority,
        categoryId: initialTask.categoryId,
        status: initialTask.status || 'new',
      });
      
      if (initialTask.dueDate) {
        setDate(new Date(initialTask.dueDate));
      } else {
        setDate(undefined);
      }
    } else {
      setTask({
        title: '',
        description: '',
        completed: false,
        dueDate: null,
        priority: 'medium',
        categoryId: null,
        status: preSelectedStatus as TaskStatus || 'new',
      });
      setDate(undefined);
    }
    
    // Clear pre-selected status after using it
    if (preSelectedStatus) {
      localStorage.removeItem('preSelectedStatus');
    }
  }, [initialTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!task.title.trim()) return;
    
    if (initialTask) {
      updateTask(initialTask.id, task);
    } else {
      addTask(task);
    }
    
    onClose();
  };

  const updateTaskField = <K extends keyof Omit<Task, 'id' | 'createdAt'>>(
    field: K,
    value: Omit<Task, 'id' | 'createdAt'>[K]
  ) => {
    setTask({ ...task, [field]: value });
  };

  const updateDate = (newDate: Date | undefined) => {
    setDate(newDate);
    setTask({
      ...task,
      dueDate: newDate?.toISOString() || null,
    });
  };

  return {
    task,
    date,
    updateTaskField,
    updateDate,
    handleSubmit,
    isEditing: !!initialTask
  };
}

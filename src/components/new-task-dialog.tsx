
import { Task } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TaskForm } from './task-form/task-form';
import { useEffect, useState } from 'react';

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTask?: Task | null;
}

export function NewTaskDialog({
  open,
  onOpenChange,
  initialTask,
}: TaskDialogProps) {
  const [formKey, setFormKey] = useState(Date.now());
  
  // Reset the form when the dialog opens or initialTask changes
  useEffect(() => {
    if (open) {
      setFormKey(Date.now());
    }
  }, [open, initialTask]);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-background">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {initialTask ? 'Edit Task' : 'Create Task'}
          </DialogTitle>
        </DialogHeader>
        
        <TaskForm 
          key={formKey}
          initialTask={initialTask || null} 
          onSubmit={() => onOpenChange(false)} 
        />
      </DialogContent>
    </Dialog>
  );
}

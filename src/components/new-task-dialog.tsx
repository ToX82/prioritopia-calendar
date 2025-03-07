
import { Task } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TaskForm } from './task-form/task-form';

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialTask ? 'Edit Task' : 'Create Task'}
          </DialogTitle>
        </DialogHeader>
        
        <TaskForm 
          initialTask={initialTask || null} 
          onSubmit={() => onOpenChange(false)} 
        />
      </DialogContent>
    </Dialog>
  );
}

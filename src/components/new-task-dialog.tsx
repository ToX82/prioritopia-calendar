
import { Task } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAppStore } from '@/lib/store';
import { useTaskForm } from '@/hooks/use-task-form';
import { BasicInfoFields } from './task-form/basic-info-fields';
import { CategoryField } from './task-form/category-field';
import { PriorityField } from './task-form/priority-field';
import { StatusField } from './task-form/status-field';
import { DueDateField } from './task-form/due-date-field';
import { CompletedField } from './task-form/completed-field';

interface NewTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTask?: Task | null;
}

export function NewTaskDialog({
  open,
  onOpenChange,
  initialTask,
}: NewTaskDialogProps) {
  const { categories } = useAppStore();
  const { 
    task, 
    date, 
    updateTaskField, 
    updateDate, 
    handleSubmit, 
    isEditing 
  } = useTaskForm(initialTask || null, () => onOpenChange(false));
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit Task' : 'Create Task'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <BasicInfoFields
              title={task.title}
              description={task.description}
              onTitleChange={(value) => updateTaskField('title', value)}
              onDescriptionChange={(value) => updateTaskField('description', value)}
            />
            
            <CategoryField
              categoryId={task.categoryId}
              categories={categories}
              onCategoryChange={(value) => updateTaskField('categoryId', value)}
            />
            
            <PriorityField
              priority={task.priority}
              onPriorityChange={(value) => updateTaskField('priority', value)}
            />
            
            <StatusField
              status={task.status}
              onStatusChange={(value) => updateTaskField('status', value)}
            />
            
            <DueDateField
              date={date}
              onDateChange={updateDate}
            />
            
            <CompletedField
              completed={task.completed}
              onCompletedChange={(value) => updateTaskField('completed', value)}
            />
          </div>
          
          <DialogFooter>
            <Button type="submit">
              {isEditing ? 'Update Task' : 'Create Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

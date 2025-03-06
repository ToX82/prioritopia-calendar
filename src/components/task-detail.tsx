
import { useAppStore, getCategory } from '@/lib/store';
import { formatDate } from '@/lib/date-utils';
import { Button } from '@/components/ui/button';
import { CategoryBadge } from '@/components/ui/category-badge';
import { PriorityIndicator } from '@/components/ui/priority-indicator';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CalendarIcon, Pencil, Trash } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface TaskDetailProps {
  taskId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (taskId: string) => void;
}

export function TaskDetail({
  taskId,
  open,
  onOpenChange,
  onEdit,
}: TaskDetailProps) {
  const { tasks, toggleTaskCompletion, deleteTask } = useAppStore();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return null;
  
  const category = getCategory(task.categoryId);
  
  const handleDelete = () => {
    deleteTask(task.id);
    toast.success('Task deleted', {
      description: task.title,
    });
    setDeleteDialogOpen(false);
    onOpenChange(false);
  };
  
  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="pb-2">{task.title}</SheetTitle>
          </SheetHeader>
          
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-wrap gap-2">
              <PriorityIndicator priority={task.priority} />
              {category && <CategoryBadge category={category} />}
            </div>
            
            {task.dueDate && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarIcon className="h-4 w-4" />
                <span>Due {formatDate(task.dueDate)}</span>
              </div>
            )}
            
            <div className="mt-4">
              {task.description ? (
                <p className="text-sm text-muted-foreground">{task.description}</p>
              ) : (
                <p className="text-sm italic text-muted-foreground">No description</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => toggleTaskCompletion(task.id)}
            >
              {task.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
            </Button>
          </div>
          
          <SheetFooter className="mt-auto flex sm:justify-between">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash className="h-4 w-4" />
            </Button>
            
            <Button onClick={() => onEdit(task.id)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Task
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      
      {/* Delete Task Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{task.title}"? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

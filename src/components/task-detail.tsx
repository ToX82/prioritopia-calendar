
import { useAppStore, getCategory } from '@/lib/store';
import { formatDate } from '@/lib/date-utils';
import { Button } from '@/components/ui/button';
import { CategoryBadge } from '@/components/ui/category-badge';
import { PriorityIndicator } from '@/components/ui/priority-indicator';
import { StatusBadge } from '@/components/ui/status-badge';
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
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { TaskStatus } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getStatusLabel } from '@/lib/store';

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
  const { tasks, toggleTaskCompletion, deleteTask, updateTask, statuses } = useAppStore();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [task, setTask] = useState<any>(null);
  
  // Update task when taskId changes
  useEffect(() => {
    if (taskId) {
      const foundTask = tasks.find((t) => t.id === taskId);
      setTask(foundTask || null);
    } else {
      setTask(null);
    }
  }, [taskId, tasks]);
  
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
  
  const handleStatusChange = (value: string) => {
    updateTask(task.id, { status: value as TaskStatus });
    toast.success('Status updated', {
      description: `Task status changed to ${getStatusLabel(value as TaskStatus)}`,
    });
  };
  
  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="pb-2 text-xl font-semibold">{task.title}</SheetTitle>
          </SheetHeader>
          
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-wrap gap-2">
              <PriorityIndicator priority={task.priority} />
              {category && <CategoryBadge category={category} />}
              <StatusBadge status={task.status} />
            </div>
            
            <div className="grid gap-2 pt-2">
              <label className="text-sm font-medium text-foreground">Status</label>
              <Select
                value={task.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="w-full bg-background border-input focus:ring-primary/30">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses
                    .sort((a, b) => a.order - b.order)
                    .map((status) => (
                      <SelectItem key={status.id} value={status.id}>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: status.color }}
                          />
                          <span>{status.name}</span>
                        </div>
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {task.dueDate && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 px-3 py-2 rounded-md">
                <CalendarIcon className="h-4 w-4" />
                <span>Due {formatDate(task.dueDate)}</span>
              </div>
            )}
            
            <div className="mt-4 bg-muted/30 px-4 py-3 rounded-md">
              {task.description ? (
                <p className="text-sm text-foreground/90">{task.description}</p>
              ) : (
                <p className="text-sm italic text-muted-foreground">No description</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => toggleTaskCompletion(task.id)}
              className="border-input hover:bg-muted"
            >
              {task.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
            </Button>
          </div>
          
          <SheetFooter className="mt-auto flex sm:justify-between">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setDeleteDialogOpen(true)}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash className="h-4 w-4" />
            </Button>
            
            <Button onClick={() => onEdit(task.id)} className="bg-primary hover:bg-primary/90">
              <Pencil className="mr-2 h-4 w-4" />
              Edit Task
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      
      {/* Delete Task Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-background border-border">
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

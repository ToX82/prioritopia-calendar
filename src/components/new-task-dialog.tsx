
import { useAppStore } from '@/lib/store';
import { Priority, Task } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface NewTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTask?: Task | null;
}

const defaultTask: Omit<Task, 'id' | 'createdAt'> = {
  title: '',
  description: '',
  completed: false,
  dueDate: null,
  priority: 'medium',
  categoryId: null,
};

export function NewTaskDialog({
  open,
  onOpenChange,
  initialTask,
}: NewTaskDialogProps) {
  const { categories, addTask, updateTask } = useAppStore();
  const [task, setTask] = useState<Omit<Task, 'id' | 'createdAt'>>(defaultTask);
  const [date, setDate] = useState<Date | undefined>(undefined);
  
  // Reset form when dialog opens/closes or initialTask changes
  useEffect(() => {
    if (initialTask) {
      setTask({
        title: initialTask.title,
        description: initialTask.description,
        completed: initialTask.completed,
        dueDate: initialTask.dueDate,
        priority: initialTask.priority,
        categoryId: initialTask.categoryId,
      });
      
      if (initialTask.dueDate) {
        setDate(new Date(initialTask.dueDate));
      } else {
        setDate(undefined);
      }
    } else {
      setTask(defaultTask);
      setDate(undefined);
    }
  }, [initialTask, open]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!task.title.trim()) return;
    
    if (initialTask) {
      updateTask(initialTask.id, task);
    } else {
      addTask(task);
    }
    
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {initialTask ? 'Edit Task' : 'Create Task'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={task.title}
                onChange={(e) => setTask({ ...task, title: e.target.value })}
                placeholder="Task title"
                className="w-full"
                autoFocus
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={task.description}
                onChange={(e) =>
                  setTask({ ...task, description: e.target.value })
                }
                placeholder="Task description"
                className="w-full"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={task.categoryId || ''}
                onValueChange={(value) =>
                  setTask({ ...task, categoryId: value || null })
                }
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No Category</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <RadioGroup
                id="priority"
                value={task.priority}
                onValueChange={(value) =>
                  setTask({ ...task, priority: value as Priority })
                }
                className="flex space-x-1"
              >
                <div className="flex items-center space-x-1 rounded-md border p-2">
                  <RadioGroupItem value="low" id="low" />
                  <Label htmlFor="low" className="cursor-pointer">Low</Label>
                </div>
                <div className="flex items-center space-x-1 rounded-md border p-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium" className="cursor-pointer">Medium</Label>
                </div>
                <div className="flex items-center space-x-1 rounded-md border p-2">
                  <RadioGroupItem value="high" id="high" />
                  <Label htmlFor="high" className="cursor-pointer">High</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => {
                      setDate(newDate);
                      setTask({
                        ...task,
                        dueDate: newDate?.toISOString() || null,
                      });
                    }}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="completed"
                checked={task.completed}
                onCheckedChange={(checked) =>
                  setTask({ ...task, completed: checked as boolean })
                }
              />
              <Label htmlFor="completed" className="cursor-pointer">
                Mark as completed
              </Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit">
              {initialTask ? 'Update Task' : 'Create Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


import React from 'react';
import { useTaskForm } from '@/hooks/use-task-form';
import { Category, Task, TaskStatus } from '@/lib/types';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getStatusLabel } from '@/lib/store';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon, Check, Clock, Flag, Folder, Info } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface TaskFormProps {
  initialTask: Task | null;
  onSubmit: () => void;
}

export function TaskForm({ initialTask, onSubmit }: TaskFormProps) {
  const { categories, statuses } = useAppStore();
  const { 
    task, 
    date, 
    updateTaskField, 
    updateDate, 
    handleSubmit,
    isEditing 
  } = useTaskForm(initialTask, onSubmit);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Basic Info */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Input
              value={task.title}
              onChange={(e) => updateTaskField('title', e.target.value)}
              placeholder="Task title"
              className="text-lg font-medium border-input bg-background p-2 h-auto focus-visible:ring-primary/30 placeholder:text-muted-foreground"
              autoFocus
              required
            />

            <Textarea
              value={task.description}
              onChange={(e) => updateTaskField('description', e.target.value)}
              placeholder="Task description (optional)"
              className="resize-none min-h-24 border-input bg-background p-2 focus-visible:ring-primary/30 placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50">
            <TabsTrigger value="details" className="text-sm">Details</TabsTrigger>
            <TabsTrigger value="dates" className="text-sm">Due Date</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Status */}
              <div>
                <Label htmlFor="status" className="text-xs flex items-center gap-1 text-foreground/80 mb-1">
                  <Clock className="h-3 w-3" /> Status
                </Label>
                <Select
                  value={task.status}
                  onValueChange={(value) => updateTaskField('status', value as TaskStatus)}
                >
                  <SelectTrigger id="status" className="w-full bg-background border-input focus:ring-primary/30">
                    <SelectValue placeholder="Select status" />
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

              {/* Priority */}
              <div>
                <Label htmlFor="priority" className="text-xs flex items-center gap-1 text-foreground/80 mb-1">
                  <Flag className="h-3 w-3" /> Priority
                </Label>
                <Select
                  value={task.priority}
                  onValueChange={(value) => updateTaskField('priority', value as any)}
                >
                  <SelectTrigger id="priority" className="w-full bg-background border-input focus:ring-primary/30">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category" className="text-xs flex items-center gap-1 text-foreground/80 mb-1">
                <Folder className="h-3 w-3" /> Category
              </Label>
              <Select
                value={task.categoryId || 'none'}
                onValueChange={(value) => updateTaskField('categoryId', value === 'none' ? null : value)}
              >
                <SelectTrigger id="category" className="w-full bg-background border-input focus:ring-primary/30">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Category</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Completed */}
            <div className="flex items-center space-x-2 pt-2">
              <div 
                className={cn(
                  "h-5 w-5 rounded-sm border border-input flex items-center justify-center cursor-pointer transition-colors",
                  task.completed ? "bg-primary border-primary" : "hover:bg-muted/50"
                )}
                onClick={() => updateTaskField('completed', !task.completed)}
              >
                {task.completed && <Check className="h-3 w-3 text-primary-foreground" />}
              </div>
              <Label 
                className="cursor-pointer text-sm" 
                onClick={() => updateTaskField('completed', !task.completed)}
              >
                Mark as completed
              </Label>
            </div>
          </TabsContent>
          
          <TabsContent value="dates" className="py-4">
            <div className="space-y-4">
              <Label htmlFor="dueDate" className="text-xs flex items-center gap-1 text-foreground/80">
                <CalendarIcon className="h-3 w-3" /> Due Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border-input bg-background",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : <span>Select a due date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={updateDate}
                    initialFocus
                    className="p-3 border rounded-md"
                  />
                  {date && (
                    <div className="p-3 border-t flex justify-end">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => updateDate(null)}
                        className="text-sm"
                      >
                        Clear
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
        {isEditing ? 'Update Task' : 'Create Task'}
      </Button>
    </form>
  );
}

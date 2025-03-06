
import { useAppStore } from '@/lib/store';
import { Task } from '@/lib/types';
import { PageTransition } from '@/components/ui/page-transition';
import { AppHeader } from '@/components/app-header';
import { AppSidebar } from '@/components/app-sidebar';
import { CalendarView } from '@/components/calendar-view';
import { ListView } from '@/components/list-view';
import { NewTaskDialog } from '@/components/new-task-dialog';
import { TaskDetail } from '@/components/task-detail';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

const Index = () => {
  const [newTaskDialogOpen, setNewTaskDialogOpen] = useState(false);
  const [taskDetailOpen, setTaskDetailOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const {
    tasks,
    categories,
    viewMode,
    toggleTaskCompletion,
    selectedDate,
    setSelectedDate,
  } = useAppStore();
  
  // Filter tasks by selected category and search query
  const filteredTasks = useMemo(() => {
    let filtered = tasks;
    
    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((task) => task.categoryId === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query)
      );
    }
    
    // Filter by selected date in calendar view
    if (viewMode === 'calendar' && selectedDate) {
      const date = new Date(selectedDate);
      date.setHours(0, 0, 0, 0);
      
      filtered = filtered.filter((task) => {
        if (!task.dueDate) return false;
        
        const taskDate = new Date(task.dueDate);
        taskDate.setHours(0, 0, 0, 0);
        
        return taskDate.getTime() === date.getTime();
      });
    }
    
    return filtered;
  }, [tasks, selectedCategory, searchQuery, viewMode, selectedDate]);
  
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
  
  // Handle adding a new category
  const handleAddCategory = () => {
    // This would normally open a category dialog
    // For simplicity, we'll just show a toast
    toast('Category feature coming soon!');
  };
  
  // Reset selected date when switching view modes
  useEffect(() => {
    if (viewMode === 'list') {
      setSelectedDate(null);
    }
  }, [viewMode, setSelectedDate]);
  
  // Decide which view to render
  const renderView = (): ReactNode => {
    if (viewMode === 'calendar') {
      return (
        <CalendarView
          tasks={filteredTasks}
          onTaskClick={handleTaskClick}
          onToggleComplete={handleToggleTaskCompletion}
          onAddTask={handleAddTask}
        />
      );
    }
    
    return (
      <ListView
        tasks={filteredTasks}
        onTaskClick={handleTaskClick}
        onToggleComplete={handleToggleTaskCompletion}
        onAddTask={handleAddTask}
      />
    );
  };
  
  return (
    <PageTransition location={viewMode}>
      <div className="flex min-h-screen w-full flex-col">
        <div className="flex flex-1">
          <AppSidebar
            selectedCategoryId={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onAddCategory={handleAddCategory}
          />
          
          <div className="flex flex-1 flex-col">
            <AppHeader
              onAddTask={handleAddTask}
              onSearch={setSearchQuery}
            />
            
            <main className="flex-1 p-4 sm:p-6">
              {renderView()}
            </main>
          </div>
        </div>
        
        {/* Dialogs */}
        <NewTaskDialog
          open={newTaskDialogOpen}
          onOpenChange={setNewTaskDialogOpen}
          initialTask={editingTask}
        />
        
        <TaskDetail
          taskId={selectedTask}
          open={taskDetailOpen}
          onOpenChange={setTaskDetailOpen}
          onEdit={handleEditTask}
        />
      </div>
    </PageTransition>
  );
};

export default Index;

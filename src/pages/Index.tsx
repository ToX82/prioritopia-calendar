
import { useAppStore } from '@/lib/store';
import { PageTransition } from '@/components/ui/page-transition';
import { AppHeader } from '@/components/app-header';
import { AppSidebar } from '@/components/app-sidebar';
import { NewTaskDialog } from '@/components/new-task-dialog';
import { TaskDetail } from '@/components/task-detail';
import { CategoryDialog } from '@/components/category-dialog';
import { StatusManagementDialog } from '@/components/status-management-dialog';
import { TaskViewContainer } from '@/components/task-view-container';
import { useTaskManager } from '@/hooks/use-task-manager';
import { useCategoryFilter } from '@/hooks/use-category-filter';
import { useStatusManagement } from '@/hooks/use-status-management';

const Index = () => {
  const { viewMode, setViewMode } = useAppStore();
  
  // Use the custom hooks to manage state and functionality
  const {
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
  } = useTaskManager();
  
  const {
    selectedCategory,
    setSelectedCategory,
    categoryManagementOpen,
    setCategoryManagementOpen,
    filteredTasks,
  } = useCategoryFilter(searchQuery);
  
  const {
    statusManagementOpen,
    setStatusManagementOpen,
    handleManageStatuses,
  } = useStatusManagement();
  
  return (
    <PageTransition location={viewMode}>
      <div className="flex min-h-screen w-full flex-col">
        <div className="flex flex-1">
          <AppSidebar
            selectedCategoryId={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onManageCategories={() => setCategoryManagementOpen(true)}
            onManageStatuses={handleManageStatuses}
            viewMode={viewMode}
            onChangeViewMode={setViewMode}
          />
          
          <div className="flex flex-1 flex-col">
            <AppHeader
              onAddTask={handleAddTask}
              onSearch={setSearchQuery}
            />
            
            <main className="flex-1 p-4 sm:p-6">
              <TaskViewContainer
                viewMode={viewMode}
                tasks={filteredTasks}
                onTaskClick={handleTaskClick}
                onToggleComplete={handleToggleTaskCompletion}
                onAddTask={handleAddTask}
              />
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

        <CategoryDialog
          open={categoryManagementOpen}
          onOpenChange={setCategoryManagementOpen}
        />

        <StatusManagementDialog
          open={statusManagementOpen}
          onOpenChange={setStatusManagementOpen}
        />
      </div>
    </PageTransition>
  );
};

export default Index;

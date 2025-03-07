
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Category, ViewMode } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { PlusIcon, ListIcon, CalendarIcon, MenuIcon, LayoutGridIcon, XIcon, LayoutKanbanIcon } from 'lucide-react';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CategoryItem } from './category-item';
import { CategoryDialog } from './category-dialog';
import { DeleteCategoryDialog } from './delete-category-dialog';

interface AppSidebarProps {
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  onManageCategories: () => void;
  onManageStatuses: () => void;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
}

export function AppSidebar({
  onSelectCategory,
  selectedCategoryId,
  onManageCategories,
  onManageStatuses,
  viewMode,
  onChangeViewMode
}: AppSidebarProps) {
  const [open, setOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [deleteCategoryDialogOpen, setDeleteCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<{ id: string, name: string } | null>(null);
  
  const { categories } = useAppStore();
  
  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryDialogOpen(true);
  };
  
  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryDialogOpen(true);
  };
  
  const handleDeleteCategory = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      setCategoryToDelete({ id: category.id, name: category.name });
      setDeleteCategoryDialogOpen(true);
    }
  };
  
  return (
    <>
      {/* Mobile sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed left-4 top-4 z-50 lg:hidden"
          >
            <MenuIcon className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={(categoryId) => {
              onSelectCategory(categoryId);
              setOpen(false);
            }}
            onAddCategory={handleAddCategory}
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteCategory}
            onManageCategories={onManageCategories}
            onManageStatuses={onManageStatuses}
            viewMode={viewMode}
            setViewMode={(mode) => {
              onChangeViewMode(mode);
              setOpen(false);
            }}
          />
        </SheetContent>
      </Sheet>
      
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col">
        <div className="flex h-full flex-col border-r">
          <SidebarContent
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={onSelectCategory}
            onAddCategory={handleAddCategory}
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteCategory}
            onManageCategories={onManageCategories}
            onManageStatuses={onManageStatuses}
            viewMode={viewMode}
            setViewMode={onChangeViewMode}
          />
        </div>
      </aside>
      
      {/* Category Dialog */}
      <CategoryDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
        initialCategory={editingCategory}
      />
      
      {/* Delete Category Dialog */}
      {categoryToDelete && (
        <DeleteCategoryDialog
          categoryId={categoryToDelete.id}
          categoryName={categoryToDelete.name}
          open={deleteCategoryDialogOpen}
          onOpenChange={setDeleteCategoryDialogOpen}
        />
      )}
    </>
  );
}

interface SidebarContentProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  onAddCategory: () => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
  onManageCategories: () => void;
  onManageStatuses: () => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

function SidebarContent({
  categories,
  selectedCategoryId,
  onSelectCategory,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onManageCategories,
  onManageStatuses,
  viewMode,
  setViewMode,
}: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col overflow-y-auto py-4">
      <div className="flex items-center justify-between px-4">
        <h2 className="text-lg font-semibold">Task Manager</h2>
        <XIcon className="h-5 w-5 lg:hidden cursor-pointer" onClick={() => {
          const closeButton = document.querySelector('[data-radix-collection-item]');
          if (closeButton instanceof HTMLElement) {
            closeButton.click();
          }
        }} />
      </div>
      
      <div className="mt-6 space-y-1 px-4">
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start',
            viewMode === 'list' && 'bg-accent'
          )}
          onClick={() => setViewMode('list')}
        >
          <ListIcon className="mr-2 h-4 w-4" />
          <span>List View</span>
        </Button>
        
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start',
            viewMode === 'calendar' && 'bg-accent'
          )}
          onClick={() => setViewMode('calendar')}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span>Calendar View</span>
        </Button>

        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start',
            viewMode === 'kanban' && 'bg-accent'
          )}
          onClick={() => setViewMode('kanban')}
        >
          <LayoutKanbanIcon className="mr-2 h-4 w-4" />
          <span>Kanban View</span>
        </Button>
      </div>
      
      <div className="mt-8 px-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">Categories</h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5"
            onClick={onAddCategory}
          >
            <PlusIcon className="h-4 w-4" />
            <span className="sr-only">Add Category</span>
          </Button>
        </div>
        
        <div className="mt-2 space-y-1">
          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start',
              selectedCategoryId === null && 'bg-accent'
            )}
            onClick={() => onSelectCategory(null)}
          >
            <LayoutGridIcon className="mr-2 h-4 w-4" />
            <span>All Tasks</span>
          </Button>
          
          {categories.length > 0 ? (
            <motion.div layout className="space-y-1">
              {categories.map((category) => (
                <CategoryItem
                  key={category.id}
                  category={category}
                  isSelected={selectedCategoryId === category.id}
                  onSelect={onSelectCategory}
                  onEdit={onEditCategory}
                  onDelete={onDeleteCategory}
                />
              ))}
            </motion.div>
          ) : (
            <div className="py-4 text-center text-sm text-muted-foreground">
              No categories yet
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto px-4 pb-4">
        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={onManageCategories}
          >
            <span>Manage Categories</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={onManageStatuses}
          >
            <span>Manage Statuses</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

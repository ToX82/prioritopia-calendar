
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { PlusIcon, ListIcon, CalendarIcon, MenuIcon, LayoutGridIcon, TagIcon, XIcon } from 'lucide-react';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface AppSidebarProps {
  onAddCategory: () => void;
  onSelectCategory: (categoryId: string | null) => void;
  selectedCategoryId: string | null;
}

export function AppSidebar({
  onAddCategory,
  onSelectCategory,
  selectedCategoryId,
}: AppSidebarProps) {
  const [open, setOpen] = useState(false);
  const { categories, viewMode, setViewMode } = useAppStore();
  
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
            onAddCategory={onAddCategory}
            viewMode={viewMode}
            setViewMode={(mode) => {
              setViewMode(mode);
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
            onAddCategory={onAddCategory}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
        </div>
      </aside>
    </>
  );
}

interface SidebarContentProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  onAddCategory: () => void;
  viewMode: 'list' | 'calendar';
  setViewMode: (mode: 'list' | 'calendar') => void;
}

function SidebarContent({
  categories,
  selectedCategoryId,
  onSelectCategory,
  onAddCategory,
  viewMode,
  setViewMode,
}: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col overflow-y-auto py-4">
      <div className="flex items-center justify-between px-4">
        <h2 className="text-lg font-semibold">Task Manager</h2>
        <XIcon className="h-5 w-5 lg:hidden" onClick={() => document.querySelector('[data-radix-collection-item]')?.click()} />
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
                <Button
                  key={category.id}
                  variant="ghost"
                  className={cn(
                    'w-full justify-start',
                    selectedCategoryId === category.id && 'bg-accent'
                  )}
                  onClick={() => onSelectCategory(category.id)}
                >
                  <div
                    className="mr-2 h-3 w-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span>{category.name}</span>
                </Button>
              ))}
            </motion.div>
          ) : (
            <div className="py-4 text-center text-sm text-muted-foreground">
              No categories yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

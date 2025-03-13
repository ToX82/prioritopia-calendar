
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { ViewMode } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  PlusIcon, 
  ListIcon, 
  CalendarIcon, 
  MenuIcon, 
  LayoutGridIcon, 
  XIcon, 
  KanbanIcon,
  Tag
} from 'lucide-react';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

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
  const { categories } = useAppStore();
  const { t } = useTranslation();
  
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
        <SheetContent side="left" className="w-64 p-0 bg-sidebar border-sidebar-border">
          <SidebarContent
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={(categoryId) => {
              onSelectCategory(categoryId);
              setOpen(false);
            }}
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
      <aside className="hidden lg:flex lg:w-64 lg:flex-col bg-sidebar border-r border-sidebar-border">
        <div className="flex h-full flex-col">
          <SidebarContent
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={onSelectCategory}
            onManageCategories={onManageCategories}
            onManageStatuses={onManageStatuses}
            viewMode={viewMode}
            setViewMode={onChangeViewMode}
          />
        </div>
      </aside>
    </>
  );
}

interface SidebarContentProps {
  categories: any[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  onManageCategories: () => void;
  onManageStatuses: () => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

function SidebarContent({
  categories,
  selectedCategoryId,
  onSelectCategory,
  onManageCategories,
  onManageStatuses,
  viewMode,
  setViewMode,
}: SidebarContentProps) {
  const { t } = useTranslation();

  return (
    <div className="flex h-full flex-col overflow-y-auto py-4 text-sidebar-foreground">
      <div className="flex items-center justify-between px-4">
        <h2 className="text-lg font-semibold">{t('app.title')}</h2>
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
            'w-full justify-start text-sidebar-foreground',
            viewMode === 'list' && 'bg-sidebar-accent text-sidebar-accent-foreground'
          )}
          onClick={() => setViewMode('list')}
        >
          <ListIcon className="mr-2 h-4 w-4" />
          <span>{t('views.list')}</span>
        </Button>
        
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start text-sidebar-foreground',
            viewMode === 'calendar' && 'bg-sidebar-accent text-sidebar-accent-foreground'
          )}
          onClick={() => setViewMode('calendar')}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span>{t('views.calendar')}</span>
        </Button>

        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start text-sidebar-foreground',
            viewMode === 'kanban' && 'bg-sidebar-accent text-sidebar-accent-foreground'
          )}
          onClick={() => setViewMode('kanban')}
        >
          <KanbanIcon className="mr-2 h-4 w-4" />
          <span>{t('views.kanban')}</span>
        </Button>
      </div>
      
      <div className="mt-8 px-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-sidebar-foreground/70">{t('app.categories')}</h3>
        </div>
        
        <div className="mt-2 space-y-1">
          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start text-sidebar-foreground',
              selectedCategoryId === null && 'bg-sidebar-accent text-sidebar-accent-foreground'
            )}
            onClick={() => onSelectCategory(null)}
          >
            <LayoutGridIcon className="mr-2 h-4 w-4" />
            <span>{t('app.allTasks')}</span>
          </Button>
          
          {categories.length > 0 ? (
            <motion.div layout className="space-y-1">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant="ghost"
                  className={cn(
                    'w-full justify-start text-sidebar-foreground',
                    selectedCategoryId === category.id && 'bg-sidebar-accent text-sidebar-accent-foreground'
                  )}
                  onClick={() => onSelectCategory(category.id)}
                >
                  <div
                    className="mr-2 h-3 w-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="truncate">{category.name}</span>
                </Button>
              ))}
            </motion.div>
          ) : (
            <div className="py-4 text-center text-sm text-sidebar-foreground/50">
              {t('app.noCategories')}
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto px-4 pb-4">
        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground"
            onClick={onManageCategories}
          >
            <Tag className="mr-2 h-4 w-4" />
            <span>{t('app.manageCategories')}</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground"
            onClick={onManageStatuses}
          >
            <KanbanIcon className="mr-2 h-4 w-4" />
            <span>{t('app.manageStatuses')}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

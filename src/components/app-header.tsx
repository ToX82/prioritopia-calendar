
import { useAppStore } from '@/lib/store';
import { ViewMode } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/theme-toggle';
import { CalendarIcon, ListIcon, PlusIcon, Search, KanbanIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '@/components/language-selector';

interface AppHeaderProps {
  onAddTask: () => void;
  onSearch: (query: string) => void;
}

export function AppHeader({ onAddTask, onSearch }: AppHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { viewMode, setViewMode } = useAppStore();
  const { t } = useTranslation();
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  // Save the viewMode to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('lastViewMode', viewMode);
  }, [viewMode]);
  
  return (
    <motion.header 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-10 flex flex-col gap-4 border-b bg-background/95 px-4 py-4 backdrop-blur-md sm:px-6 shadow-sm"
    >
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold sm:text-2xl bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">{t('app.title')}</h1>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSelector />
          
          <div className="bg-muted rounded-lg p-1 flex items-center gap-1">
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="icon"
              className="rounded-md h-8 w-8"
              onClick={() => setViewMode('list')}
            >
              <ListIcon className="h-4 w-4" />
              <span className="sr-only">{t('views.list')}</span>
            </Button>
            
            <Button
              variant={viewMode === 'calendar' ? 'default' : 'ghost'}
              size="icon"
              className="rounded-md h-8 w-8"
              onClick={() => setViewMode('calendar')}
            >
              <CalendarIcon className="h-4 w-4" />
              <span className="sr-only">{t('views.calendar')}</span>
            </Button>

            <Button
              variant={viewMode === 'kanban' ? 'default' : 'ghost'}
              size="icon"
              className="rounded-md h-8 w-8"
              onClick={() => setViewMode('kanban')}
            >
              <KanbanIcon className="h-4 w-4" />
              <span className="sr-only">{t('views.kanban')}</span>
            </Button>
          </div>
          
          <Button onClick={onAddTask} size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
            <PlusIcon className="mr-1 h-4 w-4" />
            <span className="hidden sm:inline">{t('app.addTask')}</span>
            <span className="sm:hidden">{t('app.addTask')}</span>
          </Button>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t('app.search')}
            className="pl-9 bg-background/50 focus-visible:ring-primary/30 w-full"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>
    </motion.header>
  );
}

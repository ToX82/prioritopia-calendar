
import { useAppStore } from '@/lib/store';
import { ViewMode } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CalendarIcon, ListIcon, PlusIcon, Search, KanbanIcon } from 'lucide-react';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface AppHeaderProps {
  onAddTask: () => void;
  onSearch: (query: string) => void;
}

export function AppHeader({ onAddTask, onSearch }: AppHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { viewMode, setViewMode } = useAppStore();
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };
  
  return (
    <motion.header 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-10 flex flex-col gap-4 border-b bg-background/80 px-4 py-4 backdrop-blur-md sm:px-6"
    >
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold sm:text-2xl">Task Manager</h1>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className={viewMode === 'list' ? 'bg-secondary' : ''}
            onClick={() => setViewMode('list')}
          >
            <ListIcon className="h-4 w-4" />
            <span className="sr-only">List View</span>
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className={viewMode === 'calendar' ? 'bg-secondary' : ''}
            onClick={() => setViewMode('calendar')}
          >
            <CalendarIcon className="h-4 w-4" />
            <span className="sr-only">Calendar View</span>
          </Button>

          <Button
            variant="outline"
            size="icon"
            className={viewMode === 'kanban' ? 'bg-secondary' : ''}
            onClick={() => setViewMode('kanban')}
          >
            <KanbanIcon className="h-4 w-4" />
            <span className="sr-only">Kanban View</span>
          </Button>
          
          <Button onClick={onAddTask} size="sm">
            <PlusIcon className="mr-1 h-4 w-4" />
            <span>Add Task</span>
          </Button>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search tasks..."
            className="pl-9"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>
    </motion.header>
  );
}

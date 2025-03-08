
import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';

export function useStatusManagement() {
  const [statusManagementOpen, setStatusManagementOpen] = useState(false);
  const { viewMode, setViewMode, setSelectedDate } = useAppStore();
  
  // Load last view mode from localStorage on initial mount
  useEffect(() => {
    const savedViewMode = localStorage.getItem('lastViewMode');
    if (savedViewMode) {
      setViewMode(savedViewMode as any); // Cast to any to handle type conversion
    }
  }, [setViewMode]);
  
  // Reset selected date when switching view modes
  useEffect(() => {
    if (viewMode === 'list') {
      setSelectedDate(null);
    }
  }, [viewMode, setSelectedDate]);

  // Handle opening status management
  const handleManageStatuses = () => {
    setStatusManagementOpen(true);
  };

  return {
    statusManagementOpen,
    setStatusManagementOpen,
    handleManageStatuses,
  };
}


import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';

export function useStatusManagement() {
  const [statusManagementOpen, setStatusManagementOpen] = useState(false);
  const { viewMode, setSelectedDate } = useAppStore();
  
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

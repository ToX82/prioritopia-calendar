
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TaskStatus } from '@/lib/types';
import { getStatusColor, getStatusLabel } from '@/lib/store';

interface StatusBadgeProps {
  status: TaskStatus;
  showLabel?: boolean;
}

export function StatusBadge({ status, showLabel = true }: StatusBadgeProps) {
  const color = getStatusColor(status);
  const label = getStatusLabel(status);
  
  return (
    <Badge className={`${color} font-normal`} variant="outline">
      {showLabel ? label : null}
    </Badge>
  );
}

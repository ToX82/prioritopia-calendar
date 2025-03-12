
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TaskStatus } from '@/lib/types';
import { getStatusColor, getStatusLabel } from '@/lib/store';
import { motion } from 'framer-motion';

interface StatusBadgeProps {
  status: TaskStatus;
  showLabel?: boolean;
}

export function StatusBadge({ status, showLabel = true }: StatusBadgeProps) {
  const color = getStatusColor(status);
  const label = getStatusLabel(status);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Badge className={`${color} font-normal transition-all`} variant="outline">
        {showLabel ? label : null}
      </Badge>
    </motion.div>
  );
}

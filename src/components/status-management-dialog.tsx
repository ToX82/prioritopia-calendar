
import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { TaskStatusConfig } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ArrowDown, ArrowUp, Edit, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface StatusManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StatusManagementDialog({
  open,
  onOpenChange,
}: StatusManagementDialogProps) {
  const { statuses, addStatus, updateStatus, deleteStatus, reorderStatuses } = useAppStore();
  const [editingStatus, setEditingStatus] = useState<TaskStatusConfig | null>(null);
  const [newStatus, setNewStatus] = useState<Omit<TaskStatusConfig, 'id'>>({
    name: '',
    color: '#3b82f6',
    order: 0,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusToDelete, setStatusToDelete] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(Date.now()); // Used to force re-render
  const [orderedStatuses, setOrderedStatuses] = useState<TaskStatusConfig[]>([]);

  // Reset the form when the dialog opens
  useEffect(() => {
    if (open) {
      resetForm();
      setFormKey(Date.now());
      const sorted = [...statuses].sort((a, b) => a.order - b.order);
      setOrderedStatuses(sorted);
    }
  }, [open, statuses]);

  // Get next available order
  const getNextOrder = () => {
    const maxOrder = statuses.reduce((max, status) => Math.max(max, status.order), -1);
    return maxOrder + 1;
  };

  const resetForm = () => {
    setEditingStatus(null);
    setNewStatus({
      name: '',
      color: '#3b82f6',
      order: getNextOrder(),
    });
  };

  const handleAddStatus = () => {
    if (!newStatus.name.trim()) {
      toast.error('Status name is required');
      return;
    }

    if (editingStatus) {
      updateStatus(editingStatus.id, newStatus);
      toast.success('Status updated');
    } else {
      addStatus({
        ...newStatus,
        order: getNextOrder(),
      });
      toast.success('Status added');
    }

    resetForm();
  };

  const handleEditStatus = (status: TaskStatusConfig) => {
    setEditingStatus(status);
    setNewStatus({
      name: status.name,
      color: status.color,
      order: status.order,
    });
  };

  const handleDeleteStatus = (statusId: string) => {
    if (statuses.length <= 1) {
      toast.error('Cannot delete the last status');
      return;
    }
    
    setStatusToDelete(statusId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteStatus = () => {
    if (statusToDelete) {
      deleteStatus(statusToDelete);
      setDeleteDialogOpen(false);
      setStatusToDelete(null);
      toast.success('Status deleted');
    }
  };

  const cancelDeleteStatus = () => {
    setDeleteDialogOpen(false);
    setStatusToDelete(null);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleMoveUp = (status: TaskStatusConfig) => {
    if (status.order > 0) {
      reorderStatuses(status.id, status.order - 1);
      toast.success(`Moved ${status.name} up`);
    }
  };

  const handleMoveDown = (status: TaskStatusConfig) => {
    const maxOrder = statuses.length - 1;
    if (status.order < maxOrder) {
      reorderStatuses(status.id, status.order + 1);
      toast.success(`Moved ${status.name} down`);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px] bg-background">
          <DialogHeader>
            <DialogTitle className="text-xl">Manage Task Statuses</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Add, edit, reorder or remove task statuses as needed. Changes affect task organization.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4" key={formKey}>
            <div className="space-y-4">
              <div className="grid grid-cols-[1fr,120px,auto] gap-2 items-center">
                <Label className="text-foreground/80">Name</Label>
                <Label className="text-foreground/80">Color</Label>
                <span></span>
              </div>

              <div className="max-h-[200px] overflow-y-auto pr-2 space-y-2">
                <AnimatePresence>
                  {[...statuses]
                    .sort((a, b) => a.order - b.order)
                    .map((status) => (
                      <motion.div
                        key={status.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="grid grid-cols-[1fr,120px,auto] gap-2 items-center bg-muted/30 p-2 rounded-md"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: status.color }}
                          />
                          <span>{status.name}</span>
                        </div>
                        <div
                          className="w-full h-8 rounded-md border border-input cursor-pointer"
                          style={{ backgroundColor: status.color }}
                          onClick={() => handleEditStatus(status)}
                        />
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMoveUp(status)}
                            disabled={status.order === 0}
                            className="h-8 w-8 transition-opacity hover:opacity-100"
                            title="Move up"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMoveDown(status)}
                            disabled={status.order === statuses.length - 1}
                            className="h-8 w-8 transition-opacity hover:opacity-100"
                            title="Move down"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditStatus(status)}
                            className="h-8 w-8"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteStatus(status.id)}
                            disabled={statuses.length <= 1}
                            className="text-destructive hover:text-destructive h-8 w-8"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                {editingStatus ? 'Edit Status' : 'Add New Status'}
                {editingStatus && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xs bg-muted px-2 py-0.5 rounded-full"
                  >
                    Editing: {editingStatus.name}
                  </motion.span>
                )}
              </h3>
              <div className="grid gap-4">
                <div className="grid grid-cols-[1fr,120px] gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="statusName" className="text-foreground/80">Name</Label>
                    <Input
                      id="statusName"
                      value={newStatus.name}
                      onChange={(e) => setNewStatus({ ...newStatus, name: e.target.value })}
                      placeholder="Enter status name"
                      className="w-full bg-background border-input focus-visible:ring-primary/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="statusColor" className="text-foreground/80">Color</Label>
                    <Input
                      id="statusColor"
                      type="color"
                      value={newStatus.color}
                      onChange={(e) => setNewStatus({ ...newStatus, color: e.target.value })}
                      className="w-full h-10 p-1 cursor-pointer"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  {editingStatus && (
                    <Button variant="outline" onClick={resetForm} className="border-input">
                      Cancel
                    </Button>
                  )}
                  <Button 
                    onClick={handleAddStatus} 
                    className="bg-primary hover:bg-primary/90 transition-colors"
                  >
                    {editingStatus ? 'Update' : 'Add'} Status
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-background">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Status</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this status? Tasks with this status will be moved to another available status.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDeleteStatus}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteStatus}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

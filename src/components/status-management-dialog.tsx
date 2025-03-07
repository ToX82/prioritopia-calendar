
import React, { useState } from 'react';
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
import { Edit, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface StatusManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StatusManagementDialog({
  open,
  onOpenChange,
}: StatusManagementDialogProps) {
  const { statuses, addStatus, updateStatus, deleteStatus } = useAppStore();
  const [editingStatus, setEditingStatus] = useState<TaskStatusConfig | null>(null);
  const [newStatus, setNewStatus] = useState<Omit<TaskStatusConfig, 'id'>>({
    name: '',
    color: '#3b82f6',
    order: 0,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusToDelete, setStatusToDelete] = useState<string | null>(null);

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

  const isDefaultStatus = (statusId: string) => {
    return ['new', 'in-progress', 'testing', 'awaiting-feedback', 'completed'].includes(statusId);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Manage Task Statuses</DialogTitle>
            <DialogDescription>
              Add, edit, or remove task statuses. Default statuses cannot be deleted.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-4">
              <div className="grid grid-cols-[1fr,120px,auto] gap-2 items-center">
                <Label>Name</Label>
                <Label>Color</Label>
                <span></span>
              </div>

              {statuses
                .sort((a, b) => a.order - b.order)
                .map((status) => (
                  <div key={status.id} className="grid grid-cols-[1fr,120px,auto] gap-2 items-center">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: status.color }}
                      />
                      <span>{status.name}</span>
                      {isDefaultStatus(status.id) && (
                        <span className="text-xs text-muted-foreground">(Default)</span>
                      )}
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
                        onClick={() => handleEditStatus(status)}
                        disabled={isDefaultStatus(status.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteStatus(status.id)}
                        disabled={isDefaultStatus(status.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="text-sm font-medium mb-3">
                {editingStatus ? 'Edit Status' : 'Add New Status'}
              </h3>
              <div className="grid gap-4">
                <div className="grid grid-cols-[1fr,120px] gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="statusName">Name</Label>
                    <Input
                      id="statusName"
                      value={newStatus.name}
                      onChange={(e) => setNewStatus({ ...newStatus, name: e.target.value })}
                      placeholder="Enter status name"
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="statusColor">Color</Label>
                    <Input
                      id="statusColor"
                      type="color"
                      value={newStatus.color}
                      onChange={(e) => setNewStatus({ ...newStatus, color: e.target.value })}
                      className="w-full h-10 p-1"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  {editingStatus && (
                    <Button variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  )}
                  <Button onClick={handleAddStatus}>
                    {editingStatus ? 'Update' : 'Add'} Status
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Status</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this status? Tasks with this status will be moved to "New" status.
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

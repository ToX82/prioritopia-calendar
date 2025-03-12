
import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Category } from '@/lib/types';
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
import { motion, AnimatePresence } from 'framer-motion';

interface CategoryManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const colorOptions = [
  '#3b82f6', // Blue
  '#10b981', // Green
  '#f59e0b', // Yellow
  '#ef4444', // Red
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#6b7280', // Gray
  '#1e293b', // Dark Blue
];

export function CategoryManagementDialog({
  open,
  onOpenChange,
}: CategoryManagementDialogProps) {
  const { categories, addCategory, updateCategory, deleteCategory } = useAppStore();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState<Omit<Category, 'id'>>({
    name: '',
    color: '#3b82f6',
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(Date.now()); // Used to force re-render

  // Reset the form when the dialog opens
  useEffect(() => {
    if (open) {
      resetForm();
      setFormKey(Date.now());
    }
  }, [open]);

  const resetForm = () => {
    setEditingCategory(null);
    setNewCategory({
      name: '',
      color: '#3b82f6',
    });
  };

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    if (editingCategory) {
      updateCategory(editingCategory.id, newCategory);
      toast.success('Category updated');
    } else {
      addCategory(newCategory);
      toast.success('Category added');
    }

    resetForm();
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setNewCategory({
      name: category.name,
      color: category.color,
    });
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategoryToDelete(categoryId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteCategory = () => {
    if (categoryToDelete) {
      const categoryName = categories.find(c => c.id === categoryToDelete)?.name || '';
      deleteCategory(categoryToDelete);
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
      toast.success(`Category "${categoryName}" deleted`);
    }
  };

  const cancelDeleteCategory = () => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px] bg-background">
          <DialogHeader>
            <DialogTitle className="text-xl">Manage Categories</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Add, edit, or remove categories to organize your tasks.
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
                  {categories.map((category) => (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="grid grid-cols-[1fr,120px,auto] gap-2 items-center bg-muted/30 p-2 rounded-md"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span>{category.name}</span>
                      </div>
                      <div
                        className="w-full h-8 rounded-md border border-input cursor-pointer"
                        style={{ backgroundColor: category.color }}
                        onClick={() => handleEditCategory(category)}
                      />
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditCategory(category)}
                          className="h-8 w-8"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteCategory(category.id)}
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
                {editingCategory ? 'Edit Category' : 'Add New Category'}
                {editingCategory && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xs bg-muted px-2 py-0.5 rounded-full"
                  >
                    Editing: {editingCategory.name}
                  </motion.span>
                )}
              </h3>
              <div className="grid gap-4">
                <div className="grid grid-cols-[1fr,auto] gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="categoryName" className="text-foreground/80">Name</Label>
                    <Input
                      id="categoryName"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      placeholder="Enter category name"
                      className="w-full bg-background border-input focus-visible:ring-primary/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground/80">Color</Label>
                    <div className="flex flex-wrap gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={`h-8 w-8 rounded-full border-2 transition-all ${
                            newCategory.color === color ? 'border-foreground scale-110 shadow-md' : 'border-transparent hover:scale-105'
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setNewCategory({ ...newCategory, color })}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  {editingCategory && (
                    <Button variant="outline" onClick={resetForm} className="border-input">
                      Cancel
                    </Button>
                  )}
                  <Button 
                    onClick={handleAddCategory} 
                    className="bg-primary hover:bg-primary/90 transition-colors"
                  >
                    {editingCategory ? 'Update' : 'Add'} Category
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
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this category? Any tasks assigned to this category will be moved to "No Category".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDeleteCategory}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteCategory}
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

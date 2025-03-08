
import { useAppStore } from '@/lib/store';
import { Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialCategory?: Category | null;
}

const defaultCategory: Omit<Category, 'id'> = {
  name: '',
  color: '#3b82f6', // Default blue color
};

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

export function CategoryDialog({
  open,
  onOpenChange,
  initialCategory,
}: CategoryDialogProps) {
  const { addCategory, updateCategory } = useAppStore();
  const [category, setCategory] = useState<Omit<Category, 'id'>>(defaultCategory);
  const [formKey, setFormKey] = useState(Date.now()); // Used to force re-render
  
  // Reset form when dialog opens/closes or initialCategory changes
  useEffect(() => {
    if (open) {
      if (initialCategory) {
        setCategory({
          name: initialCategory.name,
          color: initialCategory.color,
        });
      } else {
        setCategory(defaultCategory);
      }
      setFormKey(Date.now()); // Force re-render when dialog opens
    }
  }, [initialCategory, open]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category.name.trim()) {
      toast.error('Please enter a category name');
      return;
    }
    
    if (initialCategory) {
      updateCategory(initialCategory.id, category);
      toast.success(`Category "${category.name}" updated`);
    } else {
      addCategory(category);
      toast.success(`Category "${category.name}" created`);
    }
    
    onOpenChange(false);
  };
  
  const handleClose = () => {
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-background">
        <form onSubmit={handleSubmit} key={formKey}>
          <DialogHeader>
            <DialogTitle className="text-xl">
              {initialCategory ? 'Edit Category' : 'Create Category'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-foreground/80">Name</Label>
              <Input
                id="name"
                value={category.name}
                onChange={(e) => setCategory({ ...category, name: e.target.value })}
                placeholder="Category name"
                className="w-full bg-background border-input focus-visible:ring-primary/30"
                autoFocus
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label className="text-foreground/80">Color</Label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={cn(
                      'h-8 w-8 rounded-full border-2 transition-all',
                      category.color === color ? 'border-foreground scale-110 shadow-md' : 'border-transparent hover:scale-105'
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => setCategory({ ...category, color })}
                  />
                ))}
              </div>
            </div>
            
            <div className="mt-2">
              <Label className="text-foreground/80">Preview</Label>
              <div className="flex items-center mt-2 gap-2 bg-muted/30 p-3 rounded-md">
                <div
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <div
                  className="rounded-full px-3 py-1 text-sm"
                  style={{
                    backgroundColor: `${category.color}20`,
                    color: category.color,
                  }}
                >
                  {category.name || 'Category Name'}
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} className="border-input">
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              {initialCategory ? 'Update Category' : 'Create Category'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

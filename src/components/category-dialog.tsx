
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
  
  // Reset form when dialog opens/closes or initialCategory changes
  useEffect(() => {
    if (initialCategory) {
      setCategory({
        name: initialCategory.name,
        color: initialCategory.color,
      });
    } else {
      setCategory(defaultCategory);
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
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {initialCategory ? 'Edit Category' : 'Create Category'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={category.name}
                onChange={(e) => setCategory({ ...category, name: e.target.value })}
                placeholder="Category name"
                className="w-full"
                autoFocus
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={cn(
                      'h-8 w-8 rounded-full border-2 transition-all',
                      category.color === color ? 'border-gray-900 scale-110' : 'border-transparent hover:scale-105'
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => setCategory({ ...category, color })}
                  />
                ))}
              </div>
            </div>
            
            <div className="mt-2">
              <Label>Preview</Label>
              <div className="flex items-center mt-2 gap-2">
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
            <Button type="submit">
              {initialCategory ? 'Update Category' : 'Create Category'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

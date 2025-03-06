
import { useAppStore } from '@/lib/store';
import { Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { MoreHorizontal, Pencil, Trash } from 'lucide-react';
import React from 'react';

interface CategoryItemProps {
  category: Category;
  isSelected: boolean;
  onSelect: (categoryId: string) => void;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
}

export function CategoryItem({
  category,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: CategoryItemProps) {
  return (
    <div className="group flex items-center">
      <Button
        variant="ghost"
        className={cn(
          'flex-1 justify-start',
          isSelected && 'bg-accent'
        )}
        onClick={() => onSelect(category.id)}
      >
        <div
          className="mr-2 h-3 w-3 rounded-full"
          style={{ backgroundColor: category.color }}
        />
        <span className="truncate">{category.name}</span>
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Category menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(category)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="text-destructive focus:text-destructive"
            onClick={() => onDelete(category.id)}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

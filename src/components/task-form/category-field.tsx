
import { Category } from '@/lib/types';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CategoryFieldProps {
  categoryId: string | null;
  categories: Category[];
  onCategoryChange: (value: string | null) => void;
}

export function CategoryField({
  categoryId,
  categories,
  onCategoryChange,
}: CategoryFieldProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="category">Category</Label>
      <Select
        value={categoryId || 'none'}
        onValueChange={(value) => onCategoryChange(value === 'none' ? null : value)}
      >
        <SelectTrigger id="category">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No Category</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              <div className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                {category.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

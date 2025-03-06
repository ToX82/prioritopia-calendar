
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface CompletedFieldProps {
  completed: boolean;
  onCompletedChange: (value: boolean) => void;
}

export function CompletedField({
  completed,
  onCompletedChange,
}: CompletedFieldProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="completed"
        checked={completed}
        onCheckedChange={(checked) => onCompletedChange(checked as boolean)}
      />
      <Label htmlFor="completed" className="cursor-pointer">
        Mark as completed
      </Label>
    </div>
  );
}

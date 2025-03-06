
import { Priority } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface PriorityFieldProps {
  priority: Priority;
  onPriorityChange: (value: Priority) => void;
}

export function PriorityField({
  priority,
  onPriorityChange,
}: PriorityFieldProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="priority">Priority</Label>
      <RadioGroup
        id="priority"
        value={priority}
        onValueChange={(value) => onPriorityChange(value as Priority)}
        className="flex space-x-1"
      >
        <div className="flex items-center space-x-1 rounded-md border p-2">
          <RadioGroupItem value="low" id="low" />
          <Label htmlFor="low" className="cursor-pointer">Low</Label>
        </div>
        <div className="flex items-center space-x-1 rounded-md border p-2">
          <RadioGroupItem value="medium" id="medium" />
          <Label htmlFor="medium" className="cursor-pointer">Medium</Label>
        </div>
        <div className="flex items-center space-x-1 rounded-md border p-2">
          <RadioGroupItem value="high" id="high" />
          <Label htmlFor="high" className="cursor-pointer">High</Label>
        </div>
      </RadioGroup>
    </div>
  );
}

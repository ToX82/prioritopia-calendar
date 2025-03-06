
import { TaskStatus } from '@/lib/types';
import { getStatusLabel } from '@/lib/store';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface StatusFieldProps {
  status: TaskStatus;
  onStatusChange: (value: TaskStatus) => void;
}

export function StatusField({
  status,
  onStatusChange,
}: StatusFieldProps) {
  const statuses: TaskStatus[] = ['new', 'in-progress', 'testing', 'awaiting-feedback', 'completed'];
  
  return (
    <div className="grid gap-2">
      <Label htmlFor="status">Status</Label>
      <Select
        value={status}
        onValueChange={(value) => onStatusChange(value as TaskStatus)}
      >
        <SelectTrigger id="status">
          <SelectValue placeholder="Select a status" />
        </SelectTrigger>
        <SelectContent>
          {statuses.map((statusValue) => (
            <SelectItem key={statusValue} value={statusValue}>
              {getStatusLabel(statusValue)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Separator } from '../../../components/ui/separator';

type RoleFormProps = {
  roleName: string;
  setRoleName: (name: string) => void;
  error?: string;
};

export function RoleForm({ roleName, setRoleName, error }: RoleFormProps) {
  const inputId = 'roleName';

  return (
    <div className="grid gap-4 py-4">
      <div className="space-y-2">
        <Label htmlFor={inputId}>Role Name:</Label>
        <Input
          id={inputId}
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          className="w-full"
          placeholder="Enter role name"
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
      <Separator className="my-4" />
    </div>
  );
}

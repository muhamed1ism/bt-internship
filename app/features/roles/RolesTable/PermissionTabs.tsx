import { allPermissions } from '@app/constants/constants';
import { Checkbox } from '../../../components/ui/checkbox';
import { Label } from '../../../components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/tabs';
import { useMemo } from 'react';

export function PermissionTabs({
  selectedPermissions,
  setSelectedPermissions,
  activeTab,
  setActiveTab,
}: {
  selectedPermissions: { [category: string]: string[] };
  setSelectedPermissions: React.Dispatch<React.SetStateAction<{ [category: string]: string[] }>>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  const togglePermission = (category: string, permission: string) => {
    setSelectedPermissions((prev) => {
      const updated = { ...prev };
      if (!updated[category]) updated[category] = [];
      if (updated[category].includes(permission)) {
        updated[category] = updated[category].filter((p: string) => p !== permission);
        if (updated[category].length === 0) delete updated[category];
      } else {
        updated[category] = [...updated[category], permission];
      }
      return updated;
    });
  };

  const isPermissionSelected = useMemo(
    () => (category: string, permission: string) =>
      selectedPermissions[category]?.includes(permission) || false,
    [selectedPermissions],
  );

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-4 grid grid-cols-3 md:grid-cols-6">
        {Object.keys(allPermissions).map((category) => (
          <TabsTrigger key={category} value={category} className="text-xs md:text-sm">
            {category.split(' ')[0]}
          </TabsTrigger>
        ))}
      </TabsList>

      {Object.entries(allPermissions).map(([category, permissions]) => (
        <TabsContent key={category} value={category} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">{category}</h3>
            <span className="text-muted-foreground text-sm">
              {selectedPermissions[category]?.length || 0} of {permissions.length} selected
            </span>
          </div>

          <div className="ap-4 grid grid-cols-1 gap-4 rounded-md border md:grid-cols-2">
            {permissions.map((permission) => (
              <div key={permission} className="flex items-start space-x-2">
                <Checkbox
                  id={`${category}-${permission}`}
                  checked={isPermissionSelected(category, permission)}
                  onCheckedChange={() => togglePermission(category, permission)}
                />
                <div className="grid gap-1.5">
                  <Label htmlFor={`${category}-${permission}`} className="font-mono text-sm">
                    {permission}
                  </Label>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}

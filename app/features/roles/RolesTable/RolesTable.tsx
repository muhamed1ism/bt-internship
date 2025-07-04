import { useMemo, useState } from 'react';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Search, Plus, LayoutGrid, List } from 'lucide-react';
import { RoleTableListView } from './RoleTableListView';
import { RoleGridView } from './RoleGridView';
import { RoleDialog } from '../RoleDialog/RoleDialog';
import { RoleType } from '@app/types/types';
import { initialRoles } from '@app/constants/constants';

export type ViewProps = {
  roles: RoleType[];
  onEdit: (role: RoleType) => void;
};

export default function RolesTable() {
  const [roles, setRoles] = useState<RoleType[]>(initialRoles);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);
  const [isNew, setIsNew] = useState(false);

  const filteredRoles = useMemo(
    () => roles.filter((role) => role.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [roles, searchQuery],
  );

  const handleNew = () => {
    setSelectedRole({ id: '', name: '', permissions: {} });
    setIsNew(true);
    setDialogOpen(true);
  };

  const handleEdit = (role: RoleType) => {
    setSelectedRole({ ...role });
    setIsNew(false);
    setDialogOpen(true);
  };

  const handleSave = (updatedRole: RoleType, createNew = false) => {
    if (createNew || !updatedRole.id || updatedRole.id === '') {
      const newRole = { ...updatedRole, id: `role-${Date.now()}` };
      setRoles((prev) => [...prev, newRole]);
    } else {
      setRoles((prev) => prev.map((r) => (r.id === updatedRole.id ? updatedRole : r)));
    }
  };

  return (
    <div className="mx-auto mt-12 w-full max-w-6xl p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Roles</h1>
        <Button onClick={handleNew}>
          <Plus className="mr-1 h-4 w-4" /> New Role
        </Button>
      </div>

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search..."
            className="bg-primary-foreground pr-4 pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex rounded-lg border-1">
          <Button
            size="icon"
            onClick={() => setViewMode('list')}
            className={`rounded-r-none ${viewMode === 'list' ? 'text-primary-foreground bg-primary' : 'text-primary bg-primary-foreground hover:bg-primary/10'}`}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            onClick={() => setViewMode('grid')}
            className={`rounded-l-none ${viewMode === 'grid' ? 'text-primary-foreground bg-primary' : 'text-primary bg-primary-foreground hover:bg-primary/10'}`}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <RoleTableListView roles={filteredRoles} onEdit={handleEdit} />
      ) : (
        <RoleGridView roles={filteredRoles} onEdit={handleEdit} />
      )}

      <RoleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        role={selectedRole}
        allRoles={roles}
        isNew={isNew}
        onSave={handleSave}
      />
    </div>
  );
}

import { useMemo, useState } from 'react';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Search, Plus, LayoutGrid, List } from 'lucide-react';
import { RoleType } from '@app/types/types';
import { RoleTableListView } from './view/RoleTableListView';
import { RoleGridView } from './view/RoleGridView';
import { useGetAllRoles } from '@app/hooks/role/useGetAllRoles';
import { useUpdateRole } from '@app/hooks/role/useUpdateRole';
import { Role } from '@app/types/shared';
import { CreateRoleDialog } from './dialog/CreateRoleDialog';
import { useGetAllPermissions } from '@app/hooks/role/useGetAllPermissions';
import { UpdateRoleDialog } from './dialog/UpdateRoleDialog';

export type ViewProps = {
  roles: RoleType[];
  onEdit: (role: RoleType) => void;
};

export default function RolesTable() {
  const { roles } = useGetAllRoles();
  const { permissions } = useGetAllPermissions();
  const { mutate: updateRole } = useUpdateRole();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [createOpen, setCreateOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const filteredRoles = useMemo(
    () =>
      roles?.filter(
        (role) =>
          role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          role.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [roles, searchQuery],
  );

  const handleUpdate = (role: Role) => {
    setSelectedRole(role);
    setUpdateOpen(true);
  };

  return (
    <div className="mx-auto mt-12 w-full max-w-6xl p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Roles</h1>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-1 h-4 w-4" /> New Role
        </Button>
      </div>

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search..."
            className="bg-card pr-4 pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex rounded-lg border-1">
          <Button
            size="icon"
            onClick={() => setViewMode('list')}
            className={`rounded-r-none ${viewMode === 'list' ? 'text-secondary bg-primary' : 'text-primary bg-card hover:bg-primary/10'}`}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            onClick={() => setViewMode('grid')}
            className={`rounded-l-none ${viewMode === 'grid' ? 'text-secondary bg-primary' : 'text-primary bg-card hover:bg-primary/10'}`}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <RoleTableListView roles={filteredRoles || []} onEdit={handleUpdate} />
      ) : (
        <RoleGridView roles={filteredRoles || []} onEdit={handleUpdate} />
      )}

      <CreateRoleDialog
        categorizedPermissions={permissions}
        onOpenChange={setCreateOpen}
        open={createOpen}
      />

      <UpdateRoleDialog
        categorizedPermissions={permissions}
        onOpenChange={setUpdateOpen}
        open={updateOpen}
        role={selectedRole}
      />

      {/* <RoleDialog */}
      {/*   open={dialogOpen} */}
      {/*   onOpenChange={setDialogOpen} */}
      {/*   role={selectedRole} */}
      {/*   allRoles={roles || []} */}
      {/*   isNew={isNew} */}
      {/*   onCreate={handleCreate} */}
      {/*   onUpdate={handleUpdate} */}
      {/* /> */}
    </div>
  );
}

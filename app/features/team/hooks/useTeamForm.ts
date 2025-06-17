import { useState } from 'react';
import { TeamFormData } from '@app/schemas/team-form';

interface TeamFormState {
  isOpen: boolean;
  mode: 'create' | 'edit';
  team?: TeamFormData & { id?: number };
}

export function useTeamForm() {
  const [formState, setFormState] = useState<TeamFormState>({
    isOpen: false,
    mode: 'create',
    team: undefined,
  });

  const openCreateForm = () => {
    setFormState({
      isOpen: true,
      mode: 'create',
      team: undefined,
    });
  };

  const openEditForm = (team: TeamFormData & { id?: number }) => {
    setFormState({
      isOpen: true,
      mode: 'edit',
      team,
    });
  };

  const closeForm = () => {
    setFormState((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  const handleSave = (data: TeamFormData) => {
    if (formState.mode === 'create') {
      console.log('Creating team:', data);
      // TODO: Implement team creation logic
    } else {
      console.log('Updating team:', { ...data, id: formState.team?.id });
      // TODO: Implement team update logic
    }
    closeForm();
  };

  const handleRemove = (teamId: number) => {
    console.log('Removing team:', teamId);
    // TODO: Implement team removal logic
    closeForm();
  };

  return {
    formState,
    openCreateForm,
    openEditForm,
    closeForm,
    handleSave,
    handleRemove,
  };
}

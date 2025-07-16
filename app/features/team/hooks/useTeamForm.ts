import { useState } from 'react';
import { Team } from '@app/types/team';

interface TeamFormState {
  team?: Team;
  isOpen: boolean;
  mode: 'create' | 'edit';
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

  const openEditForm = (team: Team) => {
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

  return {
    formState,
    openCreateForm,
    openEditForm,
    closeForm,
  };
}

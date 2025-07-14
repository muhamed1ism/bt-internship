import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@app/components/ui/button';
import { Textarea } from '@app/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@app/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@app/components/ui/form';
import { Trash2 } from 'lucide-react';
import { teamSchema, TeamFormValues } from '@app/schemas';
import { TEAM_STATUS_OPTIONS } from '@app/constants/team-form';
import { TeamRemovalModal } from '../modal/TeamRemovalModal';
import { useCreateTeam, useDeleteTeam, useUpdateTeam } from '@app/hooks/team';
import { TeamFormProps } from '../modal/TeamFormModal';
import { FormDatePicker } from '@app/components/forms/FormDatePicker';
import { FormInputField } from '@app/components/forms/FormInputField';
import { FormChipsInputField } from '@app/components/forms/FormChipsInputField';

const menuItems = [
  { value: 'React' },
  { value: 'Angular' },
  { value: 'Vue.js' },
  { value: 'Node.js' },
  { value: 'Python' },
  { value: 'Java' },
  { value: 'C#' },
  { value: 'PHP' },
  { value: 'TypeScript' },
  { value: 'Docker' },
  { value: 'Kubernetes' },
  { value: 'AWS' },
];

export const TeamForm = ({ team, onClose, mode }: TeamFormProps) => {
  const { mutate: createTeam, error: createError } = useCreateTeam();
  const { mutate: updateTeam, error: updateError } = useUpdateTeam();
  const { mutate: deleteTeam } = useDeleteTeam();

  const [showRemovalModal, setShowRemovalModal] = useState(false);

  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamSchema.form),
    defaultValues: (team as TeamFormValues) || {
      name: '',
      clientName: '',
      status: '',
      startDate: new Date(),
      endDate: undefined,
      projectDescription: '',
      documentation: '',
      githubLink: '',
      technologies: [],
    },
  });

  const onSubmit = (formData: TeamFormValues) => {
    if (mode === 'create') {
      createTeam(formData);
      onClose();
    } else if (mode === 'edit') {
      if (!team?.id) return;
      updateTeam({ formData, teamId: team.id });
      onClose();
    }
  };

  const handleRemove = () => {
    setShowRemovalModal(true);
  };

  const confirmRemoval = () => {
    if (!team?.id) return;
    deleteTeam(team.id);
    setShowRemovalModal(false);
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Team Name */}
          <FormInputField control={form.control} name="name" label="Name" />

          {/* Technologies */}
          <FormChipsInputField
            control={form.control}
            name="technologies"
            label="Technologies"
            menuItems={menuItems}
          />

          {/* Client */}
          <FormInputField control={form.control} name="clientName" label="Client Name" />

          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="border-primary/30 bg-card w-1/2">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {TEAM_STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Start Date */}
          <FormDatePicker control={form.control} name="startDate" label="Start Date" />

          {/* End Date */}
          <FormDatePicker control={form.control} name="endDate" label="End Date" />

          {/* Project Description */}
          <FormField
            control={form.control}
            name="projectDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Description *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the project goals, requirements, and objectives..."
                    className="bg-card border-primary/30 min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* GitHub URL */}
          <FormInputField control={form.control} name="githubLink" label="Github Url" />

          {/* GitHub URLs */}
          {/* <FormField */}
          {/*   control={form.control} */}
          {/*   name="githubUrls" */}
          {/*   render={({ field }) => ( */}
          {/*     <FormItem> */}
          {/*       <MultiUrlInput */}
          {/*         label="GitHub Repositories" */}
          {/*         urls={field.value || ['']} */}
          {/*         onChange={field.onChange} */}
          {/*         placeholder="https://github.com/organization/repository" */}
          {/*         type="github" */}
          {/*         error={form.formState.errors.githubUrls?.message} */}
          {/*       /> */}
          {/*     </FormItem> */}
          {/*   )} */}
          {/* /> */}

          {/* JIRA URLs */}
          {/* <FormField */}
          {/*   control={form.control} */}
          {/*   name="jiraUrls" */}
          {/*   render={({ field }) => ( */}
          {/*     <FormItem> */}
          {/*       <MultiUrlInput */}
          {/*         label="JIRA Projects" */}
          {/*         urls={field.value || ['']} */}
          {/*         onChange={field.onChange} */}
          {/*         placeholder="https://organization.atlassian.net/browse/PROJECT" */}
          {/*         type="jira" */}
          {/*         error={form.formState.errors.jiraUrls?.message} */}
          {/*       /> */}
          {/*     </FormItem> */}
          {/*   )} */}
          {/* /> */}

          {/* Action Buttons */}
          <div className="border-border flex items-center justify-between border-t pt-6">
            {/* Remove Team Button (only in edit mode) */}
            {mode === 'edit' && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemove}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Remove Team
              </Button>
            )}

            {createError && <p className="text-sm text-red-500">{createError.message}</p>}

            {updateError && <p className="text-sm text-red-500">{updateError.message}</p>}

            {/* Save/Cancel Buttons */}
            <div className="flex w-full items-center justify-end gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>

              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? 'Saving...'
                  : mode === 'create'
                    ? 'Create Team'
                    : 'Save Changes'}
              </Button>
            </div>
          </div>
        </form>
      </Form>

      {/* Team Removal Confirmation Modal */}
      <TeamRemovalModal
        isOpen={showRemovalModal}
        onClose={() => setShowRemovalModal(false)}
        onConfirm={confirmRemoval}
        teamName={form.watch('name') || team?.name || 'Unknown Team'}
      />
    </div>
  );
};

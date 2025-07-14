import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
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
import { Trash2, Users } from 'lucide-react';
import { teamSchema, TeamFormValues } from '@app/schemas';
import { TEAM_STATUS_OPTIONS } from '@app/constants/team-form';
import { TeamRemovalModal } from '../modal/TeamRemovalModal';
import { useCreateTeam, useDeleteTeam, useUpdateTeam } from '@app/hooks/team';
import { TeamFormProps } from '../modal/TeamFormModal';
import { TechnologySelector } from '../TechnologySelector';
import { FormDatePicker } from '@app/components/forms/FormDatePicker';

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
    console.log('submitting...')
    console.log({mode})
    console.log({formData})
    if (mode === 'create') {
      console.log('Creating')
      console.log({formData});
      createTeam(formData);
    } else if (mode === 'edit') {
      console.log('Editing')
      console.log({formData})
      if (!team?.id) return;
      updateTeam({ formData, teamId: team.id });
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
      {/* Team Avatar Header */}
      <div className="mb-8 flex items-center justify-center">
        <div className="relative">
          {/* Team Icon Overlay */}
          <div className="bg-primary border-background absolute -right-1 -bottom-1 rounded-full border-2 p-1.5 shadow-sm">
            <Users className="text-primary-foreground h-3 w-3" />
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Team Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter team name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Technologies */}
          <FormField
            control={form.control}
            name="technologies"
            render={({ field }) => (
              <FormItem>
                <TechnologySelector
                  technologies={field.value || []}
                  onChange={field.onChange}
                  error={form.formState.errors.technologies?.message}
                />
              </FormItem>
            )}
          />

          {/* Client */}
          <FormField
            control={form.control}
            name="clientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter client name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
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
          <FormItem>
            <FormLabel>Start Date *</FormLabel>
            <FormControl>
              <FormDatePicker control={form.control} name="startDate" />
            </FormControl>
            <FormMessage />
          </FormItem>

          {/* End Date */}
          <FormItem>
            <FormLabel>End Date (Optional)</FormLabel>
            <FormControl>
              <FormDatePicker control={form.control} name="endDate" />
            </FormControl>
            <FormMessage />
          </FormItem>

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
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* GitHub URL */}
          <FormField
            control={form.control}
            name="githubLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub URL</FormLabel>
                <FormControl>
                  <Input placeholder="Enter GitHub URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

            {createError && (
              <p className='text-red-500 text-sm'>{createError.message}</p>
            )}  

            {updateError && (
              <p className='text-red-500 text-sm'>{updateError.message}</p>
            )}

            {mode === 'create' && <div />}

            {/* Save/Cancel Buttons */}
            <div className="flex items-center gap-3">
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

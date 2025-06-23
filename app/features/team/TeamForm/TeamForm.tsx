import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Avatar, AvatarImage, AvatarFallback } from '@app/components/ui/avatar';
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
import { Trash2, Users, DollarSign } from 'lucide-react';
import { teamSchema, TeamFormValues } from '@app/schemas';
import { TEAM_STATUS_OPTIONS, PRIORITY_OPTIONS, DEFAULT_TEAM_FORM } from '@app/constants/team-form';
import { TeamFormProps } from '@app/types/team-form';
import { TechnologySelector } from './TechnologySelector';
import { TeamRemovalModal } from './TeamRemovalModal';
import { MultiUrlInput } from './MultiUrlInput';

export const TeamForm = ({ team, onSave, onRemove, onClose, mode }: TeamFormProps) => {
  const [showRemovalModal, setShowRemovalModal] = useState(false);
  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamSchema.team),
    defaultValues: team || DEFAULT_TEAM_FORM,
  });

  const onSubmit = (data: TeamFormValues) => {
    onSave(data);
  };

  const handleRemove = () => {
    setShowRemovalModal(true);
  };

  const confirmRemoval = () => {
    if (team?.id && onRemove) {
      onRemove(team.id);
    }
    setShowRemovalModal(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const teamName = form.watch('name');

  return (
    <div className="space-y-6">
      {/* Team Avatar Header */}
      <div className="mb-8 flex items-center justify-center">
        <div className="relative">
          <div className="flex items-center justify-center">
            {/* Left Avatar */}
            <Avatar className="relative z-10 h-12 w-12 border-2 border-white shadow-lg">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${teamName || 'team'}-1`}
              />
              <AvatarFallback className="bg-gray-200 text-sm font-medium text-gray-700">
                T1
              </AvatarFallback>
            </Avatar>

            {/* Center Avatar */}
            <Avatar className="relative z-20 -mx-3 h-16 w-16 border-2 border-white shadow-lg">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${teamName || 'team'}-lead`}
              />
              <AvatarFallback className="bg-gray-800 text-lg font-semibold text-white">
                {teamName ? getInitials(teamName) : 'TM'}
              </AvatarFallback>
            </Avatar>

            {/* Right Avatar */}
            <Avatar className="relative z-10 h-12 w-12 border-2 border-white shadow-lg">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${teamName || 'team'}-3`}
              />
              <AvatarFallback className="bg-gray-200 text-sm font-medium text-gray-700">
                T3
              </AvatarFallback>
            </Avatar>
          </div>

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
            name="client"
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
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} min={new Date().toISOString().split('T')[0]} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Project Name */}
          <FormField
            control={form.control}
            name="projectName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter project name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

          {/* End Date */}
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    min={form.watch('startDate') || new Date().toISOString().split('T')[0]}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Priority */}
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PRIORITY_OPTIONS.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        <div className="flex items-center gap-2">
                          <div className={`h-3 w-3 rounded-full ${priority.color}`} />
                          {priority.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Budget */}
          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget (Optional)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <DollarSign className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <Input
                      type="number"
                      placeholder="Enter budget amount"
                      className="pl-10"
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.value ? Number(e.target.value) : undefined)
                      }
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* GitHub URLs */}
          <FormField
            control={form.control}
            name="githubUrls"
            render={({ field }) => (
              <FormItem>
                <MultiUrlInput
                  label="GitHub Repositories"
                  urls={field.value || ['']}
                  onChange={field.onChange}
                  placeholder="https://github.com/organization/repository"
                  type="github"
                  error={form.formState.errors.githubUrls?.message}
                />
              </FormItem>
            )}
          />

          {/* JIRA URLs */}
          <FormField
            control={form.control}
            name="jiraUrls"
            render={({ field }) => (
              <FormItem>
                <MultiUrlInput
                  label="JIRA Projects"
                  urls={field.value || ['']}
                  onChange={field.onChange}
                  placeholder="https://organization.atlassian.net/browse/PROJECT"
                  type="jira"
                  error={form.formState.errors.jiraUrls?.message}
                />
              </FormItem>
            )}
          />

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

import { FormChipsInputField } from '@app/components/forms/FormChipsInputField';
import { FormDatePicker } from '@app/components/forms/FormDatePicker';
import { FormInputField } from '@app/components/forms/FormInputField';
import { Button } from '@app/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@app/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@app/components/ui/select';
import { Spinner } from '@app/components/ui/spinner';
import { Textarea } from '@app/components/ui/textarea';
import { TEAM_STATUS_OPTIONS } from '@app/constants/team-form';
import { TechnologySelector } from '@app/features/team/components/TechnologySelector';
import { useCreateTeam } from '@app/hooks/team';
import routeNames from '@app/routes/route-names';
import { TeamFormValues, teamSchema } from '@app/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

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

export const TeamAdd = () => {
  const navigate = useNavigate();
  const { mutate: createTeam, isPending, error } = useCreateTeam();

  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamSchema.form),
    defaultValues: {
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
    console.log('Creating team', { formData });
    createTeam(formData);
  };

  return (
    <section className="flex h-full flex-col items-center justify-center bg-gray-100 px-4 py-12">
      <h1 className="mb-8 text-4xl font-bold">Add Team</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) => {
            console.log('Form invalid', errors);
          })}
          className="mx-4 w-1/3 space-y-4"
        >
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
                    <SelectTrigger className="border-primary/30 bg-primary-foreground w-1/2">
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
          <FormDatePicker control={form.control} name="endDate" label="End Date (Optional)" />

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
                    className="bg-primary-foreground border-primary/30 min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* GitHub URL */}
          <FormInputField control={form.control} name="githubLink" label="GitHub URL" />

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
          {error && <p className="text-sm text-red-500">{error.message}</p>}
          <div className="flex items-center justify-end gap-4 pt-2 pl-2">
            <Button
              size="lg"
              type="button"
              variant="outline"
              className="border-primary/30"
              onClick={() => navigate(routeNames.teams())}
            >
              Cancel
            </Button>

            <Button size="lg" type="submit" disabled={isPending}>
              {isPending ? <Spinner /> : 'Create'}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
};

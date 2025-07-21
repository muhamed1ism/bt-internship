import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@app/components/ui/dialog';
import { Button } from '@app/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@app/components/ui/tabs';

import { User } from '@app/types/types';

import { AvatarPreview } from '../AvatarPreview';
import { BasicInfoForm } from '../form/BasicInfoForm';
import { ContactInfoForm } from '../form/ContactInfoForm';
import { useForm } from 'react-hook-form';
import { UpdateProfileFormValues, userSchemas } from '@app/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@app/components/ui/form';
import { useEffect } from 'react';
import { useUpdateUser } from '@app/hooks/user';
import { Spinner } from '@app/components/ui/spinner';

type PersonalInfoModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
};

export function PersonalInfoModal({ open, onOpenChange, user }: PersonalInfoModalProps) {
  const { mutate: updateUser, isPending, error } = useUpdateUser();

  const form = useForm<UpdateProfileFormValues>({
    mode: 'onTouched',
    resolver: zodResolver(userSchemas.updateProfile),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      dateOfBirth: undefined,
      phoneNumber: '',
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        ...form.getValues(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        dateOfBirth: new Date(user.dateOfBirth),
        phoneNumber: user.phoneNumber,
      });
    }
  }, [user]);

  const onSubmit = (formData: UpdateProfileFormValues) => {
    updateUser({ userId: user?.id || '', formData });
    if (!error) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="z-50 overflow-hidden p-0 sm:max-w-[600px]">
        {/* HEADER */}
        <div className="bg-primary p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-white">
              Personal Information
            </DialogTitle>
            <DialogDescription className="text-blue-100">
              Edit user profile and account settings
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* BODY */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="p-6">
              <AvatarPreview
                firstName={user?.firstName || ''}
                lastName={user?.lastName || ''}
                email={user?.email || ''}
              />

              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="mb-4 grid grid-cols-2">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="contact">Contact & Social</TabsTrigger>
                </TabsList>

                <TabsContent value="basic">
                  <BasicInfoForm
                    form={form}
                    // experienceLevel={experienceLevel}
                    // onExperienceLevelChange={(value) =>
                    //   setValue('experienceLevel', value as experienceLevelType)
                    // }
                  />
                </TabsContent>

                <TabsContent value="contact">
                  <ContactInfoForm form={form} />
                </TabsContent>
              </Tabs>
            </div>

            {error && <div>{error.message}</div>}

            {/* FOOTER */}
            <div className="bg-muted/20 flex items-center justify-end gap-2 border-t p-6">
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary text-white">
                {isPending ? <Spinner size="small" className="text-secondary" /> : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

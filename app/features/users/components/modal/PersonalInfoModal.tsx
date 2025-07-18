import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@app/components/ui/dialog';
import { Button } from '@app/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@app/components/ui/tabs';

import { usePersonalInfoForm } from '../../hooks/usePersonalInfoForm';
import { experienceLevelType, PersonalInfoFormType, User } from '@app/types/types';

import { AvatarPreview } from '../AvatarPreview';
import { BasicInfoForm } from '../form/BasicInfoForm';
import { ContactInfoForm } from '../form/ContactInfoForm';

type PersonalInfoModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
};

export function PersonalInfoModal({ open, onOpenChange, user }: PersonalInfoModalProps) {
  const { register, handleSubmit, watch, errors, setValue } = usePersonalInfoForm(user);

  const {
    firstName,
    lastName,
    email,
    // , experienceLevel
  } = watch();

  const onSubmit = (data: PersonalInfoFormType) => {
    console.log('Saving personal info:', data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 sm:max-w-[600px]">
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6">
            <AvatarPreview firstName={firstName} lastName={lastName} email={email} />

            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="mb-4 grid grid-cols-2">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="contact">Contact & Social</TabsTrigger>
              </TabsList>

              <TabsContent value="basic">
                <BasicInfoForm
                  register={register}
                  errors={errors}
                  // experienceLevel={experienceLevel}
                  // onExperienceLevelChange={(value) =>
                  //   setValue('experienceLevel', value as experienceLevelType)
                  // }
                />
              </TabsContent>

              <TabsContent value="contact">
                <ContactInfoForm register={register} errors={errors} />
              </TabsContent>
            </Tabs>
          </div>

          {/* FOOTER */}
          <div className="bg-muted/20 flex items-center justify-end gap-2 border-t p-6">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-white">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

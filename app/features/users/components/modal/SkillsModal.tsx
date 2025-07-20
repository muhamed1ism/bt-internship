import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@app/components/ui/dialog';
import { Button } from '@app/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@app/components/ui/tabs';

import { useSkillsForm } from '../../hooks/useSkillsForm';
import { User } from '@app/types/types';
import { SkillsFormType } from '../../schemas/skillsSchema';
import { BucketsForm } from '../form/BucketsForm';
import { SkillsForm } from '../form/SkillsForm';
import { TopicsForm } from '../form/TopicsForm';

type SkillsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
};

export function SkillsModal({ open, onOpenChange, user }: SkillsModalProps) {
  const { handleSubmit, watch, setValue } = useSkillsForm(user);

  const { skills, topics, buckets, resumeFile, biographyFile } = watch();

  const onSubmit = (data: SkillsFormType) => {
    console.log('Saving skills:', {
      ...data,
      resumeFileName: data.resumeFile?.name,
      biographyFileName: data.biographyFile?.name,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 sm:max-w-[700px]">
        <div className="bg-primary p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-white">
              Skills & Expertise
            </DialogTitle>
            <DialogDescription className="text-blue-100">
              Manage user skills, interests, and professional buckets
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6">
            <Tabs defaultValue="skills" className="w-full">
              <TabsList className="mb-4 grid grid-cols-3">
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="topics">Topics</TabsTrigger>
                <TabsTrigger value="buckets">Buckets</TabsTrigger>
              </TabsList>

              <TabsContent value="skills">
                <SkillsForm
                  skills={skills}
                  onSkillsChange={(newSkills) => setValue('skills', newSkills)}
                  resumeFile={resumeFile}
                  biographyFile={biographyFile}
                  onResumeFileChange={(file) => setValue('resumeFile', file)}
                  onBiographyFileChange={(file) => setValue('biographyFile', file)}
                />
              </TabsContent>

              <TabsContent value="topics">
                <TopicsForm
                  topics={topics}
                  onTopicsChange={(newTopics) => setValue('topics', newTopics)}
                />
              </TabsContent>

              <TabsContent value="buckets">
                <BucketsForm
                  buckets={buckets}
                  onBucketsChange={(newBuckets) => setValue('buckets', newBuckets)}
                />
              </TabsContent>
            </Tabs>
          </div>

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

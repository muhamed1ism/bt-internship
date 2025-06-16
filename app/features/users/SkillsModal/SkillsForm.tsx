import { useState } from 'react';
import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
import { Label } from '@app/components/ui/label';
import { Badge } from '@app/components/ui/badge';
import { FileUpload } from '@app/components/ui/file-upload';
import { Plus } from 'lucide-react';

interface SkillsFormProps {
  skills: string[];
  onSkillsChange: (skills: string[]) => void;
  resumeFile?: File | null;
  biographyFile?: File | null;
  onResumeFileChange?: (file: File | null) => void;
  onBiographyFileChange?: (file: File | null) => void;
}

export const SkillsForm = ({
  skills,
  onSkillsChange,
  resumeFile,
  biographyFile,
  onResumeFileChange,
  onBiographyFileChange,
}: SkillsFormProps) => {
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      onSkillsChange([...skills, newSkill]);
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    onSkillsChange(skills.filter((s) => s !== skill));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Technical Skills</Label>
          <div className="flex space-x-2">
            <Input
              placeholder="Add skill..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSkill();
                }
              }}
              className="w-[200px]"
            />
            <Button size="sm" type="button" onClick={addSkill} variant="secondary">
              <Plus className="mr-1 h-4 w-4" /> Add
            </Button>
          </div>
        </div>

        <div className="bg-muted/30 flex min-h-[100px] flex-wrap gap-2 rounded-md p-4">
          {skills.length > 0 ? (
            skills.map((skill, index) => (
              <Badge
                key={index}
                className={`px-3 py-1 ${
                  index % 3 === 0
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : index % 3 === 1
                      ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                }`}
                variant="outline"
              >
                {skill}
                <button
                  type="button"
                  className="ml-2 text-gray-500 hover:text-gray-700"
                  onClick={() => removeSkill(skill)}
                >
                  ×
                </button>
              </Badge>
            ))
          ) : (
            <div className="text-muted-foreground flex h-full w-full items-center justify-center text-sm">
              No skills added yet
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FileUpload
          label="Resume (CV)"
          accept=".pdf,.doc,.docx"
          onFileSelect={onResumeFileChange}
        />
        <FileUpload
          label="Biography"
          accept=".pdf,.doc,.docx,.txt"
          onFileSelect={onBiographyFileChange}
        />
      </div>
    </div>
  );
};

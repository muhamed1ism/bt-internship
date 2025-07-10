import { Plus, Minus, Save, X } from 'lucide-react';
import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
import { Textarea } from '@app/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@app/components/ui/card';
import { Separator } from '@app/components/ui/separator';
import type { Level, EditableField, BucketCategory } from '@app/types/bucket';
import { SECTION_ICONS } from '@app/constants/bucket';
import { CreateLevelFormValues, UpdateLevelFormValues } from '@app/schemas';
import { useCreateLevel, useDeleteLevel, useUpdateLevel } from '@app/hooks/bucket';

interface LevelFormProps {
  bucketId: string;
  levelId?: string;
  editingLevel: Partial<Level>;
  isCreating: boolean;
  onCancel: () => void;
  onAddListItem: (field: EditableField) => void;
  onUpdateListItem: (field: EditableField, index: number, value: string) => void;
  onRemoveListItem: (field: EditableField, index: number) => void;
}

interface EditableSectionProps {
  title: string;
  field: EditableField;
  items: string[];
  onAdd: () => void;
  onUpdate: (index: number, value: string) => void;
  onRemove: (index: number) => void;
}

const EditableSection = ({
  title,
  field,
  items,
  onAdd,
  onUpdate,
  onRemove,
}: EditableSectionProps) => {
  const IconComponent = SECTION_ICONS[field as keyof typeof SECTION_ICONS];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {IconComponent && <IconComponent className="h-5 w-5" />}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <Textarea
              value={item}
              onChange={(e) => onUpdate(index, e.target.value)}
              placeholder={`Add ${title.toLowerCase()}...`}
              className="min-h-[80px] flex-1 resize-none"
            />
            <Button
              type="button"
              size="icon"
              onClick={() => onRemove(index)}
              disabled={items.length === 1}
              className="disabled:bg-primary shrink-0 bg-red-500 hover:bg-red-400"
            >
              <Minus className="h-4 w-4" />
            </Button>
          </div>
        ))}

        <Button type="button" onClick={onAdd} className="w-full bg-green-600 hover:bg-green-500">
          <Plus className="mr-2 h-4 w-4" />
          Add {title.substring(0, title.length - 1)}
        </Button>
      </div>
    </div>
  );
};

export const LevelForm = ({
  bucketId,
  levelId,
  editingLevel,
  isCreating,
  onCancel,
  onAddListItem,
  onUpdateListItem,
  onRemoveListItem,
}: LevelFormProps) => {
  const { mutate: createLevel } = useCreateLevel();
  const { mutate: updateLevel } = useUpdateLevel();
  const { mutate: deleteLevel } = useDeleteLevel();

  const handleAddItem = (field: EditableField) => {
    onAddListItem(field);
  };

  const handleUpdateItem = (field: EditableField, index: number, value: string) => {
    onUpdateListItem(field, index, value);
  };

  const handleRemoveItem = (field: EditableField, index: number) => {
    onRemoveListItem(field, index);
  };

  const handleCreateLevel = () => {
    const formData: CreateLevelFormValues = {
      level: editingLevel.levelNumber || 999,
      expectations: editingLevel.expectations || [],
      knowledge: editingLevel.knowledge || [],
      skills: editingLevel.skills || [],
      tools: editingLevel.tools || [],
      toAdvance: editingLevel.toAdvance || [],
    };

    console.log('Creating level: ', { formData, categoryId: bucketId ?? '' });
    createLevel({ formData, categoryId: bucketId ?? '' });
  };

  const handleUpdateLevel = () => {
    const formData: UpdateLevelFormValues = {
      expectations: editingLevel.expectations || [],
      knowledge: editingLevel.knowledge || [],
      skills: editingLevel.skills || [],
      tools: editingLevel.tools || [],
      toAdvance: editingLevel.toAdvance || [],
    };

    console.log('Updating level: ', { formData, levelId: levelId ?? '' });
    updateLevel({ formData, levelId: levelId ?? '' });
  };

  const handleDeleteLevel = () => {
    deleteLevel(levelId ?? '');
  };

  return (
    <div className="lg:col-span-3">
      <Card className="shadow-lg">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl">
            {isCreating ? 'Create New Level' : 'Edit Level'}
          </CardTitle>
        </CardHeader>

        <CardContent className="px-0">
          <div className="space-y-8">
            {/* Editable Sections */}
            <div className="grid grid-cols-1 gap-8 px-6 pt-1 xl:grid-cols-2">
              <div className="space-y-8">
                <EditableSection
                  title="Expectations"
                  field="expectations"
                  items={editingLevel.expectations || ['']}
                  onAdd={() => handleAddItem('expectations')}
                  onUpdate={(index, value) => handleUpdateItem('expectations', index, value)}
                  onRemove={(index) => handleRemoveItem('expectations', index)}
                />

                <EditableSection
                  title="Core Skills"
                  field="skills"
                  items={editingLevel.skills || ['']}
                  onAdd={() => handleAddItem('skills')}
                  onUpdate={(index, value) => handleUpdateItem('skills', index, value)}
                  onRemove={(index) => handleRemoveItem('skills', index)}
                />

                <EditableSection
                  title="Technologies & Tools"
                  field="tools"
                  items={editingLevel.tools || ['']}
                  onAdd={() => handleAddItem('tools')}
                  onUpdate={(index, value) => handleUpdateItem('tools', index, value)}
                  onRemove={(index) => handleRemoveItem('tools', index)}
                />
              </div>

              <div className="space-y-8">
                <EditableSection
                  title="Knowledge Requirements"
                  field="knowledge"
                  items={editingLevel.knowledge || ['']}
                  onAdd={() => handleAddItem('knowledge')}
                  onUpdate={(index, value) => handleUpdateItem('knowledge', index, value)}
                  onRemove={(index) => handleRemoveItem('knowledge', index)}
                />

                <EditableSection
                  title="Path to Advancement"
                  field="toAdvance"
                  items={editingLevel.toAdvance || ['']}
                  onAdd={() => handleAddItem('toAdvance')}
                  onUpdate={(index, value) => handleUpdateItem('toAdvance', index, value)}
                  onRemove={(index) => handleRemoveItem('toAdvance', index)}
                />
              </div>
            </div>
          </div>
        </CardContent>

        <Separator className="mt-4" />

        <CardFooter className="py-1">
          <div className="flex w-full gap-4">
            {isCreating ? (
              <Button onClick={handleCreateLevel} className="flex-1">
                <Save className="mr-2 h-4 w-4" />
                Create Level
              </Button>
            ) : (
              <Button onClick={handleUpdateLevel} className="flex-1">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            )}

            <Button variant="outline" onClick={onCancel} className="flex-1">
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

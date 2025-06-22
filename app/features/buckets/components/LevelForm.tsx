import { Plus, Minus, Save, X } from 'lucide-react';
import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
import { Textarea } from '@app/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@app/components/ui/card';
import { Separator } from '@app/components/ui/separator';
import type { Level, EditableField } from '@app/types/bucket';
import { SECTION_ICONS } from '@app/constants/bucket';

interface LevelFormProps {
  editingLevel: Partial<Level>;
  isCreating: boolean;
  onCancel: () => void;
  onSave: () => void;
  onUpdateField: (field: keyof Level, value: string | string[]) => void;
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
              variant="outline"
              size="icon"
              onClick={() => onRemove(index)}
              disabled={items.length === 1}
              className="shrink-0"
            >
              <Minus className="h-4 w-4" />
            </Button>
          </div>
        ))}

        <Button type="button" variant="outline" onClick={onAdd} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add {title.substring(0, title.length - 1)}
        </Button>
      </div>
    </div>
  );
};

export const LevelForm = ({
  editingLevel,
  isCreating,
  onCancel,
  onSave,
  onUpdateField,
  onAddListItem,
  onUpdateListItem,
  onRemoveListItem,
}: LevelFormProps) => {
  const handleAddItem = (field: EditableField) => {
    onAddListItem(field);
  };

  const handleUpdateItem = (field: EditableField, index: number, value: string) => {
    onUpdateListItem(field, index, value);
  };

  const handleRemoveItem = (field: EditableField, index: number) => {
    onRemoveListItem(field, index);
  };

  return (
    <div className="lg:col-span-3">
      <Card className="shadow-lg">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl">
            {isCreating ? 'Create New Level' : 'Edit Level'}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          <div className="space-y-8">
            {/* Level Title */}
            <div>
              <label className="mb-2 block text-sm font-medium">Level Title</label>
              <Input
                value={editingLevel.title || ''}
                onChange={(e) => onUpdateField('title', e.target.value)}
                placeholder="Enter level title..."
                className="w-full"
              />
            </div>

            <Separator />

            {/* Editable Sections */}
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
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

            <Separator />

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button onClick={onSave} className="flex-1">
                <Save className="mr-2 h-4 w-4" />
                {isCreating ? 'Create Level' : 'Save Changes'}
              </Button>
              <Button variant="outline" onClick={onCancel} className="px-8">
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

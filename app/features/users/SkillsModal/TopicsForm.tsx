import { useState } from 'react';
import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
import { Label } from '@app/components/ui/label';
import { Badge } from '@app/components/ui/badge';
import { Plus } from 'lucide-react';

interface TopicsFormProps {
  topics: string[];
  onTopicsChange: (topics: string[]) => void;
}

export const TopicsForm = ({ topics, onTopicsChange }: TopicsFormProps) => {
  const [newTopic, setNewTopic] = useState('');

  const addTopic = () => {
    if (newTopic && !topics.includes(newTopic)) {
      onTopicsChange([...topics, newTopic]);
      setNewTopic('');
    }
  };

  const removeTopic = (topic: string) => {
    onTopicsChange(topics.filter((t) => t !== topic));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Interested Topics</Label>
          <div className="flex space-x-2">
            <Input
              placeholder="Add topic..."
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTopic();
                }
              }}
              className="w-[200px]"
            />
            <Button size="sm" type="button" onClick={addTopic} variant="secondary">
              <Plus className="mr-1 h-4 w-4" /> Add
            </Button>
          </div>
        </div>

        <div className="bg-muted/30 flex min-h-[100px] flex-wrap gap-2 rounded-md p-4">
          {topics.length > 0 ? (
            topics.map((topic, index) => (
              <Badge
                key={index}
                className="bg-gray-100 text-gray-800 hover:bg-gray-200"
                variant="outline"
              >
                {topic}
                <button
                  type="button"
                  className="ml-2 text-gray-500 hover:text-gray-700"
                  onClick={() => removeTopic(topic)}
                >
                  ×
                </button>
              </Badge>
            ))
          ) : (
            <div className="text-muted-foreground flex h-full w-full items-center justify-center text-sm">
              No topics added yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

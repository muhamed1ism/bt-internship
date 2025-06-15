import { useState } from 'react';
import { Button } from '@app/components/ui/button';
import { Label } from '@app/components/ui/label';
import { Circle, Plus, Trash2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@app/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@app/components/ui/card';
import { fake_availableBuckets } from '../fake-data';

type AvailableBucket = {
  id: string;
  name: string;
  description: string;
};

const availableBuckets: AvailableBucket[] = fake_availableBuckets;

interface BucketsFormProps {
  buckets: { id: string; name: string; level: number }[];
  onBucketsChange: (buckets: { id: string; name: string; level: number }[]) => void;
}

export const BucketsForm = ({ buckets, onBucketsChange }: BucketsFormProps) => {
  const [selectedBucket, setSelectedBucket] = useState<string>('');

  const addBucket = () => {
    if (selectedBucket && !buckets.some((b: { id: string }) => b.id === selectedBucket)) {
      const bucketToAdd = availableBuckets.find((b: AvailableBucket) => b.id === selectedBucket);
      if (bucketToAdd) {
        onBucketsChange([...buckets, { id: bucketToAdd.id, name: bucketToAdd.name, level: 1 }]);
        setSelectedBucket('');
      }
    }
  };

  const updateBucketLevel = (id: string, level: number) => {
    onBucketsChange(buckets.map((bucket) => (bucket.id === id ? { ...bucket, level } : bucket)));
  };

  const removeBucket = (id: string) => {
    onBucketsChange(buckets.filter((bucket) => bucket.id !== id));
  };

  // Get available buckets that haven't been selected yet
  const availableBucketsToAdd = availableBuckets.filter(
    (bucket: AvailableBucket) =>
      !buckets.some((userBucket: { id: string }) => userBucket.id === bucket.id),
  );

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Professional Buckets</Label>
          <div className="flex space-x-2">
            <Select value={selectedBucket} onValueChange={setSelectedBucket}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select bucket" />
              </SelectTrigger>
              <SelectContent>
                {availableBucketsToAdd.length > 0 ? (
                  availableBucketsToAdd.map((bucket) => (
                    <SelectItem key={bucket.id} value={bucket.id}>
                      {bucket.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    All buckets added
                  </SelectItem>
                )}
              </SelectContent>
            </Select>

            <Button
              size="sm"
              type="button"
              onClick={addBucket}
              variant="secondary"
              disabled={!selectedBucket || availableBucketsToAdd.length === 0}
            >
              <Plus className="mr-1 h-4 w-4" /> Add
            </Button>
          </div>
        </div>

        <div className="mt-4 max-h-96 space-y-3 overflow-y-auto pr-2">
          {buckets.length > 0 ? (
            buckets.map((bucket) => (
              <Card key={bucket.id} className="overflow-hidden">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">{bucket.name}</CardTitle>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive h-8 w-8"
                      onClick={() => removeBucket(bucket.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription>
                    {availableBuckets.find((b: AvailableBucket) => b.id === bucket.id)?.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-4 pt-0">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Proficiency Level: {bucket.level}</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <button
                            key={level}
                            type="button"
                            onClick={() => updateBucketLevel(bucket.id, level)}
                            className="transition-transform hover:scale-110 focus:outline-none"
                          >
                            {level <= bucket.level ? (
                              <Circle className="fill-primary text-primary h-5 w-5" />
                            ) : (
                              <Circle className="h-5 w-5 text-gray-300" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-muted-foreground bg-muted/30 flex h-[100px] w-full items-center justify-center rounded-md text-sm">
              No buckets added yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

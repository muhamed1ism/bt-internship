import { useState } from 'react';
import { Button } from '@app/components/ui/button';
import { Label } from '@app/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@app/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@app/components/ui/card';
import { BucketCategory } from '@app/types/bucket';
import {
  useAssignUserBuckets,
  useGetUserBucketsById,
  useUnssignUserBucket,
} from '@app/hooks/bucket';
import { User } from '@app/types/types';
import { AssignUserBucketsFormValues } from '@app/schemas';

interface BucketsFormProps {
  user: User | null;
  buckets: BucketCategory[];
}

export const BucketsForm = ({ user, buckets }: BucketsFormProps) => {
  const [selectedBucket, setSelectedBucket] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const { buckets: userBuckets } = useGetUserBucketsById(user?.id || '');
  const { mutate: assignBuckets, error } = useAssignUserBuckets();
  const { mutate: unassignBucket } = useUnssignUserBucket();

  const selectedBucketLevels = buckets.find((bucket) => bucket.id === selectedBucket)?.bucketLevels;

  const addBucket = (bucketLevelId: string) => {
    const formData: AssignUserBucketsFormValues = { bucketLevelIds: [bucketLevelId] };

    if (!user?.id) return;

    assignBuckets({ userId: user.id, formData });
  };

  const removeBucket = (bucketLevelId: string) => {
    if (!user?.id) return;

    unassignBucket({ userId: user.id, bucketLevelId });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Professional Buckets</Label>
          <div className="mx-2 flex space-x-2">
            <Select value={selectedBucket} onValueChange={setSelectedBucket}>
              <SelectTrigger className="border-primary/30 w-[200px]">
                <SelectValue placeholder="Select bucket" />
              </SelectTrigger>
              <SelectContent>
                {buckets.length > 0 ? (
                  buckets.map((bucket) => (
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

            {selectedBucketLevels?.length && selectedBucketLevels.length > 0 ? (
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="border-primary/30 w-[125px]">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {selectedBucketLevels.map((level) => (
                    <SelectItem key={level.id} value={level.id}>
                      {level.level.toString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Select>
                <SelectTrigger disabled className="border-primary/30">
                  <SelectValue placeholder="No levels" />
                </SelectTrigger>
              </Select>
            )}

            <Button
              type="button"
              onClick={() => addBucket(selectedLevel)}
              disabled={!selectedBucket || !selectedLevel || buckets.length === 0}
            >
              <Plus className="mr-1 h-4 w-4" /> Add
            </Button>
          </div>
        </div>

        {error && <p className="text-red-500">{error.message}</p>}

        <div className="mt-4 max-h-96 space-y-3 overflow-y-auto pr-2">
          {userBuckets?.length !== 0 ? (
            userBuckets?.map((userBucket) => (
              <Card key={userBucket.bucketLevelId} className="bg-accent overflow-hidden">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">
                      {userBucket.bucket.category.name}
                    </CardTitle>
                    <Button
                      type="button"
                      size="icon"
                      className="h-8 w-8 bg-red-500 hover:bg-red-600"
                      onClick={() => removeBucket(userBucket.bucketLevelId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription>
                    {
                      buckets.find((bucket) => bucket.id === userBucket.bucket.categoryId)
                        ?.description
                    }
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-4 pt-0">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Proficiency Level: {userBucket.bucket.level}
                      </span>
                      {/* <div className="flex"> */}
                      {/*   {userBuckets.map((bucket) => ( */}
                      {/*     <button */}
                      {/*       key={bucket.bucketLevelId} */}
                      {/*       type="button" */}
                      {/*       onClick={() => updateBucketLevel(userBucket.id, level.id)} */}
                      {/*       className="transition-transform hover:scale-110 focus:outline-none" */}
                      {/*     > */}
                      {/*       {level <= userBucket.level ? ( */}
                      {/*         <Circle className="fill-primary text-primary h-5 w-5" /> */}
                      {/*       ) : ( */}
                      {/*         <Circle className="h-5 w-5 text-gray-300" /> */}
                      {/*       )} */}
                      {/*     </button> */}
                      {/*   ))} */}
                      {/* </div> */}
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

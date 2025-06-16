import { Plus, BookOpen, Target } from 'lucide-react';
import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@app/components/ui/card';

interface BucketCreationProps {
  bucketTitle: string;
  onUpdateTitle: (title: string) => void;
  onCreateLevel: () => void;
  onSaveBucket: () => void;
}

export const BucketCreation = ({
  bucketTitle,
  onUpdateTitle,
  onCreateLevel,
  onSaveBucket,
}: BucketCreationProps) => {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 text-center">
        <div className="bg-primary/10 mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full">
          <BookOpen className="text-primary h-8 w-8" />
        </div>
        <h1 className="text-foreground mb-2 text-3xl font-bold">Create Your Career Bucket</h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
          Start building your professional development path by defining your career bucket and
          adding your first level.
        </p>
      </div>

      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Bucket Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium">Bucket Title</label>
            <Input
              value={bucketTitle}
              onChange={(e) => onUpdateTitle(e.target.value)}
              placeholder="Enter your career bucket title (e.g., Software Engineer, Product Manager)"
              className="w-full"
            />
            <p className="text-muted-foreground mt-2 text-sm">
              This will be the name of your career development path.
            </p>
          </div>

          <div className="flex gap-4">
            <Button onClick={onSaveBucket} variant="outline" className="flex-1">
              Save Bucket
            </Button>
            <Button
              onClick={onCreateLevel}
              className="from-primary to-primary/80 flex-1 bg-gradient-to-r"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add First Level
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="hover:border-primary/50 border-2 border-dashed transition-colors">
          <CardContent className="p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="mb-2 font-semibold">Define Expectations</h3>
            <p className="text-muted-foreground text-sm">
              Set clear expectations for each level in your career progression.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 border-2 border-dashed transition-colors">
          <CardContent className="p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mb-2 font-semibold">Track Skills</h3>
            <p className="text-muted-foreground text-sm">
              Monitor the development of technical and soft skills over time.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 border-2 border-dashed transition-colors">
          <CardContent className="p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
              <Plus className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="mb-2 font-semibold">Plan Advancement</h3>
            <p className="text-muted-foreground text-sm">
              Create clear paths for advancing to the next level in your career.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

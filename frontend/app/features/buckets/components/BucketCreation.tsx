import { Plus, BookOpen, Target } from 'lucide-react';
import { Button } from '@app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@app/components/ui/card';

interface BucketCreationProps {
  onCreateLevel: () => void;
}

export const BucketCreation = ({ onCreateLevel }: BucketCreationProps) => {
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
          <Button
            onClick={onCreateLevel}
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg hover:from-emerald-600 hover:to-emerald-700"
          >
            <Plus className="mr-2 size-4" />
            Add First Level
          </Button>
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

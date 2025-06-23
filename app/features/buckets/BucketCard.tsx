import { Card, CardContent, CardFooter, CardHeader } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { FAKE_BUCKET } from '@app/__mocks__/buckets';

interface TempBucket {
  title: string;
  description: string;
  levels: string[];
}

export const BucketCard = ({ bucket }: { bucket: TempBucket }) => {
  const { title, description, levels } = bucket || FAKE_BUCKET;
  const navigate = useNavigate();

  function navigateTo(): void {
    navigate(title);
  }

  return (
    <Card className="w-full max-w-xs rounded-3xl border-2 px-2 py-6" onClick={navigateTo}>
      <CardHeader>
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-muted-foreground space-y-2 text-sm">
          <p>{description}</p>
        </div>

        <div className="flex gap-2 pt-2">
          {levels.map((level) => (
            <Badge variant="outline" className="rounded-md" key={level}>
              {level}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="pointer w-full cursor-pointer rounded-md">
          Edit Bucket
        </Button>
      </CardFooter>
    </Card>
  );
};

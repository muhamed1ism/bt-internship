import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
import { Label } from '@app/components/ui/label';
import { Plus, X, Github, ExternalLink } from 'lucide-react';

interface MultiUrlInputProps {
  label: string;
  urls: string[];
  onChange: (urls: string[]) => void;
  placeholder: string;
  type: 'github' | 'jira';
  error?: string;
}

export const MultiUrlInput = ({
  label,
  urls,
  onChange,
  placeholder,
  type,
  error,
}: MultiUrlInputProps) => {
  const addUrl = () => {
    onChange([...urls, '']);
  };

  const removeUrl = (index: number) => {
    if (urls.length > 1) {
      onChange(urls.filter((_, i) => i !== index));
    }
  };

  const updateUrl = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    onChange(newUrls);
  };

  const Icon = type === 'github' ? Github : ExternalLink;

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      <div className="space-y-3">
        {urls.map((url, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Icon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder={placeholder}
                value={url}
                onChange={(e) => updateUrl(index, e.target.value)}
                className="pl-10"
              />
            </div>

            {urls.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeUrl(index)}
                className="h-10 w-10 flex-shrink-0 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}

        <Button type="button" variant="outline" size="sm" onClick={addUrl} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add {type === 'github' ? 'GitHub' : 'JIRA'} URL
        </Button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <p className="text-muted-foreground text-xs">
        {urls.filter((url) => url.trim()).length} URL
        {urls.filter((url) => url.trim()).length !== 1 ? 's' : ''} added
      </p>
    </div>
  );
};

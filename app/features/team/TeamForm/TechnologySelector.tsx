import { useState } from 'react';
import { Button } from '@app/components/ui/button';
import { Badge } from '@app/components/ui/badge';
import { Input } from '@app/components/ui/input';
import { Label } from '@app/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@app/components/ui/popover';
import { Plus, X } from 'lucide-react';
import { TECHNOLOGY_OPTIONS } from '@app/constants/team-form';
import { Technology } from '@app/types/team-form';

interface TechnologySelectorProps {
  technologies: Technology[];
  onChange: (technologies: Technology[]) => void;
  error?: string;
}

export const TechnologySelector = ({ technologies, onChange, error }: TechnologySelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTechnologies = TECHNOLOGY_OPTIONS.filter(
    (tech) =>
      tech.label.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !technologies.some((selected) => selected.id === tech.value),
  );

  const addTechnology = (tech: (typeof TECHNOLOGY_OPTIONS)[0]) => {
    const newTechnology: Technology = {
      id: tech.value,
      name: tech.label,
      color: tech.color,
    };
    onChange([...technologies, newTechnology]);
    setSearchQuery('');
    setIsOpen(false);
  };

  const removeTechnology = (techId: string) => {
    onChange(technologies.filter((tech) => tech.id !== techId));
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="technologies">Technologies *</Label>

      {/* Selected Technologies */}
      <div className="border-input bg-background flex min-h-[2.5rem] flex-wrap gap-2 rounded-md border p-3">
        {technologies.map((tech) => (
          <Badge
            key={tech.id}
            className={`${tech.color} flex items-center gap-1 px-2 py-1 text-white`}
          >
            {tech.name}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-white/20"
              onClick={() => removeTechnology(tech.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}

        {technologies.length === 0 && (
          <span className="text-muted-foreground text-sm">No technologies selected</span>
        )}
      </div>

      {/* Add Technology Button */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            disabled={technologies.length >= 10}
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Technology
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-3">
          <div className="space-y-3">
            <Input
              placeholder="Search technologies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />

            <div className="grid max-h-60 grid-cols-2 gap-2 overflow-y-auto">
              {filteredTechnologies.map((tech) => (
                <Button
                  key={tech.value}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-auto justify-start p-2"
                  onClick={() => addTechnology(tech)}
                >
                  <div className={`h-3 w-3 rounded-full ${tech.color} mr-2`} />
                  <span className="text-xs">{tech.label}</span>
                </Button>
              ))}
            </div>

            {filteredTechnologies.length === 0 && (
              <p className="text-muted-foreground py-4 text-center text-sm">
                No technologies found
              </p>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <p className="text-muted-foreground text-xs">
        {technologies.length}/10 technologies selected
      </p>
    </div>
  );
};

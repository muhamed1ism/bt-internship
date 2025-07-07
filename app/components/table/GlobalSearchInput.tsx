import { Search, X } from 'lucide-react';
import { Input } from '../ui/input';

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export const GlobalSearchInput = ({ value, onChange, placeholder, className }: Props) => {
  const clearSearch = () => {
    onChange('');
  };

  return (
    <div className="relative w-full">
      <Search className="text-muted-foreground absolute top-8.5 left-3 h-4 w-4" />
      <Input
        className={`bg-primary-foreground h-9 pr-10 pl-10 ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          onClick={clearSearch}
          className="text-muted-foreground hover:text-foreground absolute top-8.5 right-2.5"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear search</span>
        </button>
      )}
    </div>
  );
};

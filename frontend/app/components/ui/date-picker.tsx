import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@app/components/ui/button';
import { Calendar } from '@app/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@app/components/ui/popover';
import { cn } from '@app/lib/utils';
import { useState } from 'react';

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  className?: string;
}

export function DatePicker({ date, setDate, className }: DatePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'hover:bg-primary/5 w-[240px] pl-3 text-left font-normal',
            !date && 'text-muted-foreground',
            className,
          )}
        >
          {date ? format(date, 'PPP') : <span>Pick a date</span>}

          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="z-50 w-auto rounded-xl p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => {
            setDate(date);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

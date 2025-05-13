import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@app/components/ui/button';
import { Calendar } from '@app/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@app/components/ui/popover';
import { cn } from '@app/lib/utils';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  className?: string;
}

export function DatePicker({ date, setDate, className }: DatePickerProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const [calendarDate, setCalendarDate] = useState<Date>(date || new Date());

  const handleYearSelect = (year: string) => {
    const newDate = new Date(calendarDate);
    newDate.setFullYear(Number.parseInt(year));
    setCalendarDate(newDate);
  };

  const handleMonthSelect = (month: string) => {
    const newDate = new Date(calendarDate);
    newDate.setMonth(Number.parseInt(month));
    setCalendarDate(newDate);
  };

  const months = [
    { value: '0', label: 'January' },
    { value: '1', label: 'February' },
    { value: '2', label: 'March' },
    { value: '3', label: 'April' },
    { value: '4', label: 'May' },
    { value: '5', label: 'June' },
    { value: '6', label: 'July' },
    { value: '7', label: 'August' },
    { value: '8', label: 'September' },
    { value: '9', label: 'October' },
    { value: '10', label: 'November' },
    { value: '11', label: 'December' },
  ];

  return (
    <Popover>
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
      <PopoverContent className="w-auto p-0" align="start">
        <div className="border-border flex gap-2 border-b p-3">
          <Select value={calendarDate.getMonth().toString()} onValueChange={handleMonthSelect}>
            <SelectTrigger className="border-primary/50 hover:bg-secondary w-[130px] border-1">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={calendarDate.getFullYear().toString()} onValueChange={handleYearSelect}>
            <SelectTrigger className="border-primary/50 hover:bg-secondary w-[100px] border-1">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          month={calendarDate}
          onMonthChange={setCalendarDate}
          defaultMonth={date || new Date(currentYear - 18, 0, 1)}
          disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
          className=""
        />
      </PopoverContent>
    </Popover>
  );
}

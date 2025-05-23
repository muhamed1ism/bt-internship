import * as React from 'react';
import { DayPicker } from 'react-day-picker';

import { cn } from '@app/lib/utils';

function Calendar({ className, classNames, ...props }: React.ComponentProps<typeof DayPicker>) {
  const dropdownClassName = 'px-3 border-1 border-primary/50 hover:bg-secondary rounded-md h-8';
  return (
    <DayPicker
      hideNavigation
      captionLayout="dropdown"
      showOutsideDays
      className={cn('min-h-[340px] p-4', className)}
      classNames={{
        caption_label: cn('hidden'),
        dropdowns: cn('flex justify-between'),
        months_dropdown: cn(dropdownClassName),
        years_dropdown: cn(dropdownClassName),
        weekdays: cn('flex flex-row', classNames?.weekdays),
        weekday: cn('w-8 text-sm font-normal text-muted-foreground', classNames?.weekday),
        month: cn('w-full', classNames?.month),

        month_grid: cn('mx-auto mt-4', classNames?.month_grid),
        week: cn('mt-2 flex w-max items-start', classNames?.week),
        day: cn('flex size-8 flex-1 items-center justify-center p-0 text-sm', classNames?.day),
        day_button: cn(
          'size-8 rounded-md p-0 font-normal transition-none hover:bg-primary/10 aria-selected:opacity-100',
          classNames?.day_button,
        ),
        selected: cn(
          '[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground',
          classNames?.selected,
        ),
        today: cn('[&>button]:bg-accent [&>button]:text-accent-foreground', classNames?.today),
        outside: cn(
          'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
          classNames?.outside,
        ),
        disabled: cn('text-muted-foreground opacity-50', classNames?.disabled),
        hidden: cn('invisible flex-1', classNames?.hidden),
        ...classNames,
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };

import { Control } from 'react-hook-form';
import { DatePicker } from '../ui/date-picker';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '../ui/form';

interface FormDatePickerProps {
  control: Control<any>;
  name: string;
  label?: string;
}

export const FormDatePicker = ({ control, name, label }: FormDatePickerProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          {label && <FormLabel>{label}</FormLabel>}

          <FormControl>
            <DatePicker
              date={field.value}
              setDate={field.onChange}
              className="bg-primary-foreground border-primary/30 w-full border-1"
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

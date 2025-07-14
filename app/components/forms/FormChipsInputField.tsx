import { useRef, useState } from 'react';
import { Control } from 'react-hook-form';
import { Check, PlusIcon, X } from 'lucide-react';
import { Button } from '@app/components/ui/button';
import { FormField, FormItem, FormLabel } from '@app/components/ui/form';
import { Input } from '@app/components/ui/input';
import { DropdownMenu, DropdownMenuGroup } from '@radix-ui/react-dropdown-menu';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface FormChipsInputFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  menuItems: MenuItem[];
}

interface MenuItem {
  value: string;
}

// TODO: Make input field appear as dropdown menu with search bar. if input value cannot be found it should add that value as item.

export const FormChipsInputField = ({
  control,
  name,
  label,
  menuItems,
}: FormChipsInputFieldProps) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const items: string[] = field.value || [];

        const addItem = (selectedItem?: string) => {
          const trimmed = selectedItem || inputValue.trim();
          if (trimmed && !items.includes(trimmed)) {
            field.onChange([...items, trimmed]);
          }
          setInputValue('');
        };

        const removeItem = (itemToRemove: string) => {
          field.onChange(items.filter((item) => item !== itemToRemove));
        };

        return (
          <FormItem>
            <FormLabel className="ml-1">{label}</FormLabel>
            <div className="border-primary/30 bg-card flex min-h-9 flex-wrap items-center rounded-md border-1 px-1 pb-1">
              {items.map((item) => (
                <div
                  key={item}
                  className="bg-primary text-secondary mt-1 mr-1 flex h-7 w-fit items-center justify-center rounded-sm"
                >
                  <p className="pl-2 text-sm">{item}</p>
                  <Button
                    type="button"
                    size="icon"
                    className="hover:text-secondary/70 size-7 cursor-pointer"
                    onClick={() => removeItem(item)}
                  >
                    <X size={14} />
                  </Button>
                </div>
              ))}

              <DropdownMenu
                onOpenChange={(open) => {
                  if (open) {
                    setTimeout(() => {
                      inputRef.current?.focus();
                    }, 0); // slight delay ensures DOM is ready
                  }
                }}
              >
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    className="bg-primary hover:bg-primary/80 mt-1 size-7 cursor-pointer rounded-sm"
                  >
                    <PlusIcon size={16} />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                  <Input
                    ref={inputRef}
                    id="input"
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      e.stopPropagation();
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addItem();
                      } else if (e.key === 'Escape') {
                        setInputValue('');
                      }
                    }}
                    autoFocus
                    className="h-full w-full border-0 px-2 shadow-none focus-visible:ring-0 min-lg:px-3"
                    placeholder="Type and press Enter"
                  />
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {menuItems
                      .filter((item) => item.value.toLowerCase().includes(inputValue.toLowerCase()))
                      .map((item) => (
                        <DropdownMenuItem onClick={() => addItem(item.value)}>
                          {item.value}
                        </DropdownMenuItem>
                      ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </FormItem>
        );
      }}
    />
  );
};

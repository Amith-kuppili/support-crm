import { forwardRef, SelectHTMLAttributes, useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: SelectOption[];
  onChange?: (value: string) => void;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, onChange, placeholder, className, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(props.value || '');
    const selectRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      setSelectedValue(props.value || '');
    }, [props.value]);

    const handleSelect = (value: string) => {
      setSelectedValue(value);
      setIsOpen(false);
      onChange?.(value);
    };

    const selectedOption = options.find((opt) => opt.value === selectedValue);

    return (
      <div ref={selectRef} className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'flex h-10 w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
            className
          )}
        >
          <span className={cn(!selectedOption && 'text-muted-foreground')}>
            {selectedOption?.label || placeholder || 'Select...'}
          </span>
          <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
        </button>
        {isOpen && (
          <div className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-card shadow-lg animate-in fade-in-0 zoom-in-95">
            <div className="py-1 max-h-60 overflow-auto">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    'flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-accent transition-colors',
                    selectedValue === option.value && 'bg-accent'
                  )}
                >
                  {option.label}
                  {selectedValue === option.value && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
        <select
          ref={ref}
          value={selectedValue}
          onChange={(e) => onChange?.(e.target.value)}
          className="hidden"
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
);
Select.displayName = 'Select';

import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';

interface FormGroupProps {
  label: string;
  htmlFor?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}

export function FormGroup({ label, htmlFor, error, required, children }: FormGroupProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

const inputBaseStyles = `
  w-full px-3 py-2 rounded-lg border border-slate-300
  text-slate-900 placeholder-slate-400
  focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
  disabled:bg-slate-50 disabled:cursor-not-allowed
`;

// Input with label support
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, required, ...props }, ref) => {
    const input = <input ref={ref} className={`${inputBaseStyles} ${className}`} required={required} {...props} />;

    if (label) {
      return (
        <FormGroup label={label} error={error} required={required}>
          {input}
        </FormGroup>
      );
    }

    return input;
  }
);
Input.displayName = 'Input';

// Textarea with label support
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', rows = 3, label, error, required, ...props }, ref) => {
    const textarea = (
      <textarea ref={ref} rows={rows} className={`${inputBaseStyles} resize-none ${className}`} required={required} {...props} />
    );

    if (label) {
      return (
        <FormGroup label={label} error={error} required={required}>
          {textarea}
        </FormGroup>
      );
    }

    return textarea;
  }
);
Textarea.displayName = 'Textarea';

// Select with label and options support
interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', children, label, error, required, options, ...props }, ref) => {
    const selectContent = options
      ? options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))
      : children;

    const select = (
      <select ref={ref} className={`${inputBaseStyles} ${className}`} required={required} {...props}>
        {selectContent}
      </select>
    );

    if (label) {
      return (
        <FormGroup label={label} error={error} required={required}>
          {select}
        </FormGroup>
      );
    }

    return select;
  }
);
Select.displayName = 'Select';

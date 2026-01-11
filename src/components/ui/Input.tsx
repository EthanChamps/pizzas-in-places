'use client';

import { forwardRef, useId } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, ...props }, ref) => {
    const id = useId();
    return (
      <div className="w-full">
        <label
          htmlFor={id}
          className="block font-sans text-sm text-neutral-600 mb-2"
        >
          {label}
        </label>
        <input
          id={id}
          type={type}
          className={`w-full px-4 py-3 bg-white border border-neutral-300 font-sans text-neutral-900 rounded-md shadow-sm
                     focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 
                     transition-colors placeholder:text-neutral-400 ${className}`}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };

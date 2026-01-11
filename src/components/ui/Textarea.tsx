'use client';

import { forwardRef, useId } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, ...props }, ref) => {
    const id = useId();
    return (
      <div className="w-full">
        <label
          htmlFor={id}
          className="block font-sans text-sm text-neutral-600 mb-2"
        >
          {label}
        </label>
        <textarea
          id={id}
          className={`w-full px-4 py-3 bg-white border border-neutral-300 font-sans text-neutral-900 rounded-md shadow-sm
                     focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 
                     transition-colors resize-y min-h-[120px] placeholder:text-neutral-400 ${className}`}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };

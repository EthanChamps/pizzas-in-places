'use client';

import { forwardRef, useId } from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, children, ...props }, ref) => {
    const id = useId();
    return (
      <div className="w-full">
        <label
          htmlFor={id}
          className="block font-sans text-sm text-neutral-600 mb-2"
        >
          {label}
        </label>
        <div className="relative">
          <select
            id={id}
            className={`w-full appearance-none bg-white px-4 py-3 border border-neutral-300 font-sans text-neutral-900 rounded-md shadow-sm
                       focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 
                       transition-colors ${className}`}
            ref={ref}
            {...props}
          >
            {children}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-neutral-700">
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select };

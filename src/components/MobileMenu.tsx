'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface MobileMenuProps {
  navItems: { href: string; label: string }[];
  onClose: () => void;
}

export default function MobileMenu({ navItems, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const initialPathname = useRef(pathname);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    // Only close if pathname actually changed (not on initial mount)
    if (pathname !== initialPathname.current) {
      onClose();
    }
  }, [pathname, onClose]);

  return (
    <div
      className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <nav
        className="fixed top-0 left-0 bottom-0 z-50 w-4/5 max-w-sm bg-[#FAFAFA] p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-12">
           <Link
              href="/"
              className="font-serif text-xl font-semibold text-neutral-900"
            >
              Pizzas in Places
            </Link>
          <button onClick={onClose} aria-label="Close menu">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <ul className="space-y-6">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block font-sans text-2xl text-neutral-800 hover:text-neutral-900 transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

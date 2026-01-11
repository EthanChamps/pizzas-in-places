'use client';

import Link from "next/link";
import { useState, useCallback } from 'react';
import MobileMenu from './MobileMenu';
import { useScrollLock } from '@/hooks/use-scroll-lock';

export default function Navigation() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  useScrollLock(isMenuOpen);

  const handleClose = useCallback(() => {
    setMenuOpen(false);
  }, []);

  const navItems = [
    { href: "/schedule", label: "Find Us" },
    { href: "/menu", label: "Menu" },
    { href: "/events", label: "Events" },
    { href: "/blog", label: "Journal" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAFA]/95 backdrop-blur-sm border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link
            href="/"
            className="font-serif text-xl font-semibold text-neutral-900 hover:text-neutral-600 transition-colors"
          >
            Pizzas in Places
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="font-sans text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Burger Menu */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!isMenuOpen)} aria-label={isMenuOpen ? "Close menu" : "Open menu"}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neutral-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
      {isMenuOpen && <MobileMenu navItems={navItems} onClose={handleClose} />}
    </>
  );
}
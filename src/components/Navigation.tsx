import Link from "next/link";

export default function Navigation() {
  const navItems = [
    { href: "/schedule", label: "Find Us" },
    { href: "/menu", label: "Menu" },
    { href: "/events", label: "Events" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAFA]/95 backdrop-blur-sm border-b border-neutral-200">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="font-serif text-xl font-semibold text-neutral-900 hover:text-neutral-600 transition-colors"
        >
          Pizzas in Places
        </Link>

        <ul className="flex items-center gap-8">
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
      </div>
    </nav>
  );
}

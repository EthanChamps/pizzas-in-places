import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/schedule", label: "Find Us" },
  { href: "/menu", label: "Menu" },
  { href: "/events", label: "Events" },
  { href: "/blog", label: "Journal" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="py-16 px-6 border-t border-neutral-200 bg-[#FAFAFA]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h3 className="font-serif text-2xl text-neutral-900 mb-4">
            Pizzas in Places
          </h3>
          <a
            href="https://www.instagram.com/pizzasinplaces/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-neutral-600 hover:text-neutral-900 transition-colors link-underline"
          >
            @pizzasinplaces
          </a>
        </div>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 md:gap-8 font-sans text-sm text-neutral-500">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-neutral-900 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <p className="text-center mt-12 font-sans text-xs text-neutral-400">
          Site by{" "}
          <a
            href="https://ethanchampion.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neutral-600 transition-colors"
          >
            Ethan Champion
          </a>
        </p>
      </div>
    </footer>
  );
}

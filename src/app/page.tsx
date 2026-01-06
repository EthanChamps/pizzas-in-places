import Link from "next/link";
import Image from "next/image";
import { getTodayLocation } from "@/lib/schedule";

export default function Home() {
  const todayLocation = getTodayLocation();

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      {/* Hero */}
      <section className="relative h-screen">
        <Image
          src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop"
          alt="Fresh wood-fired pizza"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-6">
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-medium mb-6">
              Pizzas in Places
            </h1>
            <p className="font-sans text-lg md:text-xl text-white/90 max-w-md mx-auto">
              Fresh sourdough pizza, made daily from our horse trailer
            </p>
          </div>
        </div>
      </section>

      {/* Today's Location */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-sans text-sm uppercase tracking-widest text-neutral-500 mb-4">
            Find us today
          </p>
          {todayLocation ? (
            <>
              <h2 className="font-serif text-3xl md:text-4xl text-neutral-900 mb-3">
                {todayLocation.location}
              </h2>
              <p className="font-sans text-neutral-600 mb-2">
                {todayLocation.time}
              </p>
              <p className="font-sans text-sm text-neutral-500">
                {todayLocation.date}
              </p>
            </>
          ) : (
            <>
              <h2 className="font-serif text-3xl md:text-4xl text-neutral-900 mb-3">
                Not trading today
              </h2>
              <Link
                href="/schedule"
                className="font-sans text-neutral-600 hover:text-neutral-900 transition-colors link-underline"
              >
                View our full schedule
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-xs mx-auto border-t border-neutral-200" />

      {/* About */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl text-neutral-900 mb-8 text-center">
            Our Story
          </h2>
          <div className="font-sans text-neutral-600 leading-relaxed space-y-6">
            <p>
              We started with a simple idea: bring exceptional sourdough pizza
              to wherever people gather. Our renovated horse trailer is now home
              to a wood-fired oven that reaches 450°C.
            </p>
            <p>
              Every morning, we make our dough fresh. No shortcuts. Just flour,
              water, salt, and time. The 24-hour fermentation gives our bases
              that distinctive tang and light, airy texture.
            </p>
          </div>
        </div>
      </section>

      {/* Menu Preview */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl text-neutral-900 mb-12 text-center">
            The Menu
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Margherita",
                desc: "San Marzano tomatoes, fior di latte, basil",
                price: "£12",
                image:
                  "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=2069&auto=format&fit=crop",
              },
              {
                name: "Spicy Salami",
                desc: "Nduja, salami, mozzarella, honey drizzle",
                price: "£14",
                image:
                  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=2081&auto=format&fit=crop",
              },
              {
                name: "Garden",
                desc: "Seasonal vegetables, goat cheese, rocket",
                price: "£13",
                image:
                  "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=2135&auto=format&fit=crop",
              },
            ].map((pizza) => (
              <div key={pizza.name} className="group">
                <div className="relative aspect-square mb-4 overflow-hidden">
                  <Image
                    src={pizza.image}
                    alt={pizza.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-serif text-xl text-neutral-900">
                    {pizza.name}
                  </h3>
                  <span className="font-sans text-neutral-900">
                    {pizza.price}
                  </span>
                </div>
                <p className="font-sans text-sm text-neutral-500">
                  {pizza.desc}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/menu"
              className="font-sans text-neutral-900 hover:text-neutral-600 transition-colors link-underline"
            >
              View full menu
            </Link>
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl text-neutral-900 mb-12 text-center">
            This Week
          </h2>
          <div className="space-y-4">
            {[
              { day: "Monday", location: "Chipping Campden" },
              { day: "Tuesday", location: "Bourton-on-the-Water" },
              { day: "Wednesday", location: "Stow-on-the-Wold" },
              { day: "Thursday", location: "Moreton-in-Marsh" },
              { day: "Friday", location: "Winchcombe" },
              { day: "Saturday", location: "Cirencester" },
              { day: "Sunday", location: "Broadway" },
            ].map((item) => (
              <div
                key={item.day}
                className="flex justify-between items-center py-3 border-b border-neutral-200"
              >
                <span className="font-serif text-lg text-neutral-900">
                  {item.day}
                </span>
                <span className="font-sans text-neutral-600">
                  {item.location}
                </span>
              </div>
            ))}
          </div>
          <p className="font-sans text-sm text-neutral-500 text-center mt-6">
            6:00 PM – 9:00 PM daily
          </p>
          <div className="text-center mt-8">
            <Link
              href="/schedule"
              className="font-sans text-neutral-900 hover:text-neutral-600 transition-colors link-underline"
            >
              Full schedule
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-neutral-200">
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
          <div className="flex justify-center gap-8 font-sans text-sm text-neutral-500">
            <Link href="/menu" className="hover:text-neutral-900 transition-colors">
              Menu
            </Link>
            <Link href="/schedule" className="hover:text-neutral-900 transition-colors">
              Schedule
            </Link>
            <Link href="/events" className="hover:text-neutral-900 transition-colors">
              Events
            </Link>
            <Link href="/contact" className="hover:text-neutral-900 transition-colors">
              Contact
            </Link>
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
    </main>
  );
}

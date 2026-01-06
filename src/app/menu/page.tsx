import Link from "next/link";

export default function MenuPage() {
  const pizzas = [
    {
      name: "Margherita",
      description: "San Marzano tomato, fior di latte, basil",
      price: "£12",
      tag: "V",
    },
    {
      name: "Pepperoni",
      description: "Tomato, mozzarella, Italian pepperoni",
      price: "£14",
    },
    {
      name: "Quattro Stagioni",
      description: "Tomato, mozzarella, mushrooms, ham, artichokes, olives",
      price: "£16",
    },
    {
      name: "Prosciutto & Rocket",
      description: "Mozzarella, Parma ham, rocket, parmesan, balsamic",
      price: "£17",
    },
    {
      name: "Goat's Cheese & Onion",
      description: "Tomato, goat's cheese, caramelized onion, thyme, honey",
      price: "£15",
      tag: "V",
    },
    {
      name: "Spicy Chorizo",
      description: "Tomato, mozzarella, chorizo, red peppers, chilli",
      price: "£16",
    },
    {
      name: "Mushroom & Truffle",
      description: "Garlic oil, mixed mushrooms, mozzarella, truffle oil",
      price: "£18",
      tag: "V",
    },
    {
      name: "Vegan Mediterranean",
      description: "Tomato, vegan cheese, roasted vegetables, olives",
      price: "£14",
      tag: "VE",
    },
  ];

  return (
    <main className="min-h-screen bg-[#FAFAFA] pt-24">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <header className="mb-16 text-center">
          <h1 className="font-serif text-4xl md:text-5xl text-neutral-900 mb-4">
            Menu
          </h1>
          <p className="font-sans text-neutral-600">
            Wood-fired sourdough pizzas
          </p>
        </header>

        <section className="mb-16">
          <div className="space-y-0">
            {pizzas.map((pizza, index) => (
              <div
                key={index}
                className="flex justify-between items-start py-5 border-b border-neutral-200"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-serif text-lg text-neutral-900">
                      {pizza.name}
                    </span>
                    {pizza.tag && (
                      <span className="font-sans text-xs text-neutral-500 border border-neutral-300 px-1.5 py-0.5">
                        {pizza.tag}
                      </span>
                    )}
                  </div>
                  <p className="font-sans text-sm text-neutral-500">
                    {pizza.description}
                  </p>
                </div>
                <span className="font-sans text-neutral-900 ml-4">
                  {pizza.price}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <div className="border-t border-neutral-200 pt-8">
            <p className="font-sans text-sm text-neutral-500 mb-4">
              <span className="border border-neutral-300 px-1.5 py-0.5 mr-2">V</span>
              Vegetarian
              <span className="border border-neutral-300 px-1.5 py-0.5 mx-2 ml-4">VE</span>
              Vegan
            </p>
            <p className="font-sans text-sm text-neutral-500">
              All pizzas contain gluten. Please inform us of any allergies.
            </p>
          </div>
        </section>

        <section className="text-center border-t border-neutral-200 pt-12">
          <h2 className="font-serif text-2xl text-neutral-900 mb-4">
            Custom Menus
          </h2>
          <p className="font-sans text-neutral-600 mb-6 max-w-md mx-auto">
            For private events, we can tailor our menu to your preferences.
          </p>
          <Link
            href="/events"
            className="inline-block font-sans text-sm uppercase tracking-wider bg-neutral-900 text-white px-6 py-3 hover:bg-neutral-800 transition-colors"
          >
            Plan Your Event
          </Link>
        </section>
      </div>
    </main>
  );
}

import BookingForm from "@/components/events/BookingForm";

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] pt-24">
      {/* Intro Section */}
      <header className="text-center py-16 md:py-24 border-b border-neutral-200">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="font-serif text-4xl md:text-5xl text-neutral-900 mb-4">
            Event Catering
          </h1>
          <p className="font-sans text-lg text-neutral-600">
            From weddings to corporate gatherings, bring fresh, wood-fired sourdough pizza to your special event. We handle everything, so you can focus on your guests.
          </p>
        </div>
      </header>
      
      {/* Form Section */}
      <section className="py-16 md:py-24 px-6">
        <BookingForm />
      </section>

      {/* Requirements Section */}
      <section className="py-16 md:py-24 bg-white border-t border-neutral-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center">
            <h2 className="font-serif text-3xl text-neutral-900 mb-4">What We Provide</h2>
            <p className="font-sans text-neutral-600 max-w-2xl mx-auto">
              Our standard private hire package includes our mobile pizza trailer, a professional team, and a continuous service of our signature pizzas for you and your guests.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center mt-12 font-sans text-neutral-600">
            <div>
              <h3 className="font-serif text-xl text-neutral-900 mb-2">Full Setup</h3>
              <p>We arrive, set up our mobile kitchen, and handle all the cleanup.</p>
            </div>
            <div>
              <h3 className="font-serif text-xl text-neutral-900 mb-2">Fresh Pizza</h3>
              <p>A selection of our classic pizzas, made fresh on-site for 2-3 hours.</p>
            </div>
            <div>
              <h3 className="font-serif text-xl text-neutral-900 mb-2">Dietary Options</h3>
              <p>We can cater for vegetarian, vegan, and gluten-free guests on request.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
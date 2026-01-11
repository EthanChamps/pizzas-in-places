import ContactForm from "@/components/contact/ContactForm";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] pt-24">
      <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        {/* Header */}
        <header className="mb-16 md:mb-24 text-center">
          <h1 className="font-serif text-4xl md:text-5xl text-neutral-900 mb-4">
            Get in Touch
          </h1>
          <p className="font-sans text-lg text-neutral-600 max-w-2xl mx-auto">
            Whether you have a question, a proposal for a private event, or just want to say hello, we’d love to hear from you.
          </p>
        </header>

        {/* Two-column layout */}
        <div className="grid md:grid-cols-2 md:gap-24">
          {/* Left Column: Context */}
          <div className="prose prose-neutral font-sans text-neutral-600 leading-relaxed">
            <h2 className="font-serif text-2xl text-neutral-900 mb-6">Contact Details</h2>
            <p>
              For general enquiries, please use the form. For anything urgent, you can reach us via email or phone.
            </p>
            <ul className="space-y-4 not-prose list-none p-0 mt-6">
              <li>
                <p className="text-sm text-neutral-500">Email</p>
                <a
                  href="mailto:hello@pizzasinplaces.co.uk"
                  className="text-neutral-900 hover:text-neutral-600 transition-colors"
                >
                  hello@pizzasinplaces.co.uk
                </a>
              </li>
              <li>
                <p className="text-sm text-neutral-500">Instagram</p>
                <a
                  href="https://www.instagram.com/pizzasinplaces/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-900 hover:text-neutral-600 transition-colors"
                >
                  @pizzasinplaces
                </a>
              </li>
              <li>
                <p className="text-sm text-neutral-500">Based in</p>
                <p className="text-neutral-900">The Cotswolds, UK</p>
              </li>
            </ul>
             <p className="mt-8">
              If you’re looking to book us for an event, please use the dedicated booking form for a detailed quote.
            </p>
            <a 
              href="/events" 
              className="font-sans text-sm text-neutral-900 hover:text-neutral-600 transition-colors link-underline mt-2 inline-block"
            >
              Go to Event Booking
            </a>
          </div>

          {/* Right Column: Form */}
          <div className="mt-16 md:mt-0">
            <ContactForm />
          </div>
        </div>
      </div>
    </main>
  );
}
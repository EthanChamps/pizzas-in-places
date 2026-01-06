"use client";

import Link from "next/link";
import { useState } from "react";

export default function EventsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventDate: "",
    location: "",
    guests: "",
    notes: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-[#FAFAFA] pt-24 flex items-center justify-center">
        <div className="max-w-md mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl text-neutral-900 mb-4">
            Thank you
          </h2>
          <p className="font-sans text-neutral-600 mb-8">
            We&apos;ve received your enquiry and will be in touch within 24 hours.
          </p>
          <Link
            href="/"
            className="font-sans text-neutral-900 hover:text-neutral-600 transition-colors link-underline"
          >
            Return home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] pt-24">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <header className="mb-16 text-center">
          <h1 className="font-serif text-4xl md:text-5xl text-neutral-900 mb-4">
            Private Events
          </h1>
          <p className="font-sans text-neutral-600">
            Bring wood-fired pizza to your celebration
          </p>
        </header>

        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h3 className="font-serif text-xl text-neutral-900 mb-4">
                We cater for
              </h3>
              <ul className="font-sans text-neutral-600 space-y-2">
                <li>Weddings & receptions</li>
                <li>Birthday parties</li>
                <li>Corporate events</li>
                <li>Private parties</li>
                <li>Festivals & markets</li>
              </ul>
            </div>
            <div>
              <h3 className="font-serif text-xl text-neutral-900 mb-4">
                What we provide
              </h3>
              <ul className="font-sans text-neutral-600 space-y-2">
                <li>Mobile wood-fired oven</li>
                <li>Professional team</li>
                <li>Fresh sourdough pizza</li>
                <li>Vegetarian & vegan options</li>
                <li>Full setup & cleanup</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-200 pt-8 mb-12">
            <h3 className="font-serif text-xl text-neutral-900 mb-4">
              Requirements
            </h3>
            <div className="font-sans text-neutral-600 text-sm space-y-1">
              <p>Level ground for trailer setup</p>
              <p>Vehicle access (3.5m wide, 6m long)</p>
              <p>3m clearance around cooking area</p>
              <p>Serves 50–200+ guests</p>
              <p>2-hour minimum service</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-neutral-900 mb-8 text-center">
            Get a quote
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block font-sans text-sm text-neutral-700 mb-2"
                >
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-neutral-300 font-sans text-neutral-900 focus:outline-none focus:border-neutral-900 transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block font-sans text-sm text-neutral-700 mb-2"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-neutral-300 font-sans text-neutral-900 focus:outline-none focus:border-neutral-900 transition-colors"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="phone"
                  className="block font-sans text-sm text-neutral-700 mb-2"
                >
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-neutral-300 font-sans text-neutral-900 focus:outline-none focus:border-neutral-900 transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="eventDate"
                  className="block font-sans text-sm text-neutral-700 mb-2"
                >
                  Event date *
                </label>
                <input
                  type="date"
                  id="eventDate"
                  name="eventDate"
                  required
                  value={formData.eventDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-neutral-300 font-sans text-neutral-900 focus:outline-none focus:border-neutral-900 transition-colors"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="location"
                  className="block font-sans text-sm text-neutral-700 mb-2"
                >
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  required
                  placeholder="Town or venue"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-neutral-300 font-sans text-neutral-900 focus:outline-none focus:border-neutral-900 transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="guests"
                  className="block font-sans text-sm text-neutral-700 mb-2"
                >
                  Number of guests *
                </label>
                <select
                  id="guests"
                  name="guests"
                  required
                  value={formData.guests}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-neutral-300 font-sans text-neutral-900 focus:outline-none focus:border-neutral-900 transition-colors bg-white"
                >
                  <option value="">Select</option>
                  <option value="30-50">30–50</option>
                  <option value="50-75">50–75</option>
                  <option value="75-100">75–100</option>
                  <option value="100-150">100–150</option>
                  <option value="150-200">150–200</option>
                  <option value="200+">200+</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="notes"
                className="block font-sans text-sm text-neutral-700 mb-2"
              >
                Tell us about your event
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                value={formData.notes}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-neutral-300 font-sans text-neutral-900 focus:outline-none focus:border-neutral-900 transition-colors resize-none"
              />
            </div>

            <div className="text-center pt-4">
              <button
                type="submit"
                className="font-sans text-sm uppercase tracking-wider bg-neutral-900 text-white px-8 py-4 hover:bg-neutral-800 transition-colors"
              >
                Send Enquiry
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

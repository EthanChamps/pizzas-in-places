"use client";

import Link from "next/link";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-[#FAFAFA] pt-24 flex items-center justify-center">
        <div className="max-w-md mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl text-neutral-900 mb-4">
            Message sent
          </h2>
          <p className="font-sans text-neutral-600 mb-8">
            Thank you for getting in touch. We&apos;ll respond as soon as possible.
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
            Contact
          </h1>
          <p className="font-sans text-neutral-600">
            We&apos;d love to hear from you
          </p>
        </header>

        <section className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h3 className="font-serif text-xl text-neutral-900 mb-6">
              Get in touch
            </h3>
            <div className="font-sans text-neutral-600 space-y-4">
              <div>
                <p className="text-sm text-neutral-500 mb-1">Email</p>
                <a
                  href="mailto:hello@pizzasinplaces.co.uk"
                  className="text-neutral-900 hover:text-neutral-600 transition-colors"
                >
                  hello@pizzasinplaces.co.uk
                </a>
              </div>
              <div>
                <p className="text-sm text-neutral-500 mb-1">Phone</p>
                <a
                  href="tel:+447123456789"
                  className="text-neutral-900 hover:text-neutral-600 transition-colors"
                >
                  07123 456 789
                </a>
              </div>
              <div>
                <p className="text-sm text-neutral-500 mb-1">Instagram</p>
                <a
                  href="https://www.instagram.com/pizzasinplaces/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-900 hover:text-neutral-600 transition-colors"
                >
                  @pizzasinplaces
                </a>
              </div>
              <div>
                <p className="text-sm text-neutral-500 mb-1">Area</p>
                <p className="text-neutral-900">The Cotswolds</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-serif text-xl text-neutral-900 mb-6">
              Send a message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
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

              <div>
                <label
                  htmlFor="message"
                  className="block font-sans text-sm text-neutral-700 mb-2"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-neutral-300 font-sans text-neutral-900 focus:outline-none focus:border-neutral-900 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full font-sans text-sm uppercase tracking-wider bg-neutral-900 text-white py-4 hover:bg-neutral-800 transition-colors"
              >
                Send
              </button>
            </form>
          </div>
        </section>

        <section className="border-t border-neutral-200 pt-12 text-center">
          <p className="font-sans text-neutral-500 text-sm mb-4">
            For event bookings, use our dedicated form
          </p>
          <Link
            href="/events"
            className="font-sans text-neutral-900 hover:text-neutral-600 transition-colors link-underline"
          >
            Book an event
          </Link>
        </section>
      </div>
    </main>
  );
}

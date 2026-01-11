import Link from "next/link";
import ScheduleClientPage from "@/components/schedule/ScheduleClientPage";

export default function SchedulePage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] pt-24">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <header className="mb-16 text-center">
          <h1 className="font-serif text-4xl md:text-5xl text-neutral-900 mb-4">
            Schedule
          </h1>
          <p className="font-sans text-neutral-600">
            Find us across the Cotswolds. Here’s where we’ll be next.
          </p>
        </header>

        <ScheduleClientPage />

        <section className="text-center border-t border-neutral-200 mt-16 pt-12">
          <h2 className="font-serif text-2xl text-neutral-900 mb-4">
            Private Events
          </h2>
          <p className="font-sans text-neutral-600 mb-6 max-w-md mx-auto">
            Book us for your wedding, party, or corporate event.
          </p>
          <Link
            href="/events"
            className="inline-block font-sans text-sm uppercase tracking-wider bg-neutral-900 text-white px-6 py-3 hover:bg-neutral-800 transition-colors"
          >
            Enquire
          </Link>
        </section>
      </div>
    </main>
  );
}
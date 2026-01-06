import Link from "next/link";
import { getTwoWeekSchedule } from "@/lib/schedule";

export default function SchedulePage() {
  const schedule = getTwoWeekSchedule();
  const today = new Date().toDateString();

  return (
    <main className="min-h-screen bg-[#FAFAFA] pt-24">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <header className="mb-16 text-center">
          <h1 className="font-serif text-4xl md:text-5xl text-neutral-900 mb-4">
            Schedule
          </h1>
          <p className="font-sans text-neutral-600">
            Find us across the Cotswolds, 6–9 PM
          </p>
        </header>

        <section className="mb-16">
          <div className="space-y-0">
            {schedule.map((location, index) => {
              const isToday = new Date(location.date).toDateString() === today;

              return (
                <div
                  key={index}
                  className={`flex justify-between items-center py-4 border-b border-neutral-200 ${
                    isToday ? "bg-neutral-900 text-white -mx-4 px-4" : ""
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <span className={`font-serif text-lg ${isToday ? "text-white" : "text-neutral-900"}`}>
                        {location.location}
                      </span>
                      {isToday && (
                        <span className="bg-white text-neutral-900 px-2 py-0.5 text-xs font-sans uppercase tracking-wider">
                          Today
                        </span>
                      )}
                    </div>
                    <span className={`font-sans text-sm ${isToday ? "text-neutral-300" : "text-neutral-500"}`}>
                      {location.date}
                    </span>
                  </div>
                  <span className={`font-sans ${isToday ? "text-neutral-300" : "text-neutral-600"}`}>
                    {location.time}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="text-center border-t border-neutral-200 pt-12">
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

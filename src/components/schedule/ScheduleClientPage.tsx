'use client';

import { useState, useEffect } from 'react';
import { ScheduleLocation } from '@/lib/schedule';
import LocationCard from './LocationCard';

const INITIAL_DAYS = 7;

export default function ScheduleClientPage() {
  const [schedule, setSchedule] = useState<ScheduleLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    async function fetchSchedule() {
      try {
        const response = await fetch('/api/locations');
        if (!response.ok) {
          throw new Error('Failed to fetch schedule');
        }
        const data = await response.json();
        // Transform API response to match ScheduleLocation interface
        const locations: ScheduleLocation[] = data.locations.map((loc: {
          name: string;
          date: string;
          start_time: string;
          end_time: string;
          latitude: number;
          longitude: number;
          what3words: string | null;
        }) => {
          const dateObj = new Date(loc.date);
          return {
            day: dateObj.toLocaleDateString('en-GB', { weekday: 'long' }),
            location: loc.name,
            startTime: loc.start_time.slice(0, 5),
            endTime: loc.end_time.slice(0, 5),
            date: dateObj.toLocaleDateString('en-GB', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
            latitude: Number(loc.latitude),
            longitude: Number(loc.longitude),
            what3words: loc.what3words || '',
          };
        });
        setSchedule(locations);
      } catch (err) {
        console.error('Error fetching schedule:', err);
        setError('Unable to load schedule. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchSchedule();
  }, []);

  if (loading) {
    return (
      <section className="mb-16">
        <div className="space-y-4">
          {[...Array(INITIAL_DAYS)].map((_, i) => (
            <div key={i} className="h-24 bg-neutral-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mb-16">
        <div className="text-center py-8">
          <p className="font-sans text-neutral-600">{error}</p>
        </div>
      </section>
    );
  }

  if (schedule.length === 0) {
    return (
      <section className="mb-16">
        <div className="text-center py-8">
          <p className="font-sans text-neutral-600">No upcoming locations scheduled.</p>
        </div>
      </section>
    );
  }

  const visibleSchedule = showAll ? schedule : schedule.slice(0, INITIAL_DAYS);
  const hasMore = schedule.length > INITIAL_DAYS;

  return (
    <section className="mb-16">
      <div className="space-y-4">
        {visibleSchedule.map((location, index) => (
          <LocationCard key={index} location={location} />
        ))}
      </div>
      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={() => setShowAll(!showAll)}
            className="font-sans text-sm uppercase tracking-wider border border-neutral-300 text-neutral-700 px-6 py-3 hover:bg-neutral-100 transition-colors"
          >
            {showAll ? 'Show less' : `View more dates`}
          </button>
        </div>
      )}
    </section>
  );
}

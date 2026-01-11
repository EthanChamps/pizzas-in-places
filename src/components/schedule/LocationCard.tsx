'use client';

import { useState, useMemo } from 'react';
import type { ScheduleLocation } from '@/lib/schedule';
import OpenInMapsMenu from './OpenInMapsMenu';

interface LocationCardProps {
  location: ScheduleLocation;
}

export default function LocationCard({ location }: LocationCardProps) {
  const [isMapsMenuOpen, setMapsMenuOpen] = useState(false);

  const { isToday, isNowOpen, timeDisplay } = useMemo(() => {
    const now = new Date();
    const locationDate = new Date(location.date);
    const isToday = now.toDateString() === locationDate.toDateString();

    const [startHour, startMinute] = location.startTime.split(':').map(Number);
    const [endHour, endMinute] = location.endTime.split(':').map(Number);

    const startTime = new Date(locationDate);
    startTime.setHours(startHour, startMinute, 0, 0);

    const endTime = new Date(locationDate);
    endTime.setHours(endHour, endMinute, 0, 0);

    const isNowOpen = isToday && now >= startTime && now <= endTime;
    
    const formatTime = (date: Date) => {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).replace(' ', '');
    }

    return {
      isToday,
      isNowOpen,
      timeDisplay: `${formatTime(startTime)} - ${formatTime(endTime)}`,
    };
  }, [location]);

  return (
    <>
      <div className="group relative">
        <div
          className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200 transition-shadow hover:shadow-md"
        >
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="font-serif text-xl text-neutral-900">{location.location}</h2>
                {isToday && (
                  <span className={`text-xs font-sans uppercase tracking-wider px-2 py-1 rounded-full ${isNowOpen ? 'bg-green-600 text-white' : 'bg-neutral-800 text-white'}`}>
                    {isNowOpen ? 'Now Open' : 'Today'}
                  </span>
                )}
              </div>
              <p className="font-sans text-sm text-neutral-500">
                {new Date(location.date).toLocaleDateString('en-GB', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>

            <div className="flex flex-col sm:items-end gap-2 sm:gap-4 flex-shrink-0">
              <p className="font-sans text-neutral-600 text-left sm:text-right">{timeDisplay}</p>
              <button
                onClick={() => setMapsMenuOpen(true)}
                className="font-sans text-sm text-neutral-900 bg-neutral-100 hover:bg-neutral-200 transition-colors px-4 py-2 rounded-md w-full sm:w-auto"
              >
                Open in Maps
              </button>
            </div>
          </div>
        </div>
      </div>

      {isMapsMenuOpen && (
        <OpenInMapsMenu location={location} onClose={() => setMapsMenuOpen(false)} />
      )}
    </>
  );
}

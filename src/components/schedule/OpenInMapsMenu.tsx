'use client';

import Image from 'next/image';
import { usePlatform } from '@/hooks/use-platform';
import type { ScheduleLocation } from '@/lib/schedule';

interface OpenInMapsMenuProps {
  location: ScheduleLocation;
  onClose: () => void;
}

interface MapProvider {
  name: string;
  icon: string;
  url: string;
  isDefault: boolean;
}

export default function OpenInMapsMenu({ location, onClose }: OpenInMapsMenuProps) {
  const platform = usePlatform();
  const { latitude, longitude, what3words, location: locationName } = location;

  const encodedLocationName = encodeURIComponent(locationName);

  const providers: MapProvider[] = [
    {
      name: 'Google Maps',
      icon: '/icons/google-maps.svg',
      url: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}&query_place_id=${encodedLocationName}`,
      isDefault: platform === 'android',
    },
    {
      name: 'Apple Maps',
      icon: '/icons/apple.svg',
      url: `http://maps.apple.com/?q=${encodedLocationName}&ll=${latitude},${longitude}`,
      isDefault: platform === 'ios',
    },
    {
      name: 'Waze',
      icon: '/icons/waze.svg',
      url: `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`,
      isDefault: false,
    },
    {
      name: 'what3words',
      icon: '/icons/what3words.svg',
      url: `https://what3words.com/${what3words.replace('///', '')}`,
      isDefault: false,
    },
  ];

  const sortedProviders = providers.sort((a, b) => (b.isDefault ? 1 : -1) - (a.isDefault ? 1 : -1));

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="maps-menu-title"
    >
      <div
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg p-6 md:absolute md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-sm md:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 id="maps-menu-title" className="font-serif text-xl text-neutral-900">
            Open in Maps
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-900"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <ul className="space-y-3">
          {sortedProviders.map((provider) => (
            <li key={provider.name}>
              <a
                href={provider.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-3 rounded-lg bg-neutral-100 hover:bg-neutral-200 transition-colors"
              >
                <Image src={provider.icon} alt={`${provider.name} icon`} width={24} height={24} className="opacity-70" />
                <span className="font-sans text-neutral-800">{provider.name}</span>
                {provider.isDefault && (
                  <span className="ml-auto text-xs font-sans text-neutral-500 bg-neutral-200 px-2 py-1 rounded-full">
                    Default
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

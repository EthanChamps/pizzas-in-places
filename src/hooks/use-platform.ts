'use client';

import { useSyncExternalStore } from 'react';

export type Platform = 'ios' | 'android' | 'desktop';

function getPlatform(): Platform {
  if (typeof window === 'undefined') {
    return 'desktop';
  }

  const userAgent = window.navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  const isAndroid = /Android/.test(userAgent);

  if (isIOS) return 'ios';
  if (isAndroid) return 'android';
  return 'desktop';
}

function subscribe() {
  // Platform doesn't change, no subscription needed
  return () => {};
}

function getSnapshot(): Platform {
  return getPlatform();
}

function getServerSnapshot(): Platform {
  return 'desktop';
}

export function usePlatform(): Platform {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

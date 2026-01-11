'use client';

import { useLayoutEffect } from 'react';

export function useScrollLock(isLocked: boolean) {
  useLayoutEffect(() => {
    if (isLocked) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isLocked]);
}

'use client';

import { useEffect } from 'react';
import { initializeAppData } from '@/lib/initializeData';

/**
 * Client component that initializes all app data on mount
 * This ensures mock data is loaded consistently across the app
 */
export function DataInitializer() {
  useEffect(() => {
    initializeAppData();
  }, []);

  return null;
}


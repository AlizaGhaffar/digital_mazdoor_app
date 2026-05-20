'use client';

import React from 'react';
import { GlobalProvider } from '@/context/GlobalContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GlobalProvider>
      {children}
    </GlobalProvider>
  );
}

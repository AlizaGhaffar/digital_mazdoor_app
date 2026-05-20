'use client';

import React from 'react';
import { useGlobalState } from '@/context/GlobalContext';
import { LandingPage } from '@/components/LandingPage';
import { Dashboard } from '@/components/Dashboard';

export default function Home() {
  const { viewMode } = useGlobalState();

  if (viewMode === 'landing') {
    return <LandingPage />;
  }

  return <Dashboard />;
}

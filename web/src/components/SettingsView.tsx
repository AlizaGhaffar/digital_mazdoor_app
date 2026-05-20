'use client';

import React from 'react';
import { useGlobalState } from '@/context/GlobalContext';
import { Shield, MapPin, User, Moon, Sun, Laptop, Cpu, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';

const neighborhoods = [
  { name: 'Gulshan-e-Iqbal, Karachi', lat: 24.92, lng: 67.09 },
  { name: 'DHA Phase 6, Karachi', lat: 24.81, lng: 67.05 },
  { name: 'Clifton, Karachi', lat: 24.82, lng: 67.03 },
  { name: 'Nazimabad, Karachi', lat: 24.91, lng: 67.02 },
  { name: 'PECHS, Karachi', lat: 24.87, lng: 67.07 },
];

export const SettingsView: React.FC = () => {
  const { 
    theme, 
    toggleTheme, 
    user, 
    logout, 
    userLocation, 
    setUserLocation, 
    detectLocation,
    backendConnected, 
    checkBackendHealth 
  } = useGlobalState();

  // Combine predefined neighborhoods and dynamic current location
  const isPredefined = neighborhoods.some(n => n.name === userLocation.name);
  const dropdownOptions = [...neighborhoods];
  if (!isPredefined && userLocation.name) {
    dropdownOptions.unshift(userLocation);
  }

  const handleLocationChange = (name: string) => {
    const matched = dropdownOptions.find(n => n.name === name);
    if (matched) {
      setUserLocation(matched);
    }
  };

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      {/* Screen Title */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h2 className="text-2xl font-extrabold tracking-tight">System Settings</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your credentials, geofence coordinates, theme choices, and backend health status.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Profile Card & Theme */}
        <div className="md:col-span-8 space-y-6">
          {/* Profile Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
            <h3 className="text-lg font-extrabold tracking-tight flex items-center gap-2">
              <User className="h-5 w-5 text-slate-400" />
              User Profile
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5 text-xs font-semibold text-slate-500">
                <span>Account Name</span>
                <p className="text-sm text-slate-900 dark:text-white font-extrabold mt-1">
                  {user?.name || 'Guest User'}
                </p>
              </div>
              <div className="space-y-1.5 text-xs font-semibold text-slate-500">
                <span>Phone Number</span>
                <p className="text-sm text-slate-900 dark:text-white font-extrabold mt-1">
                  {user?.phone || '03000000000'}
                </p>
              </div>
              <div className="space-y-1.5 text-xs font-semibold text-slate-500">
                <span>Email Address</span>
                <p className="text-sm text-slate-900 dark:text-white font-extrabold mt-1">
                  {user?.email || 'guest@digitalmazdoor.pk'}
                </p>
              </div>
              <div className="space-y-1.5 text-xs font-semibold text-slate-500">
                <span>Account Reputation Rating</span>
                <p className="text-sm text-emerald-500 font-extrabold mt-1 flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  {user?.reputation || 95}% Positive
                </p>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
              <button
                onClick={logout}
                className="cursor-pointer rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40 text-red-600 px-5 py-2.5 text-xs font-extrabold transition active:scale-[0.98]"
              >
                Log Out Account
              </button>
            </div>
          </div>

          {/* Theme Settings */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h3 className="text-lg font-extrabold tracking-tight flex items-center gap-2">
              <Moon className="h-5 w-5 text-slate-400" />
              Theme Preferences
            </h3>
            
            <div className="flex items-center justify-between border border-slate-100 dark:border-slate-800 rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-950/20">
              <div>
                <p className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                  {theme === 'dark' ? 'Dark Theme Active' : 'Light Theme Active'}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Adjust visual styles for low light reading.
                </p>
              </div>

              <button
                onClick={toggleTheme}
                className="cursor-pointer flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 transition"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 text-amber-500 fill-amber-500/10" />
                ) : (
                  <Moon className="h-5 w-5 text-slate-700 fill-slate-700/10" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Geofence Context & Backend status (Right column) */}
        <div className="md:col-span-4 space-y-6">
          {/* Geolocation selector */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h3 className="text-lg font-extrabold tracking-tight flex items-center gap-2">
              <MapPin className="h-5 w-5 text-slate-400" />
              Geofence Center
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Neighborhood Coordinates</span>
                <select
                  value={userLocation.name}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  className="w-full mt-1.5 rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 text-xs font-bold text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                >
                  {dropdownOptions.map((n, idx) => (
                    <option key={idx} value={n.name}>
                      {n.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-[10px] font-mono text-slate-400 dark:border-slate-800 dark:bg-slate-950 space-y-1">
                <p>LATITUDE: {userLocation.lat}</p>
                <p>LONGITUDE: {userLocation.lng}</p>
              </div>

              <button
                onClick={detectLocation}
                className="cursor-pointer flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-850 px-4 py-2.5 text-[10px] font-black w-full text-slate-800 dark:text-slate-200 transition"
              >
                <RefreshCw className="h-3 w-3" />
                Detect GPS Location
              </button>
            </div>
          </div>

          {/* Backend Connection */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h3 className="text-lg font-extrabold tracking-tight flex items-center gap-2">
              <Cpu className="h-5 w-5 text-slate-400" />
              API Connection
            </h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className={`h-3.5 w-3.5 rounded-full shrink-0 ${backendConnected ? 'bg-emerald-500 shadow-md shadow-emerald-500/35' : 'bg-red-500 shadow-md shadow-red-500/35 animate-pulse'}`} />
                <span className="text-xs font-black">
                  {backendConnected ? 'Connected to FastAPI' : 'FastAPI Offline'}
                </span>
              </div>

              <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
                {backendConnected 
                  ? 'All requests resolve dynamically through the live agent pipeline using your local FastAPI server.' 
                  : 'FastAPI server at http://localhost:8000 is not responding. The frontend is automatically running on local mock fallbacks so you can still demonstrate all booking workflows.'}
              </p>

              <button 
                onClick={checkBackendHealth}
                className="cursor-pointer flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-850 px-4 py-2.5 text-[10px] font-black w-full text-slate-800 dark:text-slate-200 transition"
              >
                <RefreshCw className="h-3 w-3" />
                Refresh Health Status
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

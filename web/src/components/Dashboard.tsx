'use client';

import React, { useState } from 'react';
import { useGlobalState, TabType } from '@/context/GlobalContext';
import { Marketplace } from './Marketplace';
import { AIAssistant } from './AIAssistant';
import { ResultsView } from './ResultsView';
import { TraceView } from './TraceView';
import { BookingView } from './BookingView';
import { HistoryView } from './HistoryView';
import { SettingsView } from './SettingsView';
import { 
  Bot, 
  LayoutDashboard, 
  MessageSquareCode, 
  TrendingUp, 
  Terminal, 
  CalendarCheck, 
  History, 
  Settings, 
  LogOut, 
  Moon, 
  Sun,
  MapPin,
  Cpu,
  Menu,
  X,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Dashboard: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    user, 
    logout, 
    theme, 
    toggleTheme, 
    userLocation, 
    detectLocation,
    backendConnected,
    currentBooking
  } = useGlobalState();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navigationItems = [
    { id: 'marketplace' as TabType, name: 'Marketplace', icon: LayoutDashboard },
    { id: 'assistant' as TabType, name: 'AI Assistant', icon: MessageSquareCode },
    { id: 'results' as TabType, name: 'Results Analysis', icon: TrendingUp },
    { id: 'trace' as TabType, name: 'Reasoning Trace', icon: Terminal },
    { id: 'booking' as TabType, name: 'Active Booking', icon: CalendarCheck, badge: currentBooking ? '1' : undefined },
    { id: 'history' as TabType, name: 'Activity History', icon: History },
    { id: 'settings' as TabType, name: 'Settings', icon: Settings },
  ];

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'marketplace':
        return <Marketplace />;
      case 'assistant':
        return <AIAssistant />;
      case 'results':
        return <ResultsView />;
      case 'trace':
        return <TraceView />;
      case 'booking':
        return <BookingView />;
      case 'history':
        return <HistoryView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <Marketplace />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shrink-0">
        <div className="px-6 py-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 shadow-md shadow-indigo-600/30">
            <Bot className="h-5.5 w-5.5 text-white" />
          </div>
          <span className="font-black text-lg tracking-tight bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-300">
            Digital Mazdoor
          </span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/15'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4.5 w-4.5" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white text-indigo-600' : 'bg-indigo-600 text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold px-3 py-2 bg-slate-50 dark:bg-slate-950/40 rounded-xl">
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${backendConnected ? 'bg-emerald-500 shadow-md shadow-emerald-500/25' : 'bg-red-500 shadow-md'}`} />
              <span className="text-slate-500 dark:text-slate-400">FastAPI</span>
            </div>
            <span className="text-[10px] font-black text-slate-400">v1.0.0</span>
          </div>

          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200 cursor-pointer"
          >
            <LogOut className="h-4.5 w-4.5" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            {/* Sidebar content */}
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-64 border-r border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between"
            >
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
                      <Bot className="h-5.5 w-5.5" />
                    </div>
                    <span className="font-black text-lg tracking-tight bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-300">
                      Digital Mazdoor
                    </span>
                  </div>
                  <button onClick={() => setMobileSidebarOpen(false)} className="p-1 rounded bg-slate-100 dark:bg-slate-800">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <nav className="space-y-1.5">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setMobileSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
                          isActive
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/15'
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-4.5 w-4.5" />
                          <span>{item.name}</span>
                        </div>
                        {item.badge && (
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            isActive ? 'bg-white text-indigo-600' : 'bg-indigo-600 text-white'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition cursor-pointer animate-pulse"
                >
                  <LogOut className="h-4.5 w-4.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 px-6 sm:px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-850 rounded-xl"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Geofence Context indicator */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-50 dark:bg-slate-950 px-3.5 py-2 rounded-2xl border border-slate-100 dark:border-slate-850">
              <MapPin className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <div className="text-left flex items-center gap-2">
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Geofence center</p>
                  <p className="text-xs font-black text-slate-900 dark:text-white line-clamp-1">{userLocation.name}</p>
                </div>
                {(userLocation.name === 'Location not selected' || userLocation.name === 'Enable location access') ? (
                  <button 
                    onClick={detectLocation}
                    className="cursor-pointer ml-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 text-[9px] font-bold transition flex items-center gap-1 active:scale-95"
                    title="Detect current location"
                  >
                    <RefreshCw className="h-2.5 w-2.5 animate-pulse" />
                    GPS
                  </button>
                ) : (
                  <button 
                    onClick={detectLocation}
                    className="cursor-pointer ml-1 p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                    title="Refresh GPS location"
                  >
                    <RefreshCw className="h-2.5 w-2.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme toggle */}
            <button 
              onClick={toggleTheme}
              className="rounded-full p-2.5 border border-slate-200/60 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-850 transition"
            >
              {theme === 'dark' ? (
                <Sun className="h-4.5 w-4.5 text-amber-500 fill-amber-500/10" />
              ) : (
                <Moon className="h-4.5 w-4.5 text-slate-700 fill-slate-700/10" />
              )}
            </button>

            {/* User Profile Info */}
            <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-800 pl-4">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'G'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">{user?.name || 'Guest User'}</p>
                <p className="text-[10px] text-slate-400 font-semibold">{user?.role === 'provider' ? 'Mazdoor Provider' : 'Service Seeker'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Tab Content */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="mx-auto max-w-7xl">
            {renderActiveTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

'use client';

import React from 'react';
import { useGlobalState } from '@/context/GlobalContext';
import { Wind, Droplets, Zap, Brush, BookOpen, Clock, MapPin, ArrowRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const services = [
  { id: 'ac', name: 'AC Repair', icon: Wind, color: 'from-blue-500 to-cyan-500', desc: 'Air Conditioning maintenance & gas refilling' },
  { id: 'plumbing', name: 'Plumbing', icon: Droplets, color: 'from-emerald-500 to-teal-500', desc: 'Leaking pipes, washroom installations' },
  { id: 'electric', name: 'Electrician', icon: Zap, color: 'from-amber-500 to-orange-500', desc: 'Short-circuit fixing, UPS, wiring jobs' },
  { id: 'painter', name: 'Painter', icon: Brush, color: 'from-pink-500 to-rose-500', desc: 'Wall painting, waterproofing treatment' },
  { id: 'tutor', name: 'Tutor', icon: BookOpen, color: 'from-violet-500 to-purple-500', desc: 'Mathematics, Science, Urdu tutorials' },
];

export const Marketplace: React.FC = () => {
  const { history, userLocation, setActiveTab, runOrchestrator } = useGlobalState();

  const handleQuickBook = (serviceName: string) => {
    // Navigate to assistant and automatically submit
    setActiveTab('assistant');
    // Pre-populate input is handled by sending prompt
  };

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-indigo-600 px-8 py-10 text-white shadow-xl shadow-indigo-600/20 dark:bg-indigo-950 dark:shadow-none">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-indigo-500/30 blur-2xl" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="inline-block rounded-full bg-indigo-500/40 px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
            Karachi Service Hub
          </span>
          <h1 className="text-3xl font-extrabold sm:text-4xl">
            Find the Perfect Professional in Seconds
          </h1>
          <p className="text-indigo-100 text-sm sm:text-base">
            Our autonomous network of AI agents filters, matches, ranks, and coordinates the best providers based on your custom prompt.
          </p>
          <div className="pt-2">
            <button 
              onClick={() => setActiveTab('assistant')}
              className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-indigo-600 shadow-md hover:bg-slate-50 transition active:scale-[0.98]"
            >
              Ask AI Assistant
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Top Categories */}
      <div className="space-y-6">
        <h2 className="text-2xl font-extrabold tracking-tight">Top Categories</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleQuickBook(service.name)}
                className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md dark:border-slate-800 dark:bg-slate-900 transition flex flex-col justify-between"
              >
                <div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${service.color} text-white shadow-md`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-lg font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                    {service.name}
                  </h3>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {service.desc}
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-end text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Recent Workflows */}
      {history.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-extrabold tracking-tight">Recent Activity</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {history.slice(0, 3).map((item, index) => (
              <div 
                key={index}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">
                      {item.intent?.service_type || 'General Service'}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {item.location_name || 'Karachi'} • Status: <span className="font-bold text-indigo-600 dark:text-indigo-400">{item.workflow_status}</span>
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    // Load this history into active global state so they can inspect it
                    // We can directly toggle to results / trace
                    setActiveTab('history');
                  }}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* How AI Orchestrator Works Infographic */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-xl font-bold tracking-tight mb-6">Autonomous Multi-Agent Pipeline</h2>
        <div className="relative">
          {/* Timeline lines */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 hidden lg:block" />
          
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 relative z-10">
            {[
              { title: '1. Intent Analysis', desc: 'IntentAgent parses Roman Urdu input dynamically using DeepSeek v3.', step: '01' },
              { title: '2. Matching & Geofence', desc: 'MatchingAgent filters registered providers within device geofence limits.', step: '02' },
              { title: '3. Multi-Factor Ranking', desc: 'RankingAgent weights ratings, proximity, prices, and reliability scores.', step: '03' },
              { title: '4. Atomic Booking', desc: 'Scheduling & Booking Agents coordinate availability slots and dispatch.', step: '04' }
            ].map((step, idx) => (
              <div key={idx} className="space-y-3 bg-white dark:bg-slate-900 rounded-xl p-4 lg:p-0">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-md">
                    {step.step}
                  </span>
                  <h4 className="font-extrabold text-sm">{step.title}</h4>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

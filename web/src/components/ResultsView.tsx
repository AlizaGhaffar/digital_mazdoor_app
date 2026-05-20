'use client';

import React from 'react';
import { useGlobalState } from '@/context/GlobalContext';
import { Brain, Star, MapPin, CheckCircle, Info, ChevronRight, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const ResultsView: React.FC = () => {
  const { workflowContext, confirmBooking, setActiveTab } = useGlobalState();

  if (!workflowContext) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
        <Info className="h-12 w-12 text-slate-400" />
        <h3 className="text-lg font-bold">No analysis results found</h3>
        <p className="text-sm text-slate-500 max-w-xs">
          Please run a query in the AI Assistant screen to get ranked provider results.
        </p>
        <button 
          onClick={() => setActiveTab('assistant')}
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-indigo-700 transition"
        >
          Go to AI Assistant
        </button>
      </div>
    );
  }

  const intent = workflowContext.intent || {};
  const providers = workflowContext.ranked_providers || [];

  return (
    <div className="space-y-10">
      {/* AI Analysis Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
              <Brain className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-extrabold tracking-tight">AI Orchestrator Analysis Summary</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Service</span>
              <p className="font-extrabold text-sm text-slate-900 dark:text-white">{intent.service_type || 'N/A'}</p>
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Location Context</span>
              <p className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-1">{intent.location_name || 'N/A'}</p>
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Urgency</span>
              <p className="font-extrabold text-sm text-slate-900 dark:text-white">{intent.urgency || 'N/A'}</p>
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Match Confidence</span>
              <p className={`font-extrabold text-sm ${intent.confidence > 0.7 ? 'text-emerald-500' : 'text-amber-500'}`}>
                {intent.confidence ? `${(intent.confidence * 100).toFixed(0)}%` : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="md:col-span-4 flex justify-end border-t border-slate-100 dark:border-slate-800 md:border-t-0 pt-6 md:pt-0">
          <button 
            onClick={() => setActiveTab('trace')}
            className="cursor-pointer flex items-center justify-center gap-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 px-6 py-3.5 text-sm font-bold w-full md:w-auto shadow-sm hover:bg-indigo-100 transition active:scale-[0.98]"
          >
            View AI Reasoning Trace
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Recommended Providers */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Recommended Providers</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Autonomous sorting based on ratings, proximity, scheduling buffers, and target budgets.
          </p>
        </div>

        {providers.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {providers.map((provider: any, index: number) => (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`relative rounded-3xl bg-white p-6 dark:bg-slate-900 border transition flex flex-col justify-between ${
                  index === 0
                    ? 'border-indigo-500 shadow-md shadow-indigo-500/5 ring-1 ring-indigo-500/25'
                    : 'border-slate-200 dark:border-slate-800 shadow-sm'
                }`}
              >
                {index === 0 && (
                  <span className="absolute top-4 right-4 inline-flex items-center gap-1 bg-indigo-600 text-[10px] font-black tracking-wider uppercase text-white px-2.5 py-1 rounded-full shadow-md">
                    <CheckCircle className="h-3 w-3" />
                    Best Match
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white line-clamp-1">
                      {provider.full_name}
                    </h3>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold mt-0.5">
                      {provider.service_type}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span>{provider.rating}</span>
                    </div>
                    <span className="text-slate-300 dark:text-slate-700">|</span>
                    <span className="text-emerald-500 font-bold">{provider.reliability_score}% Reliable</span>
                  </div>

                  <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <span>{provider.location.neighborhood}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span>Orchestrator Score:</span>
                      <span className="font-extrabold text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        {provider.orchestrator_score} / 100
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Estimated Rate</span>
                    <p className="text-lg font-black text-indigo-600 dark:text-indigo-400 mt-0.5">Rs. {provider.base_rate}</p>
                  </div>
                  <button
                    onClick={() => confirmBooking(provider)}
                    className={`cursor-pointer rounded-xl px-4 py-2.5 text-xs font-black shadow-sm active:scale-[0.98] transition ${
                      index === 0
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    Book Service
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <AlertCircle className="h-10 w-10 text-slate-400" />
            <h3 className="text-base font-bold">No candidate pool matches</h3>
            <p className="text-xs text-slate-400 max-w-xs">
              The matching agent was unable to find nearby verified providers. Try modifying your search bounds.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

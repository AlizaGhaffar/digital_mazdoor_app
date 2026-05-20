'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useGlobalState } from '@/context/GlobalContext';
import { Bot, Send, Brain, Sparkles, MapPin, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const promptSuggestions = [
  { label: 'Roman Urdu AC repair', text: 'Mujhe kal subah Gulshan mein AC technician chahiye' },
  { label: 'Kitchen Pipe leak', text: 'DHA Phase 6 me kitchen pipe leakage leak ho gaya hai urgent plumber bhejein' },
  { label: 'Short circuit', text: 'Mera room ka board short ho gaya hai, electricity check karwana hai Clifton me' },
  { label: 'Unsupported category', text: 'Mera ghur saaf karne ke liye aik maid/masi chahiye abhi' },
];

export const AIAssistant: React.FC = () => {
  const { runOrchestrator, loading, workflowContext, userLocation, detectLocation, error } = useGlobalState();
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    
    const query = input;
    setInput('');
    await runOrchestrator(query);
  };

  const handleSuggestionClick = (text: string) => {
    setInput(text);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [loading, workflowContext]);

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] min-h-[500px] border border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
      {/* Location tag bar */}
      <div className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 px-6 py-3 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <span className="flex items-center gap-2">
            Active Geolocation context:{' '}
            <span className="font-extrabold text-slate-800 dark:text-white">{userLocation.name}</span>
            {(userLocation.name === 'Location not selected' || userLocation.name === 'Enable location access') ? (
              <button 
                type="button"
                onClick={detectLocation}
                className="cursor-pointer ml-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-0.5 text-[10px] font-bold transition flex items-center gap-1 active:scale-95"
              >
                <RefreshCw className="h-2.5 w-2.5 animate-pulse" />
                Enable GPS
              </button>
            ) : (
              <button 
                type="button"
                onClick={detectLocation}
                className="cursor-pointer ml-1 p-0.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                title="Refresh location"
              >
                <RefreshCw className="h-3 w-3" />
              </button>
            )}
          </span>
        </div>
        <span className="text-[10px] uppercase bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded font-bold">
          DeepSeek v3 Active
        </span>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Welcome message */}
        <div className="flex gap-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 shadow-md">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div className="max-w-[80%] space-y-2 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm leading-relaxed text-slate-800 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200">
            <p className="font-semibold text-slate-900 dark:text-white">Assalam-o-Alaikum! I am your AI Service Orchestrator.</p>
            <p>Tell me what service you need today. You can speak in Urdu, English, or Roman Urdu.</p>
            <p className="text-xs text-slate-400 italic">
              Example: "AC kharab hai Gulshan me theek karwana hai" or "Plumber needed for kitchen leak in Clifton".
            </p>
          </div>
        </div>

        {/* Render query input if matching exists */}
        {workflowContext && (
          <div className="space-y-6">
            <div className="flex gap-4 justify-end">
              <div className="max-w-[80%] rounded-2xl bg-indigo-600 p-4 text-sm leading-relaxed text-white shadow-md">
                <p>{workflowContext.raw_input}</p>
              </div>
            </div>

            {/* Render response / reasoning */}
            {workflowContext.workflow_status === 'UNSUPPORTED' ? (
              <div className="flex gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 shadow-md">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div className="max-w-[80%] space-y-2 rounded-2xl border border-amber-200 bg-amber-50/50 p-4 text-sm leading-relaxed text-slate-800 dark:border-amber-900/30 dark:bg-amber-950/20 dark:text-slate-200">
                  <p className="font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4" />
                    Unsupported Category
                  </p>
                  <p className="font-semibold">{workflowContext.fallback_response}</p>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Loading / Reasoning Trace state */}
        {loading && (
          <div className="flex gap-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 shadow-md">
              <Brain className="h-5 w-5 text-white animate-pulse" />
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/30 px-5 py-3 text-sm text-indigo-600 dark:border-indigo-900/30 dark:bg-indigo-950/20 dark:text-indigo-400">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="font-bold flex items-center gap-1">
                Agent Reasoning Pipeline in execution... <Sparkles className="h-4 w-4 text-indigo-500 animate-bounce" />
              </span>
            </div>
          </div>
        )}

        {/* Global errors */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50/50 p-4 dark:border-red-900/30 dark:bg-red-950/20">
            <p className="text-sm text-red-600 dark:text-red-400 font-bold">{error}</p>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggestion list */}
      {!workflowContext && !loading && (
        <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/20">
          <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {promptSuggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(s.text)}
                className="cursor-pointer text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-500 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-400 dark:hover:text-indigo-400 transition"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="border-t border-slate-100 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-950/20 flex gap-4">
        <textarea
          required
          rows={1}
          placeholder="Ask for plumbing, AC repair, tutors, painters, electricians..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          className="flex-1 resize-none rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold outline-none transition focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-500"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="cursor-pointer flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/10 active:scale-[0.96] disabled:opacity-40 transition"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { useGlobalState } from '@/context/GlobalContext';
import { Brain, ChevronDown, ChevronUp, CheckCircle2, AlertTriangle, HelpCircle, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TraceStepProps {
  step: any;
  isLast: boolean;
}

const TraceStep: React.FC<TraceStepProps> = ({ step, isLast }) => {
  const [expanded, setExpanded] = useState(true);

  const agentName = step.agent_id.replace('_', ' ').toUpperCase();
  const timestamp = new Date(step.timestamp || Date.now()).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-emerald-500 fill-emerald-500/10" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500 fill-amber-500/10" />;
      case 'failure':
        return <AlertTriangle className="h-5 w-5 text-red-500 fill-red-500/10" />;
      default:
        return <HelpCircle className="h-5 w-5 text-slate-400" />;
    }
  };

  return (
    <div className="flex gap-6">
      {/* Timeline Column */}
      <div className="flex flex-col items-center shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 z-10 shadow-sm">
          {getStatusIcon(step.status || 'success')}
        </div>
        {!isLast && (
          <div className="w-0.5 flex-1 bg-slate-200 dark:bg-slate-800 my-2" />
        )}
      </div>

      {/* Content Column */}
      <div className="flex-1 pb-10">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
          {/* Header */}
          <button 
            onClick={() => setExpanded(!expanded)}
            className="w-full text-left px-6 py-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-950/20 transition"
          >
            <div>
              <h3 className="font-extrabold text-sm tracking-wide text-slate-800 dark:text-slate-200">
                {agentName}
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-1">
                Executed at {timestamp}
              </p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition">
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </button>

          {/* Details */}
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-slate-100 dark:border-slate-800"
              >
                <div className="p-6 space-y-6">
                  {/* Reasoning list */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Agent Reasoning Logic</span>
                    <ul className="space-y-2.5">
                      {step.reasoning_logic.map((logic: string, idx: number) => (
                        <li key={idx} className="flex gap-3 text-xs font-semibold text-slate-600 dark:text-slate-300 leading-relaxed">
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                          <span>{logic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Decision codeblock */}
                  {step.decision && (
                    <div className="space-y-2.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <Terminal className="h-3 w-3" />
                        Decision Output Payload
                      </span>
                      <pre className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-4 text-[11px] font-mono text-indigo-600 dark:text-indigo-400 overflow-x-auto leading-relaxed border border-slate-100 dark:border-slate-900/60 max-h-48">
                        {JSON.stringify(step.decision, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export const TraceView: React.FC = () => {
  const { traces } = useGlobalState();

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      {/* Screen Header */}
      <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 shadow-sm">
          <Brain className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">AI Reasoning Trace</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Audit the decision flow logs and reasoning steps taken by the autonomous orchestrator.
          </p>
        </div>
      </div>

      {/* Timeline List */}
      {traces.length > 0 ? (
        <div className="pl-4 pr-2 pt-4">
          {traces.map((step, index) => (
            <TraceStep 
              key={index}
              step={step}
              isLast={index === traces.length - 1}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <Brain className="h-14 w-14 text-slate-300 dark:text-slate-700 animate-pulse" />
          <h3 className="text-lg font-bold">No traces logged</h3>
          <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
            Traces appear automatically after executing service request workflows in the AI Assistant chat.
          </p>
        </div>
      )}
    </div>
  );
};

'use client';

import React from 'react';
import { useGlobalState } from '@/context/GlobalContext';
import { Clock, MapPin, ChevronRight, Info, Award, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export const HistoryView: React.FC = () => {
  const { history, disputes, setActiveTab, setWorkflowContext } = useGlobalState();

  const handleAuditTrace = (item: any) => {
    // Load workflow traces into current active state and route to trace view
    setWorkflowContext(item);
    setActiveTab('trace');
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Screen Title */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h2 className="text-2xl font-extrabold tracking-tight">Activity History</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review your completed service requests, bookings, and dispute audits.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Bookings log */}
        <div className="lg:col-span-8 space-y-6">
          <h3 className="text-lg font-extrabold tracking-tight flex items-center gap-2">
            <Clock className="h-5 w-5 text-slate-400" />
            Workflow Requests Log
          </h3>

          {history.length > 0 ? (
            <div className="space-y-4">
              {history.map((item: any, index: number) => {
                const isCompleted = item.workflow_status === 'SUCCESS' || item.workflow_status === 'CONFIRMED' || item.workflow_status === 'Active';
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between md:flex-row md:items-center gap-6"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-black tracking-wider uppercase ${
                          isCompleted
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400'
                            : 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400'
                        }`}>
                          {item.workflow_status}
                        </span>
                        <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                          {item.intent?.service_type || 'General Service'}
                        </h4>
                      </div>

                      <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <span className="font-mono">ID: {item.workflow_id || 'manual'}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{item.location_name || 'Karachi'}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold line-clamp-1 italic">
                        "{item.raw_input}"
                      </p>
                    </div>

                    <button
                      onClick={() => handleAuditTrace(item)}
                      className="cursor-pointer shrink-0 rounded-xl bg-slate-50 border border-slate-200/60 hover:bg-slate-100 dark:bg-slate-800/40 dark:border-slate-800 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 px-4 py-2.5 text-xs font-extrabold flex items-center justify-center gap-1.5 transition active:scale-[0.98]"
                    >
                      Audit AI Trace
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-3 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <Clock className="h-10 w-10 text-slate-300 dark:text-slate-700" />
              <h4 className="font-bold text-sm">No activity recorded</h4>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                Your completed AI orchestration workflows will appear here once executed.
              </p>
            </div>
          )}
        </div>

        {/* Dispute Logs (Right column) */}
        <div className="lg:col-span-4 space-y-6">
          <h3 className="text-lg font-extrabold tracking-tight flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-slate-400" />
            AI Dispute Audits
          </h3>

          {disputes.length > 0 ? (
            <div className="space-y-4">
              {disputes.map((disp, idx) => (
                <div 
                  key={idx}
                  className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 space-y-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Dispute #{disp.id.slice(-4)}
                    </span>
                    <span className="text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
                      {disp.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <p className="font-bold text-slate-500">Evidence:</p>
                    <p className="text-slate-800 dark:text-slate-300 line-clamp-2 font-semibold">"{disp.evidence}"</p>
                  </div>

                  {disp.verdict && (
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-1 text-xs">
                      <p className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <Award className="h-3.5 w-3.5" />
                        Verdict:
                      </p>
                      <p className="text-slate-600 dark:text-slate-400 font-semibold">{disp.verdict}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-3 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <ShieldAlert className="h-10 w-10 text-slate-300 dark:text-slate-700" />
              <h4 className="font-bold text-sm">Clean records</h4>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                No active disputes or claims recorded under this profile session.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

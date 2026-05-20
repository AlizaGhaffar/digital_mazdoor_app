'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useGlobalState } from '@/context/GlobalContext';
import { CheckCircle, Calendar, Clock, MapPin, User, Send, ShieldAlert, Sparkles, MessageSquare, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const BookingView: React.FC = () => {
  const { currentBooking, createDispute, setActiveTab } = useGlobalState();
  const [messages, setMessages] = useState<Array<{ id: string; text: string; sender: 'user' | 'provider' }>>([
    { id: '1', text: 'Assalam-o-Alaikum! G mein booking mil gayi hai. Mein time pe pohnch jaunga.', sender: 'provider' }
  ]);
  const [chatInput, setChatInput] = useState('');
  
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [disputeType, setDisputeType] = useState('rate_mismatch');
  const [disputeEvidence, setDisputeEvidence] = useState('');
  const [disputeLoading, setDisputeLoading] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { id: Date.now().toString(), text: chatInput, sender: 'user' as const };
    setMessages(prev => [...prev, userMsg]);
    setChatInput('');

    // Simulated provider automated reply in Roman Urdu
    setTimeout(() => {
      let replyText = "Theek hai sir, mein bas nikal raha hun.";
      if (chatInput.toLowerCase().includes('location') || chatInput.toLowerCase().includes('kahan')) {
        replyText = "Mein safeer chowrangi ke paas pohnch gaya hun. 10 minute lagengy.";
      } else if (chatInput.toLowerCase().includes('shukriya') || chatInput.toLowerCase().includes('thanks')) {
        replyText = "Shukriya boht boht!";
      }
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), text: replyText, sender: 'provider' }]);
    }, 1500);
  };

  const handleDisputeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBooking) return;
    
    setDisputeLoading(true);
    try {
      await createDispute(currentBooking.id, disputeType, disputeEvidence);
      setDisputeOpen(false);
      setDisputeEvidence('');
    } catch (err) {
      console.error(err);
    } finally {
      setDisputeLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!currentBooking) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-slate-400" />
        <h3 className="text-lg font-bold">No active booking</h3>
        <p className="text-sm text-slate-500 max-w-xs">
          Your active booking information will appear here once you choose a provider from the results list.
        </p>
        <button 
          onClick={() => setActiveTab('marketplace')}
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-indigo-700 transition"
        >
          Go to Marketplace
        </button>
      </div>
    );
  }

  const provider = currentBooking.provider;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Booking Details Card (Left column) */}
      <div className="lg:col-span-6 space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 shadow-md">
            <CheckCircle className="h-10 w-10 fill-emerald-500/10" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold tracking-tight">Booking Confirmed!</h2>
            <p className="text-xs text-slate-400 font-semibold">Booking ID: {currentBooking.id}</p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
          <h3 className="text-lg font-extrabold tracking-tight">Service Particulars</h3>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Scheduled Date</span>
                <p className="font-extrabold text-sm text-slate-800 dark:text-slate-200 mt-0.5">May 20, 2026</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Estimated Arrival</span>
                <p className="font-extrabold text-sm text-slate-800 dark:text-slate-200 mt-0.5">11:00 AM - 12:30 PM</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Address geofence</span>
                <p className="font-extrabold text-sm text-slate-800 dark:text-slate-200 mt-0.5">{provider.location.neighborhood}, Karachi</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Your Provider</h4>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h5 className="font-extrabold text-sm text-slate-800 dark:text-white">{provider.full_name}</h5>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">{provider.service_type}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-6 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Calculated Rate</span>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">(Includes complexity adjustment)</p>
            </div>
            <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">Rs. {provider.base_rate}</p>
          </div>

          {/* Dispute trigger button */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
            <button 
              onClick={() => setDisputeOpen(true)}
              className="cursor-pointer flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50/50 hover:bg-red-50 text-red-600 dark:border-red-950/20 dark:bg-red-950/10 dark:hover:bg-red-950/20 px-5 py-3 text-xs font-bold w-full transition"
            >
              <ShieldAlert className="h-4 w-4" />
              File a Dispute with AI Agent
            </button>
          </div>
        </div>
      </div>

      {/* Live Provider Chat (Right column) */}
      <div className="lg:col-span-6 flex flex-col h-[600px] border border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        {/* Header */}
        <div className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 px-6 py-4 flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span className="font-extrabold text-sm">Provider Chat</span>
          </div>
        </div>

        {/* Message bubble list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map(m => (
            <div key={m.id} className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.sender === 'provider' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase">
                  {provider.full_name.slice(0, 2)}
                </div>
              )}
              <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-800 dark:bg-slate-950/40 dark:text-slate-200 border border-slate-200/40 dark:border-slate-800/40'
              }`}>
                <p>{m.text}</p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Chat input box */}
        <form onSubmit={handleSendChat} className="border-t border-slate-100 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-950/20 flex gap-3">
          <input
            type="text"
            required
            placeholder="Send message to provider..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold outline-none transition focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!chatInput.trim()}
            className="cursor-pointer flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 transition"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>

      {/* Dispute Resolution Modal */}
      <AnimatePresence>
        {disputeOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDisputeOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
            >
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="h-6 w-6 text-red-500" />
                Submit Dispute Claim
              </h3>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Disputes are processed autonomously by the Dispute Agent checking telemetry, logs, and evidence.
              </p>

              <form onSubmit={handleDisputeSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Dispute Reason
                  </label>
                  <select
                    value={disputeType}
                    onChange={(e) => setDisputeType(e.target.value)}
                    className="w-full mt-1.5 rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm font-semibold text-slate-950 outline-none transition focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  >
                    <option value="rate_mismatch">Rate mismatch / Overcharging</option>
                    <option value="no_show">Provider No-show</option>
                    <option value="late_arrival">Extreme Late Arrival</option>
                    <option value="poor_quality">Substandard service delivery</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Evidence description
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe what went wrong in detail (e.g. Plumber yasir arrived 35 minutes late and demanded Rs. 2000 instead of Rs. 1500 agreed rate)."
                    value={disputeEvidence}
                    onChange={(e) => setDisputeEvidence(e.target.value)}
                    className="w-full mt-1.5 resize-none rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div className="mt-6 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setDisputeOpen(false)}
                    className="cursor-pointer flex-1 rounded-xl border border-slate-200 py-3 text-center text-xs font-bold text-slate-700 dark:border-slate-800 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={disputeLoading || !disputeEvidence.trim()}
                    className="cursor-pointer flex-1 rounded-xl bg-red-600 py-3 text-center text-xs font-bold text-white shadow-md shadow-red-600/10 hover:bg-red-700"
                  >
                    {disputeLoading ? 'Resolving...' : 'Submit to AI'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

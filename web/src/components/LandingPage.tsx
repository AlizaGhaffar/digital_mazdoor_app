'use client';

import React, { useState } from 'react';
import { useGlobalState } from '@/context/GlobalContext';
import { AuthModal } from './AuthModal';
import { ArrowRight, Bot, Cpu, Heart, CheckCircle2, ShieldCheck, Star, Users, ArrowUpRight, Zap, RefreshCw, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export const LandingPage: React.FC = () => {
  const { setViewMode, theme, toggleTheme } = useGlobalState();
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } },
  } as const;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
      {/* Navigation */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-slate-50/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-600/30">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-300">
              Digital Mazdoor
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Features</a>
            <a href="#how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">How It Works</a>
            <a href="#testimonials" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Testimonials</a>
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="rounded-full p-2.5 text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800 transition"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <svg className="h-5 w-5 fill-amber-400" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 14.05a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zm-.707-8.485a1 1 0 011.414-1.414l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM3 11a1 1 0 100-2H2a1 1 0 100 2h1z"/></svg>
              ) : (
                <svg className="h-5 w-5 fill-slate-700" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>
              )}
            </button>
            <button 
              onClick={() => openAuth('login')}
              className="cursor-pointer text-sm font-bold text-slate-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
            >
              Log In
            </button>
            <button 
              onClick={() => openAuth('signup')}
              className="cursor-pointer rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 active:scale-[0.98] transition"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-28 md:pt-28 md:pb-36">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent dark:from-indigo-600/15" />
        
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:items-center"
          >
            <div className="lg:col-span-7 space-y-8">
              <motion.div 
                variants={itemVariants}
                className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/50 px-4 py-1.5 dark:border-indigo-800/60 dark:bg-indigo-950/30"
              >
                <Cpu className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-semibold text-indigo-800 dark:text-indigo-300">
                  World's First Agentic AI Service Marketplace
                </span>
              </motion.div>

              <motion.h1 
                variants={itemVariants}
                className="text-4xl font-extrabold tracking-tight sm:text-6xl text-slate-900 dark:text-white leading-[1.1]"
              >
                Formalizing the{' '}
                <span className="bg-gradient-to-r from-indigo-600 via-violet-500 to-pink-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-pink-400">
                  Informal Economy
                </span>{' '}
                with Autonomous AI
              </motion.h1>

              <motion.p 
                variants={itemVariants}
                className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed"
              >
                Describe what you need in natural language (Urdu, English, or Roman Urdu). 
                An orchestrator of 11 specialized AI agents matches, ranks, books, and schedules 
                the most reliable professionals in Karachi with 100% transparent reasoning.
              </motion.p>

              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4"
              >
                <button 
                  onClick={() => openAuth('signup')}
                  className="cursor-pointer flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-indigo-600/30 hover:bg-indigo-700 active:scale-[0.98] transition"
                >
                  Find a Mazdoor Now
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => {
                    // Bypass login for quick demo
                    setViewMode('app');
                  }}
                  className="cursor-pointer flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-8 py-4 text-base font-bold text-slate-700 shadow-md hover:bg-slate-50 active:scale-[0.98] transition dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800/80"
                >
                  Live Demo (Guest Mode)
                  <ArrowUpRight className="h-5 w-5 text-slate-400" />
                </button>
              </motion.div>

              {/* Statistics */}
              <motion.div 
                variants={itemVariants}
                className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200 dark:border-slate-800"
              >
                <div>
                  <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">11</p>
                  <p className="mt-1 text-xs font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400">Specialized AI Agents</p>
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">98%</p>
                  <p className="mt-1 text-xs font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400">SLA Matches Confirmed</p>
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">&lt; 15s</p>
                  <p className="mt-1 text-xs font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400">Average Dispatch Time</p>
                </div>
              </motion.div>
            </div>

            {/* Hero Right Column: Mockup Image */}
            <div className="lg:col-span-5 relative flex justify-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, type: 'spring', damping: 20 }}
                className="relative w-full max-w-sm rounded-[40px] border-[10px] border-slate-900 bg-slate-900 shadow-2xl overflow-hidden aspect-[9/19]"
              >
                <img 
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800" 
                  alt="Pakistani Construction / Electrician Worker Portrait" 
                  className="w-full h-full object-cover opacity-90"
                />
                
                {/* Floating glass notification */}
                <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/20 bg-slate-950/70 p-4 text-white backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400">Best Match Found</p>
                      <p className="text-sm font-extrabold">Muhammad Ali (Electrician)</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs border-t border-white/10 pt-2">
                    <span className="text-emerald-400 font-bold">98% Reliability Score</span>
                    <span className="text-slate-300 font-semibold">1.2 km away</span>
                  </div>
                </div>
              </motion.div>
              
              {/* Blurred background glows */}
              <div className="absolute top-1/2 -left-12 -z-10 h-72 w-72 -translate-y-1/2 rounded-full bg-violet-600/30 blur-[80px]" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 border-t border-slate-200 dark:border-slate-900 bg-slate-100/50 dark:bg-slate-950/40">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-slate-900 dark:text-white">
              Why Choose Digital Mazdoor?
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              We leverage an autonomous network of AI agents to solve discovery, pricing, reliability, and language barriers.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-bold">Natural Urdu Orchestration</h3>
              <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Type or speak in Roman Urdu, Urdu script, or English. The AI parses complex linguistic intents seamlessly, accommodating regional terms and contexts.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                <Cpu className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-bold">11-Agent Pipeline</h3>
              <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                From parsing intent, contextualizing, matching geolocations, multi-factor ranking, scheduling availability, and calculating pricing, to booking.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                <RefreshCw className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-bold">Explainable Reasoning Traces</h3>
              <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                No black-box decisions. View the step-by-step logic, score calculations, and travel buffer adjustments logged by each agent.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-bold">Dynamic Dispute Settlement</h3>
              <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                If anything goes wrong, a specialized Dispute Agent collects GPS checks, chat history, and evidence, making autonomous, fair refund allocations.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-bold">Verified Professionals</h3>
              <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                All providers are vetted with location tags, reputation scores, and ratings that continuously update based on verified completions.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-bold">Automated Pivot Fallbacks</h3>
              <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                If a matched provider becomes busy or rejects the slot, the scheduling agent automatically pivots to the next best ranking candidate in real time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-slate-900 dark:text-white">
              How The Platform Works
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              From a single text box to booking confirmation, managed in seconds.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-4">
            {/* Step 1 */}
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">1</div>
              <h3 className="mt-6 text-lg font-bold">Submit Prompt</h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Type your need (e.g. "DHA main kitchen sink leak ho rahi hai urgent Plumber bheinjo") and share location coordinates.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">2</div>
              <h3 className="mt-6 text-lg font-bold">AI Orchestration</h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                The Intent, Context, Matching, Ranking, Scheduling, and Pricing Agents analyze parameters in a unified context.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">3</div>
              <h3 className="mt-6 text-lg font-bold">Compare & Select</h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Inspect AI scores, ratings, proximity, and transparent pricing cards. Select the professional you prefer.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">4</div>
              <h3 className="mt-6 text-lg font-bold">Book & Confirm</h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Confirm your booking instantly. The Notification Agent simulates SMS alerts and dispatches the provider.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 border-t border-slate-200 dark:border-slate-900 bg-slate-100/50 dark:bg-slate-950/40">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-slate-900 dark:text-white">
              Trusted by Thousands in Karachi
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              Hear from our home-makers and local service providers.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Testimonial 1 */}
            <div className="rounded-3xl bg-white p-8 shadow-sm dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex gap-1 text-amber-500">
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
              </div>
              <p className="mt-6 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                "Finding an AC technician in Gulshan during May was always a nightmare. Either they overcharge or cancel. Digital Mazdoor got Yasir at my place in 20 minutes, with the pricing verified by the AI pricing agent!"
              </p>
              <div className="mt-6 flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold">K</div>
                <div>
                  <h4 className="text-sm font-bold">Kamran Shah</h4>
                  <p className="text-xs text-slate-500">Gulshan-e-Iqbal, Karachi</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="rounded-3xl bg-white p-8 shadow-sm dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex gap-1 text-amber-500">
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
              </div>
              <p className="mt-6 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                "I was skeptical about AI understanding Roman Urdu. But when I typed 'cook chahiye budget kam hai Clifton', it perfectly mapped it to tutoring/other options and explained what categories are supported. Truly amazing!"
              </p>
              <div className="mt-6 flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold">Z</div>
                <div>
                  <h4 className="text-sm font-bold">Zoya Khan</h4>
                  <p className="text-xs text-slate-500">Clifton, Karachi</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="rounded-3xl bg-white p-8 shadow-sm dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex gap-1 text-amber-500">
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
              </div>
              <p className="mt-6 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                "As an electrician, I used to rely on shopkeepers who cut 30% commission. On Digital Mazdoor, the AI rates jobs fairly based on complexity, and dispatches me automatically. My ratings are transparent."
              </p>
              <div className="mt-6 flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold">M</div>
                <div>
                  <h4 className="text-sm font-bold">Muhammad Ali</h4>
                  <p className="text-xs text-slate-500">Verified Electrician</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-indigo-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-800 via-transparent to-transparent" />
        <div className="mx-auto max-w-5xl px-6 text-center relative z-10 space-y-8">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
            Ready to experience explainable AI matchmaking?
          </h2>
          <p className="text-lg text-indigo-100 max-w-2xl mx-auto">
            Book AC repairs, plumbers, electricians, painters, and tutors in Karachi without any friction. 
            View the reasoning of every decision automatically.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => openAuth('signup')}
              className="cursor-pointer rounded-2xl bg-white px-8 py-4 text-base font-bold text-indigo-600 shadow-xl hover:bg-slate-50 active:scale-[0.98] transition"
            >
              Get Started for Free
            </button>
            <button 
              onClick={() => setViewMode('app')}
              className="cursor-pointer rounded-2xl border border-indigo-400 bg-indigo-700/30 px-8 py-4 text-base font-bold text-white hover:bg-indigo-700/50 active:scale-[0.98] transition"
            >
              Explore Demo Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-900 py-12 bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400 text-sm">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <span className="font-extrabold text-slate-800 dark:text-slate-200">Digital Mazdoor</span>
          </div>
          <p className="text-center md:text-left">
            &copy; 2026 Digital Mazdoor. All rights reserved. Formalizing informal labour through autonomous AI.
          </p>
          <div className="flex items-center gap-2 text-xs">
            Made with <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" /> in Pakistan
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authOpen} 
        onClose={() => setAuthOpen(false)} 
        initialMode={authMode} 
      />
    </div>
  );
};

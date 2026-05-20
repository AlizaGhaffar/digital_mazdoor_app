'use client';

import React, { useState } from 'react';
import { useGlobalState } from '@/context/GlobalContext';
import { X, Lock, Phone, Mail, User as UserIcon, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { login, signup } = useGlobalState();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'seeker' | 'provider'>('seeker');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!phone || phone.length < 10) {
      setErrorMsg('Please enter a valid Pakistani phone number (e.g. 03001234567)');
      return;
    }

    if (mode === 'signup' && !name) {
      setErrorMsg('Please enter your full name');
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'login') {
        await login(phone, email);
      } else {
        await signup(name, phone, email, role);
      }
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Heading */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {mode === 'login' ? 'Welcome Back' : 'Join Digital Mazdoor'}
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {mode === 'login' 
              ? 'Login to connect with verified service providers.' 
              : 'Create an account to hire or offer services.'}
          </p>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="mt-4 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600 dark:bg-red-950/30 dark:text-red-400">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Full Name
              </label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <UserIcon className="h-5 w-5" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="Muhammad Ali"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-10 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Phone Number
            </label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Phone className="h-5 w-5" />
              </span>
              <input
                type="tel"
                required
                placeholder="03001234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-10 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Email Address (Optional)
            </label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Mail className="h-5 w-5" />
              </span>
              <input
                type="email"
                placeholder="ali@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-10 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Password
            </label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Lock className="h-5 w-5" />
              </span>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-10 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-500"
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Register As
              </label>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('seeker')}
                  className={`flex flex-col items-center justify-center rounded-xl border p-4 text-center transition ${
                    role === 'seeker'
                      ? 'border-indigo-500 bg-indigo-50/50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400'
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-950'
                  }`}
                >
                  <UserIcon className="h-6 w-6" />
                  <span className="mt-2 text-sm font-bold">Service Seeker</span>
                  <span className="mt-1 text-[10px] text-slate-400">I want to hire help</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('provider')}
                  className={`flex flex-col items-center justify-center rounded-xl border p-4 text-center transition ${
                    role === 'provider'
                      ? 'border-indigo-500 bg-indigo-50/50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400'
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-950'
                  }`}
                >
                  <Shield className="h-6 w-6" />
                  <span className="mt-2 text-sm font-bold">Mazdoor / Provider</span>
                  <span className="mt-1 text-[10px] text-slate-400">I want to offer services</span>
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 w-full cursor-pointer rounded-xl bg-indigo-600 py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : mode === 'login' ? 'Login' : 'Create Account'}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-6 text-center text-sm">
          <span className="text-slate-500 dark:text-slate-400">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          </span>
          <button
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="font-bold text-indigo-600 hover:underline dark:text-indigo-400"
          >
            {mode === 'login' ? 'Sign Up' : 'Login'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

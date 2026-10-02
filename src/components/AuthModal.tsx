import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Lock, Mail, User as UserIcon, Shield, ArrowRight } from 'lucide-react';
import { BarakaBizzLogo } from './BarakaBizzLogo';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authMode,
    setAuthMode,
    login,
    signup
  } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide a valid email address.');
      return;
    }

    if (authMode === 'signin') {
      const isAdmin = email.toLowerCase().includes('admin');
      login(email, isAdmin ? 'admin' : 'customer');
    } else {
      if (!name) {
        setError('Please enter your full name.');
        return;
      }
      signup(name, email);
    }
  };

  const handleDemoCustomer = () => {
    login('mr7.shahzad@gmail.com', 'customer');
  };

  const handleDemoAdmin = () => {
    login('admin@barakabizz.com', 'admin');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-[#E8E4DC] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-[#E8E4DC] flex items-center justify-between bg-[#FAF8F5]">
          <div>
            <BarakaBizzLogo className="h-8 w-auto mb-2" />
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#B85D36] font-semibold block">
              ATELIER CLIENT PRIVILEGES
            </span>
            <h3 className="font-brand text-lg font-bold text-[#141413]">
              {authMode === 'signin' ? 'Sign In to Your Account' : 'Create an Atelier Account'}
            </h3>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 text-[#756E65] hover:text-[#141413] rounded-full hover:bg-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-[#E8E4DC] text-xs font-semibold uppercase tracking-wider">
          <button
            onClick={() => {
              setAuthMode('signin');
              setError('');
            }}
            className={`flex-1 py-3 text-center transition-colors ${
              authMode === 'signin'
                ? 'border-b-2 border-[#B85D36] text-[#141413] bg-white'
                : 'text-[#756E65] bg-[#FAF8F5] hover:text-[#141413]'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setAuthMode('signup');
              setError('');
            }}
            className={`flex-1 py-3 text-center transition-colors ${
              authMode === 'signup'
                ? 'border-b-2 border-[#B85D36] text-[#141413] bg-white'
                : 'text-[#756E65] bg-[#FAF8F5] hover:text-[#141413]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
              {error}
            </div>
          )}

          {authMode === 'signup' && (
            <div>
              <label className="text-xs font-semibold text-[#544F49] uppercase tracking-wider block mb-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-[#8C867D] absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Shahzad Ali"
                  className="w-full text-xs pl-9 pr-3 py-2 bg-[#FAF8F5] border border-[#DDD8CE] rounded focus:outline-none focus:border-[#B85D36]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-[#544F49] uppercase tracking-wider block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8C867D] absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mr7.shahzad@gmail.com"
                className="w-full text-xs pl-9 pr-3 py-2 bg-[#FAF8F5] border border-[#DDD8CE] rounded focus:outline-none focus:border-[#B85D36]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#544F49] uppercase tracking-wider block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8C867D] absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full text-xs pl-9 pr-3 py-2 bg-[#FAF8F5] border border-[#DDD8CE] rounded focus:outline-none focus:border-[#B85D36]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#B85D36] hover:bg-[#A34E2A] text-white text-xs font-semibold uppercase tracking-widest rounded-md shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <span>{authMode === 'signin' ? 'Sign In to Account' : 'Register Member'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Quick Demo Login Shortcuts for immediate testing */}
          <div className="pt-4 border-t border-[#E8E4DC] space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-[#8C867D] font-semibold block text-center">
              1-Click Demo Profiles (For Instant Evaluation)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleDemoCustomer}
                className="py-2 px-3 bg-[#EFECE4] hover:bg-[#E5E0D5] text-[#141413] text-[11px] font-semibold rounded flex items-center justify-center gap-1.5 transition-colors"
              >
                <UserIcon className="w-3.5 h-3.5 text-[#B85D36]" />
                <span>Demo Customer</span>
              </button>
              <button
                type="button"
                onClick={handleDemoAdmin}
                className="py-2 px-3 bg-[#191918] hover:bg-black text-white text-[11px] font-semibold rounded flex items-center justify-center gap-1.5 transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Demo Admin</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

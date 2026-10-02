import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Smartphone, User as UserIcon, ArrowRight, ShieldCheck, RefreshCw, CheckCircle2, ArrowLeft } from 'lucide-react';
import { BarakaBizzLogo } from './BarakaBizzLogo';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authMode,
    setAuthMode,
    sendOtp,
    verifyOtpAndLogin
  } = useStore();

  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [error, setError] = useState('');
  const [simulatedCode, setSimulatedCode] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);

  // Timer countdown for OTP resend
  useEffect(() => {
    let interval: any = null;
    if (step === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  if (!isAuthModalOpen) return null;

  const handlePhoneChange = (val: string) => {
    // Only accept numeric characters up to 10 digits
    const cleaned = val.replace(/\D/g, '').slice(0, 10);
    setPhone(cleaned);
    setError('');
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setError('Kripya apna 10-digit mobile number enter karein.');
      return;
    }

    if (authMode === 'signup' && !name.trim()) {
      setError('Kripya apna poora naam (Full Name) enter karein.');
      return;
    }

    const code = sendOtp(phone);
    setSimulatedCode(code);
    setOtp('');
    setStep('otp');
    setResendTimer(30);
    setError('');
  };

  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    const code = sendOtp(phone);
    setSimulatedCode(code);
    setResendTimer(30);
    setError('');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      setError('Kripya 6-digit OTP code enter karein.');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      const success = verifyOtpAndLogin(phone, otp, name, authMode === 'signup');
      setIsVerifying(false);
      if (!success) {
        setError('Galt OTP code hai. Kripya check karke dobara enter karein.');
      } else {
        // Reset states
        setStep('phone');
        setOtp('');
        setPhone('');
        setName('');
        setError('');
      }
    }, 400);
  };

  const handleClose = () => {
    setIsAuthModalOpen(false);
    setStep('phone');
    setError('');
    setOtp('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
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
              {step === 'otp'
                ? 'Mobile Number OTP Verification'
                : authMode === 'signin'
                ? 'Sign In with Mobile OTP'
                : 'Create Account with Mobile Number'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-[#756E65] hover:text-[#141413] rounded-full hover:bg-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch (Only visible in Phone step) */}
        {step === 'phone' && (
          <div className="flex border-b border-[#E8E4DC] text-xs font-semibold uppercase tracking-wider">
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
              Sign Up (Register)
            </button>
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
          </div>
        )}

        {/* Body */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2 animate-in fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: PHONE & NAME ENTRY */}
          {step === 'phone' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              {authMode === 'signup' && (
                <div>
                  <label className="text-xs font-semibold text-[#544F49] uppercase tracking-wider block mb-1">
                    Full Name (Aapka Naam)
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-[#8C867D] absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sartaj Ali"
                      className="w-full text-xs pl-9 pr-3 py-2.5 bg-[#FAF8F5] border border-[#DDD8CE] rounded-lg focus:outline-none focus:border-[#B85D36]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-[#544F49] uppercase tracking-wider block mb-1">
                  Mobile Number (10 Digits)
                </label>
                <div className="flex">
                  <div className="px-3 py-2.5 bg-[#EFECE4] border border-r-0 border-[#DDD8CE] rounded-l-lg text-xs font-semibold text-[#141413] flex items-center gap-1.5 select-none">
                    <span>🇮🇳</span>
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="9870168023"
                    className="flex-1 text-xs px-3 py-2.5 bg-[#FAF8F5] border border-[#DDD8CE] rounded-r-lg focus:outline-none focus:border-[#B85D36] font-mono tracking-wider"
                  />
                </div>
                <span className="text-[11px] text-[#756E65] mt-1 block">
                  Aapke is number par 6-digit ka verification OTP bheja jayega.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#B85D36] hover:bg-[#A34E2A] text-white text-xs font-semibold uppercase tracking-widest rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <Smartphone className="w-4 h-4" />
                <span>Get OTP / Verification Code</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <span className="text-[11px] text-[#8C867D]">
                  By signing in, you agree to BARAKA Bizz. Terms of Service & Privacy Policy.
                </span>
              </div>
            </form>
          )}

          {/* STEP 2: OTP VERIFICATION */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="flex items-center justify-between text-xs pb-1">
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="flex items-center gap-1 text-[#B85D36] hover:underline font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change Number</span>
                </button>
                <span className="font-mono text-[#141413] font-semibold bg-[#EFECE4] px-2 py-0.5 rounded">
                  +91 {phone}
                </span>
              </div>

              {/* Simulated SMS Notification Banner */}
              {simulatedCode && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs space-y-1.5 animate-in fade-in">
                  <div className="flex items-center justify-between text-amber-900 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-[#B85D36]" />
                      <span>SMS Alert (Simulation)</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setOtp(simulatedCode)}
                      className="text-[11px] bg-[#B85D36] hover:bg-[#A34E2A] text-white px-2 py-0.5 rounded font-semibold transition-colors"
                    >
                      Auto-Fill OTP
                    </button>
                  </div>
                  <p className="text-[#59544E] text-[11px]">
                    Your BARAKA Bizz OTP is: <strong className="font-mono text-[#141413] text-sm tracking-widest">{simulatedCode}</strong>.
                  </p>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-[#544F49] uppercase tracking-wider block mb-1">
                  Enter 6-Digit OTP
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={otp}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setOtp(cleaned);
                    setError('');
                  }}
                  placeholder="• • • • • •"
                  className="w-full text-center text-xl font-mono tracking-[0.4em] py-3 bg-[#FAF8F5] border border-[#DDD8CE] rounded-lg focus:outline-none focus:border-[#B85D36]"
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-[#756E65]">
                  {resendTimer > 0 ? (
                    <span>Resend OTP in <strong>{resendTimer}s</strong></span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-[#B85D36] hover:underline font-semibold flex items-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Resend OTP</span>
                    </button>
                  )}
                </span>
                <span className="text-[11px] text-[#756E65]">Code valid for 5 mins</span>
              </div>

              <button
                type="submit"
                disabled={isVerifying || otp.length !== 6}
                className="w-full py-3.5 bg-[#B85D36] hover:bg-[#A34E2A] disabled:bg-[#DDD8CE] disabled:text-[#8C867D] text-white text-xs font-semibold uppercase tracking-widest rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {isVerifying
                    ? 'Verifying OTP...'
                    : authMode === 'signup'
                    ? 'Verify OTP & Create Account'
                    : 'Verify OTP & Sign In'}
                </span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

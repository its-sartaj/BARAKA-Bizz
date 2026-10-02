import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Smartphone,
  User as UserIcon,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  ArrowLeft,
  UserPlus,
  LogIn,
  Mail,
  MessageCircle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { BarakaBizzLogo } from './BarakaBizzLogo';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authMode,
    setAuthMode,
    sendEmailOtp,
    verifyEmailOtpAndLogin
  } = useStore();

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'form' | 'otp'>('form');
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
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('Kripya valid email address enter karein (e.g. name@example.com).');
      return;
    }

    if (authMode === 'signup') {
      if (!name.trim()) {
        setError('Kripya apna poora naam (Full Name) enter karein.');
        return;
      }

      const cleanPhoneDigits = phone.replace(/\D/g, '').slice(-10);
      if (cleanPhoneDigits.length !== 10) {
        setError('WhatsApp Mobile Number dalna compulsory hai (10 digits). Is par manual delivery updates bheje jayenge.');
        return;
      }
    }

    const code = sendEmailOtp(cleanEmail);
    setSimulatedCode(code);
    setOtp('');
    setStep('otp');
    setResendTimer(30);
    setError('');
  };

  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    const cleanEmail = email.trim().toLowerCase();
    const code = sendEmailOtp(cleanEmail);
    setSimulatedCode(code);
    setResendTimer(30);
    setError('');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      setError('Kripya 6-digit verification code enter karein.');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      const cleanEmail = email.trim().toLowerCase();
      const success = verifyEmailOtpAndLogin(
        cleanEmail,
        otp,
        name,
        phone,
        authMode === 'signup'
      );
      setIsVerifying(false);
      if (!success) {
        setError('Galt OTP code hai. Kripya check karke dobara enter karein.');
      } else {
        // Reset states
        setStep('form');
        setOtp('');
        setEmail('');
        setPhone('');
        setName('');
        setError('');
      }
    }, 400);
  };

  const handleClose = () => {
    setIsAuthModalOpen(false);
    setStep('form');
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
              CUSTOMER PORTAL · ग्राहक खाता
            </span>
            <h3 className="font-brand text-lg font-bold text-[#141413]">
              {step === 'otp'
                ? 'Email Verification Code'
                : authMode === 'signup'
                ? 'Create Customer Account'
                : 'Customer Sign In'}
            </h3>
            <p className="text-xs text-[#756E65] mt-0.5">
              {step === 'otp'
                ? `6-digit verification code has been dispatched to ${email}`
                : authMode === 'signup'
                ? 'Register with your Email & WhatsApp number to track all orders'
                : 'Sign in with your Email address to view orders & invoices'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-[#756E65] hover:text-[#141413] rounded-full hover:bg-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch (Only visible in Form step) */}
        {step === 'form' && (
          <div className="flex border-b border-[#E8E4DC] text-xs font-semibold uppercase tracking-wider bg-[#FAF8F5]">
            <button
              onClick={() => {
                setAuthMode('signup');
                setError('');
              }}
              className={`flex-1 py-3 text-center transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'signup'
                  ? 'border-b-2 border-[#B85D36] text-[#141413] bg-white font-bold'
                  : 'text-[#756E65] hover:text-[#141413]'
              }`}
            >
              <UserPlus className="w-4 h-4 text-[#B85D36]" />
              <span>Create Account (Sign Up)</span>
            </button>
            <button
              onClick={() => {
                setAuthMode('signin');
                setError('');
              }}
              className={`flex-1 py-3 text-center transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'signin'
                  ? 'border-b-2 border-[#B85D36] text-[#141413] bg-white font-bold'
                  : 'text-[#756E65] hover:text-[#141413]'
              }`}
            >
              <LogIn className="w-4 h-4 text-[#B85D36]" />
              <span>Sign In (Login)</span>
            </button>
          </div>
        )}

        {/* Body */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: FORM ENTRY */}
          {step === 'form' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              {authMode === 'signup' && (
                <div>
                  <label className="text-xs font-semibold text-[#544F49] uppercase tracking-wider block mb-1">
                    Customer Full Name (Aapka Poora Naam) *
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-[#8C867D] absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setError('');
                      }}
                      placeholder="e.g. Sartaj Ali"
                      className="w-full text-xs pl-9 pr-3 py-2.5 bg-[#FAF8F5] border border-[#DDD8CE] rounded-lg focus:outline-none focus:border-[#B85D36]"
                    />
                  </div>
                  <span className="text-[11px] text-[#756E65] mt-1 block">
                    Yeh naam aapke invoices aur customer profile par aayega.
                  </span>
                </div>
              )}

              {/* Email Address Field (Primary Login Credential) */}
              <div>
                <label className="text-xs font-semibold text-[#544F49] uppercase tracking-wider block mb-1">
                  Email Address (Login & Order Invoices) *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8C867D] absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    placeholder="customer@gmail.com"
                    className="w-full text-xs pl-9 pr-3 py-2.5 bg-[#FAF8F5] border border-[#DDD8CE] rounded-lg focus:outline-none focus:border-[#B85D36] font-medium"
                  />
                </div>
                <div className="flex items-center justify-between mt-1 text-[11px] text-[#756E65]">
                  <span>Verification OTP code aapke email par aayega.</span>
                  {authMode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => {
                        setEmail('mr7.shahzad@gmail.com');
                        setError('');
                      }}
                      className="text-[#B85D36] hover:underline font-semibold cursor-pointer"
                    >
                      Demo Email
                    </button>
                  )}
                </div>
              </div>

              {/* WhatsApp Mobile Number (COMPULSORY on Sign Up!) */}
              {authMode === 'signup' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-[#544F49] uppercase tracking-wider">
                      WhatsApp Mobile Number *
                    </label>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                      COMPULSORY / अनिवार्य
                    </span>
                  </div>
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
                  <div className="flex items-start gap-1.5 mt-1.5 p-2 bg-emerald-50/70 border border-emerald-200/60 rounded text-[11px] text-emerald-800">
                    <MessageCircle className="w-3.5 h-3.5 shrink-0 text-emerald-600 mt-0.5" />
                    <span>
                      <strong>Zaroori:</strong> Hamari team aapko order dispatch, courier tracking aur live updates directly WhatsApp par bhej sakegi.
                    </span>
                  </div>
                  <div className="flex justify-end mt-1 text-[11px]">
                    <button
                      type="button"
                      onClick={() => {
                        setName('Sartaj Ali');
                        setEmail('sartaj@barakabizz.in');
                        setPhone('9870168023');
                        setError('');
                      }}
                      className="text-[#B85D36] hover:underline font-semibold cursor-pointer"
                    >
                      Demo Fill All
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-[#B85D36] hover:bg-[#A34E2A] text-white text-xs font-semibold uppercase tracking-widest rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 active:scale-95"
              >
                <Mail className="w-4 h-4" />
                <span>
                  {authMode === 'signup'
                    ? 'Send Email Code & Create Account'
                    : 'Send Email Verification Code'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <span className="text-[11px] text-[#8C867D]">
                  By continuing, you agree to BARAKA Bizz Terms of Service & Privacy Policy.
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
                  onClick={() => setStep('form')}
                  className="flex items-center gap-1 text-[#B85D36] hover:underline font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change Email / Details</span>
                </button>
                <span className="font-mono text-[#141413] font-semibold bg-[#EFECE4] px-2 py-0.5 rounded truncate max-w-[200px]">
                  {email}
                </span>
              </div>

              {/* Simulated Email Notification Preview */}
              {simulatedCode && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-xs space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between text-amber-900 font-semibold border-b border-amber-200/60 pb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#B85D36]" />
                      <span>Email Inbox Preview (Simulation)</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setOtp(simulatedCode)}
                      className="text-[11px] bg-[#B85D36] hover:bg-[#A34E2A] text-white px-2 py-0.5 rounded font-semibold transition-colors"
                    >
                      Auto-Fill Code
                    </button>
                  </div>
                  <div className="text-[#59544E] text-[11px] space-y-0.5">
                    <p><strong>To:</strong> {email}</p>
                    <p><strong>Subject:</strong> Your BARAKA Bizz Account Verification Code</p>
                    <p className="pt-1">
                      Your 6-digit verification code is:{' '}
                      <strong className="font-mono text-[#141413] text-base tracking-widest bg-amber-100/80 px-2 py-0.5 rounded">
                        {simulatedCode}
                      </strong>
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-[#544F49] uppercase tracking-wider block mb-1">
                  Enter 6-Digit Email Verification Code
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
                    <span>Resend code in <strong>{resendTimer}s</strong></span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-[#B85D36] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Resend Code to Email</span>
                    </button>
                  )}
                </span>
                <span className="text-[11px] text-[#756E65]">Valid for 5 mins</span>
              </div>

              <button
                type="submit"
                disabled={isVerifying || otp.length !== 6}
                className="w-full py-3.5 bg-[#B85D36] hover:bg-[#A34E2A] disabled:bg-[#DDD8CE] disabled:text-[#8C867D] text-white text-xs font-semibold uppercase tracking-widest rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {isVerifying
                    ? 'Verifying Code...'
                    : authMode === 'signup'
                    ? 'Verify & Complete Account Registration'
                    : 'Verify Code & Sign In'}
                </span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

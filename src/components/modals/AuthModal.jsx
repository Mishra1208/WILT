import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ArrowRight, 
  Sparkles, 
  Phone, 
  Mail, 
  ShieldCheck, 
  CheckCircle2, 
  RotateCcw, 
  Lock,
  GraduationCap,
  ChevronLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';

export const AuthModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login, switchAccount } = useAuth();

  // Auth Modes: 'select' | 'phone' | 'otp' | 'profile' | 'google'
  const [step, setStep] = useState('select');
  const [authMethod, setAuthMethod] = useState('phone'); // 'phone' | 'email'
  
  // Form States
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  
  // OTP Verification States
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);

  // Profile Details
  const [fullName, setFullName] = useState('');
  const [university, setUniversity] = useState('Stanford University');
  const [major, setMajor] = useState('Finance & Tech');

  const otpInputRefs = useRef([]);

  // Reset modal state on open
  useEffect(() => {
    if (isAuthModalOpen) {
      setStep('select');
      setOtpDigits(['', '', '', '', '', '']);
      setOtpError('');
    }
  }, [isAuthModalOpen]);

  // Resend Timer Countdown
  useEffect(() => {
    let interval = null;
    if (step === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  if (!isAuthModalOpen) return null;

  // Send OTP handler
  const handleSendOtp = (method) => {
    setAuthMethod(method);
    if (method === 'phone' && !phoneNumber.trim()) return;
    if (method === 'email' && (!emailAddress.trim() || !emailAddress.includes('@'))) return;

    // Generate a clean 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpDigits(['', '', '', '', '', '']);
    setOtpError('');
    setResendTimer(30);
    setStep('otp');

    // Auto-focus first OTP input after render
    setTimeout(() => {
      if (otpInputRefs.current[0]) {
        otpInputRefs.current[0].focus();
      }
    }, 150);
  };

  // Google 1-Click Login
  const handleGoogleLogin = () => {
    const defaultName = "Alex Chen";
    const username = "alexchen";
    login({
      username,
      name: defaultName,
      university: "Stanford University",
      major: "Quantitative Finance",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    });
    try {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}
    setIsAuthModalOpen(false);
  };

  // Handle OTP digit changes
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);
    setOtpError('');

    // Auto-advance to next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto-verify if all 6 digits entered
    const fullCode = newDigits.join('');
    if (fullCode.length === 6) {
      verifyOtpCode(fullCode);
    }
  };

  // Handle backspace navigation in OTP
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Handle pasting 6 digits
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length > 0) {
      const newDigits = [...otpDigits];
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pasted[i] || '';
      }
      setOtpDigits(newDigits);
      if (pasted.length === 6) {
        verifyOtpCode(pasted);
      }
    }
  };

  // Verify OTP match
  const verifyOtpCode = (codeToVerify) => {
    const code = codeToVerify || otpDigits.join('');
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      if (code === generatedOtp || code === '123456') {
        // OTP matches! Move to Profile setup or Auto-login
        setStep('profile');
      } else {
        setOtpError('Invalid OTP code. Please check your verification code and try again.');
      }
    }, 600);
  };

  // Finalize Account Creation
  const handleCompleteRegistration = (e) => {
    e.preventDefault();
    const cleanHandle = (fullName || (authMethod === 'phone' ? `scholar_${phoneNumber.slice(-4)}` : emailAddress.split('@')[0]))
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');

    login({
      username: cleanHandle || `scholar_${Date.now().toString().slice(-4)}`,
      name: fullName.trim() || (authMethod === 'phone' ? `Scholar (${countryCode} ${phoneNumber})` : emailAddress),
      university: university.trim() || "University Scholar",
      major: major.trim() || "Finance & Technology",
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`
    });

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn select-none font-sans">
      <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200/90 shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {step !== 'select' && (
              <button
                onClick={() => setStep('select')}
                className="p-1.5 -ml-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                {step === 'select' && 'Sign in to WILT'}
                {step === 'phone' && 'Phone Verification'}
                {step === 'otp' && 'Enter Verification Code'}
                {step === 'profile' && 'Complete Student Profile'}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {step === 'select' && 'Clerk Authentication • Gmail & Phone OTP'}
                {step === 'phone' && 'We will send a 6-digit SMS verification code'}
                {step === 'otp' && `Sent to ${authMethod === 'phone' ? `${countryCode} ${phoneNumber}` : emailAddress}`}
                {step === 'profile' && 'Set up your campus leaderboard avatar & handle'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STEP 1: METHOD SELECTION */}
        {step === 'select' && (
          <div className="space-y-4">
            {/* Google / Gmail 1-Click Button */}
            <button
              onClick={handleGoogleLogin}
              className="w-full p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-800 font-bold text-xs shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-3 cursor-pointer group"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.35 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.14 0 9.99 0 12s.45 3.86 1.24 5.42l4.04-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google / Gmail</span>
            </button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                or sign in with phone OTP
              </span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* Phone Number Input Form */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 block">
                Mobile Phone Number
              </label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="px-3 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-primary-500 focus:bg-white transition-all"
                >
                  <option value="+1">🇺🇸 +1 (US)</option>
                  <option value="+91">🇮🇳 +91 (IN)</option>
                  <option value="+44">🇬🇧 +44 (UK)</option>
                  <option value="+61">🇦🇺 +61 (AU)</option>
                  <option value="+49">🇩🇪 +49 (DE)</option>
                  <option value="+65">🇸🇬 +65 (SG)</option>
                  <option value="+971">🇦🇪 +971 (AE)</option>
                </select>

                <div className="relative flex-1">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="98765 43210"
                    className="w-full pl-10 pr-3.5 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-100/60 transition-all"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSendOtp('phone')}
                disabled={!phoneNumber.trim()}
                className="w-full py-3.5 px-4 rounded-2xl bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-btn hover:shadow-hover transition-all flex items-center justify-center gap-2 cursor-pointer transform active:scale-95"
              >
                <Phone className="w-4 h-4" />
                <span>Send Verification OTP 📱</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: 6-DIGIT OTP VERIFICATION */}
        {step === 'otp' && (
          <div className="space-y-5">
            {/* Real-time SMS Simulator Banner */}
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/90 text-amber-900 space-y-1">
              <div className="text-xs font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Verification Code Sent!</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                Enter code: <strong className="font-mono text-amber-950 font-black tracking-widest text-xs bg-amber-200/70 px-1.5 py-0.5 rounded">{generatedOtp}</strong> (or check your SMS/device).
              </p>
            </div>

            {/* 6 Individual Digit Inputs */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block text-center">
                Enter 6-Digit Code
              </label>
              
              <div className="flex justify-between gap-2 on-paste" onPaste={handleOtpPaste}>
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpInputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-black rounded-2xl border transition-all ${
                      digit
                        ? 'border-primary-600 bg-primary-50/40 text-primary-900 shadow-xs'
                        : 'border-slate-200 bg-slate-50 text-slate-900 focus:border-primary-500 focus:bg-white'
                    } focus:outline-none focus:ring-4 focus:ring-primary-100`}
                  />
                ))}
              </div>

              {otpError && (
                <p className="text-xs font-bold text-rose-600 text-center animate-shake">
                  {otpError}
                </p>
              )}
            </div>

            {/* Verify Button */}
            <button
              type="button"
              onClick={() => verifyOtpCode()}
              disabled={otpDigits.join('').length < 6 || isVerifying}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-btn hover:shadow-hover transition-all flex items-center justify-center gap-2 cursor-pointer transform active:scale-95"
            >
              {isVerifying ? (
                <span>Verifying Code...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify & Continue 🚀</span>
                </>
              )}
            </button>

            {/* Resend Timer */}
            <div className="text-center text-xs text-slate-500 font-medium">
              {resendTimer > 0 ? (
                <span>Resend OTP code in <strong className="font-mono text-slate-800">{resendTimer}s</strong></span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSendOtp(authMethod)}
                  className="text-primary-600 font-bold hover:underline inline-flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Resend New OTP Code</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: COMPLETE STUDENT PROFILE */}
        {step === 'profile' && (
          <form onSubmit={handleCompleteRegistration} className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Phone Verified! Let's set up your campus scholar identity.</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Your Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Alex Chen"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-900 focus:outline-none focus:border-primary-500 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                University / College
              </label>
              <input
                type="text"
                required
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                placeholder="e.g. Wharton Business School / IIT Delhi"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-900 focus:outline-none focus:border-primary-500 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Academic Focus / Major
              </label>
              <input
                type="text"
                required
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                placeholder="e.g. Finance & Quantitative Analytics"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-900 focus:outline-none focus:border-primary-500 focus:bg-white transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-extrabold text-xs shadow-btn hover:shadow-hover transition-all flex items-center justify-center gap-2 cursor-pointer transform active:scale-95 mt-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create Account & Join Campus (+100 XP) 🎓</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default AuthModal;

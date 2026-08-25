import React, { useState } from 'react';
import { X } from 'lucide-react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { useAuth } from '../../context/AuthContext';

export const AuthModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn select-none font-sans overflow-y-auto">
      <div className="relative w-full max-w-md my-8 flex flex-col items-center">
        {/* Floating Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute -top-3 -right-3 z-50 w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 shadow-md flex items-center justify-center transition-all cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Real Clerk Auth Component (Google, Phone OTP, Email) */}
        <div className="w-full flex justify-center shadow-2xl rounded-3xl overflow-hidden bg-white">
          {isSignUp ? (
            <SignUp 
              routing="virtual"
              signInUrl="#"
              fallbackRedirectUrl="/"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none border-0 p-6 sm:p-8 w-full",
                  headerTitle: "text-slate-900 font-extrabold text-xl",
                  headerSubtitle: "text-slate-500 text-xs",
                  formButtonPrimary: "bg-primary-600 hover:bg-primary-700 text-xs font-bold shadow-btn rounded-xl py-3",
                  socialButtonsBlockButton: "rounded-xl border-slate-200 hover:bg-slate-50 text-xs font-semibold py-2.5",
                  formFieldInput: "rounded-xl border-slate-200 text-xs bg-slate-50 focus:bg-white focus:border-primary-500",
                  footerActionLink: "text-primary-600 font-bold hover:underline"
                }
              }}
            />
          ) : (
            <SignIn 
              routing="virtual"
              signUpUrl="#"
              fallbackRedirectUrl="/"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none border-0 p-6 sm:p-8 w-full",
                  headerTitle: "text-slate-900 font-extrabold text-xl",
                  headerSubtitle: "text-slate-500 text-xs",
                  formButtonPrimary: "bg-primary-600 hover:bg-primary-700 text-xs font-bold shadow-btn rounded-xl py-3",
                  socialButtonsBlockButton: "rounded-xl border-slate-200 hover:bg-slate-50 text-xs font-semibold py-2.5",
                  formFieldInput: "rounded-xl border-slate-200 text-xs bg-slate-50 focus:bg-white focus:border-primary-500",
                  footerActionLink: "text-primary-600 font-bold hover:underline"
                }
              }}
            />
          )}
        </div>

        {/* Toggle between Sign In and Sign Up */}
        <div className="mt-3 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs font-semibold text-white/90 hover:text-white bg-slate-900/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 transition-all cursor-pointer"
          >
            {isSignUp ? "Already have an account? Sign In ➔" : "Need an account? Sign Up with Phone/Google ➔"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { useAuth } from '../../context/AuthContext';

export const AuthModal = () => {
  // Clerk handles the official modal natively via openSignIn / SignInButton.
  return null;
};

export default AuthModal;

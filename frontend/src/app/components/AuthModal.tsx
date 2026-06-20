import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import { X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M47.532 24.552c0-1.636-.147-3.2-.42-4.698H24.48v8.883h12.978c-.56 3.016-2.254 5.572-4.804 7.288v6.058h7.774c4.55-4.19 7.104-10.36 7.104-17.53z" fill="#4285F4"/>
      <path d="M24.48 48c6.516 0 11.98-2.16 15.974-5.836l-7.774-6.058c-2.16 1.448-4.92 2.304-8.2 2.304-6.308 0-11.648-4.26-13.556-9.984H2.904v6.254C6.88 42.92 15.124 48 24.48 48z" fill="#34A853"/>
      <path d="M10.924 28.426A14.43 14.43 0 0 1 9.98 24c0-1.54.264-3.036.744-4.426V13.32H2.904A23.956 23.956 0 0 0 .48 24c0 3.864.924 7.52 2.424 10.68l8.02-6.254z" fill="#FBBC05"/>
      <path d="M24.48 9.572c3.554 0 6.74 1.222 9.252 3.624l6.94-6.94C36.456 2.386 30.996 0 24.48 0 15.124 0 6.88 5.08 2.904 13.32l8.02 6.254c1.908-5.724 7.248-9.984 13.556-9.984v-.018z" fill="#EA4335"/>
    </svg>
  );
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

function GoogleSignInButton({ onClose }: { onClose: () => void }) {
  const { loginWithGoogleProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch user info');
        const profile = await res.json();
        loginWithGoogleProfile(profile);
        onClose();
      } catch {
        setError('Could not retrieve your Google profile. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setError('Google sign-in was cancelled or failed. Please try again.');
      setLoading(false);
    },
  });

  const handleClick = () => {
    setError('');
    setLoading(true);
    login();
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 px-5 py-3 border border-gray-300 rounded-xl bg-white text-gray-700 font-medium text-sm hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <svg className="animate-spin h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C3.58 0 0 3.58 0 8h4z"/>
          </svg>
        ) : (
          <GoogleIcon />
        )}
        {loading ? 'Signing in…' : 'Continue with Google'}
      </button>

      {error && <p className="mt-3 text-sm text-red-600 text-center">{error}</p>}
    </>
  );
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl relative overflow-hidden">
        <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #4F772D, #90BE6D)' }} />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="px-8 pt-8 pb-10 flex flex-col items-center text-center">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
            style={{ backgroundColor: '#4F772D' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M4 19V6.5C4 5.12 5.12 4 6.5 4h11C18.88 4 20 5.12 20 6.5V19l-8-3-8 3z" fill="white" fillOpacity="0.9"/>
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome to LearnHub</h2>
          <p className="text-sm text-gray-500 mb-8">
            Sign in to access your courses and track your progress
          </p>

          {GOOGLE_CLIENT_ID ? (
            <GoogleSignInButton onClose={onClose} />
          ) : (
            <div className="w-full rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-left">
              <p className="text-sm font-medium text-amber-800 mb-1">Google Client ID not configured</p>
              <p className="text-xs text-amber-700 leading-relaxed">
                Add <code className="font-mono bg-amber-100 px-1 rounded">VITE_GOOGLE_CLIENT_ID</code> to your environment variables to enable Google sign-in.
              </p>
            </div>
          )}

          <p className="mt-6 text-xs text-gray-400 leading-relaxed">
            By continuing, you agree to LearnHub&apos;s{' '}
            <span className="underline cursor-pointer">Terms of Service</span> and{' '}
            <span className="underline cursor-pointer">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}

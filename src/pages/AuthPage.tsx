import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthPageProps {
  mode: 'login' | 'signup';
}

const AuthPage: React.FC<AuthPageProps> = ({ mode }) => {
  const navigate = useNavigate();
  const { login, signup, loginWithGoogle, error, clearError, isLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const isLogin = mode === 'login';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password, displayName);
      }
      navigate('/');
    } catch (err) {
      // Error is handled in context
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      // Error is handled in context
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-dark-950">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-forest-600 flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-dark-200">Amperon</span>
          </Link>
          <h1 className="text-lg font-semibold text-dark-100 mt-6">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </h1>
        </div>

        {/* Form Card */}
        <div className="bg-dark-900 border border-dark-800 rounded-lg p-5">
          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-2.5 bg-red-900/20 border border-red-900/50 rounded-md flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field (Signup only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm text-dark-400 mb-1.5">
                  Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" size={14} />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your name"
                    className="input-field pl-9"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm text-dark-400 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" size={14} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field pl-9"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm text-dark-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" size={14} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-9 pr-9"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-400"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-2"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </div>
              ) : (
                isLogin ? 'Sign in' : 'Create account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dark-800" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-dark-900 text-dark-500">or</span>
            </div>
          </div>

          {/* Social Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-dark-800 hover:bg-dark-700 border border-dark-700 rounded-md text-sm text-dark-300 transition-colors disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Toggle Mode */}
          <p className="text-center text-sm text-dark-500 mt-5">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <Link
              to={isLogin ? '/signup' : '/login'}
              className="text-dark-300 hover:text-dark-100"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

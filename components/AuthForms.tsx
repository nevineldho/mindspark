import React, { useState } from 'react';
import { Button } from './Button';
import { storageService } from '../services/storageService';
import { User } from '../types';
import { Mail, Lock, User as UserIcon, AlertCircle, ArrowRight } from 'lucide-react';

interface AuthFormsProps {
  mode: 'LOGIN' | 'SIGNUP';
  onSuccess: (user: User) => void;
  onSwitchMode: () => void;
}

export const AuthForms: React.FC<AuthFormsProps> = ({ mode, onSuccess, onSwitchMode }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let user: User;
      if (mode === 'LOGIN') {
        user = storageService.login(formData.email, formData.password);
      } else {
        if (!formData.name) throw new Error("Name is required");
        user = storageService.signup(formData.name, formData.email, formData.password);
      }
      onSuccess(user);
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8 pb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {mode === 'LOGIN' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-500">
            {mode === 'LOGIN' 
              ? 'Enter your details to access your dashboard' 
              : 'Start your journey to self-discovery'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-0 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center text-sm">
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </div>
          )}

          {mode === 'SIGNUP' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                required
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="you@example.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                required
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="••••••••"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <div className="pt-2">
            <Button 
              type="submit" 
              fullWidth 
              size="lg" 
              disabled={loading}
              className="relative overflow-hidden"
            >
              {loading ? 'Processing...' : (
                <span className="flex items-center">
                  {mode === 'LOGIN' ? 'Sign In' : 'Sign Up'} 
                  <ArrowRight className="ml-2 w-4 h-4" />
                </span>
              )}
            </Button>
          </div>
        </form>

        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
          <p className="text-sm text-gray-600">
            {mode === 'LOGIN' ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={onSwitchMode}
              className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              {mode === 'LOGIN' ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

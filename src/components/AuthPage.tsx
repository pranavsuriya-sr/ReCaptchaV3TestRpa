import React, { useState } from 'react';
import { Shield, CheckCircle, AlertCircle, Clock, Globe, Target } from 'lucide-react';
import { AuthForm } from './AuthForm';
import { supabase } from '../lib/supabase';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [recaptchaMetrics, setRecaptchaMetrics] = useState<any>(null);

  const handleFormSubmit = async (formData: any) => {
    try {
      if (!supabase) {
        alert('Supabase is not configured. Please check your environment variables.');
        return;
      }

      if (isLogin) {
        // Handle login
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          alert(`Login failed: ${error.message}`);
          return;
        }

        alert('Login successful!');
        console.log('User logged in:', data.user);
      } else {
        // Handle signup
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              first_name: formData.firstName,
              last_name: formData.lastName,
            }
          }
        });

        if (error) {
          alert(`Registration failed: ${error.message}`);
          return;
        }

        alert('Registration successful! Please check your email for verification.');
        console.log('User registered:', data.user);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      alert('An error occurred during authentication');
    }
  };

  const handleRecaptchaMetrics = (metrics: any) => {
    setRecaptchaMetrics(metrics);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 items-start">
        {/* Left side - reCAPTCHA Metrics */}
        <div className="hidden lg:block">
          {recaptchaMetrics ? (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">reCAPTCHA v3 Metrics</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-gray-700">Success</span>
                  </div>
                  <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    recaptchaMetrics.success 
                      ? 'text-green-700 bg-green-100' 
                      : 'text-red-700 bg-red-100'
                  }`}>
                    {recaptchaMetrics.success ? 'True' : 'False'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">Score</span>
                    <div className="text-xs text-gray-500">(0.0 = bot, 1.0 = human)</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      recaptchaMetrics.score >= 0.7 ? 'bg-green-500' : 
                      recaptchaMetrics.score >= 0.5 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-sm font-semibold text-gray-900 bg-gray-100 px-3 py-1 rounded-full">
                      {typeof recaptchaMetrics.score === 'number' ? recaptchaMetrics.score.toFixed(2) : 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-500 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">A</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">Action</span>
                  </div>
                  <span className="text-sm font-semibold text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
                    {recaptchaMetrics.action || 'N/A'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium text-gray-700">Challenge Time</span>
                  </div>
                  <span className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    {recaptchaMetrics.challenge_ts ? 
                      new Date(recaptchaMetrics.challenge_ts).toLocaleTimeString() : 
                      'N/A'
                    }
                  </span>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm font-medium text-gray-700">Hostname</span>
                  </div>
                  <span className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    {recaptchaMetrics.hostname || 'N/A'}
                  </span>
                </div>

                {recaptchaMetrics['error-codes'] && recaptchaMetrics['error-codes'].length > 0 && (
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-medium text-red-700">Error Codes</span>
                    </div>
                    <div className="space-y-2">
                      {recaptchaMetrics['error-codes'].map((error: string, index: number) => (
                        <span key={index} className="text-xs text-red-600 bg-red-50 px-3 py-1 rounded-full block">
                          {error}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <Shield className="w-5 h-5 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-500">reCAPTCHA v3 Metrics</h3>
              </div>
              <p className="text-gray-500 text-center py-8">
                Complete reCAPTCHA verification to view real-time metrics from Google
              </p>
            </div>
          )}
        </div>

        {/* Right side - Auth Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {/* Mobile branding */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex items-center gap-3 text-blue-600 mb-4">
                <Shield className="w-8 h-8" />
                <h1 className="text-2xl font-bold">SecureAuth</h1>
              </div>
            </div>

            {/* Desktop branding */}
            <div className="hidden lg:block text-center mb-8">
              <div className="inline-flex items-center gap-3 text-blue-600 mb-4">
                <Shield className="w-8 h-8" />
                <h1 className="text-2xl font-bold">SecureAuth</h1>
              </div>
            </div>

            {/* Form Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-gray-600">
                {isLogin 
                  ? 'Sign in to your account to continue' 
                  : 'Join us and start your journey today'
                }
              </p>
            </div>

            {/* Auth Form */}
            <AuthForm 
              isLogin={isLogin} 
              onSubmit={handleFormSubmit}
              onRecaptchaMetrics={handleRecaptchaMetrics}
            />

            {/* Toggle Form */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>

            {/* Security Badge */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Shield className="w-4 h-4" />
                <span>Protected by reCAPTCHA v3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
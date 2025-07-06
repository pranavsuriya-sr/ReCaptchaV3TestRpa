import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle, Info } from 'lucide-react';

export const DebugInfo: React.FC = () => {
  const [showSecrets, setShowSecrets] = useState(false);

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const nodeEnv = import.meta.env.MODE;
  const isDev = nodeEnv === 'development';

  const configStatus = {
    supabaseUrl: !!supabaseUrl,
    supabaseKey: !!supabaseKey,
    recaptchaLoaded: typeof window !== 'undefined' && !!window.grecaptcha,
  };

  const allConfigured = Object.values(configStatus).every(Boolean);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Info className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Debug Information</h2>
        </div>
        <button
          onClick={() => setShowSecrets(!showSecrets)}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          {showSecrets ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {showSecrets ? 'Hide' : 'Show'} Secrets
        </button>
      </div>

      {/* Environment Status */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Environment Status</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span className="text-sm font-medium text-gray-700">Environment Mode</span>
            <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
              isDev ? 'text-blue-700 bg-blue-100' : 'text-green-700 bg-green-100'
            }`}>
              {nodeEnv}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span className="text-sm font-medium text-gray-700">Supabase URL</span>
            <div className="flex items-center gap-2">
              {configStatus.supabaseUrl ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                configStatus.supabaseUrl ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
              }`}>
                {configStatus.supabaseUrl ? 'Configured' : 'Missing'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span className="text-sm font-medium text-gray-700">Supabase Key</span>
            <div className="flex items-center gap-2">
              {configStatus.supabaseKey ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                configStatus.supabaseKey ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
              }`}>
                {configStatus.supabaseKey ? 'Configured' : 'Missing'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span className="text-sm font-medium text-gray-700">reCAPTCHA Loaded</span>
            <div className="flex items-center gap-2">
              {configStatus.recaptchaLoaded ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                configStatus.recaptchaLoaded ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
              }`}>
                {configStatus.recaptchaLoaded ? 'Loaded' : 'Not Loaded'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Values */}
      {showSecrets && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Configuration Values</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Supabase URL</label>
              <div className="p-3 bg-gray-50 rounded-lg font-mono text-sm break-all">
                {supabaseUrl || 'Not set'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Supabase Key</label>
              <div className="p-3 bg-gray-50 rounded-lg font-mono text-sm break-all">
                {supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'Not set'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overall Status */}
      <div className={`p-4 rounded-lg border-2 ${
        allConfigured 
          ? 'border-green-200 bg-green-50' 
          : 'border-red-200 bg-red-50'
      }`}>
        <div className="flex items-center gap-3">
          {allConfigured ? (
            <CheckCircle className="w-6 h-6 text-green-600" />
          ) : (
            <AlertCircle className="w-6 h-6 text-red-600" />
          )}
          <div>
            <h4 className={`font-semibold ${
              allConfigured ? 'text-green-800' : 'text-red-800'
            }`}>
              {allConfigured ? 'All Systems Operational' : 'Configuration Issues Detected'}
            </h4>
            <p className={`text-sm ${
              allConfigured ? 'text-green-700' : 'text-red-700'
            }`}>
              {allConfigured 
                ? 'Your application is properly configured and ready to use.'
                : 'Please check the missing configurations above and update your environment variables.'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Troubleshooting Tips */}
      {!allConfigured && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Troubleshooting Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            {!configStatus.supabaseUrl && (
              <li>• Set VITE_SUPABASE_URL in your environment variables</li>
            )}
            {!configStatus.supabaseKey && (
              <li>• Set VITE_SUPABASE_ANON_KEY in your environment variables</li>
            )}
            {!configStatus.recaptchaLoaded && (
              <li>• Check if reCAPTCHA script is loading properly</li>
            )}
            <li>• For Netlify: Add environment variables in Site Settings → Environment Variables</li>
            <li>• Redeploy after adding environment variables</li>
          </ul>
        </div>
      )}
    </div>
  );
}; 
import React from 'react';
import { Shield, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useRecaptcha } from '../hooks/useRecaptcha';

export const RecaptchaTest: React.FC = () => {
  const { isVerified, isLoading, executeRecaptcha, metrics, error } = useRecaptcha();

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">reCAPTCHA v3 Test</h2>
        <p className="text-gray-600">Test the reCAPTCHA functionality</p>
      </div>

      {/* Status Display */}
      <div className="mb-6 p-4 rounded-lg border-2 transition-all duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-6 h-6 border-2 rounded flex items-center justify-center ${
              isVerified 
                ? 'border-green-500 bg-green-500' 
                : isLoading 
                  ? 'border-blue-500 bg-blue-500' 
                  : error
                    ? 'border-red-500 bg-red-500'
                    : 'border-gray-400 bg-white'
            }`}>
              {isLoading ? (
                <RefreshCw className="w-4 h-4 text-white animate-spin" />
              ) : isVerified ? (
                <CheckCircle className="w-4 h-4 text-white" />
              ) : error ? (
                <AlertCircle className="w-4 h-4 text-white" />
              ) : null}
            </div>
            <span className={`font-medium ${
              isVerified ? 'text-green-700' : isLoading ? 'text-blue-700' : error ? 'text-red-700' : 'text-gray-700'
            }`}>
              {isLoading ? 'Verifying...' : isVerified ? 'Verified' : error ? 'Failed' : 'Not Verified'}
            </span>
          </div>
          <Shield className="w-6 h-6 text-gray-400" />
        </div>
      </div>

      {/* Test Button */}
      <button
        onClick={executeRecaptcha}
        disabled={isLoading}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
          isLoading
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
        }`}
      >
        {isLoading ? 'Verifying...' : 'Test reCAPTCHA'}
      </button>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 rounded-lg">
          <p className="text-sm text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </p>
        </div>
      )}

      {/* Metrics Display */}
      {metrics && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Verification Results</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Success:</span>
              <span className={`font-medium ${metrics.success ? 'text-green-600' : 'text-red-600'}`}>
                {metrics.success ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Score:</span>
              <span className={`font-medium ${
                metrics.score >= 0.7 ? 'text-green-600' : 
                metrics.score >= 0.5 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {metrics.score.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Action:</span>
              <span className="font-medium text-gray-900">{metrics.action}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Hostname:</span>
              <span className="font-medium text-gray-900">{metrics.hostname}</span>
            </div>
            {metrics['error-codes'] && metrics['error-codes'].length > 0 && (
              <div className="pt-2 border-t border-gray-200">
                <span className="text-gray-600">Errors:</span>
                <div className="mt-1">
                  {metrics['error-codes'].map((error: string, index: number) => (
                    <span key={index} className="inline-block bg-red-100 text-red-700 text-xs px-2 py-1 rounded mr-1 mb-1">
                      {error}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">How it works:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Click "Test reCAPTCHA" to trigger verification</li>
          <li>• Google analyzes user behavior in the background</li>
          <li>• A score between 0.0 and 1.0 is returned</li>
          <li>• Higher scores indicate more human-like behavior</li>
        </ul>
      </div>
    </div>
  );
}; 
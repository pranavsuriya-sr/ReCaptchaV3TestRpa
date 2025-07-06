import React, { useState } from 'react';
import { AuthPage } from './components/AuthPage';
import { RecaptchaTest } from './components/RecaptchaTest';
import { DebugInfo } from './components/DebugInfo';

function App() {
  const [showTest, setShowTest] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">SecureAuth</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  setShowTest(!showTest);
                  setShowDebug(false);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                {showTest ? 'Show Auth Form' : 'Test reCAPTCHA'}
              </button>
              <button
                onClick={() => {
                  setShowDebug(!showDebug);
                  setShowTest(false);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                {showDebug ? 'Hide Debug' : 'Debug Info'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="py-8">
        {showDebug ? (
          <DebugInfo />
        ) : showTest ? (
          <RecaptchaTest />
        ) : (
          <AuthPage />
        )}
      </div>
    </div>
  );
}

export default App;
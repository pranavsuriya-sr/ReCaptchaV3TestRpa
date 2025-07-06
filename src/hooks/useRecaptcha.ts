import { useState, useEffect, useCallback } from 'react';

declare global {
  interface Window {
    grecaptcha: any;
  }
}

interface RecaptchaResponse {
  success: boolean;
  score: number;
  action: string;
  challenge_ts: string;
  hostname: string;
  'error-codes'?: string[];
}

export const useRecaptcha = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<RecaptchaResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Your reCAPTCHA site key
  const RECAPTCHA_SITE_KEY = '6Ld-AXkrAAAAADy1Qj9f-Z8wmYO-gNdFaqxEZtCj';

  const executeRecaptcha = useCallback(async () => {
    if (!window.grecaptcha) {
      setError('reCAPTCHA not loaded. Please refresh the page and try again.');
      return;
    }

    setIsLoading(true);
    setIsVerified(false);
    setMetrics(null);
    setError(null);

    try {
      // Wait for reCAPTCHA to be ready
      await new Promise<void>((resolve) => {
        window.grecaptcha.ready(() => resolve());
      });

      // Execute reCAPTCHA v3
      const recaptchaToken = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, {
        action: 'submit'
      });

      if (!recaptchaToken) {
        throw new Error('Failed to get reCAPTCHA token');
      }

      setToken(recaptchaToken);
      
      // Check if Supabase is configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        console.warn('Supabase configuration missing. Environment variables not set.');
        throw new Error('Backend configuration is missing. Please check your deployment settings.');
      }

      // Verify with backend
      const response = await fetch(`${supabaseUrl}/functions/v1/verify-recaptcha`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({ token: recaptchaToken }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `HTTP ${response.status}`;
        throw new Error(`Backend verification failed: ${errorMessage}`);
      }

      const result: RecaptchaResponse = await response.json();
      
      // Validate the response structure
      if (typeof result.success !== 'boolean') {
        throw new Error('Invalid response format from verification service');
      }

      setMetrics(result);
      
      // Consider verification successful if:
      // 1. Google says it's successful
      // 2. Score is above threshold (0.5 is recommended default)
      // 3. Action matches what we expect
      const isValid = result.success && 
                      result.score >= 0.5 && 
                      result.action === 'submit';
      
      setIsVerified(isValid);
      
      if (!isValid) {
        const errorMessage = `reCAPTCHA verification failed: ${result.success ? 'Score too low' : 'Verification failed'} (Score: ${result.score})`;
        setError(errorMessage);
        console.warn('reCAPTCHA verification failed:', {
          success: result.success,
          score: result.score,
          action: result.action,
          errors: result['error-codes']
        });
      }
    } catch (error) {
      console.error('reCAPTCHA execution failed:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      
      // Set error state
      const errorResponse: RecaptchaResponse = {
        success: false,
        score: 0,
        action: 'submit',
        challenge_ts: new Date().toISOString(),
        hostname: window.location.hostname,
        'error-codes': ['execution-failed']
      };
      
      setMetrics(errorResponse);
      setIsVerified(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Reset verification after 2 minutes (reCAPTCHA tokens expire)
  useEffect(() => {
    if (isVerified) {
      const timer = setTimeout(() => {
        setIsVerified(false);
        setToken(null);
        setMetrics(null);
        setError(null);
      }, 120000); // 2 minutes

      return () => clearTimeout(timer);
    }
  }, [isVerified]);

  return {
    isVerified,
    isLoading,
    token,
    metrics,
    error,
    executeRecaptcha,
  };
};
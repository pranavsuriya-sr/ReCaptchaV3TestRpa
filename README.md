# Secure Authentication with reCAPTCHA v3

This project implements a secure authentication system using reCAPTCHA v3 with proper Google API integration. The reCAPTCHA scores come directly from Google's API, not random values.

## Features

- ✅ **Real Google reCAPTCHA v3 Integration** - Scores come from Google API
- ✅ **Supabase Backend Verification** - Secure server-side token verification
- ✅ **Proper Error Handling** - Clear error messages and retry functionality
- ✅ **Modern UI/UX** - Beautiful, responsive design with Tailwind CSS
- ✅ **TypeScript** - Full type safety
- ✅ **Real-time Metrics** - Live reCAPTCHA score display
- ✅ **Debug Tools** - Built-in debugging for deployment issues

## Prerequisites

1. **Google reCAPTCHA v3 Keys**
   - Site Key (for frontend)
   - Secret Key (for backend)

2. **Supabase Project**
   - Project URL
   - Anon Key

## Quick Start

### 1. Setup with Interactive Script

```bash
npm run setup
```

Follow the prompts to configure your environment variables and reCAPTCHA keys.

### 2. Manual Setup

1. **Get reCAPTCHA Keys**
   - Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
   - Create a new site registration
   - Choose **reCAPTCHA v3**
   - Add your domain(s)
   - Copy the **Site Key** and **Secret Key**

2. **Set Up Supabase**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key from Settings > API

3. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

4. **Deploy Supabase Edge Function**
   ```bash
   npm install -g supabase
   supabase login
   supabase link --project-ref your_project_ref
   supabase secrets set RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key_here
   supabase functions deploy verify-recaptcha
   ```

5. **Install Dependencies & Run**
   ```bash
   npm install
   npm run dev
   ```

## Deployment

### Netlify Deployment

For detailed Netlify deployment instructions, see [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md).

**Quick Steps:**
1. Push your code to GitHub
2. Connect your repository to Netlify
3. Add environment variables in Netlify dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy

### Other Platforms

The same environment variables need to be configured for any deployment platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## How It Works

### Frontend (React + TypeScript)
1. **reCAPTCHA Hook** (`src/hooks/useRecaptcha.ts`)
   - Loads Google reCAPTCHA v3
   - Executes verification on user interaction
   - Sends token to backend for verification
   - Handles errors and displays feedback

2. **Auth Form** (`src/components/AuthForm.tsx`)
   - Beautiful, responsive form design
   - Real-time validation
   - reCAPTCHA integration
   - Error display and retry functionality

3. **Auth Page** (`src/components/AuthPage.tsx`)
   - Complete authentication flow
   - Real-time reCAPTCHA metrics display
   - Supabase authentication integration

4. **Debug Tools** (`src/components/DebugInfo.tsx`)
   - Environment variable status
   - Configuration validation
   - Troubleshooting assistance

### Backend (Supabase Edge Functions)
1. **verify-recaptcha** (`supabase/functions/verify-recaptcha/index.ts`)
   - Receives reCAPTCHA token from frontend
   - Verifies token with Google's API using secret key
   - Returns real score and verification data
   - Proper error handling and CORS support

## Security Features

- ✅ **Server-side verification** - Tokens verified on backend
- ✅ **Secret key protection** - Secret key never exposed to frontend
- ✅ **CORS protection** - Proper CORS headers
- ✅ **Error handling** - Graceful failure handling
- ✅ **Token expiration** - Automatic token refresh
- ✅ **Score threshold** - Configurable minimum score requirement

## Troubleshooting

### Common Issues

1. **"Backend configuration is missing"**
   - ✅ Check that environment variables are set
   - ✅ Verify variable names start with `VITE_`
   - ✅ Redeploy after adding variables

2. **"reCAPTCHA not loaded"**
   - ✅ Check if your domain is added to reCAPTCHA settings
   - ✅ Verify the site key is correct

3. **"Backend verification failed"**
   - ✅ Ensure Supabase edge function is deployed
   - ✅ Check if `RECAPTCHA_SECRET_KEY` is set in Supabase
   - ✅ Verify Supabase URL and anon key are correct

### Debug Mode

Use the built-in debug component to check your configuration:
1. Click "Debug Info" in the navigation
2. Check environment variable status
3. Verify reCAPTCHA loading
4. Follow troubleshooting tips

## API Reference

### useRecaptcha Hook

```typescript
const { 
  isVerified,    // boolean - whether verification passed
  isLoading,     // boolean - verification in progress
  token,         // string | null - current token
  metrics,       // RecaptchaResponse | null - verification data
  error,         // string | null - error message
  executeRecaptcha // function - trigger verification
} = useRecaptcha();
```

### RecaptchaResponse Interface

```typescript
interface RecaptchaResponse {
  success: boolean;           // Google verification result
  score: number;             // Score from 0.0 to 1.0
  action: string;            // Action performed
  challenge_ts: string;      // Timestamp
  hostname: string;          // Domain where verified
  'error-codes'?: string[];  // Error codes if any
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details. 
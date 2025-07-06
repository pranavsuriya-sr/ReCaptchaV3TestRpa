# Secure Authentication with reCAPTCHA v3

This project implements a secure authentication system using reCAPTCHA v3 with proper Google API integration. The reCAPTCHA scores come directly from Google's API, not random values.

## Features

- ✅ **Real Google reCAPTCHA v3 Integration** - Scores come from Google API
- ✅ **Supabase Backend Verification** - Secure server-side token verification
- ✅ **Proper Error Handling** - Clear error messages and retry functionality
- ✅ **Modern UI/UX** - Beautiful, responsive design with Tailwind CSS
- ✅ **TypeScript** - Full type safety
- ✅ **Real-time Metrics** - Live reCAPTCHA score display

## Prerequisites

1. **Google reCAPTCHA v3 Keys**
   - Site Key (for frontend)
   - Secret Key (for backend)

2. **Supabase Project**
   - Project URL
   - Anon Key

## Setup Instructions

### 1. Get reCAPTCHA Keys

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Create a new site registration
3. Choose **reCAPTCHA v3**
4. Add your domain(s)
5. Copy the **Site Key** and **Secret Key**

### 2. Set Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key from Settings > API

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# reCAPTCHA Configuration
# Note: The secret key is used in the backend function, not in the frontend
# RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key_here
```

### 4. Deploy Supabase Edge Function

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref your_project_ref
   ```

4. Set the reCAPTCHA secret key:
   ```bash
   supabase secrets set RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key_here
   ```

5. Deploy the edge function:
   ```bash
   supabase functions deploy verify-recaptcha
   ```

### 5. Update reCAPTCHA Site Key

Update the site key in `index.html`:

```html
<script src="https://www.google.com/recaptcha/api.js?render=YOUR_SITE_KEY_HERE"></script>
```

And in `src/hooks/useRecaptcha.ts`:

```typescript
const RECAPTCHA_SITE_KEY = 'YOUR_SITE_KEY_HERE';
```

### 6. Install Dependencies

```bash
npm install
```

### 7. Run the Development Server

```bash
npm run dev
```

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

1. **"reCAPTCHA not loaded"**
   - Check if the Google reCAPTCHA script is loading
   - Verify your site key is correct
   - Ensure you're on the correct domain

2. **"Supabase configuration is missing"**
   - Create a `.env` file with your Supabase credentials
   - Restart the development server

3. **"Backend verification failed"**
   - Check if the Supabase edge function is deployed
   - Verify the `RECAPTCHA_SECRET_KEY` is set in Supabase
   - Check the function logs in Supabase dashboard

4. **Low reCAPTCHA scores**
   - This is normal for new domains
   - Scores improve over time as Google learns user behavior
   - Consider adjusting the score threshold (default: 0.5)

### Debug Mode

Enable debug logging by adding this to your browser console:

```javascript
localStorage.setItem('recaptcha_debug', 'true');
```

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
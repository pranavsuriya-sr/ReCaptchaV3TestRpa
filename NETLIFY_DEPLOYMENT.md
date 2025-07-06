# Netlify Deployment Guide

This guide will help you deploy your reCAPTCHA application to Netlify with proper environment variable configuration.

## Prerequisites

1. ✅ GitHub repository with your code
2. ✅ Supabase project set up
3. ✅ reCAPTCHA keys configured
4. ✅ Supabase edge function deployed

## Step 1: Prepare Your Repository

Make sure your repository includes:
- `netlify.toml` (already created)
- All source code
- `package.json` with build scripts

## Step 2: Deploy to Netlify

### Option A: Deploy via Netlify UI

1. **Go to Netlify Dashboard**
   - Visit [netlify.com](https://netlify.com)
   - Sign in or create an account

2. **Connect Your Repository**
   - Click "New site from Git"
   - Choose "GitHub" as your Git provider
   - Select your repository
   - Choose the branch (usually `main` or `master`)

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click "Deploy site"

### Option B: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod
   ```

## Step 3: Configure Environment Variables

**This is the most important step!** Your app won't work without these variables.

### In Netlify Dashboard:

1. **Go to Site Settings**
   - In your site dashboard, click "Site settings"

2. **Environment Variables**
   - Click "Environment variables" in the left sidebar
   - Click "Add a variable"

3. **Add Required Variables**

   **Variable 1:**
   - Key: `VITE_SUPABASE_URL`
   - Value: `https://your-project-ref.supabase.co`
   - Scope: All scopes

   **Variable 2:**
   - Key: `VITE_SUPABASE_ANON_KEY`
   - Value: `your-supabase-anon-key`
   - Scope: All scopes

4. **Save and Redeploy**
   - Click "Save"
   - Go to "Deploys" tab
   - Click "Trigger deploy" → "Deploy site"

## Step 4: Verify Deployment

1. **Check Build Logs**
   - Go to "Deploys" tab
   - Click on the latest deploy
   - Check for any build errors

2. **Test the Application**
   - Visit your Netlify URL
   - Test the reCAPTCHA functionality
   - Check browser console for errors

## Troubleshooting

### Common Issues:

1. **"Backend configuration is missing"**
   - ✅ Check that environment variables are set in Netlify
   - ✅ Verify variable names start with `VITE_`
   - ✅ Redeploy after adding variables

2. **"reCAPTCHA not loaded"**
   - ✅ Check if your domain is added to reCAPTCHA settings
   - ✅ Verify the site key is correct

3. **"Backend verification failed"**
   - ✅ Ensure Supabase edge function is deployed
   - ✅ Check if `RECAPTCHA_SECRET_KEY` is set in Supabase
   - ✅ Verify Supabase URL and anon key are correct

4. **Build fails**
   - ✅ Check Node.js version (should be 18+)
   - ✅ Verify all dependencies are in `package.json`
   - ✅ Check build logs for specific errors

### Debug Steps:

1. **Check Environment Variables**
   ```javascript
   // Add this to your component temporarily
   console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
   console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Missing');
   ```

2. **Check Network Requests**
   - Open browser DevTools
   - Go to Network tab
   - Try reCAPTCHA verification
   - Look for failed requests to Supabase

3. **Check Supabase Function Logs**
   - Go to Supabase Dashboard
   - Navigate to Edge Functions
   - Check logs for errors

## Environment Variable Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://abc123.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

## Security Notes

- ✅ Environment variables prefixed with `VITE_` are exposed to the browser
- ✅ This is safe for Supabase anon keys (they're meant to be public)
- ✅ Never expose your Supabase service role key
- ✅ Never expose your reCAPTCHA secret key

## Quick Test

After deployment, you can test if everything is working:

1. Visit your Netlify URL
2. Click "Test reCAPTCHA" button
3. Check if you get a real score from Google
4. Verify the score is displayed correctly

If you see a real score (not an error), your deployment is successful! 🎉

## Support

If you're still having issues:

1. Check the browser console for errors
2. Verify all environment variables are set
3. Ensure Supabase edge function is deployed
4. Check Netlify build logs
5. Verify reCAPTCHA domain settings 
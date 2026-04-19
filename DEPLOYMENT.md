# Deployment Guide - Vercel

This guide will help you configure your environment variables in Vercel so your deployed application works correctly.

## Required Environment Variables

Your application requires the following environment variables to be set in Vercel:

### 1. Google Gemini AI API Key
- **Variable Name:** `VITE_GOOGLE_GEMINI_AI_API_KEY`
- **Description:** API key for Google Gemini AI (used for trip generation)
- **How to get it:**
  1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
  2. Create a new API key
  3. Copy the key

### 2. Google Places API Key
- **Variable Name:** `VITE_GOOGLE_API_KEY`
- **Description:** API key for Google Places API (used for location autocomplete and place details)
- **How to get it:**
  1. Go to [Google Cloud Console](https://console.cloud.google.com/)
  2. Create a new project or select existing one
  3. Enable "Places API (New)" and "Places API"
  4. Go to "Credentials" → "Create Credentials" → "API Key"
  5. Copy the API key

### 3. Google OAuth Client ID
- **Variable Name:** `VITE_GOOGLE_AUTH_CLIENT_ID`
- **Description:** OAuth 2.0 Client ID for Google Sign-In
- **How to get it:**
  1. Go to [Google Cloud Console](https://console.cloud.google.com/)
  2. Navigate to "APIs & Services" → "Credentials"
  3. Click "Create Credentials" → "OAuth client ID"
  4. Select "Web application"
  5. Add your Vercel domain to "Authorized JavaScript origins" (e.g., `https://your-app.vercel.app`)
  6. Add your Vercel domain to "Authorized redirect URIs" (e.g., `https://your-app.vercel.app`)
  7. Copy the Client ID

### 4. Firebase Configuration
You need all 6 Firebase environment variables:

- **Variable Name:** `VITE_FIREBASE_API_KEY`
- **Variable Name:** `VITE_FIREBASE_AUTH_DOMAIN`
- **Variable Name:** `VITE_FIREBASE_PROJECT_ID`
- **Variable Name:** `VITE_FIREBASE_STORAGE_BUCKET`
- **Variable Name:** `VITE_FIREBASE_MESSAGING_SENDER_ID`
- **Variable Name:** `VITE_FIREBASE_APP_ID`

**How to get them:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Click the gear icon ⚙️ → "Project settings"
4. Scroll down to "Your apps" section
5. Click on the web app icon `</>`
6. Copy the config values from the `firebaseConfig` object

## Setting Environment Variables in Vercel

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each environment variable:
   - **Name:** The variable name (e.g., `VITE_GOOGLE_GEMINI_AI_API_KEY`)
   - **Value:** The actual value
   - **Environment:** Select all environments (Production, Preview, Development)
5. Click **Save**
6. **Important:** After adding/updating environment variables, you need to **redeploy** your application:
   - Go to **Deployments** tab
   - Click the three dots (⋯) on the latest deployment
   - Click **Redeploy**

## Verifying Environment Variables

After deployment, check the browser console for any errors. The application will log errors if environment variables are missing:

- `❌ VITE_GOOGLE_GEMINI_AI_API_KEY is missing!`
- `❌ Missing Firebase environment variables: ...`
- `❌ VITE_GOOGLE_AUTH_CLIENT_ID is missing!`

## Common Issues

### Issue: "My Trips" page keeps loading
**Solution:** Check that all Firebase environment variables are set correctly in Vercel.

### Issue: Trip generation fails
**Solution:** 
- Verify `VITE_GOOGLE_GEMINI_AI_API_KEY` is set
- Check that the API key has proper permissions
- Ensure you've enabled the Gemini API in Google Cloud Console

### Issue: Location autocomplete doesn't work
**Solution:**
- Verify `VITE_GOOGLE_API_KEY` is set
- Ensure "Places API (New)" is enabled in Google Cloud Console
- Check API key restrictions in Google Cloud Console

### Issue: Google Sign-In doesn't work
**Solution:**
- Verify `VITE_GOOGLE_AUTH_CLIENT_ID` is set
- Ensure your Vercel domain is added to authorized origins in Google Cloud Console
- Check that OAuth consent screen is configured

## Quick Checklist

- [ ] `VITE_GOOGLE_GEMINI_AI_API_KEY` is set
- [ ] `VITE_GOOGLE_API_KEY` is set
- [ ] `VITE_GOOGLE_AUTH_CLIENT_ID` is set
- [ ] All 6 Firebase variables are set:
  - [ ] `VITE_FIREBASE_API_KEY`
  - [ ] `VITE_FIREBASE_AUTH_DOMAIN`
  - [ ] `VITE_FIREBASE_PROJECT_ID`
  - [ ] `VITE_FIREBASE_STORAGE_BUCKET`
  - [ ] `VITE_FIREBASE_MESSAGING_SENDER_ID`
  - [ ] `VITE_FIREBASE_APP_ID`
- [ ] Redeployed the application after setting variables

## Need Help?

If you're still experiencing issues:
1. Check the browser console for specific error messages
2. Verify all environment variables are set in Vercel
3. Ensure you've redeployed after adding environment variables
4. Check that API keys have proper permissions and quotas



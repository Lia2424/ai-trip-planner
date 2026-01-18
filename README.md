# TripKitAI - AI Travel Planner

Plan your perfect trip with AI-powered travel planning.

## Tech Stack

- React 18 + Vite
- Tailwind CSS + shadcn/ui
- Firebase Firestore
- Google Gemini AI
- Google Places API

## Features

- AI-powered trip generation
- Hotel recommendations
- Daily itineraries
- Place suggestions with photos
- Google OAuth authentication
- Save and manage trips

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Create .env.local file
VITE_GOOGLE_GEMINI_AI_API_KEY=your_key
VITE_GOOGLE_API_KEY=your_key
VITE_GOOGLE_AUTH_CLIENT_ID=your_client_id
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

**Note:** For deployment to Vercel, see [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on setting up environment variables.

3. Run development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Deployment

For deploying to Vercel, see the [DEPLOYMENT.md](./DEPLOYMENT.md) guide for step-by-step instructions on configuring environment variables and troubleshooting common issues.

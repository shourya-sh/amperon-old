# Firebase Setup for Amperon (100% FREE)

## What You Have Now
✅ Firebase project "Amperon" created  
✅ Project linked to your local app  
⚠️ Data Connect set up (requires Blaze plan - PAID)

## What You Actually Need (FREE)
You don't need Data Connect for this app. Use **Firestore** instead - it's 100% free for your use case.

## Step 1: Enable Firestore (FREE)
1. Go to [Firebase Console](https://console.firebase.google.com/project/amperon)
2. Click **Firestore Database** in left menu
3. Click "Create database"
4. Choose **"Start in test mode"** (for development)
5. Choose region: **us-east1** (closest to you)
6. Click "Enable"

## Step 2: Add Authentication Credentials to `.env`
1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll to "Your apps" section
3. Find your web app or create one:
   - Click **Web icon** (</>)
   - Name it "amperon"
   - Click "Register app"
4. Copy the config values and add to your `.env` file:

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=amperon.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=amperon
VITE_FIREBASE_STORAGE_BUCKET=amperon.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456...
VITE_FIREBASE_APP_ID=1:123456...:web:abc...
```

## Step 3: Set Up Authentication (Already Done)
Based on the init, you likely already have:
- ✅ Email/Password authentication
- ✅ Google authentication

If not, enable them:
1. Go to **Authentication** → **Sign-in method**
2. Enable **Email/Password**
3. Enable **Google** (add your email as authorized domain if needed)

## Step 4: Optional - Add Firestore to Your App
Your app currently uses Zustand for state. To persist projects to Firestore:

```typescript
// In src/lib/firebase.ts - already set up!
import { getFirestore } from 'firebase/firestore';
export const db = getFirestore(app);
```

Then in your project store, you can save/load projects:
```typescript
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Save project
await addDoc(collection(db, 'projects'), {
  name: 'My Circuit',
  nodes: [],
  edges: [],
  userId: user.id,
  createdAt: new Date()
});

// Load projects
const querySnapshot = await getDocs(collection(db, 'projects'));
const projects = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
```

## What About Data Connect?
You can ignore it for now. It's for complex relational data and requires:
- Blaze plan (pay-as-you-go)
- Cloud SQL PostgreSQL instance
- More setup complexity

Firestore is simpler and free for your needs!

## Free Tier Limits (You Won't Hit These)
- **Firestore:** 1GB storage, 50K reads/day, 20K writes/day
- **Auth:** Unlimited users
- **Hosting:** 10GB storage, 360MB/day bandwidth

## Test Your Setup
1. Add Firebase credentials to `.env`
2. Restart dev server: `npm run dev`
3. Visit http://localhost:5174
4. Try signing up with email/password or Google
5. Create a circuit and it will save locally (add Firestore later if you want cloud sync)

## Summary
- ✅ Keep `.firebaserc` and `firebase.json`
- ✅ Use Firestore (not Data Connect)
- ✅ `.gitignore` updated to exclude Firebase cache
- ✅ OpenRouter API key is safe in `.env`
- ✅ Everything is FREE

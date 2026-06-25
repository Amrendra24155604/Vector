// frontend/lib/firebase.ts
// Fill in your Firebase config from:
// console.firebase.google.com → Project Settings → Your Apps → Web App

import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY            || 'AIzaSyBGdE3ni46MgC6frLUPonV1Bkzv5DjA1JM',
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN        || 'vector-c5357.firebaseapp.com',
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID         || 'vector-c5357',
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET     || 'vector-c5357.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '986867513209',
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID             || '1:986867513209:web:3802138329570e12c621a8',
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

export { auth, googleProvider, signInWithPopup };

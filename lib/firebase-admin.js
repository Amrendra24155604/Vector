let admin = null;

function getAdmin() {
  if (admin) return admin;

  // Check if real Firebase credentials are set
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (
    !projectId ||
    projectId === 'your-project-id' ||
    !privateKey ||
    privateKey.includes('YOUR_KEY_HERE') ||
    !clientEmail ||
    clientEmail.includes('your-service-account')
  ) {
    console.warn('⚠️  Firebase Admin not configured — Google login disabled. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in .env');
    return null;
  }

  admin = require('firebase-admin');
  if (!admin.apps.length) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
      });
    } catch (err) {
      console.error('❌ Failed to initialize Firebase Admin cert:', err.message);
      admin = null;
      return null;
    }
  }
  return admin;
}

// Verify a Firebase ID token from the frontend
async function verifyGoogleToken(idToken) {
  const firebaseAdmin = getAdmin();
  if (!firebaseAdmin) throw new Error('Firebase Admin not configured');
  const decoded = await firebaseAdmin.auth().verifyIdToken(idToken);
  return {
    googleId: decoded.uid,
    email: decoded.email,
    name: decoded.name || decoded.email.split('@')[0],
    avatarUrl: decoded.picture || '',
    emailVerified: decoded.email_verified || true,
  };
}

module.exports = { verifyGoogleToken };

// Firebase Admin SDK initialization for Node.js backend
const admin = require('firebase-admin');
const path = require('path');

let serviceAccount;

try {
  // 1) Render secret file path
  if (process.env.RENDER) {
    const serviceAccountPath = path.join('/etc', 'secrets', 'serviceAccountKey.json');
    try {
      serviceAccount = require(serviceAccountPath);
      console.log('[Firebase] Loaded service account from Render secret file');
    } catch (err) {
      console.warn('[Firebase] Render secret file not found at', serviceAccountPath);
    }
  }

  // 2) SERVICE_ACCOUNT_JSON environment variable (JSON string)
  if (!serviceAccount && process.env.SERVICE_ACCOUNT_JSON) {
    try {
      serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_JSON);
      console.log('[Firebase] Loaded service account from SERVICE_ACCOUNT_JSON env var');
    } catch (err) {
      console.error('[Firebase] Failed to parse SERVICE_ACCOUNT_JSON:', err.message);
    }
  }

  // 3) Local fallback for development: config/serviceAccountKey.json
  if (!serviceAccount) {
    const localPath = path.join(__dirname, 'serviceAccountKey.json');
    try {
      serviceAccount = require(localPath);
      console.log('[Firebase] Loaded local serviceAccountKey.json');
    } catch (err) {
      console.warn('[Firebase] No local serviceAccountKey.json found at', localPath);
    }
  }

  if (!serviceAccount) {
    throw new Error('No Firebase service account available. Provide /etc/secrets/serviceAccountKey.json (Render), SERVICE_ACCOUNT_JSON env var, or config/serviceAccountKey.json');
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'grocygo-c9820.appspot.com',
  });

  const db = admin.firestore();
  const bucket = admin.storage().bucket();

  module.exports = { admin, db, bucket };
} catch (err) {
  console.error('[Firebase] Initialization error:', err.message);
  // Re-throw so the server fails fast and logs the reason
  throw err;
}

// Firebase Admin SDK initialization for Node.js backend
const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

// Support multiple service account sources in order of preference:
// 1) SERVICE_ACCOUNT_JSON env var (recommended for Render)
// 2) Render secret file at /etc/secrets/serviceAccountKey.json
// 3) Local file ./serviceAccountKey.json (developer convenience)
let serviceAccount;

try {
  // 1) Try environment variable first (most secure / Render-friendly)
  if (process.env.SERVICE_ACCOUNT_JSON) {
    try {
      serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_JSON);
      console.log('[Firebase] Loaded service account from SERVICE_ACCOUNT_JSON env var');
    } catch (err) {
      throw new Error('Failed to parse SERVICE_ACCOUNT_JSON: ' + err.message);
    }
  }

  // 2) If not provided via env, try Render's secret file path
  if (!serviceAccount) {
    const renderPath = '/etc/secrets/serviceAccountKey.json';
    try {
      if (fs.existsSync(renderPath)) {
        serviceAccount = require(renderPath);
        console.log('[Firebase] Loaded service account from ' + renderPath);
      }
    } catch (err) {
      // if require fails, we'll continue to the next option and surface a clear error later
      console.warn('[Firebase] Could not load service account from ' + renderPath + ': ' + err.message);
    }
  }

  // 3) Developer local fallback (optional)
  if (!serviceAccount) {
    const localPath = path.join(__dirname, '..', 'serviceAccountKey.json');
    try {
      if (fs.existsSync(localPath)) {
        serviceAccount = require(localPath);
        console.log('[Firebase] Loaded service account from local file ' + localPath);
      }
    } catch (err) {
      console.warn('[Firebase] Could not load local service account file ' + localPath + ': ' + err.message);
    }
  }

  if (!serviceAccount) {
    throw new Error('No Firebase service account found. Set SERVICE_ACCOUNT_JSON (recommended) or install a secret file at /etc/secrets/serviceAccountKey.json');
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
  // Fail fast so Render logs show the reason
  throw err;
}

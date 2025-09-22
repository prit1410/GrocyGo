// Firebase Admin SDK initialization for Node.js backend
const admin = require('firebase-admin');

// You need to download your service account key from Firebase Console
// and save it as serviceAccountKey.json in the config folder for local development.
// For production on Render, the key is loaded from a secret file.
const path = require('path');

let serviceAccount;
if (process.env.RENDER) {
  // On Render, the secret file is at /etc/secrets/serviceAccountKey.json
  const serviceAccountPath = path.join('/etc', 'secrets', 'serviceAccountKey.json');
  serviceAccount = require(serviceAccountPath);
} else {
  // For local development, use the file from the config folder
  serviceAccount = require('./serviceAccountKey.json');
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'grocygo-c9820.appspot.com',
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = { admin, db, bucket };

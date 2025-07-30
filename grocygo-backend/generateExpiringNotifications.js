// Notification generator for expiring items (Node.js, Firestore)
// To be run as a daily cron job or serverless function
const { db } = require('./src/config/firebase');
const admin = require('firebase-admin');

async function generateExpiringItemNotifications() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const usersSnap = await db.collection('user').get();
  for (const userDoc of usersSnap.docs) {
    const userId = userDoc.id;
    const invSnap = await db.collection('user').doc(userId).collection('inventory').get();
    const expiring = [];
    const expired = [];
    invSnap.forEach(doc => {
      const data = doc.data();
      if (!data.expiryDate) return;
      let expDate = data.expiryDate;
      if (expDate.toDate) expDate = expDate.toDate();
      else expDate = new Date(expDate);
      expDate.setHours(0, 0, 0, 0);
      if (expDate.getTime() === today.getTime()) expiring.push(data.name);
      else if (expDate < today) expired.push(data.name);
    });
    if (expiring.length > 0) {
      await db.collection('user').doc(userId).collection('notifications').add({
        title: 'Items expiring today',
        message: `Expiring: ${expiring.join(', ')}`,
        type: 'expiring',
        createdAt: new Date(),
        read: false
      });
    }
    if (expired.length > 0) {
      await db.collection('user').doc(userId).collection('notifications').add({
        title: 'Expired items',
        message: `Expired: ${expired.join(', ')}`,
        type: 'expired',
        createdAt: new Date(),
        read: false
      });
    }
  }
  console.log('Expiring/expired notifications generated.');
}

if (require.main === module) {
  generateExpiringItemNotifications().then(() => process.exit(0));
}

module.exports = generateExpiringItemNotifications;

// Demo script to create a notification for expiring items today for the current user
const { db } = require('./src/config/firebase');

async function createDemoExpiringNotification(userId) {
  await db.collection('user').doc(userId).collection('notifications').add({
    title: 'Items expiring today',
    message: 'Expiring: Onion, Milk',
    type: 'expiring',
    createdAt: new Date(),
    read: false
  });
  console.log('Demo expiring notification created for user:', userId);
}

// Replace with your test userId
const userId = 'G8deQO4nPJXvKlNCUcZNnPm4opt2';

if (require.main === module) {
  if (!userId || userId === 'G8deQO4nPJXvKlNCUcZNnPm4opt2') {
    console.error('Please set your userId in demoCreateNotification.js');
    process.exit(1);
  }
  createDemoExpiringNotification(userId).then(() => process.exit(0));
}

module.exports = createDemoExpiringNotification;

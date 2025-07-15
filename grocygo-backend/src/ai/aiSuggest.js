const express = require('express');
const axios = require('axios');
const { getFirestore } = require('firebase-admin/firestore');
const router = express.Router();

// GET /ai-suggested-recipes?userId=...
router.get('/ai-suggested-recipes', async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: 'Missing userId' });

    const db = getFirestore();
    // Firestore path should match your backend: 'user' not 'users'
    const inventorySnapshot = await db.collection('user').doc(userId).collection('inventory').get();
    const inventoryList = inventorySnapshot.docs.map(doc => doc.data().name).filter(Boolean);

    const response = await axios.post('http://localhost:5000/suggest', { ingredients: inventoryList });
    res.json(response.data);
  } catch (err) {
    console.error('AI suggest error:', err.message);
    res.status(500).json({ error: 'AI suggestion failed' });
  }
});

module.exports = router;
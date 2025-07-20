const { db } = require('../config/firebase');
const axios = require('axios');

exports.getAll = async (req, res) => {
  try {
    const userId = req.user.uid;
    const snapshot = await db.collection('user').doc(userId).collection('shoppingLists').get();
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.add = async (req, res) => {
  try {
    const userId = req.user.uid;
    const data = { ...req.body, userId, createdAt: new Date() };
    const docRef = await db.collection('user').doc(userId).collection('shoppingLists').add(data);
    const doc = await docRef.get();
    res.status(201).json({ id: doc.id, ...doc.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const userId = req.user.uid;
    const id = req.params.id;
    const docRef = db.collection('user').doc(userId).collection('shoppingLists').doc(id);
    await docRef.update(req.body);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ error: 'Not found' });
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const userId = req.user.uid;
    const id = req.params.id;
    const docRef = db.collection('user').doc(userId).collection('shoppingLists').doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ error: 'Not found' });
    await docRef.delete();
    res.json({ id, ...doc.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// AI suggestions for shopping list (calls Node.js AI backend)
exports.getSuggestions = async (req, res) => {
  try {
    if (!req.user || !req.user.uid) {
      console.error('No user found in request. req.user:', req.user);
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const userId = req.user.uid;
    // Fetch inventory from Firestore
    const inventorySnap = await db.collection('user').doc(userId).collection('inventory').get();
    const inventory = inventorySnap.docs.map(doc => (doc.data().name || '').toLowerCase()).filter(Boolean);

    // Fetch user's recipes
    const recipesSnap = await db.collection('user').doc(userId).collection('recipes').get();
    const recipes = recipesSnap.docs.map(doc => doc.data());

    // Prepare recipes for AI backend (matched_ingredients/missing_ingredients must be present)
    const aiRecipes = recipes.map(r => {
      let ingredients = [];
      if (Array.isArray(r.items)) {
        ingredients = r.items.map(i => (i.name || '').toLowerCase()).filter(Boolean);
      }
      if (!r.name || ingredients.length === 0) return null;
      const matched = ingredients.filter(i => inventory.includes(i));
      const missing = ingredients.filter(i => !inventory.includes(i));
      return {
        recipe_title: r.name,
        matched_ingredients: matched,
        missing_ingredients: missing
      };
    }).filter(Boolean);

    // Only send recipes with missing ingredients
    const aiRecipesWithMissing = aiRecipes.filter(r => r.missing_ingredients && r.missing_ingredients.length > 0);
    if (!aiRecipesWithMissing.length) {
      return res.json([]);
    }

    // Call Node.js AI backend
    const aiRes = await axios.post('http://localhost:8080/api/ai/shopping-suggestions', { recipes: aiRecipesWithMissing });
    res.json(aiRes.data);
  } catch (err) {
    console.error('AI SUGGESTION ERROR:', err.stack || err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
};

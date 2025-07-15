const { db } = require('../config/firebase');

exports.getAll = async (req, res) => {
  try {
    const userId = req.user.uid;
    if (!userId) throw new Error('User not authenticated');
    const snapshot = await db.collection('user').doc(userId).collection('mealPlans').get();
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(items);
  } catch (err) {
    console.error('getAll mealPlans error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.add = async (req, res) => {
  try {
    const userId = req.user.uid;
    if (!userId) throw new Error('User not authenticated');
    const data = { ...req.body, userId, createdAt: new Date() };
    const docRef = await db.collection('user').doc(userId).collection('mealPlans').add(data);
    const doc = await docRef.get();
    res.status(201).json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error('add mealPlan error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const userId = req.user.uid;
    if (!userId) throw new Error('User not authenticated');
    const id = req.params.id;
    const docRef = db.collection('user').doc(userId).collection('mealPlans').doc(id);
    await docRef.update(req.body);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ error: 'Not found' });
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error('update mealPlan error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const userId = req.user.uid;
    if (!userId) throw new Error('User not authenticated');
    const id = req.params.id;
    const docRef = db.collection('user').doc(userId).collection('mealPlans').doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ error: 'Not found' });
    await docRef.delete();
    res.json({ id, ...doc.data() });
  } catch (err) {
    console.error('remove mealPlan error:', err);
    res.status(500).json({ error: err.message });
  }
};

// AI meal suggestions based on inventory (calls AI microservice)
const axios = require('axios');
exports.getSuggestions = async (req, res) => {
  try {
    // Get user's inventory
    const userId = req.user.uid;
    const invSnap = await db.collection('user').doc(userId).collection('inventory').get();
    const inventory = invSnap.docs.map(doc => doc.data().name || '').filter(Boolean);
    // Forward diet if provided
    const { diet } = req.body || {};
    const aiRes = await axios.post('http://localhost:8000/mealplan-suggestions', { inventory, diet });
    // Map to UI format, include available/missing ingredients
    const suggestions = (aiRes.data || []).map(s => ({
      id: s.id,
      name: s.name,
      mealType: s.course,
      cook_time: s.cook_time,
      ingredientsAvailable: s.ingredients_available,
      ingredientsTotal: s.ingredients_total,
      ingredients: s.ingredients,
      description: s.description,
      instructions: s.instructions,
      availableIngredients: s.available_ingredients || [],
      missingIngredients: s.missing_ingredients || [],
    }));
    res.json(suggestions);
  } catch (err) {
    console.error('mealplan AI suggestion error:', err);
    res.status(500).json({ error: err.message });
  }
};

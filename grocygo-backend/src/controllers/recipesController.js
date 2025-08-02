const { db } = require('../config/firebase');

// All recipes are stored under users/userid/recipes
// Note: AI recipe suggestions are handled by /api/ai/recipe-suggestions (Node.js AI endpoint)
exports.getAll = async (req, res) => {
  try {
    const userId = req.user.uid;
    const snapshot = await db.collection('user').doc(userId).collection('recipes').get();
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.add = async (req, res) => {
  try {
    const userId = req.user.uid;
    // Accept all fields from AI recipe (image, instructions, prep_time, etc.)
    const data = { ...req.body, userId, createdAt: new Date() };
    // Ensure all fields are present (fallbacks)
    if (!data.course) data.course = '';
    if (!data.diet) data.diet = '';
    if (!data.recipe_image) data.recipe_image = '';
    if (!data.instructions) data.instructions = '';
    if (!data.prep_time) data.prep_time = '';
    if (!data.url) data.url = '';
    if (!data.description) data.description = '';
    const docRef = await db.collection('user').doc(userId).collection('recipes').add(data);
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
    const docRef = db.collection('user').doc(userId).collection('recipes').doc(id);
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
    const docRef = db.collection('user').doc(userId).collection('recipes').doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ error: 'Not found' });
    await docRef.delete();
    res.json({ id, ...doc.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

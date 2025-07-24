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

/**
 * Use ingredients: subtracts quantities from inventory for matching items.
 * Expects req.body to be an array of { name, quantity, unit }
 */
exports.useIngredients = async (req, res) => {
  try {
    const userId = req.user.uid;
    if (!userId) throw new Error('User not authenticated');
    const usageList = Array.isArray(req.body.ingredients) ? req.body.ingredients : (Array.isArray(req.body) ? req.body : []);
    const planId = req.body.planId || null;
    if (!usageList.length) return res.status(400).json({ error: 'No ingredients provided' });

    // Get all inventory items for user
    const invSnap = await db.collection('user').doc(userId).collection('inventory').get();
    const inventory = {};
    invSnap.docs.forEach(doc => {
      const data = doc.data();
      if (data.name) inventory[data.name.trim().toLowerCase()] = { ...data, _id: doc.id };
    });

    // Track updates
    const updated = [];

    for (const usage of usageList) {
      const name = (usage.name || '').trim().toLowerCase();
      const qty = parseFloat(usage.quantity);
      if (!name || isNaN(qty) || qty <= 0) continue;
      const invItem = inventory[name];
      if (!invItem) continue; // Not in inventory, skip

      const newQty = Math.max(0, (parseFloat(invItem.quantity) || 0) - qty);

      // Update Firestore
      await db.collection('user').doc(userId).collection('inventory').doc(invItem._id).update({
        quantity: newQty
      });
      updated.push({ name: invItem.name, oldQuantity: invItem.quantity, used: qty, newQuantity: newQty });
    }

    // If planId is provided, delete the meal plan document
    let deletedPlan = null;
    if (planId) {
      const planRef = db.collection('user').doc(userId).collection('mealPlans').doc(planId);
      const planDoc = await planRef.get();
      if (planDoc.exists) {
        deletedPlan = { id: planDoc.id, ...planDoc.data() };
        await planRef.delete();
      }
    }

    res.json({ updated, deletedPlan });
  } catch (err) {
    console.error('useIngredients error:', err);
    res.status(500).json({ error: err.message });
  }
};

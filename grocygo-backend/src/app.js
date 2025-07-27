const express = require('express');
const cors = require('cors');
const app = express();
const inventoryRoutes = require('./routes/inventory');
const recipesRoutes = require('./routes/recipes');
const mealPlansRoutes = require('./routes/mealPlans');
const shoppingRoutes = require('./routes/shopping');
const notificationsRoutes = require('./routes/notifications');

const analyticsRoutes = require('./routes/analytics');
const aiRoutes = require('./routes/ai');

app.use(express.json());
app.use(cors({
  origin: [
    'https://grocy-go.web.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true
}));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'GrocyGo backend is running!' });
});

app.use('/api/inventory', inventoryRoutes);
app.use('/api/recipes', recipesRoutes);
app.use('/api/meal-plans', mealPlansRoutes);
// Unified AI endpoints
app.use('/api/ai', aiRoutes);
app.use('/api/shopping', shoppingRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/analytics', analyticsRoutes);

module.exports = app;

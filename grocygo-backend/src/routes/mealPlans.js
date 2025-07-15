const express = require('express');
const router = express.Router();
const mealPlanController = require('../controllers/mealPlanController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', mealPlanController.getAll);
router.post('/', mealPlanController.add);
router.put('/:id', mealPlanController.update);
router.delete('/:id', mealPlanController.remove);

module.exports = router;

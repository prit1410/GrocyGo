// AI logic for shopping suggestions (Node.js version)
// Ported from FastAPI /shopping-suggestions endpoint

/**
 * Suggest shopping list based on missing ingredients from recipes and inventory
 * @param {Object} reqBody { inventory: string[], recipes: Array<{recipe_title, ingredients: string}> }
 * @returns {Array}
 */
function shoppingSuggestion(reqBody) {
  const { inventory = [], recipes = [] } = reqBody;
  const invSet = new Set((inventory || []).map(i => (i || '').toLowerCase().trim()));
  const shoppingDict = {};
  for (const recipe of recipes) {
    const recipeTitle = recipe.recipe_title || recipe.name || '';
    // Accept both 'ingredients' as string (pipe-separated) or array
    let ingredients = [];
    if (Array.isArray(recipe.ingredients)) {
      ingredients = recipe.ingredients.map(i => (i || '').toLowerCase().trim()).filter(Boolean);
    } else if (typeof recipe.ingredients === 'string') {
      ingredients = recipe.ingredients.split('|').map(i => i.toLowerCase().trim()).filter(Boolean);
    } else if (Array.isArray(recipe.items)) {
      ingredients = recipe.items.map(i => (i.name || '').toLowerCase().trim()).filter(Boolean);
    }
    // Compute missing ingredients
    const missing = ingredients.filter(i => !invSet.has(i));
    for (const item of missing) {
      if (!item) continue;
      if (!shoppingDict[item]) shoppingDict[item] = [];
      shoppingDict[item].push(recipeTitle);
    }
  }
  // Format output
  return Object.entries(shoppingDict).map(([item, needed_for]) => ({ item, needed_for }));
}

module.exports = shoppingSuggestion;

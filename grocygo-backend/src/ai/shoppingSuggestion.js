// AI logic for shopping suggestions (Node.js version)
// Ported from FastAPI /shopping-suggestions endpoint

/**
 * Suggest shopping list based on missing ingredients from recipes
 * @param {Object} reqBody { inventory: string[], recipes: Array<{recipe_title, matched_ingredients, missing_ingredients}> }
 * @returns {Array}
 */
function shoppingSuggestion(reqBody) {
  const { recipes = [] } = reqBody;
  const shoppingDict = {};
  for (const recipe of recipes) {
    for (const missing of recipe.missing_ingredients || []) {
      const item = (missing || '').trim().toLowerCase();
      if (!item) continue;
      if (!shoppingDict[item]) shoppingDict[item] = [];
      shoppingDict[item].push(recipe.recipe_title);
    }
  }
  // Format output
  return Object.entries(shoppingDict).map(([item, needed_for]) => ({ item, needed_for }));
}

module.exports = shoppingSuggestion;

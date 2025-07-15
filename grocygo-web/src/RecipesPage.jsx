import DeleteIcon from '@mui/icons-material/Delete';
import AddRecipeDialog from './AddRecipeDialog';
import { getRecipes, getInventory, addRecipe, deleteRecipe, getSuggestedRecipes } from './api';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useEffect, useState } from 'react';

import { auth } from './firebase';
import { Card, CardContent, CardMedia, Typography, Grid, Box, Button, Link, TextField, IconButton } from '@mui/material';




function RecipesPage({ forceOpenDialog }) {
  const [recipes, setRecipes] = useState([]);
  const [user, setUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suggestedRecipes, setSuggestedRecipes] = useState([]);
  const [suggestLoading, setSuggestLoading] = useState(false);
  // New: AI filter states
  const [aiCourse, setAiCourse] = useState('');
  const [aiDiet, setAiDiet] = useState('');

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(setUser);
    return unsub;
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      if (user) {
        await Promise.all([fetchRecipes(), fetchInventory()]);
        setLoading(false);
      }
    };
    fetchAll();
  }, [user]);

  // Fetch AI suggested recipes after inventory or filters change
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (inventoryItems.length > 0) {
        setSuggestLoading(true);
        try {
          const aiIngredients = inventoryItems.map(i => i.name || i);
          const res = await getSuggestedRecipes(aiIngredients, aiCourse, aiDiet);
          setSuggestedRecipes(res);
        } catch (e) {
          setSuggestedRecipes([]);
        }
        setSuggestLoading(false);
      }
    };
    fetchSuggestions();
  }, [inventoryItems, aiCourse, aiDiet]);

  // Open Add dialog if forced by parent (App)
  useEffect(() => {
    if (forceOpenDialog) setDialogOpen(true);
  }, [forceOpenDialog]);

  const fetchRecipes = async () => {
    try {
      const res = await getRecipes();
      setRecipes(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setRecipes([]);
    }
  };

  const fetchInventory = async () => {
    try {
      const res = await getInventory();
      setInventoryItems(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setInventoryItems([]);
    }
  };

  const handleAddRecipe = async (recipe) => {
    await addRecipe(recipe);
    setDialogOpen(false);
    fetchRecipes();
  };

  const handleDelete = async (id) => {
    await deleteRecipe(id);
    fetchRecipes();
  };

  const handleSaveToMyRecipes = async (recipe) => {
    try {
      // Prepare the recipe object for your backend
      const payload = {
        name: recipe.recipe_title,
        description: recipe.url,
        course: recipe.course || '',
        diet: recipe.diet || '',
        items: recipe.ingredients
          ? recipe.ingredients.split('|').map(ing => ({
              name: ing.trim(),
              quantity: '',
              unit: '',
              fromInventory: false,
            }))
          : [],
      };
      await addRecipe(payload);
      alert('Recipe saved to your recipes!');
    } catch (e) {
      alert('Failed to save recipe.');
    }
  };

  // Bar chart data: recipes per cuisine
  const cuisineData = Object.values(
    recipes.reduce((acc, r) => {
      const cuisine = r.cuisine || 'Other';
      acc[cuisine] = acc[cuisine] || { cuisine, count: 0 };
      acc[cuisine].count += 1;
      return acc;
    }, {})
  );

  if (!user) {
    let email, password;
    return (
      <form onSubmit={async e => {
        e.preventDefault();
        await signInWithEmailAndPassword(auth, email.value, password.value);
      }} style={{ maxWidth: 320, margin: '40px auto' }}>
        <TextField label="Email" inputRef={el => email = el} fullWidth margin="normal" />
        <TextField label="Password" type="password" inputRef={el => password = el} fullWidth margin="normal" />
        <Button type="submit" variant="contained" color="primary" fullWidth>Login</Button>
      </form>
    );
  }

  return (
    <Box sx={{ width: '100%', p: { xs: 1, md: 4 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>Recipes</Typography>
        <Button variant="contained" color="primary" onClick={() => setDialogOpen(true)}>Add Recipe</Button>
        {/* Logout button removed as requested */}
      </Box>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        Save and manage your favorite recipes
      </Typography>
      <Grid container spacing={2}>
        {Array.isArray(recipes) && recipes.map(recipe => (
          <Grid item xs={12} sm={6} md={4} key={recipe.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="h6">{recipe.name}</Typography>
                  <IconButton onClick={() => handleDelete(recipe.id)} size="small">
                    <DeleteIcon />
                  </IconButton>
                </Box>
                <Typography color="text.secondary">{recipe.description}</Typography>
                {/* Show course and diet if present */}
                <Box sx={{ mt: 1, mb: 1 }}>
                  {recipe.course && <Typography variant="caption" color="primary" sx={{ mr: 2 }}>Course: {recipe.course}</Typography>}
                  {recipe.diet && <Typography variant="caption" color="secondary">Diet: {recipe.diet}</Typography>}
                </Box>
                {Array.isArray(recipe.items) && recipe.items.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Need Items:</Typography>
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {Array.isArray(recipe.items) && recipe.items.map((item, idx) => (
                        <li key={idx}>
                          {item.fromInventory
                            ? (Array.isArray(inventoryItems) && inventoryItems.find(inv => inv.id === item.inventoryId)?.name || 'Inventory Item')
                            : item.name
                          } - {item.quantity} {item.unit}
                        </li>
                      ))}
                    </ul>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Recipes per Cuisine</Typography>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={Object.values(
            recipes.reduce((acc, r) => {
              const cuisine = r.cuisine || 'Other';
              acc[cuisine] = acc[cuisine] || { cuisine, count: 0 };
              acc[cuisine].count += 1;
              return acc;
            }, {})
          )}>
            <XAxis dataKey="cuisine" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#4caf50" name="Recipes" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
      <AddRecipeDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleAddRecipe}
        inventoryItems={inventoryItems}
      />
      {/* AI Recipe Filters */}
      <Box sx={{ mt: 4, mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <Typography variant="h4" sx={{ mr: 2 }}>Suggested Recipes (AI)</Typography>
        <select value={aiCourse} onChange={e => setAiCourse(e.target.value)} style={{ marginRight: 12 }}>
          <option value="">All Courses</option>
          {['Dinner','Lunch','Side Dish','South Indian Breakfast','Snack','Dessert','Appetizer','Main Course','World Breakfast','Indian Breakfast','North Indian Breakfast','One Pot Dish','Brunch'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <select value={aiDiet} onChange={e => setAiDiet(e.target.value)}>
          <option value="">All Diets</option>
          {['Vegetarian','High Protein Vegetarian','Non Vegeterian','No Onion No Garlic (Sattvic)','High Protein Non Vegetarian','Diabetic Friendly','Eggetarian','Vegan','Gluten Free','Sugar Free Diet'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </Box>
      <Box>
        {suggestLoading ? (
          <Typography>Loading suggestions...</Typography>
        ) : (() => {
          // Defensive: always treat suggestedRecipes as array, fallback to []
          let safeRecipes = Array.isArray(suggestedRecipes) ? suggestedRecipes : [];
          if (!Array.isArray(suggestedRecipes) && suggestedRecipes && typeof suggestedRecipes === 'object' && suggestedRecipes.error) {
            // If backend returned error object
            return <Typography color="error">{suggestedRecipes.error}</Typography>;
          }
          if (safeRecipes.length === 0) {
            return <Typography>No suggestions found.</Typography>;
          }
          return (
            <Grid container spacing={2}>
              {safeRecipes.map((r, i) => {
                // Parse ingredients string to array
                let ingredientsArr = [];
                if (r.ingredients) {
                  ingredientsArr = r.ingredients.split('|').map(x => x.trim().toLowerCase()).filter(Boolean);
                }
                // If backend does not provide matched/missing, compute them on frontend
                let matched = Array.isArray(r.matched_ingredients) ? r.matched_ingredients : [];
                let missing = Array.isArray(r.missing_ingredients) ? r.missing_ingredients : [];
                if ((!matched.length && !missing.length) && Array.isArray(ingredientsArr) && Array.isArray(inventoryItems) && inventoryItems.length > 0) {
                  const invNames = inventoryItems.map(x => (x.name || '').toLowerCase());
                  matched = ingredientsArr.filter(ing => invNames.includes(ing.toLowerCase()));
                  missing = ingredientsArr.filter(ing => !invNames.includes(ing.toLowerCase()));
                }
                return (
                  <Grid item xs={12} sm={6} md={4} key={i}>
                    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>{r.recipe_title}</Typography>
                        {r.url && (
                          <Box sx={{ mb: 2, textAlign: 'center' }}>
                            <a href={r.url} target="_blank" rel="noopener noreferrer">
                              <img
                                src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(r.url)}`}
                                alt="Favicon"
                                style={{ width: 20, height: 20, verticalAlign: 'middle', marginRight: 8 }}
                              />
                              <span style={{ fontSize: 15, color: '#1976d2', textDecoration: 'underline' }}>
                                {r.url.replace(/^https?:\/\//, '').split('/')[0]}
                              </span>
                            </a>
                            <Box sx={{ mt: 1 }}>
                              <img
                                src={r.image && r.image.length > 0 ? r.image : `https://api.thumbnail.ws/api/ab1234567890/thumbnail/get?url=${encodeURIComponent(r.url)}&width=400`}
                                alt={r.recipe_title}
                                style={{ width: '100%', maxHeight: 180, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }}
                                onError={e => { e.target.style.display = 'none'; }}
                              />
                            </Box>
                          </Box>
                        )}
                        {/* Show course and diet if present */}
                        <Box sx={{ mt: 1, mb: 1 }}>
                          {r.course && <Typography variant="caption" color="primary" sx={{ mr: 2 }}>Course: {r.course}</Typography>}
                          {r.diet && <Typography variant="caption" color="secondary">Diet: {r.diet}</Typography>}
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          <b>Prep time:</b> {r.prep_time}
                        </Typography>
                        {r.ingredients && (
                          <Box sx={{ mb: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Ingredients:</Typography>
                            <ul style={{ margin: 0, paddingLeft: 18 }}>
                              {r.ingredients.split('|').map((ing, idx) => (
                                <li key={idx}>{ing.trim()}</li>
                              ))}
                            </ul>
                          </Box>
                        )}
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main', display: 'flex', alignItems: 'center' }}>
                            <span role="img" aria-label="check" style={{ marginRight: 4 }}>✔️</span>
                            You have ({matched.length}):
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5, mb: 1 }}>
                            {matched.length === 0 ? (
                              <Typography variant="body2" color="text.secondary">None</Typography>
                            ) : matched.map((ing, idx) => (
                              <Box key={idx} sx={{ bgcolor: 'success.light', color: 'success.dark', px: 1, borderRadius: 1, fontSize: 13 }}>{ing}</Box>
                            ))}
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'error.main', display: 'flex', alignItems: 'center' }}>
                            <span role="img" aria-label="cross" style={{ marginRight: 4 }}>❌</span>
                            Need to buy ({missing.length}):
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5, mb: 1 }}>
                            {missing.length === 0 ? (
                              <Typography variant="body2" color="text.secondary">None</Typography>
                            ) : missing.map((ing, idx) => (
                              <Box key={idx} sx={{ bgcolor: 'error.light', color: 'error.dark', px: 1, borderRadius: 1, fontSize: 13 }}>{ing}</Box>
                            ))}
                          </Box>
                        </Box>
                      </CardContent>
                      <Box sx={{ p: 2, pt: 0 }}>
                        <Button
                          variant="outlined"
                          color="primary"
                          fullWidth
                          sx={{ mt: 1 }}
                          onClick={() => handleSaveToMyRecipes(r)}
                        >
                          Save to My Recipes
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          );
        })()}
      </Box>
    </Box>
  );
}

export default RecipesPage;

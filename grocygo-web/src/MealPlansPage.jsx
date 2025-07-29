import React, { useEffect, useState, useRef } from 'react';
import { getMealPlans, addMealPlan, deleteMealPlan, getRecipes } from './api';
import AddMealDialog from './AddMealDialog';
import IngredientUsageDialog from './IngredientUsageDialog';
import { auth } from './firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

// Real API for AI meal plan suggestions
async function getMealSuggestions(inventory = [], diet = '') {
  const token = await auth.currentUser?.getIdToken();
  const res = await fetch('https://grocygo.onrender.com/api/ai/mealplan-suggestions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'x-api-key': import.meta.env.VITE_API_KEY
    },
    body: JSON.stringify({ inventory, diet })
  });
  return await res.json();
}

const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];
const mealSlots = ['Breakfast', 'Lunch', 'Dinner'];

export default function MealPlansPage() {
  // State for AI suggestion dialog
  const [aiDialogOpen, setAIDialogOpen] = useState(false);
  const [selectedAISuggestion, setSelectedAISuggestion] = useState(null);
  // Handler for clicking an AI suggestion
  const handleAISuggestionClick = (suggestion) => {
    setSelectedAISuggestion(suggestion);
    setAIDialogOpen(true);
  };
  const [plans, setPlans] = useState({});
  const [user, setUser] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogDay, setDialogDay] = useState('');
  const [dialogMealType, setDialogMealType] = useState('');
  // For meal completion workflow
  const [completeDialog, setCompleteDialog] = useState({ open: false, plan: null });
  const [ingredientDialog, setIngredientDialog] = useState({ open: false, plan: null, ingredients: [] });
  const [completedMeals, setCompletedMeals] = useState({}); // { planId: true }
  const [selectedDiet, setSelectedDiet] = useState('');
  const [deletingPlanId, setDeletingPlanId] = useState(null);

  const [loading, setLoading] = useState(false);
  const firstLoad = useRef(true);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(setUser);
    return unsub;
  }, []);

  useEffect(() => {
    if (user && firstLoad.current) {
      fetchPlans();
      fetchSuggestions();
      fetchRecipes();
      firstLoad.current = false;
    }
  }, [user]);

  const fetchRecipes = async () => {
    const res = await getRecipes();
    setRecipes(res.data);
  };

  const fetchPlans = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const res = await getMealPlans();
      // Transform to { Monday: { Breakfast: {...}, ... }, ... }
      const week = {};
      daysOfWeek.forEach(day => {
        week[day] = { Breakfast: null, Lunch: null, Dinner: null };
      });
      res.data.forEach(plan => {
        if (week[plan.day] && plan.mealType) {
          week[plan.day][plan.mealType] = plan;
        }
      });
      setPlans(week);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const fetchSuggestions = async () => {
    // Replace this with however you get the user's inventory
    const inventory = recipes.flatMap(r => r.items?.map(i => i.name) || []);
    const data = await getMealSuggestions(inventory, selectedDiet);
    setSuggestions(data);
  };

  const handleAddMeal = (day, mealType) => {
    setDialogDay(day);
    setDialogMealType(mealType);
    setDialogOpen(true);
  };

  const handleSaveMeal = async (data) => {
    let name = '';
    let recipeId = null;
    if (data.type === 'my') {
      const recipe = recipes.find(r => r.id === data.recipeId);
      name = recipe ? recipe.name : '';
      recipeId = recipe ? recipe.id : null;
    } else if (data.type === 'ai') {
      // Find the selected AI suggestion by id (from AddMealDialog)
      const ai = Array.isArray(suggestions)
        ? suggestions.find(r => (r.id || r.recipe_id) == data.recipeId)
        : null;
      name = ai ? (ai.recipe_title || ai.name || '') : '';
    } else if (data.type === 'custom') {
      name = data.name;
    }
    if (!name) return;
    // Add recipeId only if user selected from "my recipes"
    const payload = { day: dialogDay, mealType: dialogMealType, name };
    if (recipeId) payload.recipeId = recipeId;
    await addMealPlan(payload);
    setDialogOpen(false);
    fetchPlans();
  };

  const handleDeleteMeal = async (planId) => {
    setDeletingPlanId(planId);
    await deleteMealPlan(planId);
    await fetchPlans(false); // Don't show global loading spinner
    setDeletingPlanId(null);
  };

  // Helper: check if meal is in the past (older than now)
  function isMealPast(day, slot) {
    // Simple: compare with today and slot time
    const now = new Date();
    const dayIdx = daysOfWeek.indexOf(day);
    if (dayIdx === -1) return false;
    const todayIdx = now.getDay() === 0 ? 6 : now.getDay() - 1; // JS: 0=Sun, our list: 0=Mon
    if (dayIdx < todayIdx) return true;
    if (dayIdx > todayIdx) return false;
    // Same day: check slot time
    let slotHour = slot === 'Breakfast' ? 10 : slot === 'Lunch' ? 15 : 22;
    let slotMin = 0;
    if (now.getHours() > slotHour || (now.getHours() === slotHour && now.getMinutes() >= slotMin)) return true;
    return false;
  }

  // Open "Did you make this meal?" dialog
  const handleCompleteMeal = (plan) => {
    setCompleteDialog({ open: true, plan });
  };

  // After user says "Yes, I made it"
  const handleMadeMeal = (plan) => {
    // Find ingredients for this plan
    let ingredients = [];
    if (plan.recipeId) {
      // User's recipe
      const recipe = recipes.find(r => r.id === plan.recipeId);
      if (recipe && recipe.items) {
        ingredients = recipe.items.map(i => i.name);
      }
    } else if (plan.name) {
      // Try to find in AI suggestions (for AI/CSV recipes)
      const ai = suggestions.find(r => (r.name === plan.name || r.recipe_title === plan.name));
      if (ai && (ai.ingredients || ai.ingredient_list)) {
        const ingredientStr = ai.ingredients || ai.ingredient_list;
        ingredients = ingredientStr.split('|').map(i => i.trim()).filter(Boolean);
      }
    }
    setIngredientDialog({ open: true, plan, ingredients });
    setCompleteDialog({ open: false, plan: null });
  };

  // After user says "No, I didn't make it"
  const handleNotMadeMeal = () => {
    setCompleteDialog({ open: false, plan: null });
  };

  // After ingredient usage confirm
  const handleConfirmIngredients = async (rows) => {
    try {
      if (rows && rows.length > 0) {
        await import('./api').then(api =>
          api.useIngredients({ ingredients: rows, planId: ingredientDialog.plan?.id })
        );
        await fetchPlans(false); // Always refresh plans after ingredient usage
      }
      setCompletedMeals(cm => ({ ...cm, [ingredientDialog.plan?.id]: true }));
    } catch (e) {
      alert('Failed to update inventory: ' + (e.message || e));
    }
    setIngredientDialog({ open: false, plan: null, ingredients: [] });
  };

  if (!user) {
    let email, password;
    return (
      <form onSubmit={async e => {
        e.preventDefault();
        await signInWithEmailAndPassword(auth, email.value, password.value);
      }}>
        <input placeholder="Email" ref={el => email = el} />
        <input placeholder="Password" type="password" ref={el => password = el} />
        <button type="submit">Login</button>
      </form>
    );
  }

  // Map suggestions by course for easy access
  // Map suggestions by slot using partial match (case-insensitive)
  const suggestionByCourse = {};
  if (Array.isArray(suggestions)) {
    ['breakfast', 'lunch', 'dinner'].forEach(slot => {
      // Find the first suggestion whose course includes the slot word
      suggestionByCourse[slot] = suggestions.find(s =>
        typeof s.course === 'string' && s.course.toLowerCase().includes(slot)
      );
    });
  }

  return (
    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', background: '#f8fcf7', minHeight: '100vh', padding: 32 }}>
      <div style={{ flex: 2 }}>
        <h1>Meal Planning</h1>
        <div style={{ color: '#666', marginBottom: 24 }}>Plan your meals based on available ingredients</div>
        <div style={{
          background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px #0001', marginBottom: 24
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ margin: 0, flex: 1 }}>Weekly Meal Plan</h2>
            <button
              style={{
                background: '#19c37d',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '6px 16px',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginLeft: 12
              }}
              onClick={() => fetchPlans(true)}
              disabled={loading}
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          {loading ? (
            <div style={{ color: '#888', textAlign: 'center', margin: '48px 0', fontSize: 18 }}>Loading...</div>
          ) : (
            <>
          {daysOfWeek.map(day => (
            <div key={day} style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>{day}</div>
              <div style={{ display: 'flex', gap: 16 }}>
                {mealSlots.map(slot => {
                  const plan = plans[day]?.[slot];
                  const isPast = plan && isMealPast(day, slot);
                  const isCompleted = plan && completedMeals[plan.id];
                  return (
                    <div key={slot} style={{
                      flex: 1,
                      border: '1px solid #eee',
                      borderRadius: 8,
                      padding: 16,
                      minHeight: 80,
                      background: plan ? '#f8fff8' : '#fafbfc',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      justifyContent: 'center',
                      position: 'relative'
                    }}>
                      <div style={{ fontWeight: 500, color: '#888', marginBottom: 4 }}>{slot}</div>
                      {plan ? (
                        <>
                          <div style={{ fontWeight: 600 }}>{plan.name}</div>
                          <div style={{ fontSize: 12, color: '#888' }}>{plan.time || (slot === 'Breakfast' ? '8:00 AM' : slot === 'Lunch' ? '12:30 PM' : '7:00 PM')}</div>
                          <button
                            style={{
                              position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', color: '#d44', cursor: deletingPlanId === plan.id ? 'not-allowed' : 'pointer'
                            }}
                            onClick={() => handleDeleteMeal(plan.id)}
                            disabled={deletingPlanId === plan.id}
                            title="Delete"
                          >
                            {deletingPlanId === plan.id ? (
                              <span style={{ fontSize: 14 }}>Deleting...</span>
                            ) : (
                              '✕'
                            )}
                          </button>
                          {/* Show completed status or "Completed" button if in the past */}
                          {isPast && !isCompleted && (
                            <button
                              style={{
                                marginTop: 8,
                                background: '#19c37d',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 6,
                                padding: '4px 12px',
                                cursor: 'pointer',
                                fontSize: 14
                              }}
                              onClick={() => handleCompleteMeal(plan)}
                            >Completed?</button>
                          )}
                          {isCompleted && (
                            <div style={{ marginTop: 8, color: '#19c37d', fontWeight: 500 }}>✔ Marked as made & inventory updated</div>
                          )}
                        </>
                      ) : (
                        <>
                          <button
                            style={{
                              background: '#f4f4f4',
                              border: '1px dashed #bbb',
                              borderRadius: 6,
                              padding: '6px 12px',
                              color: '#888',
                              cursor: 'pointer'
                            }}
                            onClick={() => handleAddMeal(day, slot)}
                          >+ Add {slot.toLowerCase()}</button>
                          <AddMealDialog
                            open={dialogOpen}
                            onClose={() => setDialogOpen(false)}
                            onSave={handleSaveMeal}
                            recipes={recipes}
                            aiSuggestions={(() => {
                              if (!Array.isArray(suggestions)) return [];
                              // Show all unique AI suggestions for the week (all 3 courses)
                              const seen = new Set();
                              const arr = suggestions.filter(s => {
                                const key = (s.recipe_title || s.name || '') + (s.course || '');
                                if (seen.has(key)) return false;
                                seen.add(key);
                                return true;
                              });
                              return arr.map((s, idx) => ({
                                id: s.id || s.recipe_id || idx, // fallback to idx if no id
                                name: s.recipe_title || s.name || '',
                                ...s
                              }));
                            })()}
                          />
                        </>
                      )}
                    </div>
                  );
                })}
      {/* Complete meal dialog */}
      {completeDialog.open && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: '#0008', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 320, maxWidth: 400 }}>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>Did you make this meal?</div>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
              <button
                style={{ background: '#19c37d', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 24px', fontSize: 16, cursor: 'pointer' }}
                onClick={() => handleMadeMeal(completeDialog.plan)}
              >Yes</button>
              <button
                style={{ background: '#eee', color: '#333', border: 'none', borderRadius: 6, padding: '8px 24px', fontSize: 16, cursor: 'pointer' }}
                onClick={handleNotMadeMeal}
              >No</button>
            </div>
          </div>
        </div>
      )}

      {/* Ingredient usage dialog */}
      <IngredientUsageDialog
        open={ingredientDialog.open}
        onClose={() => setIngredientDialog({ open: false, plan: null, ingredients: [] })}
        ingredients={ingredientDialog.ingredients}
        onConfirm={handleConfirmIngredients}
      />
              </div>
            </div>
          ))}
            </>
          )}
        </div>
      </div>
      <div style={{
        flex: 1,
        background: '#fff',
        borderRadius: 12,
        padding: 24,
        boxShadow: '0 2px 8px #0001',
        minWidth: 320
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, gap: 12 }}>
          <h2 style={{ margin: 0, flex: 1 }}>AI Meal Suggestions</h2>
          <select
            value={selectedDiet}
            onChange={e => setSelectedDiet(e.target.value)}
            style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #bbb', color: '#333', background: '#f8fcf7' }}
            title="Filter by diet"
          >
            <option value="">All Diets</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="High Protein Vegetarian">High Protein Vegetarian</option>
            <option value="Non Vegeterian">Non Vegeterian</option>
            <option value="No Onion No Garlic (Sattvic)">No Onion No Garlic (Sattvic)</option>
            <option value="High Protein Non Vegetarian">High Protein Non Vegetarian</option>
            <option value="Diabetic Friendly">Diabetic Friendly</option>
            <option value="Eggetarian">Eggetarian</option>
            <option value="Vegan">Vegan</option>
            <option value="Gluten Free">Gluten Free</option>
            <option value="Sugar Free Diet">Sugar Free Diet</option>
          </select>
          <button style={{
            background: '#19c37d',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '6px 16px',
            cursor: 'pointer'
          }} onClick={fetchSuggestions}>AI Generate</button>
        </div>
        {/* Show only recipe names for Breakfast, Lunch, Dinner */}
        {['Breakfast', 'Lunch', 'Dinner'].map(slot => {
          const s = suggestionByCourse[slot.toLowerCase()];
          // Icon path for each meal slot
          const iconMap = {
            breakfast: '/assets/icons/breakfast.png',
            lunch: '/assets/icons/lunch.png',
            dinner: '/assets/icons/dinner.png',
          };
          const iconSrc = iconMap[slot.toLowerCase()];
          return (
            <div key={slot} style={{
              border: '1px solid #eee',
              borderRadius: 8,
              padding: 16,
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              cursor: s ? 'pointer' : 'not-allowed',
              background: '#f8fcf7',
              opacity: s ? 1 : 0.5,
              minHeight: 72,
            }} onClick={() => s && handleAISuggestionClick(s)}>
              {/* Icon on the left */}
              <img
                src={iconSrc}
                alt={slot + ' icon'}
                style={{ width: 44, height: 44, objectFit: 'contain', marginRight: 8, flexShrink: 0, filter: s ? 'none' : 'grayscale(1)' }}
              />
              {/* Recipe info */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontWeight: 600, color: '#333', fontSize: 17, marginBottom: 2 }}>
                  {s ? s.recipe_title : 'No suggestion'}
                </div>
                <div style={{ fontSize: 13, color: '#888', fontWeight: 500, marginBottom: 2, minHeight: 16 }}>
                  {s && s.course ? s.course : ''}
                </div>
                {/* Ingredient availability */}
                {s && (
                  <div style={{ fontSize: 13, color: '#19c37d', fontWeight: 600 }}>
                    {typeof s.ingredients_available === 'number' && typeof s.ingredients_total === 'number'
                      ? `${s.ingredients_available} / ${s.ingredients_total} ingredients`
                      : ''}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      {/* AI Suggestion Dialog */}
      {aiDialogOpen && selectedAISuggestion && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: '#0008', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              padding: 0,
              minWidth: 340,
              maxWidth: 540,
              boxShadow: '0 2px 12px #0002',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
            tabIndex={0}
            onClick={e => e.stopPropagation()}
          >
            <div style={{
              padding: 32,
              overflowY: 'auto',
              maxHeight: 'calc(90vh - 60px)',
              minHeight: 0,
              flex: 1,
              boxSizing: 'border-box',
            }}>
              <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 12 }}>{selectedAISuggestion.recipe_title}</div>
              <div style={{ color: '#666', fontSize: 15, marginBottom: 8 }}>
                {selectedAISuggestion.course}
                {selectedAISuggestion.diet ? <span> &middot; {selectedAISuggestion.diet}</span> : null}
                {selectedAISuggestion.prep_time ? <span> &middot; {selectedAISuggestion.prep_time}</span> : null}
              </div>
              {selectedAISuggestion.recipe_image && (
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <img
                    src={selectedAISuggestion.recipe_image}
                    alt={selectedAISuggestion.recipe_title}
                    style={{ width: '100%', maxHeight: 400, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                </div>
              )}
              {selectedAISuggestion.description && (
                <div style={{ color: '#888', fontSize: 14, marginBottom: 12 }}>{selectedAISuggestion.description}</div>
              )}
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Ingredients:</div>
              {selectedAISuggestion.ingredients ? (
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  {selectedAISuggestion.ingredients.split('|').filter(i => i.trim()).map((ing, idx) => {
                    const isAvailable = selectedAISuggestion.matched_ingredients?.includes(ing.toLowerCase());
                    const isMissing = selectedAISuggestion.missing_ingredients?.includes(ing.toLowerCase());
                    return (
                      <li key={idx} style={{
                        marginBottom: 4,
                        color: isAvailable ? '#19c37d' : isMissing ? '#d9534f' : '#333',
                        fontWeight: isAvailable ? 600 : isMissing ? 600 : 400
                      }}>
                        {ing}
                        {isAvailable && <span style={{ marginLeft: 8, fontSize: 12, color: '#19c37d' }}>(In Inventory)</span>}
                        {isMissing && <span style={{ marginLeft: 8, fontSize: 12, color: '#d9534f' }}>(Missing)</span>}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div style={{ color: '#888', fontSize: 14, marginBottom: 8 }}>No ingredients found for this recipe.</div>
              )}
              {selectedAISuggestion.instructions && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>Instructions:</div>
                  <ol style={{ margin: 0, paddingLeft: 18 }}>
                    {selectedAISuggestion.instructions.split('|').map((step, idx) => (
                      <li key={idx} style={{ marginBottom: 4 }}>{step.trim()}</li>
                    ))}
                  </ol>
                </div>
              )}
              <div style={{ marginTop: 10, fontSize: 14, color: '#333' }}>
                <b>Ingredients available:</b> {selectedAISuggestion.ingredients_available} / {selectedAISuggestion.ingredients_total}
              </div>
              {selectedAISuggestion.url && (
                <div style={{ marginTop: 10 }}>
                  <a href={selectedAISuggestion.url} target="_blank" rel="noopener noreferrer" style={{ color: '#2196f3', textDecoration: 'underline' }}>
                    View Full Recipe
                  </a>
                </div>
              )}
            </div>
            <div style={{
              padding: '16px 32px',
              borderTop: '1px solid #eee',
              background: '#fafbfc',
              textAlign: 'right',
            }}>
              <button
                style={{ background: '#eee', color: '#333', border: 'none', borderRadius: 6, padding: '8px 24px', fontSize: 16, cursor: 'pointer' }}
                onClick={() => { setAIDialogOpen(false); setSelectedAISuggestion(null); }}
              >Close</button>
            </div>
          </div>
        </div>
      )}
        {!Array.isArray(suggestions) && suggestions && suggestions.error && (
          <div style={{ color: 'red' }}>{suggestions.error}</div>
        )}
      </div>
    </div>
  );
}

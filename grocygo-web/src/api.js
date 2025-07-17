// AI Suggested Recipes API (returns matched/missing ingredients)
export const getSuggestedRecipes = async (ingredients, course = '', diet = '') => {
  // ingredients: array of strings
  const res = await axios.post('https://grocygo.onrender.com/suggest', { ingredients, course, diet });
  // The FastAPI returns an array directly, not { suggestions: [...] }
  return Array.isArray(res.data) ? res.data : [];
};
// Suggestions API
export const getSuggestions = async (q = '') => {
  // No auth required
  return axios.get(`${API_BASE}/inventory/suggestions`, {
    params: { q }
  });
};
import axios from 'axios';
import { auth } from './firebase';

const API_BASE = 'https://grocygo.onrender.com/api';


export const getInventory = async () => {
  const token = await auth.currentUser?.getIdToken();
  return axios.get(`${API_BASE}/inventory`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const addInventory = async (item) => {
  const token = await auth.currentUser?.getIdToken();
  return axios.post(`${API_BASE}/inventory`, item, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const updateInventory = async (id, item) => {
  const token = await auth.currentUser?.getIdToken();
  return axios.put(`${API_BASE}/inventory/${id}`, item, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const deleteInventory = async (id) => {
  const token = await auth.currentUser?.getIdToken();
  return axios.delete(`${API_BASE}/inventory/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Recipes API
export const getRecipes = async () => {
  const token = await auth.currentUser?.getIdToken();
  return axios.get(`${API_BASE}/recipes`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const addRecipe = async (recipe) => {
  const token = await auth.currentUser?.getIdToken();
  // Add course and diet if present
  const payload = { ...recipe };
  if (!payload.course) payload.course = '';
  if (!payload.diet) payload.diet = '';
  const res = await axios.post(`${API_BASE}/recipes`, payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const updateRecipe = async (id, recipe) => {
  const token = await auth.currentUser?.getIdToken();
  return axios.put(`${API_BASE}/recipes/${id}`, recipe, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const deleteRecipe = async (id) => {
  const token = await auth.currentUser?.getIdToken();
  return axios.delete(`${API_BASE}/recipes/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Meal Plans API
export const getMealPlans = async () => {
  const token = await auth.currentUser?.getIdToken();
  return axios.get(`${API_BASE}/meal-plans`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const addMealPlan = async (plan) => {
  const token = await auth.currentUser?.getIdToken();
  return axios.post(`${API_BASE}/meal-plans`, plan, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const updateMealPlan = async (id, plan) => {
  const token = await auth.currentUser?.getIdToken();
  return axios.put(`${API_BASE}/meal-plans/${id}`, plan, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const deleteMealPlan = async (id) => {
  const token = await auth.currentUser?.getIdToken();
  return axios.delete(`${API_BASE}/meal-plans/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Shopping Lists API
export const getShoppingLists = async () => {
  const token = await auth.currentUser?.getIdToken();
  return axios.get(`${API_BASE}/shopping`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const addShoppingList = async (list) => {
  const token = await auth.currentUser?.getIdToken();
  return axios.post(`${API_BASE}/shopping`, list, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const updateShoppingList = async (id, list) => {
  const token = await auth.currentUser?.getIdToken();
  return axios.put(`${API_BASE}/shopping/${id}`, list, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const deleteShoppingList = async (id) => {
  const token = await auth.currentUser?.getIdToken();
  return axios.delete(`${API_BASE}/shopping/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Notifications API
export const getNotifications = async () => {
  const token = await auth.currentUser?.getIdToken();
  return axios.get(`${API_BASE}/notifications`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const addNotification = async (notification) => {
  const token = await auth.currentUser?.getIdToken();
  return axios.post(`${API_BASE}/notifications`, notification, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const markNotificationRead = async (id) => {
  const token = await auth.currentUser?.getIdToken();
  return axios.put(`${API_BASE}/notifications/${id}/read`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const deleteNotification = async (id) => {
  const token = await auth.currentUser?.getIdToken();
  return axios.delete(`${API_BASE}/notifications/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Analytics API
export const getAnalyticsStats = async () => {
  const token = await auth.currentUser?.getIdToken();
  return axios.get(`${API_BASE}/analytics/stats`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export async function useIngredients(usedIngredients) {
  const token = await auth.currentUser.getIdToken();
  return fetch(`${API_BASE}/inventory/use`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ usedIngredients })
  }).then(res => res.json());
}

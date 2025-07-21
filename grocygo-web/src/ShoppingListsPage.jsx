import React, { useEffect, useState, useRef } from 'react';
import { getShoppingLists, addShoppingList, deleteShoppingList } from './api';
import { auth } from './firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Select, MenuItem, FormControl, InputLabel, Box
} from '@mui/material';
import ShoppingSuggestionInput from './ShoppingSuggestionInput';

// Fetch AI shopping suggestions from backend (returns [{item, needed_for: [...]}, ...])
// The backend uses the authenticated user's inventory and recipes; payload is ignored.
async function getShoppingSuggestions() {
  const token = await auth.currentUser?.getIdToken();
  if (!token) return [];
  const res = await fetch('https://grocygo.onrender.com/api/ai/shopping-suggestions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({})
  });
  const data = await res.json();
  // Always return an array for suggestions
  if (Array.isArray(data)) return data;
  if (!data) return [];
  // If backend returns an object (e.g. {error: ...}), return empty array
  return [];
}

const units = ['pcs', 'kg', 'packet', 'box', 'loaf', 'container'];
const categories = ['fruits', 'vegetables', 'namkeen', 'meat & fish', 'dairy', 'pantry'];

export default function ShoppingListsPage() {
  const [lists, setLists] = useState([]);
  const [items, setItems] = useState([
    { name: '', quantity: 1, unit: '', category: '' }
  ]);
  const [user, setUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSmartSuggestions, setShowSmartSuggestions] = useState(true);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(setUser);
    return unsub;
  }, []);

  const [loading, setLoading] = useState(false);
  const firstLoad = useRef(true);

  useEffect(() => {
    if (user && firstLoad.current) {
      fetchLists();
      fetchSuggestions();
      firstLoad.current = false;
    }
  }, [user]);

  const fetchLists = async () => {
    setLoading(true);
    try {
      const res = await getShoppingLists();
      setLists(res.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async () => {
    setSuggestionsLoading(true);
    setSuggestionsError(null);
    try {
      const data = await getShoppingSuggestions();
      setSuggestions(Array.isArray(data) ? data : []);
      setShowSmartSuggestions(true);
    } catch (err) {
      setSuggestionsError('Failed to fetch suggestions. Please try again.');
    } finally {
      setSuggestionsLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    // Add all items in the array
    for (const item of items) {
      if (item.name && item.quantity && item.unit && item.category) {
        await addShoppingList(item);
      }
    }
    setItems([{ name: '', quantity: 1, unit: '', category: '' }]);
    setDialogOpen(false);
    fetchLists();
  };

  const handleDelete = async (id) => {
    await deleteShoppingList(id);
    fetchLists();
  };

  const handleAddFromSuggestion = async (item) => {
    // Accept both {item, needed_for} and {name, ...}
    const name = item.name || item.item || '';
    await addShoppingList({
      name,
      quantity: 1,
      unit: item.unit || '',
      category: item.category || ''
    });
    fetchLists();
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

  // Calculate completed and estimated total (mocked)
  const completed = 0;
  const estimatedTotal = lists.reduce((sum, item) => sum + (item.price || 0), 0);
  return (
    <div>
      <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', background: '#f8fcf7', minHeight: '100vh', padding: 32 }}>
        <div style={{ flex: 2 }}>
          <h1>Shopping Lists</h1>
          <div style={{ color: '#666', marginBottom: 24 }}>Smart shopping lists based on your inventory and meal plans</div>
          <Box sx={{
            background: '#fff', borderRadius: 3, p: 3, boxShadow: '0 2px 8px #0001', mb: 3
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <h2 style={{ margin: 0, flex: 1 }}>Shopping List</h2>
              <span style={{ color: '#888', fontSize: 14 }}>{completed}/{lists.length} completed</span>
              <Button
                variant="outlined"
                sx={{ ml: 2 }}
                onClick={() => setDialogOpen(true)}
              >+ Add</Button>
              <Button
                variant="outlined"
                sx={{ ml: 2 }}
                onClick={fetchLists}
                disabled={loading}
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </Button>
            </Box>
            <div style={{ color: '#888', marginBottom: 8 }}>Estimated total: ${estimatedTotal.toFixed(2)}</div>
            <form onSubmit={e => { e.preventDefault(); setDialogOpen(true); }}>
              <TextField
                fullWidth
                placeholder="Add new item..."
                onFocus={() => setDialogOpen(true)}
                sx={{ mb: 2 }}
                value=""
                InputProps={{
                  endAdornment: (
                    <Button variant="contained" onClick={() => setDialogOpen(true)} sx={{ minWidth: 40, p: 0 }}>+</Button>
                  )
                }}
                inputProps={{ readOnly: true }}
              />
            </form>
            {loading ? (
              <div style={{ color: '#888', textAlign: 'center', margin: '48px 0', fontSize: 18 }}>Loading...</div>
            ) : (
              <>
                {lists.length === 0 ? (
                  <div style={{ color: '#aaa', textAlign: 'center', margin: '48px 0' }}>
                    Your shopping list is empty.<br />Add items using the input above.
                  </div>
                ) : (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {lists.map(list => {
                      // Show the name, and fallback to item if name is missing
                      const displayName = list.name || list.item || '(No name)';
                      return (
                        <li key={list.id} style={{
                          display: 'flex', alignItems: 'center', borderBottom: '1px solid #f0f0f0', padding: '12px 0'
                        }}>
                          <div style={{ flex: 1 }}>
                            <span style={{ fontWeight: 500 }}>{displayName}</span>
                            <span style={{ color: '#888', marginLeft: 8 }}>
                              {list.quantity} {list.unit} {list.category && `| ${list.category}`}
                            </span>
                          </div>
                          <Button
                            variant="text"
                            color="error"
                            onClick={() => handleDelete(list.id)}
                          >Delete</Button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </>
            )}
          </Box>
        </div>
        <div style={{ flex: 1,
          background: '#fff',
          borderRadius: 12,
          padding: 24,
          boxShadow: '0 2px 8px #0001',
          minWidth: 320
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ margin: 0, flex: 1 }}>Smart Suggestions</h2>
            <Button
              variant="contained"
              sx={{ background: '#19c37d', ml: 2 }}
              onClick={fetchSuggestions}
            >Auto Generate</Button>
          </div>
          {suggestionsLoading && (
            <div style={{ color: '#888', textAlign: 'center', margin: '32px 0' }}>Loading suggestions...</div>
          )}
          {suggestionsError && (
            <div style={{ color: 'red', textAlign: 'center', margin: '32px 0' }}>{suggestionsError}</div>
          )}
          {showSmartSuggestions && !suggestionsLoading && !suggestionsError && (
            <>
              {suggestions.length === 0 ? (
                <div style={{ color: '#aaa', textAlign: 'center', margin: '32px 0' }}>
                  No smart suggestions available.
                </div>
              ) : (
                suggestions.map((item, idx) => {
                  // Support both {item, needed_for} and {name, needed_for} for compatibility
                  const displayName = item.name || item.item;
                  const neededFor = Array.isArray(item.needed_for) ? item.needed_for.filter(Boolean).join(', ') : '';
                  if (!displayName) return null;
                  return (
                    <div key={displayName + idx} style={{
                      border: '1px solid #eee',
                      borderRadius: 8,
                      padding: 16,
                      marginBottom: 16,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600 }}>{displayName}</div>
                        {neededFor && (
                          <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>
                            Needed for: {neededFor}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="outlined"
                        sx={{ minWidth: 40, p: 0 }}
                        onClick={() => handleAddFromSuggestion(item)}
                      >+</Button>
                    </div>
                  );
                })
              )}
            </>
          )}
        </div>
      </div>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Add Items</DialogTitle>
        <form onSubmit={handleAdd}>
          <DialogContent>
            {items.map((item, idx) => (
              <Box key={idx} sx={{ mb: 2, border: '1px solid #eee', borderRadius: 2, p: 2, position: 'relative' }}>
                <ShoppingSuggestionInput
                  label="Item Name"
                  value={item.name}
                  onChange={e => setItems(arr => arr.map((it, i) => i === idx ? {
                    ...it,
                    name: e.target.value,
                    category: e.category || it.category
                  } : it))}
                  required
                  sx={{ mb: 1 }}
                />
                <TextField
                  fullWidth
                  label="Quantity"
                  type="number"
                  value={item.quantity}
                  onChange={e => setItems(arr => arr.map((it, i) => i === idx ? { ...it, quantity: e.target.value } : it))}
                  required
                  sx={{ mb: 1 }}
                />
                <FormControl fullWidth required sx={{ mb: 1 }}>
                  <InputLabel>Unit</InputLabel>
                  <Select
                    value={item.unit}
                    label="Unit"
                    onChange={e => setItems(arr => arr.map((it, i) => i === idx ? { ...it, unit: e.target.value } : it))}
                  >
                    {units.map(unit => (
                      <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={item.category}
                    label="Category"
                    onChange={e => setItems(arr => arr.map((it, i) => i === idx ? { ...it, category: e.target.value } : it))}
                  >
                    {categories.map(cat => (
                      <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {items.length > 1 && (
                  <Button
                    size="small"
                    color="error"
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                    onClick={() => setItems(arr => arr.filter((_, i) => i !== idx))}
                  >Remove</Button>
                )}
              </Box>
            ))}
            <Button
              variant="outlined"
              onClick={() => setItems(arr => [...arr, { name: '', quantity: 1, unit: '', category: '' }])}
              sx={{ mb: 2 }}
              fullWidth
            >+ Add Another Item</Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setDialogOpen(false);
              setItems([{ name: '', quantity: 1, unit: '', category: '' }]);
            }}>Cancel</Button>
            <Button type="submit" variant="contained">Add All</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

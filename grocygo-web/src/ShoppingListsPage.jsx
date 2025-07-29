import React, { useEffect, useState, useRef } from 'react';
import { getShoppingLists, addShoppingList, updateShoppingList, deleteShoppingList } from './api';
import { auth } from './firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Select, MenuItem, FormControl, InputLabel, Box
} from '@mui/material';
import ShoppingSuggestionInput from './ShoppingSuggestionInput';

// Fetch smart shopping suggestions from backend (returns [{item, needed_for: [...]}, ...])
// Uses GET /api/shopping/suggestions, which uses the user's inventory and recipes
async function getShoppingSuggestions() {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("User not authenticated");
  const res = await fetch('https://grocygo.onrender.com/api/shopping/suggestions', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'x-api-key': process.env.REACT_APP_API_KEY
    }
  });
  const data = await res.json();
  if (Array.isArray(data)) return data;
  if (data && data.error) throw new Error(data.error);
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
  const [suggestionPrompt, setSuggestionPrompt] = useState("");

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

  const [rawSuggestions, setRawSuggestions] = useState(null);
  const [showRaw, setShowRaw] = useState(false);
  const fetchSuggestions = async () => {
    setSuggestionsLoading(true);
    setSuggestionsError(null);
    setRawSuggestions(null);
    try {
      const data = await getShoppingSuggestions();
      setSuggestions(Array.isArray(data) ? data : []);
      setRawSuggestions(data);
      setShowSmartSuggestions(true);
      // Log backend response for debugging
      console.log('AI Shopping Suggestions backend response:', data);
    } catch (err) {
      setSuggestionsError(err.message || 'Failed to fetch suggestions. Please try again.');
      setSuggestions([]);
    } finally {
      setSuggestionsLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    let updatedLists = [...lists];
    for (const item of items) {
      if (item.name && item.quantity && item.unit && item.category) {
        const key = `${item.name.trim().toLowerCase()}|${item.unit}|${item.category}`;
        const existing = updatedLists.find(
          l => `${(l.name || l.item || '').trim().toLowerCase()}|${l.unit}|${l.category}` === key
        );
        if (existing) {
          const updated = {
            ...existing,
            quantity: Number(existing.quantity || 1) + Number(item.quantity)
          };
          await updateShoppingList(existing.id, updated);
          updatedLists = updatedLists.map(l => l.id === existing.id ? updated : l);
        } else {
          const res = await addShoppingList({ ...item, quantity: Number(item.quantity) });
          updatedLists.push(res.data || { ...item, quantity: Number(item.quantity) });
        }
      }
    }
    setLists(updatedLists);
    setItems([{ name: '', quantity: 1, unit: '', category: '' }]);
    setDialogOpen(false);
    // Only fetchLists on dialog close, not after every add
  };

  const handleDelete = async (id) => {
    await deleteShoppingList(id);
    setLists(lists => lists.filter(l => l.id !== id));
  };

  const handleAddFromSuggestion = async (item) => {
    // Accept both {item, needed_for} and {name, ...}
    const name = item.name || item.item || '';
    const unit = item.unit || '';
    const category = item.category || '';
    const key = `${name.trim().toLowerCase()}|${unit}|${category}`;
    const existing = lists.find(
      l => `${(l.name || l.item || '').trim().toLowerCase()}|${l.unit}|${l.category}` === key
    );
    let updatedLists = [...lists];
    if (existing) {
      const updated = {
        ...existing,
        quantity: Number(existing.quantity || 1) + 1
      };
      await updateShoppingList(existing.id, updated);
      updatedLists = updatedLists.map(l => l.id === existing.id ? updated : l);
    } else {
      const res = await addShoppingList({
        name,
        quantity: 1,
        unit,
        category
      });
      updatedLists.push(res.data || { name, quantity: 1, unit, category });
    }
    setLists(updatedLists);
    // No fetchLists here
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
                    {Object.values(lists.reduce((acc, list) => {
                      const name = list.name || list.item || '(No name)';
                      const unit = list.unit || '';
                      const category = list.category || '';
                      const key = `${name.toLowerCase()}|${unit}|${category}`;
                      if (!acc[key]) {
                        acc[key] = { ...list, name, quantity: Number(list.quantity) || 1 };
                      } else {
                        acc[key].quantity += Number(list.quantity) || 1;
                      }
                      return acc;
                    }, {})).map(list => (
                      <li key={list.name + '|' + list.unit + '|' + list.category} style={{
                        display: 'flex', alignItems: 'center', borderBottom: '1px solid #f0f0f0', padding: '12px 0'
                      }}>
                        <div style={{ flex: 1 }}>
                          <span style={{ fontWeight: 500 }}>{list.name}</span>
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
                    ))}
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
          </div>
          <Button
            variant="contained"
            sx={{ background: '#19c37d', width: '100%', mb: 2 }}
            onClick={fetchSuggestions}
            disabled={suggestionsLoading}
          >{suggestionsLoading ? 'Generating...' : 'Auto Generate'}</Button>
          {suggestionsError && (
            <div style={{ color: 'red', textAlign: 'center', margin: '16px 0' }}>{suggestionsError}</div>
          )}
          {(!suggestionsLoading && suggestions.length === 0 && !suggestionsError) && (
            <div style={{ color: '#aaa', textAlign: 'center', margin: '32px 0' }}>
              No smart suggestions available.<br />
              <span style={{ color: '#888', fontSize: 13 }}>
                This may happen if your inventory and meal plans are empty, or the AI could not generate suggestions for your data.<br />
                Try adding items to your inventory or meal plans, or adjust your prompt above.<br />
              </span>
              <Button variant="outlined" sx={{ mt: 2, mr: 2 }} onClick={() => fetchSuggestions(suggestionPrompt)}>
                Regenerate Suggestions
              </Button>
              {rawSuggestions !== null && (
                <Button variant="text" sx={{ mt: 2 }} onClick={() => setShowRaw(v => !v)}>
                  {showRaw ? 'Hide' : 'Show'} Debug Info
                </Button>
              )}
              {showRaw && rawSuggestions !== null && (
                <pre style={{ textAlign: 'left', marginTop: 12, background: '#f6f6f6', padding: 8, borderRadius: 4, fontSize: 12, maxHeight: 200, overflow: 'auto' }}>
                  {JSON.stringify(rawSuggestions, null, 2)}
                </pre>
              )}
            </div>
          )}
          {suggestionsLoading && (
            <div style={{ color: '#888', textAlign: 'center', margin: '32px 0' }}>Loading suggestions...</div>
          )}
          {suggestions.length > 0 && !suggestionsLoading && (
            <>
              {suggestions.map((item, idx) => {
                const displayName = item.name || item.item;
                // Deduplicate and limit needed_for list for readability
                let neededFor = Array.isArray(item.needed_for)
                  ? Array.from(new Set(item.needed_for.filter(Boolean)))
                  : [];
                const neededForDisplay = neededFor.length > 0
                  ? neededFor.slice(0, 3).join(', ') + (neededFor.length > 3 ? `, +${neededFor.length - 3} more` : '')
                  : '';
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
                      {neededForDisplay && (
                        <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>
                          Needed for: {neededForDisplay}
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
              })}
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

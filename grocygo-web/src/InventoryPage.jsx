import React, { useEffect, useState, useRef } from 'react';
import SuggestionInput from './SuggestionInput';
import { getInventory, addInventory, deleteInventory } from './api';
import { auth } from './firebase';
import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import {
  Card, CardContent, Typography, Grid, IconButton, Box,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Select, MenuItem, FormControl,
  InputLabel, InputAdornment, Tooltip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import DeleteIcon from '@mui/icons-material/Delete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ScanIcon from '@mui/icons-material/QrCodeScanner';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import { useNavigate } from 'react-router-dom';
import { Player } from '@lottiefiles/react-lottie-player';

const COLORS = ['#4caf50', '#ff9800', '#2196f3', '#f44336', '#9c27b0', '#ffeb3b'];
const units = ['pieces', 'kg', 'bag', 'packet', 'box', 'containers', 'lbs', 'loaf'];
const locations = ['Counter', 'Fridge', 'Freezer', 'Pantry'];
const categories = ['fruits', 'vegetables', 'namkeen', 'meat & fish', 'dairy', 'pantry'];

export default function InventoryPage() {
  const [items, setItems] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({
    name: '',
    quantity: 1,
    unit: '',
    location: '',
    expiryDate: null,
    category: ''
  });
  const [user, setUser] = useState(null);
  const [isSignup, setIsSignup] = useState(false); // <-- move this here
  const [snackbar, setSnackbar] = useState(null);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {
      setUser(u);
      if (u) {
        await fetchItems();
      }
    });
    return unsub;
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await getInventory();
      setItems(res.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      // Display user-friendly error message
      setSnackbar({
        open: true,
        message: 'Failed to load inventory. Please try again later.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await addInventory({
        ...form,
        expiryDate: form.expiryDate?.toISOString(),
        createdAt: new Date().toISOString()
      });
      setDialogOpen(false);
      setForm({ name: '', quantity: 1, unit: '', location: '', expiryDate: null, category: '' });
      fetchItems();
    } catch (err) {
      console.error('Error adding item:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteInventory(id);
      fetchItems();
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  const getExpiryStatus = (date) => {
    if (!date) return null;
    const expiryDate = new Date(date);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return { text: 'Expired', color: '#ef5350' };
    if (daysUntilExpiry === 0) return { text: 'Expires Today', color: '#ef5350' };
    if (daysUntilExpiry <= 3) return { text: `Expires in ${daysUntilExpiry} days`, color: '#ff9800' };
    return { text: `Expires in ${daysUntilExpiry} days`, color: '#4caf50' };
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    let email, password, name;
    return (
      <form
        onSubmit={async e => {
          e.preventDefault();
          if (isSignup) {
            await createUserWithEmailAndPassword(auth, email.value, password.value);
            if (name && name.value) {
              await auth.currentUser.updateProfile({ displayName: name.value });
            }
          } else {
            await signInWithEmailAndPassword(auth, email.value, password.value);
          }
        }}
        style={{ maxWidth: 320, margin: '40px auto' }}
      >
        {isSignup && (
          <TextField label="Name" inputRef={el => name = el} fullWidth margin="normal" />
        )}
        <TextField label="Email" inputRef={el => email = el} fullWidth margin="normal" />
        <TextField label="Password" type="password" inputRef={el => password = el} fullWidth margin="normal" />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          {isSignup ? 'Sign Up' : 'Login'}
        </Button>
        <Button
          onClick={e => { e.preventDefault(); setIsSignup(s => !s); }}
          color="secondary"
          fullWidth
          sx={{ mt: 1 }}
        >
          {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
        </Button>
      </form>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>Inventory</Typography>
        <Button onClick={() => navigate('/recipes')} sx={{ mr: 1 }} variant="outlined">
          Suggested Recipes
        </Button>
        <Button startIcon={<ScanIcon />} sx={{ mr: 1 }}>Scan</Button>
        <Button startIcon={<KeyboardVoiceIcon />} sx={{ mr: 1 }}>Voice</Button>
        <Button 
          startIcon={<AddIcon />}
          variant="contained"
          color="primary"
          onClick={() => setDialogOpen(true)}
        >
          Add Item
        </Button>
        <Button
          variant="outlined"
          sx={{ ml: 2 }}
          onClick={fetchItems}
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </Box>
      
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        Manage your kitchen items and track expiry dates
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Excel-like Table */}
      <Box sx={{ width: '100%', overflowX: 'auto', mb: 4 }}>
        <Box
          component="table"
          sx={{
            width: '100%',
            borderCollapse: 'collapse',
            minWidth: 600,
            background: '#fff',
            boxShadow: 1,
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <Box component="thead" sx={{ background: '#f5f5f5' }}>
            <Box component="tr">
              <Box component="th" sx={{ px: 2, py: 1, borderBottom: '1px solid #ddd', fontWeight: 700, textAlign: 'left' }}>Name</Box>
              <Box component="th" sx={{ px: 2, py: 1, borderBottom: '1px solid #ddd', fontWeight: 700, textAlign: 'left' }}>Quantity</Box>
              <Box component="th" sx={{ px: 2, py: 1, borderBottom: '1px solid #ddd', fontWeight: 700, textAlign: 'left' }}>Unit</Box>
              <Box component="th" sx={{ px: 2, py: 1, borderBottom: '1px solid #ddd', fontWeight: 700, textAlign: 'left' }}>Location</Box>
              <Box component="th" sx={{ px: 2, py: 1, borderBottom: '1px solid #ddd', fontWeight: 700, textAlign: 'left' }}>Expiry</Box>
              <Box component="th" sx={{ px: 2, py: 1, borderBottom: '1px solid #ddd', fontWeight: 700, textAlign: 'center' }}>Action</Box>
            </Box>
          </Box>
          <Box component="tbody">
            {loading ? (
              <Box component="tr">
                <Box component="td" colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                  {/* Lottie animation for loading */}
                  <Player
                    autoplay
                    loop
                    src="/loading/GlowLoading.json" // <-- use JSON file, not .lottie
                    style={{ height: 120, width: 120, margin: '0 auto' }}
                  />
                </Box>
              </Box>
            ) : (
              filteredItems.map(item => (
                <Box component="tr" key={item.id} sx={{ borderBottom: '1px solid #eee', '&:hover': { background: '#fafafa' } }}>
                  <Box component="td" sx={{ px: 2, py: 1 }}>{item.name}</Box>
                  <Box component="td" sx={{ px: 2, py: 1 }}>{item.quantity}</Box>
                  <Box component="td" sx={{ px: 2, py: 1 }}>{item.unit}</Box>
                  <Box component="td" sx={{ px: 2, py: 1 }}>{item.location}</Box>
                  <Box component="td" sx={{ px: 2, py: 1 }}>
                    {item.expiryDate && (
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: getExpiryStatus(item.expiryDate).color,
                          bgcolor: `${getExpiryStatus(item.expiryDate).color}22`,
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          display: 'inline-block'
                        }}
                      >
                        {getExpiryStatus(item.expiryDate).text}
                      </Typography>
                    )}
                  </Box>
                  <Box component="td" sx={{ px: 2, py: 1, textAlign: 'center' }}>
                    <IconButton onClick={() => handleDelete(item.id)} size="small">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              ))
            )}
          </Box>
        </Box>
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Item</DialogTitle>
        <form onSubmit={handleAdd}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <SuggestionInput
                  label="Name"
                  value={form.name}
                  onChange={e => {
                    setForm(f => ({
                      ...f,
                      name: e.target.value,
                      // If suggestion includes category, auto-fill it
                      category: e.category || f.category
                    }));
                  }}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Quantity"
                  type="number"
                  value={form.quantity}
                  onChange={(e) => setForm(f => ({ ...f, quantity: e.target.value }))}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth required>
                  <InputLabel>Unit</InputLabel>
                  <Select
                    value={form.unit}
                    label="Unit"
                    onChange={(e) => setForm(f => ({ ...f, unit: e.target.value }))}
                  >
                    {units.map(unit => (
                      <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Location</InputLabel>
                  <Select
                    value={form.location}
                    label="Location"
                    onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))}
                  >
                    {locations.map(loc => (
                      <MenuItem key={loc} value={loc}>{loc}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={form.category}
                    label="Category"
                    onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}
                  >
                    {categories.map(cat => (
                      <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Expiry Date"
                    value={form.expiryDate}
                    onChange={(date) => setForm(f => ({ ...f, expiryDate: date }))}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">Add Item</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

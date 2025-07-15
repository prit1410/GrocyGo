import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid } from '@mui/material';


// ingredients: array of strings or objects (from CSV: "Tortillas|Extra Virgin Olive Oil|Garlic|Mozzarella cheese|...")
// Accepts both [{name, quantity, unit}] or ["Tortillas", ...]

export default function IngredientUsageDialog({ open, onClose, ingredients, onConfirm }) {
  // Normalize input: if string, convert to {name, usedUnit: ''}
  const initialRows = (ingredients || []).map(i => {
    if (typeof i === 'string') {
      return { name: i, usedUnit: '' };
    }
    return {
      name: i.name || i.ingredient || '',
      usedUnit: i.usedUnit || ''
    };
  });
  const [rows, setRows] = useState(initialRows);

  // Reset rows if dialog is reopened with different ingredients
  React.useEffect(() => {
    setRows(initialRows);
    // eslint-disable-next-line
  }, [open, ingredients && ingredients.join ? ingredients.join(',') : '']);

  const handleChange = (idx, value) => {
    setRows(rows => rows.map((row, i) => i === idx ? { ...row, usedUnit: value } : row));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Ingredient Usage</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {rows.map((row, idx) => (
            <React.Fragment key={row.name}>
              <Grid item xs={7}>
                <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                  <span style={{ fontWeight: 500 }}>{row.name}</span>
                </div>
              </Grid>
              <Grid item xs={5}>
                <TextField
                  value={row.usedUnit}
                  label="Used (unit/qty)"
                  fullWidth
                  placeholder="e.g. 2 pieces, 100g, 1 cup"
                  onChange={e => handleChange(idx, e.target.value)}
                />
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => onConfirm(rows)} variant="contained" color="primary">Confirm</Button>
      </DialogActions>
    </Dialog>
  );
}
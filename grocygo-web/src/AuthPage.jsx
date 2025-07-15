import React, { useState } from 'react';
import { auth } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Box, Typography, TextField, Button, Paper, Tabs, Tab } from '@mui/material';

export default function AuthPage({ onAuth }) {
  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async e => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onAuth();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSignup = async e => {
    e.preventDefault();
    setError('');
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      if (name) await updateProfile(userCred.user, { displayName: name });
      onAuth();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Paper sx={{ p: 4, borderRadius: 4, boxShadow: 6 }}>
        <Typography variant="h4" align="center" sx={{ mb: 2, fontWeight: 700 }}>Welcome to GrocyGo</Typography>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} centered sx={{ mb: 2 }}>
          <Tab label="Login" />
          <Tab label="Sign Up" />
        </Tabs>
        {tab === 0 ? (
          <form onSubmit={handleLogin}>
            <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} fullWidth margin="normal" required />
            <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} fullWidth margin="normal" required />
            {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Login</Button>
          </form>
        ) : (
          <form onSubmit={handleSignup}>
            <TextField label="Name" value={name} onChange={e => setName(e.target.value)} fullWidth margin="normal" required />
            <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} fullWidth margin="normal" required />
            <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} fullWidth margin="normal" required />
            {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
            <Button type="submit" variant="contained" color="secondary" fullWidth sx={{ mt: 2 }}>Sign Up</Button>
          </form>
        )}
      </Paper>
    </Box>
  );
}

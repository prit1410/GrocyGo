
import React, { useEffect, useState } from 'react';
import { getNotifications, markNotificationRead, deleteNotification } from './api';
import { auth } from './firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import NotificationsIcon from '@mui/icons-material/Notifications';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { Badge, Card, CardContent, Typography, IconButton, Box, Button, Snackbar, Alert, Chip } from '@mui/material';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(setUser);
    return unsub;
  }, []);

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user]);

  const fetchNotifications = async () => {
    const res = await getNotifications();
    setNotifications(Array.isArray(res.data) ? res.data : []);
  };


  const handleMarkRead = async (id) => {
    await markNotificationRead(id);
    setSnackbar({ open: true, message: 'Marked as read', severity: 'info' });
    fetchNotifications();
  };

  const handleDelete = async (id) => {
    await deleteNotification(id);
    setSnackbar({ open: true, message: 'Notification deleted', severity: 'warning' });
    fetchNotifications();
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

  // Icon and color by notification type
  const typeIcon = {
    expiring: <WarningAmberIcon color="warning" />,
    expired: <WarningAmberIcon color="error" />,
    'meal-used': <FastfoodIcon color="primary" />,
    'meal-completed': <CheckCircleIcon color="success" />,
    default: <NotificationsIcon color="info" />,
  };
  const typeColor = {
    expiring: '#ff9800',
    expired: '#ef5350',
    'meal-used': '#2196f3',
    'meal-completed': '#4caf50',
    default: '#607d8b',
  };
  const typeLabel = {
    expiring: 'Expiring',
    expired: 'Expired',
    'meal-used': 'Meal Used',
    'meal-completed': 'Meal Completed',
    default: 'General',
  };

  // Group notifications by type
  const grouped = notifications.reduce((acc, n) => {
    const t = n.type || 'default';
    if (!acc[t]) acc[t] = [];
    acc[t].push(n);
    return acc;
  }, {});
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton color="primary">
          {unreadCount > 0 ? (
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          ) : (
            <NotificationsIcon />
          )}
        </IconButton>
        <Typography variant="h5" sx={{ flex: 1, fontWeight: 700, ml: 1 }}>Notifications</Typography>
        <Button onClick={() => signOut(auth)} color="secondary" variant="outlined">Logout</Button>
      </Box>
      {Object.keys(grouped).map(type => (
        <Box key={type} sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: typeColor[type] || typeColor.default, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            {typeIcon[type] || typeIcon.default} {typeLabel[type] || typeLabel.default}
          </Typography>
          {grouped[type].map(n => (
            <Card key={n.id} sx={{ mb: 1, opacity: n.read ? 0.5 : 1, borderLeft: `6px solid ${typeColor[type] || typeColor.default}`, cursor: n.read ? 'default' : 'pointer' }}
              onClick={() => !n.read && handleMarkRead(n.id)}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {typeIcon[type] || typeIcon.default}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{n.title}</Typography>
                  <Typography variant="body2" sx={{ color: '#555' }}>{n.message}</Typography>
                  <Chip label={typeLabel[type] || typeLabel.default} size="small" sx={{ mt: 0.5, background: typeColor[type] || typeColor.default, color: '#fff' }} />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button onClick={e => { e.stopPropagation(); handleDelete(n.id); }} size="small" color="error" variant="outlined">Delete</Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      ))}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
        <Alert onClose={() => setSnackbar(s => ({ ...s, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

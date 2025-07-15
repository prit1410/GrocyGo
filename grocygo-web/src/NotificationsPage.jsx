import React, { useEffect, useState } from 'react';
import { getNotifications, addNotification, markNotificationRead, deleteNotification } from './api';
import { auth } from './firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [form, setForm] = useState({ title: '', message: '' });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(setUser);
    return unsub;
  }, []);

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user]);

  const fetchNotifications = async () => {
    const res = await getNotifications();
    setNotifications(res.data);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    await addNotification(form);
    setForm({ title: '', message: '' });
    fetchNotifications();
  };

  const handleMarkRead = async (id) => {
    await markNotificationRead(id);
    fetchNotifications();
  };

  const handleDelete = async (id) => {
    await deleteNotification(id);
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

  return (
    <div>
      <button onClick={() => signOut(auth)}>Logout</button>
      <h2>Notifications</h2>
      <form onSubmit={handleAdd}>
        <input placeholder="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
        <input placeholder="Message" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
        <button type="submit">Add</button>
      </form>
      <ul>
        {notifications.map(n => (
          <li key={n.id} style={{ opacity: n.read ? 0.5 : 1 }}>
            {n.title}: {n.message}
            <button onClick={() => handleMarkRead(n.id)} disabled={n.read}>Mark Read</button>
            <button onClick={() => handleDelete(n.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

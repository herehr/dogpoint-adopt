// src/components/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, TextField, Paper } from '@mui/material';

function AdminDashboard() {
  const [moderators, setModerators] = useState([]);
  const [newModerator, setNewModerator] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
  });

  // Moderatoren abrufen
  const fetchModerators = async () => {
    try {
      const token = localStorage.getItem('token'); // Token aus dem Login
      const response = await fetch('http://localhost:3000/admin/moderators', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setModerators(data.moderators);
      } else {
        alert(data.error || 'Fehler beim Abrufen der Moderatoren');
      }
    } catch (error) {
      console.error('Error fetching moderators:', error);
    }
  };

  useEffect(() => {
    fetchModerators();
  }, []);

  // Neuen Moderator registrieren
  const handleCreateModerator = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/auth/register-moderator', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newModerator)
      });
      const data = await response.json();
      if (response.ok) {
        alert('Moderator erfolgreich registriert. Eine E-Mail mit der Zugangs-URL wurde versendet.');
        setNewModerator({ username: '', email: '', phone: '', password: '' });
        fetchModerators();
      } else {
        alert(data.error || 'Fehler bei der Registrierung');
      }
    } catch (error) {
      console.error('Error registering moderator:', error);
      alert('Fehler bei der Registrierung');
    }
  };

  // Moderator deaktivieren
  const handleDeactivate = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/admin/moderators/${id}/deactivate`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        alert('Moderator deaktiviert');
        fetchModerators();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error deactivating moderator:', error);
    }
  };

  // Moderator aktivieren
  const handleActivate = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/admin/moderators/${id}/activate`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        alert('Moderator aktiviert');
        fetchModerators();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error activating moderator:', error);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Admin Dashboard
      </Typography>

      {/* Moderator registrieren */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h5">Neuen Moderator registrieren</Typography>
        <Box
          component="form"
          onSubmit={handleCreateModerator}
          sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            label="Username"
            value={newModerator.username}
            onChange={(e) => setNewModerator({ ...newModerator, username: e.target.value })}
            required
          />
          <TextField
            label="Email"
            value={newModerator.email}
            onChange={(e) => setNewModerator({ ...newModerator, email: e.target.value })}
            required
          />
          <TextField
            label="Phone"
            value={newModerator.phone}
            onChange={(e) => setNewModerator({ ...newModerator, phone: e.target.value })}
            required
          />
          <TextField
            label="Password"
            type="password"
            value={newModerator.password}
            onChange={(e) => setNewModerator({ ...newModerator, password: e.target.value })}
            required
          />
          <Button variant="contained" type="submit">
            Moderator registrieren
          </Button>
        </Box>
      </Paper>

      {/* Moderatoren verwalten */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h5">Moderatoren verwalten</Typography>
        {moderators.length === 0 ? (
          <Typography variant="body1">Keine Moderatoren vorhanden.</Typography>
        ) : (
          moderators.map((mod) => (
            <Box
              key={mod.id}
              sx={{
                borderBottom: '1px solid #ccc',
                py: 1,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Box>
                <Typography variant="subtitle1">{mod.username}</Typography>
                <Typography variant="body2">{mod.email}</Typography>
                <Typography variant="body2">{mod.phone}</Typography>
                <Typography variant="body2">
                  Status: {mod.active ? 'Aktiv' : 'Deaktiviert'}
                </Typography>
              </Box>
              <Box>
                {mod.active ? (
                  <Button variant="outlined" color="error" onClick={() => handleDeactivate(mod.id)}>
                    Deaktivieren
                  </Button>
                ) : (
                  <Button variant="outlined" onClick={() => handleActivate(mod.id)}>
                    Aktivieren
                  </Button>
                )}
              </Box>
            </Box>
          ))
        )}
      </Paper>
    </Container>
  );
}

export default AdminDashboard;

// src/components/Registration.jsx
import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Registration() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('adopter'); // Default-Rolle, z. B. "adopter"
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Registrierung fehlgeschlagen');
      } else {
        // Bei erfolgreicher Registrierung könntest du auf die Login-Seite weiterleiten
        console.log('Registrierung erfolgreich:', data);
        navigate('/login');
      }
    } catch (err) {
      console.error(err);
      setError('Ein Fehler ist aufgetreten.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Registrierung
      </Typography>
      {error && (
        <Typography color="error" align="center">
          {error}
        </Typography>
      )}
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Benutzername"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <TextField
          label="Passwort"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <TextField
          label="Rolle (z.B. adopter, moderator, admin)"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        />
        <Button variant="contained" type="submit">
          Registrieren
        </Button>
      </Box>
    </Container>
  );
}

export default Registration;

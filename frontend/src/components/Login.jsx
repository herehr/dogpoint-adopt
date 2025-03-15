// src/components/Login.jsx
import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ADMIN'); // Standardwert kann ADMIN oder MODERATOR sein
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        setError(responseData.error || 'Přihlášení selhalo.');
      } else {
        localStorage.setItem('token', responseData.token);
        if (responseData.user.role === 'ADMIN') {
          navigate('/admin');
        } else if (responseData.user.role === 'MODERATOR') {
          navigate('/moderator');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      console.error(err);
      setError('Došlo k chybě.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Přihlášení
      </Typography>
      {error && (
        <Typography color="error" align="center">
          {error}
        </Typography>
      )}
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Uživatelské jméno"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <TextField
          label="Heslo"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <FormControl required>
          <InputLabel id="role-select-label">Role</InputLabel>
          <Select
            labelId="role-select-label"
            id="role-select"
            value={role}
            label="Role"
            onChange={(e) => setRole(e.target.value)}
          >
            <MenuItem value="ADMIN">ADMIN</MenuItem>
            <MenuItem value="MODERATOR">MODERATOR</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" type="submit">
          Přihlásit se
        </Button>
      </Box>
    </Container>
  );
}

export default Login;

// backend/server.js
const express = require('express');
const helmet = require('helmet');
const app = express();
const PORT = process.env.PORT || 3000;

// Sicherheit: Helmet Middleware
app.use(helmet());

// Middleware zum Parsen von JSON-Daten
app.use(express.json());

// Basis-Route: Root-Pfad
app.get('/', (req, res) => {
  res.send('Hello from dogpoint-adopt Backend!');
});

// Tiere-Routen einbinden
const animalsRoutes = require('./routes/animals');
app.use('/animals', animalsRoutes);

// Adoptions-Routen einbinden
const adoptionsRoutes = require('./routes/adoptions/adoptions');
app.use('/adoptions', adoptionsRoutes);

// Benutzer-Routen einbinden
const usersRoutes = require('./routes/users');
app.use('/users', usersRoutes);

// Fehlerbehandlungs-Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Ein interner Serverfehler ist aufgetreten.' });
});

// Server starten
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});

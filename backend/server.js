// backend/server.js
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Allow requests from http://localhost:5173
app.use(cors({
  origin: 'http://localhost:5173'
}));

// Serve static files from "uploads" folder
app.use('/uploads', express.static('uploads'));

// Security: Helmet middleware
app.use(helmet());

// Parse JSON bodies
app.use(express.json());

// =============================
// =  ROUTES
// =============================

// Upload routes (for uploading new animals, etc.)
const uploadRoutes = require('./routes/upload');
app.use('/upload', uploadRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('Hello from dogpoint-adopt Backend!');
});

// Admin routes (for managing moderators, etc.)
const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);

// Animal routes (GET/PUT animals, POST animal posts, etc.)
const animalsRoutes = require('./routes/animals');
app.use('/animals', animalsRoutes);

// Adoption routes
const adoptionsRoutes = require('./routes/adoptions/adoptions');
app.use('/adoptions', adoptionsRoutes);

// User routes
const usersRoutes = require('./routes/users');
app.use('/users', usersRoutes);

// Auth routes (login, register, etc.)
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// =============================
// =  ERROR HANDLING
// =============================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Ein interner Serverfehler ist aufgetreten.' });
});

// =============================
// =  START THE SERVER
// =============================
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
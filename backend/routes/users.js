// backend/routes/users.js
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// POST /users – Neuen Benutzer erstellen
router.post('/', usersController.createUser);

// GET /users – Alle Benutzer abrufen (optional)
router.get('/', usersController.getAllUsers);

module.exports = router;

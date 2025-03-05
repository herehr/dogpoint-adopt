// backend/routes/adoptions/adoptions.js
const express = require('express');
const router = express.Router();
const adoptionsController = require('../../controllers/adoptionsController');

// POST /adoptions – Neue Adoptionsanfrage erstellen
router.post('/', adoptionsController.createAdoption);

// GET /adoptions – Alle Adoptionsanfragen abrufen
router.get('/', adoptionsController.getAllAdoptions);

module.exports = router;


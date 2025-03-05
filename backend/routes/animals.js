// backend/routes/animals.js
const express = require('express');
const router = express.Router();
const animalsController = require('../controllers/animalsController');

// GET /animals - alle Tiere abrufen
router.get('/', animalsController.getAllAnimals);

// GET /animals/:id - einzelnes Tier anhand der ID abrufen
router.get('/:id', animalsController.getAnimalById);

// POST /animals - neues Tier erstellen
router.post('/', animalsController.createAnimal);

// PUT /animals/:id - bestehendes Tier aktualisieren
router.put('/:id', animalsController.updateAnimal);

// DELETE /animals/:id - Tier löschen
router.delete('/:id', animalsController.deleteAnimal);

module.exports = router;

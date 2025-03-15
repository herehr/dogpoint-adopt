// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController'); // für checkAdmin

// Alle Routen in diesem Router erfordern, dass der ursprüngliche Admin angemeldet ist
router.use(authController.checkAdmin);

// Alle Moderatoren abrufen
router.get('/moderators', adminController.getModerators);

// Moderator deaktivieren
router.put('/moderators/:id/deactivate', adminController.deactivateModerator);

// Moderator aktivieren (optional)
router.put('/moderators/:id/activate', adminController.activateModerator);

module.exports = router;

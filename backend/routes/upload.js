// backend/routes/upload.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadController = require('../controllers/uploadController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Stelle sicher, dass der Ordner "uploads" existiert
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Endpoint zum Anlegen eines neuen Tieres
router.post(
  '/newAnimal',
  upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'video', maxCount: 1 }
  ]),
  uploadController.newAnimal
);

// Optional: weiterer Endpoint für Beiträge
router.post(
  '/upload',
  upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'video', maxCount: 1 }
  ]),
  uploadController.uploadFiles
);

// backend/controllers/uploadController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.newAnimal = async (req, res) => {
  try {
    const { name, age, description, species } = req.body;
    const { images, video } = req.files || {};

    // Extrahiere Dateipfade aus den hochgeladenen Dateien
    const imagePaths = images ? images.map(img => img.path) : [];
    const videoPath = video && video.length > 0 ? video[0].path : null;

    // Erstelle einen neuen Tier-Eintrag in der Datenbank
    const newAnimal = await prisma.animal.create({
      data: {
        name,
        species,
        age: parseInt(age, 10),
        description,
        imagePaths,
        videoPath,
        active: true,
      },
    });

    res.status(201).json({
      message: 'Neues Tier angelegt',
      animal: newAnimal,
    });
  } catch (error) {
    console.error('Fehler beim Speichern des Tieres:', error);
    res.status(500).json({ error: 'Fehler beim Anlegen des Tieres' });
  }
};


module.exports = router;

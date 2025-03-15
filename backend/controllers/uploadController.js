// backend/controllers/uploadController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.newAnimal = async (req, res) => {
  try {
    // Erwartete Felder aus dem Request-Body
    const { name, age, description, species } = req.body;
    // Dateien aus req.files (Multer speichert sie als Array)
    const { images, video } = req.files || {};

    // Extrahiere Dateipfade
    const imagePaths = images ? images.map(img => img.path) : [];
    const videoPath = video && video.length > 0 ? video[0].path : null;

    // Falls species nicht übergeben wird, verwende einen Standardwert
    const animalSpecies = species || 'Unknown';

    // Erstelle einen neuen Tier-Eintrag in der Datenbank
    const newAnimal = await prisma.animal.create({
      data: {
        name,
        species: animalSpecies,
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

exports.uploadFiles = (req, res) => {
  // Dieser Endpunkt kann für Beiträge/Posts verwendet werden
  res.status(200).json({
    message: 'Files uploaded successfully',
    files: req.files,
  });
};

// backend/controllers/animalsController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Alle Tiere abrufen
exports.getAllAnimals = async (req, res) => {
  try {
    const animals = await prisma.animal.findMany();
    res.json(animals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Tiere' });
  }
};

// Einzelnes Tier anhand der ID abrufen
exports.getAnimalById = async (req, res) => {
  const { id } = req.params;
  try {
    const animal = await prisma.animal.findUnique({
      where: { id: parseInt(id, 10) },
    });
    if (!animal) {
      return res.status(404).json({ error: 'Tier nicht gefunden' });
    }
    res.json(animal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Fehler beim Abrufen des Tieres' });
  }
};

// Neues Tier erstellen
exports.createAnimal = async (req, res) => {
  const { name, species, age, description } = req.body;
  try {
    const newAnimal = await prisma.animal.create({
      data: { name, species, age, description },
    });
    res.status(201).json(newAnimal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Fehler beim Erstellen des Tieres' });
  }
};

// Tier aktualisieren
exports.updateAnimal = async (req, res) => {
  const { id } = req.params;
  const { name, species, age, description } = req.body;
  try {
    const updatedAnimal = await prisma.animal.update({
      where: { id: parseInt(id, 10) },
      data: { name, species, age, description },
    });
    res.json(updatedAnimal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Fehler beim Aktualisieren des Tieres' });
  }
};

// Tier löschen
exports.deleteAnimal = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedAnimal = await prisma.animal.delete({
      where: { id: parseInt(id, 10) },
    });
    res.json(deletedAnimal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Fehler beim Löschen des Tieres' });
  }
};

// backend/controllers/adoptionsController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Neue Adoptionsanfrage erstellen
exports.createAdoption = async (req, res) => {
  const { userId, animalId } = req.body;
  try {
    const newAdoption = await prisma.adoption.create({
      data: {
        user: { connect: { id: userId } },
        animal: { connect: { id: animalId } },
        // Falls weitere Felder benötigt werden, können diese hier ergänzt werden,
        // z. B. ein Startdatum: startDate: new Date()
      },
    });
    res.status(201).json(newAdoption);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Fehler beim Erstellen der Adoptionsanfrage' });
  }
};

// Alle Adoptionsanfragen abrufen
exports.getAllAdoptions = async (req, res) => {
  try {
    const adoptions = await prisma.adoption.findMany({
      include: {
        user: true,
        animal: true,
      },
    });
    res.json(adoptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Adoptionsanfragen' });
  }
};


// backend/controllers/usersController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Neuen Benutzer erstellen
exports.createUser = async (req, res) => {
  const { username, email } = req.body;
  try {
    const newUser = await prisma.user.create({
      data: { username, email },
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Fehler beim Erstellen des Benutzers' });
  }
};

// Alle Benutzer abrufen (optional)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Benutzer' });
  }
};

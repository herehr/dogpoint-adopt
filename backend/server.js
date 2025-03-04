const express = require('express');
const { PrismaClient } = require('@prisma/client');
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Middleware, um JSON zu parsen
app.use(express.json());

// Beispiel-Endpunkt: Alle Tiere abrufen
app.get('/animals', async (req, res) => {
  try {
    const animals = await prisma.animal.findMany();
    res.json(animals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Tiere' });
  }
});

// Weitere Endpunkte können hier hinzugefügt werden, z.B.:
// - POST /animals zum Hinzufügen eines neuen Tieres
// - GET /animals/:id zum Abrufen eines einzelnen Tieres
// - PUT /animals/:id zum Aktualisieren eines Tieres
// - DELETE /animals/:id zum Löschen eines Tieres

// Beispiel-Endpunkt: Einen neuen Eintrag für ein Tier hinzufügen
app.post('/animals', async (req, res) => {
  try {
    const { name, species, age, description } = req.body;
    const newAnimal = await prisma.animal.create({
      data: { name, species, age, description },
    });
    res.status(201).json(newAnimal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Fehler beim Erstellen des Tieres' });
  }
});

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});

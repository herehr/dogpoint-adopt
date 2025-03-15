// backend/controllers/animalController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /animals - Returns all animals
exports.getAllAnimals = async (req, res) => {
  try {
    const animals = await prisma.animal.findMany();
    res.json(animals);
  } catch (error) {
    console.error("Error fetching animals:", error);
    res.status(500).json({ error: "Error fetching animals" });
  }
};

// GET /animals/:id - Returns a single animal by id
exports.getAnimalById = async (req, res) => {
  try {
    const animalId = parseInt(req.params.id, 10);
    const animal = await prisma.animal.findUnique({
      where: { id: animalId },
    });
    if (!animal) {
      return res.status(404).json({ error: 'Animal not found' });
    }
    res.json(animal);
  } catch (error) {
    console.error('Error fetching animal:', error);
    res.status(500).json({ error: 'Error fetching animal' });
  }
};


// PUT /animals/:id - Updates an animal (non-media fields)
exports.updateAnimal = async (req, res) => {
  try {
    const animalId = parseInt(req.params.id, 10);
    const updateData = req.body; // Expects JSON data, e.g., { active: false, name: "New Name", ... }
    const updatedAnimal = await prisma.animal.update({
      where: { id: animalId },
      data: updateData,
    });
    res.json({ message: "Animal updated successfully", animal: updatedAnimal });
  } catch (error) {
    console.error("Error updating animal:", error);
    res.status(500).json({ error: "Error updating animal" });
  }
};

// PUT /animals/:id/media - Updates an animal's media (images and/or video) and optional text fields
exports.updateAnimalMedia = async (req, res) => {
  try {
    const animalId = parseInt(req.params.id, 10);
    // Extract text fields from req.body
    const { name, species, age, description, active } = req.body;
    let updateData = {};
    if (name) updateData.name = name;
    if (species) updateData.species = species;
    if (age) updateData.age = parseInt(age, 10);
    if (description) updateData.description = description;
    if (active !== undefined) updateData.active = active;

    // Process media files from req.files (Multer handles multipart/form-data)
    const { images, video } = req.files || {};
    if (images && images.length > 0) {
      updateData.imagePaths = images.map(file => file.path);
    }
    if (video && video.length > 0) {
      updateData.videoPath = video[0].path;
    }

    const updatedAnimal = await prisma.animal.update({
      where: { id: animalId },
      data: updateData,
    });
    res.json({ message: "Animal media updated successfully", animal: updatedAnimal });
  } catch (error) {
    console.error("Error updating animal media:", error);
    res.status(500).json({ error: "Error updating animal media" });
  }
};


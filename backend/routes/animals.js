// backend/routes/animals.js
const express = require('express');
const router = express.Router();
const animalController = require('../controllers/animalController');
const postController = require('../controllers/postController');
const multer = require('multer');

// Multer configuration for file uploads (images and video)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// GET /animals – Retrieve all animals
router.get('/', animalController.getAllAnimals);

// GET /animals/:id – Retrieve a single animal by id
router.get('/:id', animalController.getAnimalById);

// PUT /animals/:id – Update an animal (non-media fields)
router.put('/:id', animalController.updateAnimal);

// PUT /animals/:id/media – Update an animal's media (images/video) and optional text fields
router.put(
  '/:id/media',
  upload.fields([{ name: 'images', maxCount: 5 }, { name: 'video', maxCount: 1 }]),
  animalController.updateAnimalMedia
);

// POST /animals/:id/posts – Create a new post for an animal
router.post(
  '/:id/posts',
  upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'videos', maxCount: 5 }
  ]),
  postController.createPost
);

// GET /animals/:id/posts – Retrieve posts for an animal
router.get('/:id/posts', postController.getPostsByAnimal);

module.exports = router;
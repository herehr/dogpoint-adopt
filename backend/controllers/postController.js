// backend/controllers/postController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Create a new post for a specific animal.
 * Expects a multipart/form-data request with:
 *  - a text field named "text"
 *  - file fields "images" (multiple allowed) and "videos" (multiple allowed)
 */
exports.createPost = async (req, res) => {
  try {
    const animalId = parseInt(req.params.id, 10);
    const { text } = req.body;
    // Multer puts files in req.files
    const { images, videos } = req.files || {};
    
    let imagePaths = [];
    let videoPaths = [];
    
    if (images && images.length > 0) {
      imagePaths = images.map(file => file.path);
    }
    if (videos && videos.length > 0) {
      videoPaths = videos.map(file => file.path);
    }
    
    const newPost = await prisma.post.create({
      data: {
        text: text || '',
        imagePaths: imagePaths,
        videoPaths: videoPaths,
        animal: {
          connect: { id: animalId }
        }
      }
    });
    res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Error creating post" });
  }
};

/**
 * Get all posts for a specific animal.
 */
exports.getPostsByAnimal = async (req, res) => {
  try {
    const animalId = parseInt(req.params.id, 10);
    const posts = await prisma.post.findMany({
      where: { animalId: animalId },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Error fetching posts" });
  }
};
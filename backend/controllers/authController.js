// backend/controllers/authController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    if (!user.active) return res.status(403).json({ error: 'User is deactivated' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, role: user.role, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Middleware: Prüft, ob der eingeloggte Benutzer der ursprüngliche Admin ("hermannehringfeld") ist
exports.checkAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ error: 'Unauthorized' });
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.role !== 'ADMIN' || payload.username !== 'hermannehringfeld') {
      return res.status(403).json({ error: 'Forbidden. Only the original admin can perform this action.' });
    }
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Registrierung für normale Benutzer (Adopter)
exports.registerUser = async (req, res) => {
  const { username, email, phone, password } = req.body;
  try {
    const existing = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });
    if (existing) return res.status(400).json({ error: 'User already exists' });
    const hashed = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        phone,
        password: hashed,
        role: 'ADOPTER'
      }
    });
    res.status(201).json({ message: 'Registration successful', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Registrierung für Moderatoren – nur vom ursprünglichen Admin erlaubt
exports.registerModerator = async (req, res) => {
  const { username, email, phone, password } = req.body;
  try {
    // Check if the user already exists
    const existing = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });
    if (existing) {
      return res.status(400).json({ error: 'User already exists' });
    }
    // Hash the password
    const hashed = await bcrypt.hash(password, 10);
    // Create a new moderator
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        phone,
        password: hashed,
        role: 'MODERATOR',
        active: true
      }
    });
    res.status(201).json({ message: 'Moderator registered successfully', user: newUser });
  } catch (error) {
    console.error("Error in registerModerator:", error);
    res.status(500).json({ error: 'Registration failed' });
  }
};
// Registration for new Admins – only allowed by the original admin
exports.registerAdmin = async (req, res) => {
  const { username, email, phone, password } = req.body;
  try {
    const existing = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });
    if (existing) return res.status(400).json({ error: 'User already exists' });
    const hashed = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        phone,
        password: hashed,
        role: 'ADMIN',
        active: true
      }
    });
    res.status(201).json({ message: 'Admin registered successfully', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

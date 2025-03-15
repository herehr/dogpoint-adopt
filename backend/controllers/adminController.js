// backend/controllers/adminController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const nodemailer = require('nodemailer');

// Konfiguriere den E-Mail-Transport (Beispiel mit Gmail – passe die Einstellungen an)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dein.email@example.com',  // Deine E-Mail-Adresse
    pass: 'deinEmailPasswort',         // Dein E-Mail-Passwort oder App-Passwort
  },
});

// Funktion zum Versenden der Zugangs-URL per E-Mail
async function sendAccessEmail(email, accessUrl) {
  const mailOptions = {
    from: 'dein.email@example.com',
    to: email,
    subject: 'Zugang zur Moderatoren-Plattform',
    text: `Hallo,\n\nIhr Zugang zur Moderatoren-Plattform lautet:\n${accessUrl}\n\nMit freundlichen Grüßen,\nDogpoint`,
  };

  await transporter.sendMail(mailOptions);
}

// Alle Moderatoren abrufen
exports.getModerators = async (req, res) => {
  try {
    const moderators = await prisma.user.findMany({
      where: { role: 'MODERATOR' }
    });
    res.json({ moderators });
  } catch (error) {
    console.error('Error fetching moderators:', error);
    res.status(500).json({ error: 'Error fetching moderators' });
  }
};

// Moderator deaktivieren
exports.deactivateModerator = async (req, res) => {
  try {
    const moderatorId = parseInt(req.params.id, 10);
    const moderator = await prisma.user.findUnique({ where: { id: moderatorId } });
    if (!moderator || moderator.role !== 'MODERATOR') {
      return res.status(404).json({ error: 'Moderator not found' });
    }
    const updatedModerator = await prisma.user.update({
      where: { id: moderatorId },
      data: { active: false }
    });
    res.json({ message: 'Moderator deactivated successfully', moderator: updatedModerator });
  } catch (error) {
    console.error('Error deactivating moderator:', error);
    res.status(500).json({ error: 'Error deactivating moderator' });
  }
};

// Moderator aktivieren
exports.activateModerator = async (req, res) => {
  try {
    const moderatorId = parseInt(req.params.id, 10);
    const moderator = await prisma.user.findUnique({ where: { id: moderatorId } });
    if (!moderator || moderator.role !== 'MODERATOR') {
      return res.status(404).json({ error: 'Moderator not found' });
    }
    const updatedModerator = await prisma.user.update({
      where: { id: moderatorId },
      data: { active: true }
    });
    res.json({ message: 'Moderator activated successfully', moderator: updatedModerator });
  } catch (error) {
    console.error('Error activating moderator:', error);
    res.status(500).json({ error: 'Error activating moderator' });
  }
};

// Neuer Moderator registrieren und per E-Mail die Zugangs-URL versenden
exports.registerModerator = async (req, res) => {
  const { username, email, phone, password } = req.body;
  try {
    const existing = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });
    if (existing) return res.status(400).json({ error: 'User already exists' });
    const bcrypt = require('bcrypt');
    const hashed = await bcrypt.hash(password, 10);
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
    // Sende die Zugangs-URL per E-Mail (Passe die URL an deine Umgebung an)
    const accessUrl = 'http://localhost:5173/login';
    await sendAccessEmail(email, accessUrl);
    res.status(201).json({ message: 'Moderator registered successfully; email sent with access URL', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
};


// Registrierung für neue Admins – nur vom ursprünglichen Admin erlaubt
exports.registerAdmin = async (req, res) => {
  const { username, email, phone, password } = req.body;
  try {
    const existing = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });
    if (existing) return res.status(400).json({ error: 'User already exists' });
    const bcrypt = require('bcrypt');
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

const bcrypt = require('bcrypt');

const plainPassword = 'phud9faw';
const saltRounds = 10;

bcrypt.hash(plainPassword, saltRounds, (err, hash) => {
  if (err) {
    console.error('Fehler beim Hashen des Passworts:', err);
  } else {
    console.log('Gehashtes Passwort:', hash);
  }
});

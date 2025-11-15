const bcrypt = require('bcrypt');
const rounds = 10;

async function hashPassword(plaintext) {
  return await bcrypt.hash(plaintext, rounds);
}

async function comparePassword(plaintext, hash) {
  return await bcrypt.compare(plaintext, hash);
}

module.exports = { hashPassword, comparePassword };

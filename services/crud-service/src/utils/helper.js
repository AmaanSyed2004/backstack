function sanitizeName(name) {
  if (!/^[A-Za-z0-9_]+$/.test(name))
    throw new Error('Invalid identifier name');
  return name;
}

module.exports = { sanitizeName };

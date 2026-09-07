const db = require("../client");

db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT DEFAULT '',
    profileImage TEXT DEFAULT '',
    passwordHash TEXT NOT NULL DEFAULT '',
    createdAt TEXT NOT NULL
  )
`).run();

module.exports = db;
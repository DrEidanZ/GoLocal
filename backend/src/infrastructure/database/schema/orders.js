const db = require("../client");

db.prepare(`
  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    restaurantId TEXT NOT NULL,
    restaurantName TEXT NOT NULL,
    items TEXT NOT NULL,
    total REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'Placed',
    createdAt TEXT NOT NULL
  )
`).run();

module.exports = db;
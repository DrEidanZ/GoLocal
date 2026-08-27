const Database = require("better-sqlite3");

const db = new Database("golocal.db");

db.pragma("journal_mode = WAL");

db.prepare(`
  CREATE TABLE IF NOT EXISTS restaurants (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    category TEXT DEFAULT 'Food',
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    logo TEXT DEFAULT '',
    createdAt TEXT NOT NULL
  )
`).run();

const restaurantCount = db
  .prepare("SELECT COUNT(*) AS count FROM restaurants")
  .get();

if (restaurantCount.count === 0) {
  const defaultRestaurants = [
    {
      id: "default-mcdonalds",
      name: "McDonald's",
      description:
        "Burgers, fries, chicken, and more.",
      category: "Food",
      latitude: 10.3157,
      longitude: 123.8854,
      logo: "",
    },
    {
      id: "default-jollibee",
      name: "Jollibee",
      description:
        "Filipino favorites and fast food.",
      category: "Food",
      latitude: 10.32,
      longitude: 123.892,
      logo: "",
    },
    {
      id: "default-starbucks",
      name: "Starbucks",
      description:
        "Coffee, pastries, and refreshing drinks.",
      category: "Food",
      latitude: 10.31,
      longitude: 123.878,
      logo: "",
    },
    {
      id: "default-mang-inasal",
      name: "Mang Inasal",
      description:
        "Chicken inasal, rice meals, and Filipino food.",
      category: "Food",
      latitude: 10.316,
      longitude: 123.89,
      logo: "",
    },
    {
      id: "default-chowking",
      name: "Chowking",
      description:
        "Chinese-style Filipino fast food.",
      category: "Food",
      latitude: 10.322,
      longitude: 123.883,
      logo: "",
    },
    {
      id: "default-cebu-grand-hotel",
      name: "Cebu Grand Hotel",
      description:
        "Comfortable rooms in the heart of the city.",
      category: "Hotels",
      latitude: 10.31,
      longitude: 123.89,
      logo: "",
    },
    {
      id: "default-harbor-view-hotel",
      name: "Harbor View Hotel",
      description:
        "Relaxing accommodation with city views.",
      category: "Hotels",
      latitude: 10.32,
      longitude: 123.88,
      logo: "",
    },
    {
      id: "default-city-garden-hotel",
      name: "City Garden Hotel",
      description:
        "Modern rooms and convenient amenities.",
      category: "Hotels",
      latitude: 10.315,
      longitude: 123.895,
      logo: "",
    },
    {
      id: "default-grand-central-suites",
      name: "Grand Central Suites",
      description:
        "Stylish suites close to major attractions.",
      category: "Hotels",
      latitude: 10.313,
      longitude: 123.884,
      logo: "",
    },
    {
      id: "default-golocal-delivery",
      name: "GoLocal Delivery",
      description:
        "Fast and convenient local deliveries.",
      category: "Delivery",
      latitude: 10.325,
      longitude: 123.885,
      logo: "",
    },
    {
      id: "default-quickdrop",
      name: "QuickDrop",
      description:
        "Affordable same-day delivery service.",
      category: "Delivery",
      latitude: 10.315,
      longitude: 123.875,
      logo: "",
    },
    {
      id: "default-dash-express",
      name: "Dash Express",
      description:
        "Fast delivery around the city.",
      category: "Delivery",
      latitude: 10.31,
      longitude: 123.9,
      logo: "",
    },
    {
      id: "default-citysend",
      name: "CitySend",
      description:
        "Local package and document delivery.",
      category: "Delivery",
      latitude: 10.308,
      longitude: 123.892,
      logo: "",
    },
    {
      id: "default-golocal-rides",
      name: "GoLocal Rides",
      description:
        "Convenient rides around the city.",
      category: "Rides",
      latitude: 10.312,
      longitude: 123.882,
      logo: "",
    },
    {
      id: "default-citycab",
      name: "CityCab",
      description:
        "Reliable city transportation.",
      category: "Rides",
      latitude: 10.322,
      longitude: 123.89,
      logo: "",
    },
    {
      id: "default-quickride",
      name: "QuickRide",
      description:
        "Fast rides whenever you need them.",
      category: "Rides",
      latitude: 10.32,
      longitude: 123.9,
      logo: "",
    },
    {
      id: "default-metro-transport",
      name: "Metro Transport",
      description:
        "Affordable transportation around Cebu.",
      category: "Rides",
      latitude: 10.318,
      longitude: 123.878,
      logo: "",
    },
  ];

  const insertRestaurant = db.prepare(`
    INSERT INTO restaurants (
      id,
      name,
      description,
      category,
      latitude,
      longitude,
      logo,
      createdAt
    )
    VALUES (
      @id,
      @name,
      @description,
      @category,
      @latitude,
      @longitude,
      @logo,
      @createdAt
    )
  `);

  const insertDefaults = db.transaction(() => {
    for (const restaurant of defaultRestaurants) {
      insertRestaurant.run({
        ...restaurant,
        createdAt: new Date().toISOString(),
      });
    }
  });

  insertDefaults();

  console.log(
    "Default GoLocal places added to the database."
  );
}

module.exports = db;
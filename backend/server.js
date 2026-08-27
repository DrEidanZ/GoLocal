const express = require("express");
const cors = require("cors");

const db = require("./database/database");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "GoLocal backend is running",
  });
});

app.get("/api/restaurants", (req, res) => {
  try {
    const restaurants = db
      .prepare(
        "SELECT * FROM restaurants ORDER BY createdAt DESC"
      )
      .all();

    res.json(restaurants);
  } catch (error) {
    console.error(
      "Error fetching restaurants:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch restaurants.",
    });
  }
});

app.post("/api/restaurants", (req, res) => {
  try {
    const {
      name,
      description,
      category,
      latitude,
      longitude,
      logo,
    } = req.body;

    if (
      !name ||
      latitude === undefined ||
      longitude === undefined
    ) {
      return res.status(400).json({
        message:
          "Name, latitude, and longitude are required.",
      });
    }

    const restaurant = {
      id: Date.now().toString(),
      name,
      description: description || "",
      category: category || "Food",
      latitude: Number(latitude),
      longitude: Number(longitude),
      logo: logo || "",
      createdAt: new Date().toISOString(),
    };

    db.prepare(`
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
    `).run(restaurant);

    res.status(201).json({
      message: "Restaurant created successfully.",
      restaurant,
    });
  } catch (error) {
    console.error(
      "Error creating restaurant:",
      error
    );

    res.status(500).json({
      message: "Failed to create restaurant.",
    });
  }
});

app.put("/api/restaurants/:id", (req, res) => {
  try {
    const {
      name,
      description,
      category,
      latitude,
      longitude,
      logo,
    } = req.body;

    if (
      !name ||
      latitude === undefined ||
      longitude === undefined
    ) {
      return res.status(400).json({
        message:
          "Name, latitude, and longitude are required.",
      });
    }

    const existingRestaurant = db
      .prepare(
        "SELECT * FROM restaurants WHERE id = ?"
      )
      .get(req.params.id);

    if (!existingRestaurant) {
      return res.status(404).json({
        message: "Restaurant not found.",
      });
    }

    const updatedRestaurant = {
      id: req.params.id,
      name,
      description: description || "",
      category: category || "Food",
      latitude: Number(latitude),
      longitude: Number(longitude),
      logo: logo || "",
    };

    db.prepare(`
      UPDATE restaurants
      SET
        name = @name,
        description = @description,
        category = @category,
        latitude = @latitude,
        longitude = @longitude,
        logo = @logo
      WHERE id = @id
    `).run(updatedRestaurant);

    const restaurant = db
      .prepare(
        "SELECT * FROM restaurants WHERE id = ?"
      )
      .get(req.params.id);

    res.json({
      message: "Restaurant updated successfully.",
      restaurant,
    });
  } catch (error) {
    console.error(
      "Error updating restaurant:",
      error
    );

    res.status(500).json({
      message: "Failed to update restaurant.",
    });
  }
});

app.delete("/api/restaurants/:id", (req, res) => {
  try {
    console.log(
      "DELETE request received for restaurant:",
      req.params.id
    );

    const existingRestaurant = db
      .prepare(
        "SELECT * FROM restaurants WHERE id = ?"
      )
      .get(req.params.id);

    if (!existingRestaurant) {
      return res.status(404).json({
        message: "Restaurant not found.",
      });
    }

    db.prepare(
      "DELETE FROM restaurants WHERE id = ?"
    ).run(req.params.id);

    console.log(
      "Restaurant deleted:",
      req.params.id
    );

    res.json({
      message: "Restaurant deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Error deleting restaurant:",
      error
    );

    res.status(500).json({
      message: "Failed to delete restaurant.",
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `GoLocal backend running on http://localhost:${PORT}`
  );

  console.log(
    `GoLocal backend available on http://192.168.1.8:${PORT}`
  );

  console.log(
    "DELETE route enabled: DELETE /api/restaurants/:id"
  );
});
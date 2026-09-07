const {
  fetchRestaurants,
  addRestaurant,
  editRestaurant,
  removeRestaurant,
} = require("./restaurant.service");

const getRestaurants = (req, res) => {
  try {
    const restaurants = fetchRestaurants();

    res.json(restaurants);
  } catch (error) {
    console.error("Error fetching restaurants:", error);

    res.status(500).json({
      message: "Failed to fetch restaurants.",
    });
  }
};

const createRestaurant = (req, res) => {
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

    const restaurant = addRestaurant({
      name,
      description,
      category,
      latitude,
      longitude,
      logo,
    });

    res.status(201).json({
      message: "Restaurant created successfully.",
      restaurant,
    });
  } catch (error) {
    console.error("Error creating restaurant:", error);

    res.status(500).json({
      message: "Failed to create restaurant.",
    });
  }
};

const updateRestaurant = (req, res) => {
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

    const restaurant = editRestaurant(req.params.id, {
      name,
      description,
      category,
      latitude,
      longitude,
      logo,
    });

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found.",
      });
    }

    res.json({
      message: "Restaurant updated successfully.",
      restaurant,
    });
  } catch (error) {
    console.error("Error updating restaurant:", error);

    res.status(500).json({
      message: "Failed to update restaurant.",
    });
  }
};

const deleteRestaurant = (req, res) => {
  try {
    const deleted = removeRestaurant(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        message: "Restaurant not found.",
      });
    }

    res.json({
      message: "Restaurant deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting restaurant:", error);

    res.status(500).json({
      message: "Failed to delete restaurant.",
    });
  }
};

module.exports = {
  getRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
};
const Restaurant = require("../models/Restaurant");

const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find()
      .sort({ createdAt: -1 })
      .lean();

    res.json(restaurants);
  } catch (error) {
    console.error("Error fetching restaurants:", error);

    res.status(500).json({
      message: "Failed to fetch restaurants.",
    });
  }
};

const createRestaurant = async (req, res) => {
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

    const restaurant = await Restaurant.create({
      id: String(Date.now()),
      name,
      description: description || "",
      category: category || "Food",
      latitude: Number(latitude),
      longitude: Number(longitude),
      logo: logo || "",
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

const updateRestaurant = async (req, res) => {
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

    const restaurant = await Restaurant.findOneAndUpdate(
      { id: req.params.id },
      {
        name,
        description: description || "",
        category: category || "Food",
        latitude: Number(latitude),
        longitude: Number(longitude),
        logo: logo || "",
      },
      {
        new: true,
        runValidators: true,
      }
    ).lean();

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

const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOneAndDelete({
      id: req.params.id,
    });

    if (!restaurant) {
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
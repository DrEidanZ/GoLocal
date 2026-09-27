const express = require("express");

const {
  getRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} = require("../controllers/restaurantController");

const authenticateToken = require("../middleware/auth");

const router = express.Router();

router.get("/", getRestaurants);

router.post("/", authenticateToken, createRestaurant);

router.put("/:id", authenticateToken, updateRestaurant);

router.delete("/:id", authenticateToken, deleteRestaurant);

module.exports = router;
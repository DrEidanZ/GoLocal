const db = require("../../infrastructure/database/client");

const getAllRestaurants = () => {
  return db
    .prepare(
      "SELECT * FROM restaurants ORDER BY createdAt DESC"
    )
    .all();
};

const createRestaurant = (restaurant) => {
  return db
    .prepare(`
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
    `)
    .run(restaurant);
};

const getRestaurantById = (id) => {
  return db
    .prepare(
      "SELECT * FROM restaurants WHERE id = ?"
    )
    .get(id);
};

const updateRestaurant = (restaurant) => {
  return db
    .prepare(`
      UPDATE restaurants
      SET
        name = @name,
        description = @description,
        category = @category,
        latitude = @latitude,
        longitude = @longitude,
        logo = @logo
      WHERE id = @id
    `)
    .run(restaurant);
};

const deleteRestaurant = (id) => {
  return db
    .prepare(
      "DELETE FROM restaurants WHERE id = ?"
    )
    .run(id);
};

module.exports = {
  getAllRestaurants,
  createRestaurant,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
};
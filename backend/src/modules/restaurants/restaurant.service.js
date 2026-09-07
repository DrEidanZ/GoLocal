const {
  getAllRestaurants,
  createRestaurant,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
} = require("./restaurant.repository");

const fetchRestaurants = () => {
  return getAllRestaurants();
};

const addRestaurant = ({
  name,
  description,
  category,
  latitude,
  longitude,
  logo,
}) => {
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

  createRestaurant(restaurant);

  return restaurant;
};

const editRestaurant = (
  id,
  {
    name,
    description,
    category,
    latitude,
    longitude,
    logo,
  }
) => {
  const existingRestaurant = getRestaurantById(id);

  if (!existingRestaurant) {
    return null;
  }

  const updatedRestaurant = {
    id,
    name,
    description: description || "",
    category: category || "Food",
    latitude: Number(latitude),
    longitude: Number(longitude),
    logo: logo || "",
  };

  updateRestaurant(updatedRestaurant);

  return getRestaurantById(id);
};

const removeRestaurant = (id) => {
  const existingRestaurant = getRestaurantById(id);

  if (!existingRestaurant) {
    return false;
  }

  deleteRestaurant(id);

  return true;
};

module.exports = {
  fetchRestaurants,
  addRestaurant,
  editRestaurant,
  removeRestaurant,
};
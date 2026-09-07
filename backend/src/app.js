const express = require("express");
const cors = require("cors");

const restaurantRoutes = require("./modules/restaurants/restaurant.routes");
const userRoutes = require("./modules/users/user.routes");
const authRoutes = require("./modules/auth/auth.routes");
const orderRoutes = require("./modules/orders/order.routes");
const errorHandler = require("./middleware/error");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "GoLocal backend is running",
  });
});

app.use("/api/restaurants", restaurantRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

app.use(errorHandler);

module.exports = app;
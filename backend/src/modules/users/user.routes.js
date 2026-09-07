const express = require("express");

const {
  getUsers,
  getCurrentUser,
  createUser,
  updateCurrentUser,
  updateUser,
  deleteUser,
} = require("./user.controller");

const authenticateToken = require("../../middleware/auth");

const router = express.Router();

router.get(
  "/me",
  authenticateToken,
  getCurrentUser
);

router.put(
  "/me",
  authenticateToken,
  updateCurrentUser
);

router.get(
  "/",
  authenticateToken,
  getUsers
);

router.post(
  "/",
  createUser
);

router.put(
  "/:id",
  authenticateToken,
  updateUser
);

router.delete(
  "/:id",
  authenticateToken,
  deleteUser
);

module.exports = router;
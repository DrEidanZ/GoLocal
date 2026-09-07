const express = require("express");

const {
  getOrders,
  getMyOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  deleteOrder,
} = require("./order.controller");

const authenticateToken = require("../../middleware/auth");

const router = express.Router();

router.get("/", authenticateToken, getOrders);
router.get("/my", authenticateToken, getMyOrders);
router.get("/:id", authenticateToken, getOrder);

router.post("/", authenticateToken, createOrder);

router.put(
  "/:id/status",
  authenticateToken,
  updateOrderStatus
);

router.delete(
  "/:id",
  authenticateToken,
  deleteOrder
);

module.exports = router;
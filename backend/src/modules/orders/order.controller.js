const {
  fetchOrders,
  fetchOrdersByUser,
  fetchOrderById,
  addOrder,
  changeOrderStatus,
  updateAutomaticOrderStatuses,
  removeOrder,
} = require("./order.service");

const getOrders = (req, res) => {
  try {
    updateAutomaticOrderStatuses();

    const orders = fetchOrders();

    res.json(orders);
  } catch (error) {
    console.error(
      "Error fetching orders:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch orders.",
    });
  }
};

const getMyOrders = (req, res) => {
  try {
    updateAutomaticOrderStatuses();

    const orders =
      fetchOrdersByUser(
        req.user.id
      );

    res.json(orders);
  } catch (error) {
    console.error(
      "Error fetching user orders:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch your orders.",
    });
  }
};

const getOrder = (req, res) => {
  try {
    updateAutomaticOrderStatuses();

    const order =
      fetchOrderById(
        req.params.id
      );

    if (!order) {
      return res.status(404).json({
        message:
          "Order not found.",
      });
    }

    res.json(order);
  } catch (error) {
    console.error(
      "Error fetching order:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch order.",
    });
  }
};

const createOrder = (req, res) => {
  try {
    const {
      restaurantId,
      restaurantName,
      items,
      total,
    } = req.body;

    if (
      !restaurantId ||
      !restaurantName ||
      !items ||
      total === undefined
    ) {
      return res.status(400).json({
        message:
          "Restaurant, items, and total are required.",
      });
    }

    const order =
      addOrder({
        userId:
          req.user.id,
        restaurantId,
        restaurantName,
        items,
        total,
      });

    res.status(201).json({
      message:
        "Order created successfully.",
      order,
    });
  } catch (error) {
    console.error(
      "Error creating order:",
      error
    );

    res.status(500).json({
      message:
        "Failed to create order.",
    });
  }
};

const updateOrderStatus = (
  req,
  res
) => {
  try {
    const { status } =
      req.body;

    if (!status) {
      return res.status(400).json({
        message:
          "Order status is required.",
      });
    }

    const order =
      changeOrderStatus(
        req.params.id,
        status
      );

    if (!order) {
      return res.status(404).json({
        message:
          "Order not found.",
      });
    }

    res.json({
      message:
        "Order status updated successfully.",
      order,
    });
  } catch (error) {
    console.error(
      "Error updating order status:",
      error
    );

    res.status(500).json({
      message:
        "Failed to update order status.",
    });
  }
};

const deleteOrder = (
  req,
  res
) => {
  try {
    const deleted =
      removeOrder(
        req.params.id
      );

    if (!deleted) {
      return res.status(404).json({
        message:
          "Order not found.",
      });
    }

    res.json({
      message:
        "Order deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Error deleting order:",
      error
    );

    res.status(500).json({
      message:
        "Failed to delete order.",
    });
  }
};

module.exports = {
  getOrders,
  getMyOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  deleteOrder,
};
const Order = require("../models/Order");

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .lean();

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);

    res.status(500).json({
      message: "Failed to fetch orders.",
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.user.id,
    })
      .sort({ createdAt: -1 })
      .lean();

    res.json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);

    res.status(500).json({
      message: "Failed to fetch your orders.",
    });
  }
};

const getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      id: req.params.id,
    }).lean();

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);

    res.status(500).json({
      message: "Failed to fetch order.",
    });
  }
};

const createOrder = async (req, res) => {
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

    const order = await Order.create({
      id: Date.now().toString(),
      userId: req.user.id,
      restaurantId,
      restaurantName,
      items,
      total: Number(total),
      status: "Placed",
      createdAt: new Date(),
    });

    res.status(201).json({
      message: "Order created successfully.",
      order,
    });

    setTimeout(async () => {
      try {
        await Order.findOneAndUpdate(
          { id: order.id },
          { status: "Preparing" }
        );
      } catch (error) {
        console.error(
          "Error updating order to Preparing:",
          error
        );
      }
    }, 10000);

    setTimeout(async () => {
      try {
        await Order.findOneAndUpdate(
          { id: order.id },
          { status: "On the way" }
        );
      } catch (error) {
        console.error(
          "Error updating order to On the way:",
          error
        );
      }
    }, 20000);

    setTimeout(async () => {
      try {
        await Order.findOneAndUpdate(
          { id: order.id },
          { status: "Delivered" }
        );
      } catch (error) {
        console.error(
          "Error updating order to Delivered:",
          error
        );
      }
    }, 30000);
  } catch (error) {
    console.error("Error creating order:", error);

    res.status(500).json({
      message: "Failed to create order.",
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { id: req.params.id },
      {
        status: req.body.status,
      },
      {
        new: true,
        runValidators: true,
      }
    ).lean();

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    res.json({
      message: "Order status updated successfully.",
      order,
    });
  } catch (error) {
    console.error(
      "Error updating order status:",
      error
    );

    res.status(500).json({
      message: "Failed to update order status.",
    });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({
      id: req.params.id,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    res.json({
      message: "Order deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting order:", error);

    res.status(500).json({
      message: "Failed to delete order.",
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
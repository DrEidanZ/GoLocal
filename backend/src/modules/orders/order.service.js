const {
  getAllOrders,
  getOrdersByUserId,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
} = require("./order.repository");

const fetchOrders = () => {
  return getAllOrders();
};

const fetchOrdersByUser = (userId) => {
  return getOrdersByUserId(userId);
};

const fetchOrderById = (id) => {
  return getOrderById(id);
};

const addOrder = ({
  userId,
  restaurantId,
  restaurantName,
  items,
  total,
}) => {
  const order = {
    id: Date.now().toString(),
    userId,
    restaurantId,
    restaurantName,
    items: JSON.stringify(items),
    total: Number(total),
    status: "Placed",
    createdAt: new Date().toISOString(),
  };

  createOrder(order);

  return getOrderById(order.id);
};

const changeOrderStatus = (id, status) => {
  const existingOrder = getOrderById(id);

  if (!existingOrder) {
    return null;
  }

  updateOrderStatus(id, status);

  return getOrderById(id);
};

/*
 * Automatically progress an order based
 * on how long ago it was created.
 *
 * Placed      -> 0 seconds
 * Preparing   -> 10 seconds
 * On the way  -> 20 seconds
 * Delivered   -> 30 seconds
 */
const updateAutomaticOrderStatuses = () => {
  const orders = getAllOrders();

  const now = Date.now();

  orders.forEach((order) => {
    if (!order.createdAt) {
      return;
    }

    if (order.status === "Delivered") {
      return;
    }

    const createdTime =
      new Date(
        order.createdAt
      ).getTime();

    if (
      !Number.isFinite(createdTime)
    ) {
      return;
    }

    const elapsed =
      now - createdTime;

    let nextStatus =
      "Placed";

    if (elapsed >= 30000) {
      nextStatus = "Delivered";
    } else if (elapsed >= 20000) {
      nextStatus = "On the way";
    } else if (elapsed >= 10000) {
      nextStatus = "Preparing";
    }

    if (
      nextStatus !== order.status
    ) {
      updateOrderStatus(
        order.id,
        nextStatus
      );

      console.log(
        `Order ${order.id} status updated: ${order.status} -> ${nextStatus}`
      );
    }
  });
};

const removeOrder = (id) => {
  const existingOrder =
    getOrderById(id);

  if (!existingOrder) {
    return false;
  }

  deleteOrder(id);

  return true;
};

module.exports = {
  fetchOrders,
  fetchOrdersByUser,
  fetchOrderById,
  addOrder,
  changeOrderStatus,
  updateAutomaticOrderStatuses,
  removeOrder,
};
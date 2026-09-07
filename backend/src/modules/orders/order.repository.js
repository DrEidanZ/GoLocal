const db = require("../../infrastructure/database/client");

const getAllOrders = () => {
  return db
    .prepare(`
      SELECT *
      FROM orders
      ORDER BY createdAt DESC
    `)
    .all();
};

const getOrdersByUserId = (userId) => {
  return db
    .prepare(`
      SELECT *
      FROM orders
      WHERE userId = ?
      ORDER BY createdAt DESC
    `)
    .all(userId);
};

const getOrderById = (id) => {
  return db
    .prepare(`
      SELECT *
      FROM orders
      WHERE id = ?
    `)
    .get(id);
};

const createOrder = (order) => {
  return db
    .prepare(`
      INSERT INTO orders (
        id,
        userId,
        restaurantId,
        restaurantName,
        items,
        total,
        status,
        createdAt
      )
      VALUES (
        @id,
        @userId,
        @restaurantId,
        @restaurantName,
        @items,
        @total,
        @status,
        @createdAt
      )
    `)
    .run(order);
};

const updateOrderStatus = (id, status) => {
  return db
    .prepare(`
      UPDATE orders
      SET status = ?
      WHERE id = ?
    `)
    .run(status, id);
};

const deleteOrder = (id) => {
  return db
    .prepare(`
      DELETE FROM orders
      WHERE id = ?
    `)
    .run(id);
};

module.exports = {
  getAllOrders,
  getOrdersByUserId,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
};
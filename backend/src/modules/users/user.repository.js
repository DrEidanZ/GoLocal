const db = require("../../infrastructure/database/client");

const getAllUsers = () => {
  return db
    .prepare(`
      SELECT
        id,
        name,
        email,
        phone,
        profileImage,
        createdAt
      FROM users
      ORDER BY createdAt DESC
    `)
    .all();
};

const createUser = (user) => {
  return db
    .prepare(`
      INSERT INTO users (
        id,
        name,
        email,
        phone,
        profileImage,
        passwordHash,
        createdAt
      )
      VALUES (
        @id,
        @name,
        @email,
        @phone,
        @profileImage,
        @passwordHash,
        @createdAt
      )
    `)
    .run(user);
};

const getUserById = (id) => {
  return db
    .prepare(`
      SELECT
        id,
        name,
        email,
        phone,
        profileImage,
        createdAt
      FROM users
      WHERE id = ?
    `)
    .get(id);
};

const getUserByEmail = (email) => {
  return db
    .prepare(`
      SELECT
        id,
        name,
        email,
        phone,
        profileImage,
        passwordHash,
        createdAt
      FROM users
      WHERE email = ?
    `)
    .get(email);
};

const updateUser = (user) => {
  return db
    .prepare(`
      UPDATE users
      SET
        name = @name,
        email = @email,
        phone = @phone,
        profileImage = @profileImage
      WHERE id = @id
    `)
    .run(user);
};

const deleteUser = (id) => {
  return db
    .prepare(
      "DELETE FROM users WHERE id = ?"
    )
    .run(id);
};

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
};
const {
  getUserByEmail,
  getUserById,
  createUser,
} = require("../users/user.repository");

module.exports = {
  findUserByEmail: getUserByEmail,
  findUserById: getUserById,
  createUser,
};
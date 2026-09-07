const bcrypt = require("bcryptjs");

const {
  getAllUsers,
  createUser,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
} = require("./user.repository");

const fetchUsers = () => {
  return getAllUsers();
};

const fetchUserById = (id) => {
  return getUserById(id);
};

const addUser = async ({
  name,
  email,
  password,
  phone,
  profileImage,
}) => {
  const existingUser =
    getUserByEmail(email);

  if (existingUser) {
    const error = new Error(
      "A user with that email already exists."
    );

    error.statusCode = 409;

    throw error;
  }

  const passwordHash =
    await bcrypt.hash(
      password,
      10
    );

  const user = {
    id: Date.now().toString(),
    name,
    email,
    phone: phone || "",
    profileImage:
      profileImage || "",
    passwordHash,
    createdAt:
      new Date().toISOString(),
  };

  createUser(user);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    profileImage:
      user.profileImage,
    createdAt:
      user.createdAt,
  };
};

const editUser = (
  id,
  {
    name,
    email,
    phone,
    profileImage,
  }
) => {
  const existingUser =
    getUserById(id);

  if (!existingUser) {
    return null;
  }

  const updatedUser = {
    id,
    name,
    email,
    phone: phone || "",
    profileImage:
      profileImage || "",
  };

  updateUser(updatedUser);

  return getUserById(id);
};

const removeUser = (id) => {
  const existingUser =
    getUserById(id);

  if (!existingUser) {
    return false;
  }

  deleteUser(id);

  return true;
};

module.exports = {
  fetchUsers,
  fetchUserById,
  addUser,
  editUser,
  removeUser,
};
const {
  fetchUsers,
  fetchUserById,
  addUser,
  editUser,
  removeUser,
} = require("./user.service");

const getUsers = (req, res) => {
  try {
    const users = fetchUsers();

    res.json(users);
  } catch (error) {
    console.error(
      "Error fetching users:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch users.",
    });
  }
};

const getCurrentUser = (req, res) => {
  try {
    const user = fetchUserById(
      req.user.id
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    res.json({
      user,
    });
  } catch (error) {
    console.error(
      "Error fetching current user:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch your profile.",
    });
  }
};

const createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      profileImage,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message:
          "Name, email, and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters long.",
      });
    }

    const user = await addUser({
      name,
      email,
      password,
      phone,
      profileImage,
    });

    res.status(201).json({
      message:
        "User created successfully.",
      user,
    });
  } catch (error) {
    console.error(
      "Error creating user:",
      error
    );

    if (error.statusCode === 409) {
      return res.status(409).json({
        message: error.message,
      });
    }

    res.status(500).json({
      message: "Failed to create user.",
    });
  }
};

const updateCurrentUser = (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      profileImage,
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message:
          "Name and email are required.",
      });
    }

    const user = editUser(
      req.user.id,
      {
        name,
        email,
        phone,
        profileImage,
      }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    res.json({
      message:
        "Profile updated successfully.",
      user,
    });
  } catch (error) {
    console.error(
      "Error updating current user:",
      error
    );

    if (
      error.code ===
      "SQLITE_CONSTRAINT_UNIQUE"
    ) {
      return res.status(409).json({
        message:
          "A user with that email already exists.",
      });
    }

    res.status(500).json({
      message:
        "Failed to update your profile.",
    });
  }
};

const updateUser = (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      profileImage,
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message:
          "Name and email are required.",
      });
    }

    const user = editUser(
      req.params.id,
      {
        name,
        email,
        phone,
        profileImage,
      }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    res.json({
      message:
        "User updated successfully.",
      user,
    });
  } catch (error) {
    console.error(
      "Error updating user:",
      error
    );

    if (
      error.code ===
      "SQLITE_CONSTRAINT_UNIQUE"
    ) {
      return res.status(409).json({
        message:
          "A user with that email already exists.",
      });
    }

    res.status(500).json({
      message:
        "Failed to update user.",
    });
  }
};

const deleteUser = (req, res) => {
  try {
    const deleted =
      removeUser(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    res.json({
      message:
        "User deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Error deleting user:",
      error
    );

    res.status(500).json({
      message:
        "Failed to delete user.",
    });
  }
};

module.exports = {
  getUsers,
  getCurrentUser,
  createUser,
  updateCurrentUser,
  updateUser,
  deleteUser,
};
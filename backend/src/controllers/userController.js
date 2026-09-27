const User = require("../models/User");

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone || "",
  profileImage: user.profileImage || "",
  createdAt: user.createdAt,
});

const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-passwordHash")
      .sort({ createdAt: -1 })
      .lean();

    res.json(users.map(sanitizeUser));
  } catch (error) {
    console.error("Error fetching users:", error);

    res.status(500).json({
      message: "Failed to fetch users.",
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findOne({
      id: req.user.id,
    })
      .select("-passwordHash")
      .lean();

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    res.json({
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error(
      "Error fetching current user:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch your profile.",
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

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingUser) {
      return res.status(409).json({
        message:
          "A user with that email already exists.",
      });
    }

    const bcrypt = require("bcryptjs");

    const passwordHash = await bcrypt.hash(
      password,
      10
    );

    const user = await User.create({
      id: Date.now().toString(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone || "",
      profileImage: profileImage || "",
      passwordHash,
    });

    res.status(201).json({
      message: "User created successfully.",
      user: sanitizeUser(user.toObject()),
    });
  } catch (error) {
    console.error("Error creating user:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        message:
          "A user with that email already exists.",
      });
    }

    res.status(500).json({
      message: "Failed to create user.",
    });
  }
};

const updateCurrentUser = async (req, res) => {
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

    const normalizedEmail =
      email.toLowerCase().trim();

    const existingUser = await User.findOne({
      email: normalizedEmail,
      id: { $ne: req.user.id },
    });

    if (existingUser) {
      return res.status(409).json({
        message:
          "A user with that email already exists.",
      });
    }

    const user = await User.findOneAndUpdate(
      { id: req.user.id },
      {
        name: name.trim(),
        email: normalizedEmail,
        phone: phone || "",
        profileImage: profileImage || "",
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .select("-passwordHash")
      .lean();

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    res.json({
      message: "Profile updated successfully.",
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error(
      "Error updating current user:",
      error
    );

    if (error.code === 11000) {
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

const updateUser = async (req, res) => {
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

    const normalizedEmail =
      email.toLowerCase().trim();

    const existingUser = await User.findOne({
      email: normalizedEmail,
      id: { $ne: req.params.id },
    });

    if (existingUser) {
      return res.status(409).json({
        message:
          "A user with that email already exists.",
      });
    }

    const user = await User.findOneAndUpdate(
      { id: req.params.id },
      {
        name: name.trim(),
        email: normalizedEmail,
        phone: phone || "",
        profileImage: profileImage || "",
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .select("-passwordHash")
      .lean();

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    res.json({
      message: "User updated successfully.",
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Error updating user:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        message:
          "A user with that email already exists.",
      });
    }

    res.status(500).json({
      message: "Failed to update user.",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({
      id: req.params.id,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    res.json({
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting user:", error);

    res.status(500).json({
      message: "Failed to delete user.",
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
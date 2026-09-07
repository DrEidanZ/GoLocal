const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  getUserByEmail,
  createUser,
} = require("../users/user.repository");

const JWT_SECRET =
  process.env.JWT_SECRET || "golocal-development-secret";

const registerUser = async (
  name,
  email,
  password
) => {
  const existingUser = getUserByEmail(email);

  if (existingUser) {
    const error = new Error(
      "An account with this email already exists."
    );

    error.statusCode = 409;

    throw error;
  }

  const passwordHash = await bcrypt.hash(
    password,
    10
  );

  const userId = Date.now().toString();

  createUser({
    id: userId,
    name,
    email,
    phone: "",
    profileImage: "",
    passwordHash,
    createdAt: new Date().toISOString(),
  });

  const user = getUserByEmail(email);

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage,
      createdAt: user.createdAt,
    },
  };
};

const loginUser = async (email, password) => {
  const user = getUserByEmail(email);

  if (!user) {
    const error = new Error(
      "Invalid email or password."
    );

    error.statusCode = 401;

    throw error;
  }

  const passwordMatch = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!passwordMatch) {
    const error = new Error(
      "Invalid email or password."
    );

    error.statusCode = 401;

    throw error;
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage,
      createdAt: user.createdAt,
    },
  };
};

module.exports = {
  registerUser,
  loginUser,
};
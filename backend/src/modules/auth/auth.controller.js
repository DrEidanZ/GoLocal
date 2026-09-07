const {
  loginUser,
  registerUser,
} = require("./auth.service");

const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
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
          "Password must be at least 6 characters.",
      });
    }

    const result = await registerUser(
      name,
      email,
      password
    );

    res.status(201).json({
      message: "Registration successful.",
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    console.error(
      "Error registering:",
      error
    );

    if (error.statusCode === 409) {
      return res.status(409).json({
        message: error.message,
      });
    }

    res.status(500).json({
      message: "Failed to register.",
    });
  }
};

const login = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message:
          "Email and password are required.",
      });
    }

    const result = await loginUser(
      email,
      password
    );

    res.json({
      message: "Login successful.",
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    console.error(
      "Error logging in:",
      error
    );

    if (error.statusCode === 401) {
      return res.status(401).json({
        message: error.message,
      });
    }

    res.status(500).json({
      message: "Failed to login.",
    });
  }
};

module.exports = {
  register,
  login,
};
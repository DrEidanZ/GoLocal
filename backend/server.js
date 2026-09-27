require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/db");

const PORT = 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(
      `GoLocal backend running on http://localhost:${PORT}`
    );

    console.log(
      `GoLocal backend available on http://192.168.1.8:${PORT}`
    );

    console.log(
      "Restaurant API enabled at /api/restaurants"
    );
  });
};

startServer();
require("dotenv").config();

require("./src/infrastructure/database/schema/restaurants");
require("./src/infrastructure/database/schema/users");
require("./src/infrastructure/database/schema/orders");
require("./src/infrastructure/database/migrations/users");

const app = require("./src/app");

const PORT = 5000;

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
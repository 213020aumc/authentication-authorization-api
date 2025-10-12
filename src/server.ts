import app from "./app.js";
import config from "./config/index.js";
import { AppDataSource } from "./config/data-source.js";

const startServer = async () => {
  try {
    await AppDataSource.initialize();
    console.log("✅ Database connection has been established successfully.");

    const port = config.port;
    app.listen(port, () => {
      console.log(`🚀 Server running on port http://localhost:${port}`);
    });
  } catch (error) {
    console.error("❌ Error during server startup:", error);
    process.exit(1);
  }
};

startServer();

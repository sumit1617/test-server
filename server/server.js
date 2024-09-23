const app = require("./app");
const connectDatabase = require("./config/database");

// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: __dirname + "/config/config.env" });
  console.log(`Environment ${process.env.NODE_ENV}`);
}

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

// Connecting to database
connectDatabase();

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});

// Unhandled Promise Rejections
process.on("Unhandled Rejections", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting Down the Server due to Unhandled Promise Rejections`);

  server.close(() => {
    process.exit(1);
  });
});

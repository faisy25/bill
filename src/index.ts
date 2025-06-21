// This is a simple Express server.
// Import the Express package
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
// Import the dotenv
import dotenv from "dotenv";

// Logging the console information with colors to identify.
import Logging from "./shared/library/logging";
import mainRoutes from "./modules/index.routes";
import { errorHandler } from "./shared/middlewares/error.middleware";

// Create an instance of an Express server
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Call the dotenv config
// Determine environment
const env = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env.${env}` });

// Set the port number
const port = process.env.PORT;

// Define a route that returns a JSON object with a message.
app.use("/api", mainRoutes);

app.use(errorHandler);

Logging.info("info");
Logging.warn("warn");
Logging.error("error");
Logging.log("log or success");
// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Running in ${env} mode`);
  console.log(`Server running at http://localhost:${port}`);
});

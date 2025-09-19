import "reflect-metadata";
import * as dotenv from "dotenv";
dotenv.config(); // Loads .env into process.env
export * from "./handlers/userHandler.js";

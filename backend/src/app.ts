import express from "express";
import dotenv from "dotenv";
import { connectToDatabase } from "./utils/connection";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port 5000 ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
    process.exit(1);
  });

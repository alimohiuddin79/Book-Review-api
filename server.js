import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import Book from "./models/Book.js";
import userRoutes from "./routes/user.js";
import authUserRoutes from "./routes/auth_user.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

dotenv.config();
// CONSTANTS
const app = express();
const PORT = process.env.PORT || 8000;

// MIDDLEWARES
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// ROUTES

app.use("/users", userRoutes);
app.use("/auth", authUserRoutes);

app.get("/", (req, res) => {
  res.send("hello");
});

// SERVER

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    app.listen(PORT, () => console.log(`server is running on port: ${PORT}`));
  })
  .catch((error) => console.error(error));

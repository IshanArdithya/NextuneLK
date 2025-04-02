import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import adminRoutes from "./routes/admin.route.js";

dotenv.config();

const app = express();

const port = process.env.PORT;

app.use(express.json());

app.use("/api/admins", adminRoutes);

app.listen(port, () => {
  connectDB();
  console.log("Server started at http://localhost:" + port);
});

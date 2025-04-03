import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import adminRoutes from "./routes/admin.route.js";
import externalApiRoutes from "./routes/externalApi.route.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());

connectDB();

app.use("/api/admins", adminRoutes);
app.use("/api/external", externalApiRoutes);

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});

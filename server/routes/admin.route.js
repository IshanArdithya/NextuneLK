import express from "express";
import { loginAdmin, registerAdmin } from "../controllers/admin.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

export default router;

import Admin from "../models/admin.model.js";
import jwt from "jsonwebtoken";

export const registerAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide all fields" });
    }

    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ success: false, message: "Admin already exists" });
    }

    const newAdmin = new Admin({ username, password });
    await newAdmin.save();

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      admin: {
        id: newAdmin._id,
        username: newAdmin.username,
      },
    });
  } catch (error) {
    console.error("Error in adding admin:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      adminId: admin._id,
      username: admin.username,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

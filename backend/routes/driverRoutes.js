import express from "express";
import {
  getAllDrivers,
  createDriver,
  updateDriver,
  softDeleteDriver,
} from "../controllers/driverController.js";

const router = express.Router();

router.get("/", getAllDrivers);       // Fetch all non-deleted drivers
router.post("/", createDriver);       // Create new driver
router.put("/:id", updateDriver);     // Update driver
router.patch("/:id", softDeleteDriver); // Soft delete driver

export default router;

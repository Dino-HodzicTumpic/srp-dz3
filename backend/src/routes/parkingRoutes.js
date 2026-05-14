import express from "express";
import {
  createParking,
  deleteParking,
  getAllParkings,
  getParkingById,
  updateParking,
} from "../controllers/parkingController.js";

const router = express.Router();

router.get("/", getAllParkings);
router.get("/:id", getParkingById);
router.post("/", createParking);
router.put("/:id", updateParking);
router.delete("/:id", deleteParking);

export default router;

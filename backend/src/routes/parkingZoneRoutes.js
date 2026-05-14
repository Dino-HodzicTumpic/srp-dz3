import express from "express";
import {
  createParkingZone,
  deleteParkingZone,
  getAllParkingZones,
  getParkingZoneById,
  updateParkingZone,
} from "../controllers/parkingZoneController.js";

const router = express.Router();

router.get("/", getAllParkingZones);
router.get("/:id", getParkingZoneById);
router.post("/", createParkingZone);
router.put("/:id", updateParkingZone);
router.delete("/:id", deleteParkingZone);

export default router;

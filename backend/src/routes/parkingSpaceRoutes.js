import express from "express";
import {
  createParkingSpace,
  deleteParkingSpace,
  getParkingSpace,
  listParkingSpaces,
  updateParkingSpace,
} from "../controllers/parkingSpaceController.js";

const router = express.Router();

router.get("/", listParkingSpaces);
router.get("/:id", getParkingSpace);
router.post("/", createParkingSpace);
router.put("/:id", updateParkingSpace);
router.delete("/:id", deleteParkingSpace);

export default router;

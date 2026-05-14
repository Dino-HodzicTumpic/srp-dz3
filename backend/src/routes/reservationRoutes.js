import express from "express";
import {
  createReservation,
  deleteReservation,
  getReservation,
  listReservations,
  updateReservation,
} from "../controllers/reservationController.js";

const router = express.Router();

router.get("/", listReservations);
router.get("/:id", getReservation);
router.post("/", createReservation);
router.put("/:id", updateReservation);
router.delete("/:id", deleteReservation);

export default router;

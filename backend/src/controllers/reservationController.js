import {
  createReservationEntry,
  deleteReservationEntry,
  getAllReservations,
  getReservationById,
  updateReservationEntry,
} from "../services/reservationService.js";

export const listReservations = async (req, res) => {
  try {
    const reservations = await getAllReservations();
    return res.json(reservations);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getReservation = async (req, res) => {
  try {
    const reservation = await getReservationById(req.params.id);
    return res.json(reservation);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message });
  }
};

export const createReservation = async (req, res) => {
  try {
    const reservation = await createReservationEntry(req.body);
    return res.status(201).json(reservation);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message });
  }
};

export const updateReservation = async (req, res) => {
  try {
    const reservation = await updateReservationEntry(req.params.id, req.body);
    return res.json(reservation);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message });
  }
};

export const deleteReservation = async (req, res) => {
  try {
    await deleteReservationEntry(req.params.id);
    return res.status(204).send();
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message });
  }
};

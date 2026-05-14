import {
  createParkingSpaceEntry,
  deleteParkingSpaceEntry,
  getAllParkingSpaces,
  getParkingSpaceById,
  updateParkingSpaceEntry,
} from "../services/parkingSpaceService.js";

export const listParkingSpaces = async (req, res) => {
  try {
    const { parkingId } = req.query;
    const spaces = await getAllParkingSpaces(parkingId);
    return res.json(spaces);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message });
  }
};

export const getParkingSpace = async (req, res) => {
  try {
    const space = await getParkingSpaceById(req.params.id);
    return res.json(space);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message });
  }
};

export const createParkingSpace = async (req, res) => {
  try {
    const space = await createParkingSpaceEntry(req.body);
    return res.status(201).json(space);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message });
  }
};

export const updateParkingSpace = async (req, res) => {
  try {
    const space = await updateParkingSpaceEntry(req.params.id, req.body);
    return res.json(space);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message });
  }
};

export const deleteParkingSpace = async (req, res) => {
  try {
    await deleteParkingSpaceEntry(req.params.id);
    return res.status(204).send();
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message });
  }
};

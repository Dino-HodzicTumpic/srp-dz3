import {
  createParkingEntry,
  deleteParkingEntry,
  getAllParkings as getAllParkingsService,
  getParkingById as getParkingByIdService,
  updateParkingEntry,
} from "../services/parkingService.js";

export const getAllParkings = async (req, res) => {
  try {
    const parkings = await getAllParkingsService();
    return res.json(parkings);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getParkingById = async (req, res) => {
  const { id } = req.params;
  try {
    const parking = await getParkingByIdService(id);
    return res.json(parking);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message });
  }
};

export const createParking = async (req, res) => {
  try {
    const parking = await createParkingEntry(req.body);
    return res.status(201).json(parking);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message });
  }
};

export const updateParking = async (req, res) => {
  try {
    const parking = await updateParkingEntry(req.params.id, req.body);
    return res.json(parking);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message });
  }
};

export const deleteParking = async (req, res) => {
  try {
    await deleteParkingEntry(req.params.id);
    return res.status(204).send();
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message });
  }
};

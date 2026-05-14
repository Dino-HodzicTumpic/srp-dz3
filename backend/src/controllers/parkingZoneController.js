import {
  createParkingZoneEntry,
  deleteParkingZoneEntry,
  getAllParkingZones as getAllParkingZonesService,
  getParkingZoneById as getParkingZoneByIdService,
  updateParkingZoneEntry,
} from "../services/parkingZoneService.js";

export const getAllParkingZones = async (req, res) => {
  try {
    const zones = await getAllParkingZonesService();
    return res.json(zones);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getParkingZoneById = async (req, res) => {
  const { id } = req.params;
  try {
    const zone = await getParkingZoneByIdService(id);
    return res.json(zone);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message });
  }
};

export const createParkingZone = async (req, res) => {
  try {
    const zone = await createParkingZoneEntry(req.body);
    return res.status(201).json(zone);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message });
  }
};

export const updateParkingZone = async (req, res) => {
  try {
    const zone = await updateParkingZoneEntry(req.params.id, req.body);
    return res.json(zone);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message });
  }
};

export const deleteParkingZone = async (req, res) => {
  try {
    await deleteParkingZoneEntry(req.params.id);
    return res.status(204).send();
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message });
  }
};

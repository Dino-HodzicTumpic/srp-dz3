import {
  createParking,
  deleteParking,
  findAllParkings,
  findParkingById,
  updateParking,
} from "../repositories/parkingRepository.js";

const parseId = (value, label) => {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    const error = new Error(`Invalid ${label} id`);
    error.statusCode = 400;
    throw error;
  }
  return parsed;
};

export const getAllParkings = async () => {
  return findAllParkings();
};

export const getParkingById = async (id) => {
  const parsedId = parseId(id, "parking");

  const parking = await findParkingById(parsedId);
  if (!parking) {
    const error = new Error("Parking not found");
    error.statusCode = 404;
    throw error;
  }

  return parking;
};

export const createParkingEntry = async (payload) => {
  const { zone_id, name, location, total_spaces } = payload;
  const parsedZoneId = parseId(zone_id, "zone");

  return createParking({
    zone_id: parsedZoneId,
    name,
    location,
    total_spaces,
  });
};

export const updateParkingEntry = async (id, payload) => {
  const parsedId = parseId(id, "parking");
  const existing = await findParkingById(parsedId);
  if (!existing) {
    const error = new Error("Parking not found");
    error.statusCode = 404;
    throw error;
  }

  const data = {};
  if (payload.zone_id !== undefined) {
    data.zone_id = parseId(payload.zone_id, "zone");
  }
  if (payload.name !== undefined) {
    data.name = payload.name;
  }
  if (payload.location !== undefined) {
    data.location = payload.location;
  }
  if (payload.total_spaces !== undefined) {
    data.total_spaces = payload.total_spaces;
  }

  return updateParking(parsedId, data);
};

export const deleteParkingEntry = async (id) => {
  const parsedId = parseId(id, "parking");
  const existing = await findParkingById(parsedId);
  if (!existing) {
    const error = new Error("Parking not found");
    error.statusCode = 404;
    throw error;
  }

  await deleteParking(parsedId);
};

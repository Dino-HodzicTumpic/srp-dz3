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

const withComputedTotalSpaces = (parking) => {
  if (!parking) {
    return parking;
  }
  const totalSpaces = Array.isArray(parking.parkingspaces)
    ? parking.parkingspaces.length
    : 0;
  return { ...parking, total_spaces: totalSpaces };
};

const withComputedTotalSpacesList = (parkings) => {
  if (!Array.isArray(parkings)) {
    return parkings;
  }
  return parkings.map((parking) => withComputedTotalSpaces(parking));
};

export const getAllParkings = async () => {
  const parkings = await findAllParkings();
  return withComputedTotalSpacesList(parkings);
};

export const getParkingById = async (id) => {
  const parsedId = parseId(id, "parking");

  const parking = await findParkingById(parsedId);
  if (!parking) {
    const error = new Error("Parking not found");
    error.statusCode = 404;
    throw error;
  }

  return withComputedTotalSpaces(parking);
};

export const createParkingEntry = async (payload) => {
  const { zone_id, name, location } = payload;
  const parsedZoneId = parseId(zone_id, "zone");

  const created = await createParking({
    zone_id: parsedZoneId,
    name,
    location,
  });

  return withComputedTotalSpaces(created);
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

  const updated = await updateParking(parsedId, data);
  return withComputedTotalSpaces(updated);
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

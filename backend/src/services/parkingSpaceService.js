import {
  createParkingSpace,
  deleteParkingSpace,
  findAllParkingSpaces,
  findParkingSpaceById,
  updateParkingSpace,
} from "../repositories/parkingSpaceRepository.js";
import { findParkingById } from "../repositories/parkingRepository.js";

const parseId = (value, label) => {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    const error = new Error(`Invalid ${label} id`);
    error.statusCode = 400;
    throw error;
  }
  return parsed;
};

export const getAllParkingSpaces = async (parkingId) => {
  const parsedParkingId = parkingId ? parseId(parkingId, "parking") : null;
  return findAllParkingSpaces(parsedParkingId);
};

export const getParkingSpaceById = async (id) => {
  const parsedId = parseId(id, "parking space");
  const space = await findParkingSpaceById(parsedId);
  if (!space) {
    const error = new Error("Parking space not found");
    error.statusCode = 404;
    throw error;
  }
  return space;
};

export const createParkingSpaceEntry = async (payload) => {
  const { parking_id, space_number, space_type } = payload;
  const parsedParkingId = parseId(parking_id, "parking");

  const parking = await findParkingById(parsedParkingId);
  if (!parking) {
    const error = new Error("Parking not found");
    error.statusCode = 404;
    throw error;
  }

  return createParkingSpace({
    parking_id: parsedParkingId,
    space_number,
    space_type,
  });
};

export const updateParkingSpaceEntry = async (id, payload) => {
  const parsedId = parseId(id, "parking space");
  const existing = await findParkingSpaceById(parsedId);
  if (!existing) {
    const error = new Error("Parking space not found");
    error.statusCode = 404;
    throw error;
  }

  const data = {};
  if (payload.parking_id !== undefined) {
    const parsedParkingId = parseId(payload.parking_id, "parking");
    const parking = await findParkingById(parsedParkingId);
    if (!parking) {
      const error = new Error("Parking not found");
      error.statusCode = 404;
      throw error;
    }
    data.parking_id = parsedParkingId;
  }
  if (payload.space_number !== undefined) {
    data.space_number = payload.space_number;
  }
  if (payload.space_type !== undefined) {
    data.space_type = payload.space_type;
  }

  return updateParkingSpace(parsedId, data);
};

export const deleteParkingSpaceEntry = async (id) => {
  const parsedId = parseId(id, "parking space");
  const existing = await findParkingSpaceById(parsedId);
  if (!existing) {
    const error = new Error("Parking space not found");
    error.statusCode = 404;
    throw error;
  }

  await deleteParkingSpace(parsedId);
};

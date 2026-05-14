import {
  countParkingsByZone,
  createParkingZone,
  deleteParkingZone,
  findAllParkingZones,
  findParkingZoneById,
  findParkingZoneByName,
  updateParkingZone,
} from "../repositories/parkingZoneRepository.js";

const parseId = (value, label) => {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    const error = new Error(`Invalid ${label} id`);
    error.statusCode = 400;
    throw error;
  }
  return parsed;
};

const parsePrice = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    const error = new Error("Invalid price_per_hour");
    error.statusCode = 400;
    throw error;
  }
  return parsed;
};

const validateZonePayload = ({ name, price_per_hour, description }) => {
  if (name === undefined || name === null) {
    const error = new Error("Name is required");
    error.statusCode = 400;
    throw error;
  }

  const trimmedName = String(name).trim();
  const namePattern = /^Z[A-Z0-9]{1,9}$/;
  if (!namePattern.test(trimmedName)) {
    const error = new Error(
      "Name must start with 'Z' and contain only uppercase letters or digits (2-10 chars)",
    );
    error.statusCode = 400;
    throw error;
  }

  if (price_per_hour === undefined || price_per_hour === null) {
    const error = new Error("price_per_hour is required");
    error.statusCode = 400;
    throw error;
  }

  const parsedPrice = parsePrice(price_per_hour);
  if (parsedPrice < 0.5 || parsedPrice > 100) {
    const error = new Error("price_per_hour must be between 0.5 and 100");
    error.statusCode = 400;
    throw error;
  }

  if (!Number.isInteger(parsedPrice * 2)) {
    const error = new Error("price_per_hour must be a multiple of 0.5");
    error.statusCode = 400;
    throw error;
  }

  if (parsedPrice > 10) {
    const trimmedDescription = String(description ?? "").trim();
    if (trimmedDescription.length < 10) {
      const error = new Error(
        "description must be at least 10 characters when price_per_hour is above 10",
      );
      error.statusCode = 400;
      throw error;
    }
  }

  return {
    name: trimmedName,
    price_per_hour: parsedPrice,
    description:
      description === undefined || description === null
        ? null
        : String(description).trim(),
  };
};

export const getAllParkingZones = async () => {
  return findAllParkingZones();
};

export const getParkingZoneById = async (id) => {
  const parsedId = parseId(id, "parking zone");
  const zone = await findParkingZoneById(parsedId);
  if (!zone) {
    const error = new Error("Parking zone not found");
    error.statusCode = 404;
    throw error;
  }
  return zone;
};

export const createParkingZoneEntry = async (payload) => {
  const validated = validateZonePayload(payload);

  const existing = await findParkingZoneByName(validated.name);
  if (existing) {
    const error = new Error("Parking zone name already exists");
    error.statusCode = 409;
    throw error;
  }

  return createParkingZone(validated);
};

export const updateParkingZoneEntry = async (id, payload) => {
  const parsedId = parseId(id, "parking zone");
  const existing = await findParkingZoneById(parsedId);
  if (!existing) {
    const error = new Error("Parking zone not found");
    error.statusCode = 404;
    throw error;
  }

  const data = { ...existing, ...payload };
  const validated = validateZonePayload({
    name: data.name,
    price_per_hour: data.price_per_hour,
    description: data.description,
  });

  if (validated.name !== existing.name) {
    const nameExists = await findParkingZoneByName(validated.name);
    if (nameExists) {
      const error = new Error("Parking zone name already exists");
      error.statusCode = 409;
      throw error;
    }
  }

  return updateParkingZone(parsedId, validated);
};

export const deleteParkingZoneEntry = async (id) => {
  const parsedId = parseId(id, "parking zone");
  const existing = await findParkingZoneById(parsedId);
  if (!existing) {
    const error = new Error("Parking zone not found");
    error.statusCode = 404;
    throw error;
  }

  const parkingsCount = await countParkingsByZone(parsedId);
  if (parkingsCount > 0) {
    const error = new Error(
      "Cannot delete parking zone that is used by existing parkings",
    );
    error.statusCode = 409;
    throw error;
  }

  return deleteParkingZone(parsedId);
};

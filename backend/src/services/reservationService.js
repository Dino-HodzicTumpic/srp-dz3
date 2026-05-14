import {
  createReservation,
  deleteReservation,
  findAllReservations,
  findOverlappingActiveReservations,
  findReservationById,
  updateReservation,
} from "../repositories/reservationRepository.js";
import { findParkingSpaceById } from "../repositories/parkingSpaceRepository.js";
import { findUserById } from "../repositories/userRepository.js";
import { findVehicleById } from "../repositories/vehicleRepository.js";

const parseId = (value, label) => {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    const error = new Error(`Invalid ${label} id`);
    error.statusCode = 400;
    throw error;
  }
  return parsed;
};

const parseDateTime = (value, label) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    const error = new Error(`Invalid ${label}`);
    error.statusCode = 400;
    throw error;
  }
  return parsed;
};

const normalizeStatus = (value) => {
  const status = String(value ?? "active")
    .trim()
    .toLowerCase();
  const allowed = ["active", "cancelled", "completed"];
  if (!allowed.includes(status)) {
    const error = new Error("Invalid status");
    error.statusCode = 400;
    throw error;
  }
  return status;
};

const validateReservationPayload = async (payload, existingId) => {
  const userId = parseId(payload.user_id, "user");
  const vehicleId = parseId(payload.vehicle_id, "vehicle");
  const parkingSpaceId = parseId(payload.parking_space_id, "parking space");
  const startTime = parseDateTime(payload.start_time, "start_time");
  const endTime = parseDateTime(payload.end_time, "end_time");
  const status = normalizeStatus(payload.status);

  if (startTime >= endTime) {
    const error = new Error("start_time must be before end_time");
    error.statusCode = 400;
    throw error;
  }

  const now = new Date();
  if (startTime < now) {
    const error = new Error("start_time cannot be in the past");
    error.statusCode = 400;
    throw error;
  }

  const user = await findUserById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const vehicle = await findVehicleById(vehicleId);
  if (!vehicle) {
    const error = new Error("Vehicle not found");
    error.statusCode = 404;
    throw error;
  }

  const space = await findParkingSpaceById(parkingSpaceId);
  if (!space) {
    const error = new Error("Parking space not found");
    error.statusCode = 404;
    throw error;
  }

  if (status === "active") {
    const overlapping = await findOverlappingActiveReservations({
      parkingSpaceId,
      startTime,
      endTime,
      excludeId: existingId,
    });

    if (overlapping.length > 0) {
      const error = new Error(
        "There is already an active reservation for this parking space in the selected time range",
      );
      error.statusCode = 409;
      throw error;
    }
  }

  return {
    user_id: userId,
    vehicle_id: vehicleId,
    parking_space_id: parkingSpaceId,
    start_time: startTime,
    end_time: endTime,
    status,
  };
};

export const getAllReservations = async () => {
  return findAllReservations();
};

export const getReservationById = async (id) => {
  const parsedId = parseId(id, "reservation");
  const reservation = await findReservationById(parsedId);
  if (!reservation) {
    const error = new Error("Reservation not found");
    error.statusCode = 404;
    throw error;
  }
  return reservation;
};

export const createReservationEntry = async (payload) => {
  const validated = await validateReservationPayload(
    {
      ...payload,
      status: "active",
    },
    null,
  );
  return createReservation(validated);
};

export const updateReservationEntry = async (id, payload) => {
  const parsedId = parseId(id, "reservation");
  const existing = await findReservationById(parsedId);
  if (!existing) {
    const error = new Error("Reservation not found");
    error.statusCode = 404;
    throw error;
  }

  const merged = {
    user_id: payload.user_id ?? existing.user_id,
    vehicle_id: payload.vehicle_id ?? existing.vehicle_id,
    parking_space_id: payload.parking_space_id ?? existing.parking_space_id,
    start_time: payload.start_time ?? existing.start_time,
    end_time: payload.end_time ?? existing.end_time,
    status: payload.status ?? existing.status,
  };

  const validated = await validateReservationPayload(merged, parsedId);
  return updateReservation(parsedId, validated);
};

export const deleteReservationEntry = async (id) => {
  const parsedId = parseId(id, "reservation");
  const existing = await findReservationById(parsedId);
  if (!existing) {
    const error = new Error("Reservation not found");
    error.statusCode = 404;
    throw error;
  }

  await deleteReservation(parsedId);
};

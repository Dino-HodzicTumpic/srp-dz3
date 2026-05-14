import prisma from "../config/prisma.js";

export const findAllParkingSpaces = async (parkingId) => {
  if (!parkingId) {
    const error = new Error("parkingId is required");
    error.statusCode = 400;
    throw error;
  }

  return prisma.parkingspaces.findMany({
    where: { parking_id: Number(parkingId) },
    include: { parkings: true },
  });
};

export const findParkingSpaceById = async (id) => {
  return prisma.parkingspaces.findUnique({
    where: { id },
    include: {
      parkings: true,
    },
  });
};

export const createParkingSpace = async (data) => {
  return prisma.parkingspaces.create({
    data,
    include: {
      parkings: true,
    },
  });
};

export const updateParkingSpace = async (id, data) => {
  return prisma.parkingspaces.update({
    where: { id },
    data,
    include: {
      parkings: true,
    },
  });
};

export const deleteParkingSpace = async (id) => {
  return prisma.parkingspaces.delete({
    where: { id },
  });
};

import prisma from "../config/prisma.js";

export const findAllParkings = async () => {
  return prisma.parkings.findMany({
    include: {
      parkingzones: true,
      parkingspaces: true,
    },
  });
};

export const findParkingById = async (id) => {
  return prisma.parkings.findUnique({
    where: { id },
    include: {
      parkingzones: true,
      parkingspaces: true,
    },
  });
};

export const createParking = async (data) => {
  return prisma.parkings.create({
    data,
    include: {
      parkingzones: true,
      parkingspaces: true,
    },
  });
};

export const updateParking = async (id, data) => {
  return prisma.parkings.update({
    where: { id },
    data,
    include: {
      parkingzones: true,
      parkingspaces: true,
    },
  });
};

export const deleteParking = async (id) => {
  return prisma.parkings.delete({
    where: { id },
  });
};

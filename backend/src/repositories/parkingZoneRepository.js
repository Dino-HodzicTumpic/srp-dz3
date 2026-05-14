import prisma from "../config/prisma.js";

export const findAllParkingZones = async () => {
  return prisma.parkingzones.findMany({
    orderBy: { name: "asc" },
  });
};

export const findParkingZoneById = async (id) => {
  return prisma.parkingzones.findUnique({
    where: { id },
  });
};

export const findParkingZoneByName = async (name) => {
  return prisma.parkingzones.findUnique({
    where: { name },
  });
};

export const createParkingZone = async (data) => {
  return prisma.parkingzones.create({
    data,
  });
};

export const updateParkingZone = async (id, data) => {
  return prisma.parkingzones.update({
    where: { id },
    data,
  });
};

export const deleteParkingZone = async (id) => {
  return prisma.parkingzones.delete({
    where: { id },
  });
};

export const countParkingsByZone = async (zoneId) => {
  return prisma.parkings.count({
    where: { zone_id: zoneId },
  });
};

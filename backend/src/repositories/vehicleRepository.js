import prisma from "../config/prisma.js";

export const findAllVehicles = async () => {
  return prisma.vehicles.findMany({
    select: {
      id: true,
      license_plate: true,
      vehicle_type: true,
      user_id: true,
    },
    orderBy: { license_plate: "asc" },
  });
};

export const findVehicleById = async (id) => {
  return prisma.vehicles.findUnique({
    where: { id },
  });
};

import prisma from "../config/prisma.js";

const reservationInclude = {
  users: true,
  vehicles: true,
  parkingspaces: {
    include: {
      parkings: true,
    },
  },
};

export const findAllReservations = async () => {
  return prisma.reservations.findMany({
    include: reservationInclude,
    orderBy: { start_time: "desc" },
  });
};

export const findReservationById = async (id) => {
  return prisma.reservations.findUnique({
    where: { id },
    include: reservationInclude,
  });
};

export const createReservation = async (data) => {
  return prisma.reservations.create({
    data,
    include: reservationInclude,
  });
};

export const updateReservation = async (id, data) => {
  return prisma.reservations.update({
    where: { id },
    data,
    include: reservationInclude,
  });
};

export const deleteReservation = async (id) => {
  return prisma.reservations.delete({
    where: { id },
  });
};

export const findOverlappingActiveReservations = async ({
  parkingSpaceId,
  startTime,
  endTime,
  excludeId,
}) => {
  const where = {
    parking_space_id: parkingSpaceId,
    status: "active",
    start_time: { lt: endTime },
    end_time: { gt: startTime },
  };

  if (excludeId) {
    where.id = { not: excludeId };
  }

  return prisma.reservations.findMany({
    where,
    select: { id: true },
  });
};

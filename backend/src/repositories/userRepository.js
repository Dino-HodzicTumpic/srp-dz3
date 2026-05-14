import prisma from "../config/prisma.js";

export const findAllUsers = async () => {
  return prisma.users.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
    orderBy: { name: "asc" },
  });
};

export const findUserById = async (id) => {
  return prisma.users.findUnique({
    where: { id },
  });
};

import { jest } from "@jest/globals";

const prismaMock = {
  parkings: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

jest.unstable_mockModule("../../../src/config/prisma.js", () => ({
  default: prismaMock,
}));

const repository =
  await import("../../../src/repositories/parkingRepository.js");

describe("parkingRepository", () => {
  test("findAllParkings queries with relations", async () => {
    prismaMock.parkings.findMany.mockResolvedValue([]);

    await repository.findAllParkings();

    expect(prismaMock.parkings.findMany).toHaveBeenCalledWith({
      include: {
        parkingzones: true,
        parkingspaces: true,
      },
    });
  });

  test("findParkingById queries by id", async () => {
    prismaMock.parkings.findUnique.mockResolvedValue({ id: 3 });

    await repository.findParkingById(3);

    expect(prismaMock.parkings.findUnique).toHaveBeenCalledWith({
      where: { id: 3 },
      include: {
        parkingzones: true,
        parkingspaces: true,
      },
    });
  });

  test("createParking includes relations", async () => {
    prismaMock.parkings.create.mockResolvedValue({ id: 10 });

    await repository.createParking({ name: "A" });

    expect(prismaMock.parkings.create).toHaveBeenCalledWith({
      data: { name: "A" },
      include: {
        parkingzones: true,
        parkingspaces: true,
      },
    });
  });

  test("updateParking includes relations", async () => {
    prismaMock.parkings.update.mockResolvedValue({ id: 11 });

    await repository.updateParking(11, { name: "B" });

    expect(prismaMock.parkings.update).toHaveBeenCalledWith({
      where: { id: 11 },
      data: { name: "B" },
      include: {
        parkingzones: true,
        parkingspaces: true,
      },
    });
  });

  test("deleteParking deletes by id", async () => {
    prismaMock.parkings.delete.mockResolvedValue({ id: 12 });

    await repository.deleteParking(12);

    expect(prismaMock.parkings.delete).toHaveBeenCalledWith({
      where: { id: 12 },
    });
  });
});

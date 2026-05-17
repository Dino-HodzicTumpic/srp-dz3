import { jest } from "@jest/globals";

const prismaMock = {
  parkingzones: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  parkings: {
    count: jest.fn(),
  },
};

jest.unstable_mockModule("../../../src/config/prisma.js", () => ({
  default: prismaMock,
}));

const repository =
  await import("../../../src/repositories/parkingZoneRepository.js");

describe("parkingZoneRepository", () => {
  test("findAllParkingZones orders by name", async () => {
    prismaMock.parkingzones.findMany.mockResolvedValue([]);

    await repository.findAllParkingZones();

    expect(prismaMock.parkingzones.findMany).toHaveBeenCalledWith({
      orderBy: { name: "asc" },
    });
  });

  test("countParkingsByZone counts by zone id", async () => {
    prismaMock.parkings.count.mockResolvedValue(0);

    await repository.countParkingsByZone(5);

    expect(prismaMock.parkings.count).toHaveBeenCalledWith({
      where: { zone_id: 5 },
    });
  });

  test("findParkingZoneById queries by id", async () => {
    prismaMock.parkingzones.findUnique.mockResolvedValue({ id: 2 });

    await repository.findParkingZoneById(2);

    expect(prismaMock.parkingzones.findUnique).toHaveBeenCalledWith({
      where: { id: 2 },
    });
  });

  test("findParkingZoneByName queries by name", async () => {
    prismaMock.parkingzones.findUnique.mockResolvedValue({ id: 3 });

    await repository.findParkingZoneByName("Z3");

    expect(prismaMock.parkingzones.findUnique).toHaveBeenCalledWith({
      where: { name: "Z3" },
    });
  });

  test("createParkingZone creates with data", async () => {
    prismaMock.parkingzones.create.mockResolvedValue({ id: 4 });

    await repository.createParkingZone({ name: "Z4" });

    expect(prismaMock.parkingzones.create).toHaveBeenCalledWith({
      data: { name: "Z4" },
    });
  });

  test("updateParkingZone updates by id", async () => {
    prismaMock.parkingzones.update.mockResolvedValue({ id: 5 });

    await repository.updateParkingZone(5, { name: "Z5" });

    expect(prismaMock.parkingzones.update).toHaveBeenCalledWith({
      where: { id: 5 },
      data: { name: "Z5" },
    });
  });

  test("deleteParkingZone deletes by id", async () => {
    prismaMock.parkingzones.delete.mockResolvedValue({ id: 6 });

    await repository.deleteParkingZone(6);

    expect(prismaMock.parkingzones.delete).toHaveBeenCalledWith({
      where: { id: 6 },
    });
  });
});

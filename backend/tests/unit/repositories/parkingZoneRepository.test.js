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
});

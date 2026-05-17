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
});

import { jest } from "@jest/globals";

jest.unstable_mockModule(
  "../../../src/repositories/parkingZoneRepository.js",
  () => ({
    countParkingsByZone: jest.fn(),
    createParkingZone: jest.fn(),
    deleteParkingZone: jest.fn(),
    findAllParkingZones: jest.fn(),
    findParkingZoneById: jest.fn(),
    findParkingZoneByName: jest.fn(),
    updateParkingZone: jest.fn(),
  }),
);

const service = await import("../../../src/services/parkingZoneService.js");
const repo = await import("../../../src/repositories/parkingZoneRepository.js");

describe("parkingZoneService", () => {
  test("getAllParkingZones returns list", async () => {
    repo.findAllParkingZones.mockResolvedValue([{ id: 1 }]);

    const result = await service.getAllParkingZones();

    expect(result).toEqual([{ id: 1 }]);
  });

  test("getParkingZoneById rejects missing record", async () => {
    repo.findParkingZoneById.mockResolvedValue(null);

    await expect(service.getParkingZoneById("9")).rejects.toMatchObject({
      statusCode: 404,
      message: "Parking zone not found",
    });
  });

  test("createParkingZoneEntry rejects invalid name", async () => {
    await expect(
      service.createParkingZoneEntry({ name: "zone", price_per_hour: 1 }),
    ).rejects.toMatchObject({
      statusCode: 400,
      message:
        "Name must start with 'Z' and contain only uppercase letters or digits (2-10 chars)",
    });
  });

  test("createParkingZoneEntry rejects missing price", async () => {
    await expect(
      service.createParkingZoneEntry({ name: "Z1" }),
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "price_per_hour is required",
    });
  });

  test("createParkingZoneEntry rejects duplicate name", async () => {
    repo.findParkingZoneByName.mockResolvedValue({ id: 1, name: "Z1" });

    await expect(
      service.createParkingZoneEntry({ name: "Z1", price_per_hour: 1 }),
    ).rejects.toMatchObject({
      statusCode: 409,
      message: "Parking zone name already exists",
    });
  });

  test("deleteParkingZoneEntry rejects when parkings exist", async () => {
    repo.findParkingZoneById.mockResolvedValue({ id: 2, name: "Z2" });
    repo.countParkingsByZone.mockResolvedValue(3);

    await expect(service.deleteParkingZoneEntry("2")).rejects.toMatchObject({
      statusCode: 409,
      message: "Cannot delete parking zone that is used by existing parkings",
    });
  });

  test("createParkingZoneEntry creates new zone", async () => {
    repo.findParkingZoneByName.mockResolvedValue(null);
    repo.createParkingZone.mockResolvedValue({ id: 3, name: "Z3" });

    const result = await service.createParkingZoneEntry({
      name: "Z3",
      price_per_hour: 2,
      description: "Opis",
    });

    expect(result).toEqual({ id: 3, name: "Z3" });
  });

  test("updateParkingZoneEntry updates zone", async () => {
    repo.findParkingZoneById.mockResolvedValue({
      id: 4,
      name: "Z4",
      price_per_hour: 2,
      description: null,
    });
    repo.findParkingZoneByName.mockResolvedValue(null);
    repo.updateParkingZone.mockResolvedValue({ id: 4, name: "Z4A" });

    const result = await service.updateParkingZoneEntry("4", {
      name: "Z4A",
      price_per_hour: 2,
      description: null,
    });

    expect(result).toEqual({ id: 4, name: "Z4A" });
  });

  test("deleteParkingZoneEntry deletes zone", async () => {
    repo.findParkingZoneById.mockResolvedValue({ id: 5, name: "Z5" });
    repo.countParkingsByZone.mockResolvedValue(0);
    repo.deleteParkingZone.mockResolvedValue({ id: 5 });

    const result = await service.deleteParkingZoneEntry("5");

    expect(result).toEqual({ id: 5 });
  });
});

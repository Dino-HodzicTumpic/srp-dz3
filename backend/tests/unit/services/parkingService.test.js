import { jest } from "@jest/globals";

jest.unstable_mockModule(
  "../../../src/repositories/parkingRepository.js",
  () => ({
    findAllParkings: jest.fn(),
    findParkingById: jest.fn(),
    createParking: jest.fn(),
    updateParking: jest.fn(),
    deleteParking: jest.fn(),
  }),
);

const service = await import("../../../src/services/parkingService.js");
const repo = await import("../../../src/repositories/parkingRepository.js");

describe("parkingService", () => {
  test("getAllParkings returns computed totals", async () => {
    repo.findAllParkings.mockResolvedValue([
      { id: 1, parkingspaces: [{ id: 1 }, { id: 2 }] },
      { id: 2, parkingspaces: [] },
    ]);

    const result = await service.getAllParkings();

    expect(result).toEqual([
      { id: 1, parkingspaces: [{ id: 1 }, { id: 2 }], total_spaces: 2 },
      { id: 2, parkingspaces: [], total_spaces: 0 },
    ]);
  });

  test("getParkingById rejects non-numeric id", async () => {
    await expect(service.getParkingById("abc")).rejects.toMatchObject({
      statusCode: 400,
      message: "Invalid parking id",
    });
  });

  test("getParkingById returns computed total", async () => {
    repo.findParkingById.mockResolvedValue({
      id: 5,
      parkingspaces: [{ id: 1 }],
    });

    const result = await service.getParkingById("5");

    expect(result).toEqual({
      id: 5,
      parkingspaces: [{ id: 1 }],
      total_spaces: 1,
    });
  });

  test("getParkingById rejects missing record", async () => {
    repo.findParkingById.mockResolvedValue(null);

    await expect(service.getParkingById("7")).rejects.toMatchObject({
      statusCode: 404,
      message: "Parking not found",
    });
  });

  test("updateParkingEntry forwards parsed id and data", async () => {
    repo.findParkingById.mockResolvedValue({ id: 12 });
    repo.updateParking.mockResolvedValue({
      id: 12,
      name: "P",
      parkingspaces: [{ id: 1 }, { id: 2 }],
    });

    const result = await service.updateParkingEntry("12", {
      name: "P",
      total_spaces: 42,
    });

    expect(repo.updateParking).toHaveBeenCalledWith(12, {
      name: "P",
    });
    expect(result).toEqual({
      id: 12,
      name: "P",
      parkingspaces: [{ id: 1 }, { id: 2 }],
      total_spaces: 2,
    });
  });

  test("createParkingEntry ignores total_spaces input", async () => {
    repo.createParking.mockResolvedValue({
      id: 20,
      parkingspaces: [{ id: 1 }],
    });

    const result = await service.createParkingEntry({
      zone_id: "2",
      name: "A",
      location: "Loc",
      total_spaces: 99,
    });

    expect(repo.createParking).toHaveBeenCalledWith({
      zone_id: 2,
      name: "A",
      location: "Loc",
    });
    expect(result).toEqual({
      id: 20,
      parkingspaces: [{ id: 1 }],
      total_spaces: 1,
    });
  });

  test("deleteParkingEntry deletes existing", async () => {
    repo.findParkingById.mockResolvedValue({ id: 7 });
    repo.deleteParking.mockResolvedValue();

    await service.deleteParkingEntry("7");

    expect(repo.deleteParking).toHaveBeenCalledWith(7);
  });
});

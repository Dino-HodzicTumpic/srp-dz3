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
  test("getParkingById rejects non-numeric id", async () => {
    await expect(service.getParkingById("abc")).rejects.toMatchObject({
      statusCode: 400,
      message: "Invalid parking id",
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
    repo.updateParking.mockResolvedValue({ id: 12, name: "P" });

    const result = await service.updateParkingEntry("12", {
      name: "P",
      total_spaces: 42,
    });

    expect(repo.updateParking).toHaveBeenCalledWith(12, {
      name: "P",
      total_spaces: 42,
    });
    expect(result).toEqual({ id: 12, name: "P" });
  });
});

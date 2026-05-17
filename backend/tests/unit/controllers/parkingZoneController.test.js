import { jest } from "@jest/globals";

jest.unstable_mockModule("../../../src/services/parkingZoneService.js", () => ({
  getAllParkingZones: jest.fn(),
  getParkingZoneById: jest.fn(),
  createParkingZoneEntry: jest.fn(),
  updateParkingZoneEntry: jest.fn(),
  deleteParkingZoneEntry: jest.fn(),
}));

const { createParkingZone } =
  await import("../../../src/controllers/parkingZoneController.js");
const parkingZoneService =
  await import("../../../src/services/parkingZoneService.js");

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn();
  res.send = jest.fn();
  return res;
};

describe("parkingZoneController", () => {
  test("createParkingZone returns created zone", async () => {
    const req = { body: { name: "Z1", price_per_hour: 1 } };
    const res = createRes();
    parkingZoneService.createParkingZoneEntry.mockResolvedValue({
      id: 1,
      name: "Z1",
    });

    await createParkingZone(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: 1, name: "Z1" });
  });

  test("createParkingZone returns error status from service", async () => {
    const req = { body: { name: "bad" } };
    const res = createRes();
    const error = new Error("Name is required");
    error.statusCode = 400;
    parkingZoneService.createParkingZoneEntry.mockRejectedValue(error);

    await createParkingZone(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Name is required" });
  });
});

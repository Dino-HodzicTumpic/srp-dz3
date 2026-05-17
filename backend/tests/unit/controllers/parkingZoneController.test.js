import { jest } from "@jest/globals";

jest.unstable_mockModule("../../../src/services/parkingZoneService.js", () => ({
  getAllParkingZones: jest.fn(),
  getParkingZoneById: jest.fn(),
  createParkingZoneEntry: jest.fn(),
  updateParkingZoneEntry: jest.fn(),
  deleteParkingZoneEntry: jest.fn(),
}));

const {
  createParkingZone,
  deleteParkingZone,
  getAllParkingZones,
  getParkingZoneById,
  updateParkingZone,
} = await import("../../../src/controllers/parkingZoneController.js");
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
  test("getAllParkingZones returns list", async () => {
    const req = {};
    const res = createRes();
    parkingZoneService.getAllParkingZones.mockResolvedValue([{ id: 1 }]);

    await getAllParkingZones(req, res);

    expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
    expect(res.status).not.toHaveBeenCalled();
  });

  test("getParkingZoneById returns zone data", async () => {
    const req = { params: { id: "2" } };
    const res = createRes();
    parkingZoneService.getParkingZoneById.mockResolvedValue({
      id: 2,
      name: "Z2",
    });

    await getParkingZoneById(req, res);

    expect(res.json).toHaveBeenCalledWith({ id: 2, name: "Z2" });
    expect(res.status).not.toHaveBeenCalled();
  });

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

  test("updateParkingZone returns updated zone", async () => {
    const req = { params: { id: "3" }, body: { name: "Z3" } };
    const res = createRes();
    parkingZoneService.updateParkingZoneEntry.mockResolvedValue({
      id: 3,
      name: "Z3",
    });

    await updateParkingZone(req, res);

    expect(res.json).toHaveBeenCalledWith({ id: 3, name: "Z3" });
    expect(res.status).not.toHaveBeenCalled();
  });

  test("deleteParkingZone returns 204", async () => {
    const req = { params: { id: "4" } };
    const res = createRes();
    parkingZoneService.deleteParkingZoneEntry.mockResolvedValue();

    await deleteParkingZone(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });
});

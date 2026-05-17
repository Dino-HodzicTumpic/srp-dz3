import { jest } from "@jest/globals";

jest.unstable_mockModule("../../../src/services/parkingService.js", () => ({
  getAllParkings: jest.fn(),
  getParkingById: jest.fn(),
  createParkingEntry: jest.fn(),
  updateParkingEntry: jest.fn(),
  deleteParkingEntry: jest.fn(),
}));

const { getParkingById } =
  await import("../../../src/controllers/parkingController.js");
const parkingService = await import("../../../src/services/parkingService.js");

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn();
  res.send = jest.fn();
  return res;
};

describe("parkingController", () => {
  test("getParkingById returns parking data", async () => {
    const req = { params: { id: "5" } };
    const res = createRes();
    parkingService.getParkingById.mockResolvedValue({ id: 5, name: "A" });

    await getParkingById(req, res);

    expect(res.json).toHaveBeenCalledWith({ id: 5, name: "A" });
    expect(res.status).not.toHaveBeenCalled();
  });

  test("getParkingById returns status from service error", async () => {
    const req = { params: { id: "x" } };
    const res = createRes();
    const error = new Error("Invalid parking id");
    error.statusCode = 400;
    parkingService.getParkingById.mockRejectedValue(error);

    await getParkingById(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid parking id" });
  });
});

import { jest } from "@jest/globals";

jest.unstable_mockModule("../../../src/services/parkingService.js", () => ({
  getAllParkings: jest.fn(),
  getParkingById: jest.fn(),
  createParkingEntry: jest.fn(),
  updateParkingEntry: jest.fn(),
  deleteParkingEntry: jest.fn(),
}));

const {
  createParking,
  deleteParking,
  getAllParkings,
  getParkingById,
  updateParking,
} = await import("../../../src/controllers/parkingController.js");
const parkingService = await import("../../../src/services/parkingService.js");

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn();
  res.send = jest.fn();
  return res;
};

describe("parkingController", () => {
  test("getAllParkings returns list", async () => {
    const req = {};
    const res = createRes();
    parkingService.getAllParkings.mockResolvedValue([{ id: 1 }]);

    await getAllParkings(req, res);

    expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
    expect(res.status).not.toHaveBeenCalled();
  });

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

  test("createParking returns created parking", async () => {
    const req = { body: { name: "New" } };
    const res = createRes();
    parkingService.createParkingEntry.mockResolvedValue({ id: 9, name: "New" });

    await createParking(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: 9, name: "New" });
  });

  test("updateParking returns updated parking", async () => {
    const req = { params: { id: "7" }, body: { name: "Updated" } };
    const res = createRes();
    parkingService.updateParkingEntry.mockResolvedValue({
      id: 7,
      name: "Updated",
    });

    await updateParking(req, res);

    expect(res.json).toHaveBeenCalledWith({ id: 7, name: "Updated" });
    expect(res.status).not.toHaveBeenCalled();
  });

  test("deleteParking returns 204", async () => {
    const req = { params: { id: "3" } };
    const res = createRes();
    parkingService.deleteParkingEntry.mockResolvedValue();

    await deleteParking(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });
});

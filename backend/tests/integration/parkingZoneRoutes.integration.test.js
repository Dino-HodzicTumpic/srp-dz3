import { jest } from "@jest/globals";
import request from "supertest";

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

jest.unstable_mockModule("../../src/config/prisma.js", () => ({
  default: prismaMock,
}));

const appModule = await import("../../src/app.js");
const parkingZoneRoutes = (
  await import("../../src/routes/parkingZoneRoutes.js")
).default;

const app = appModule.default;
app.use("/api/parking-zones", parkingZoneRoutes);

describe("parking zone routes integration", () => {
  test("GET /api/parking-zones returns list", async () => {
    prismaMock.parkingzones.findMany.mockResolvedValue([{ id: 1, name: "Z1" }]);

    const response = await request(app).get("/api/parking-zones");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1, name: "Z1" }]);
    expect(prismaMock.parkingzones.findMany).toHaveBeenCalledTimes(1);
  });

  test("GET /api/parking-zones/:id returns single", async () => {
    prismaMock.parkingzones.findUnique.mockResolvedValue({ id: 2, name: "Z2" });

    const response = await request(app).get("/api/parking-zones/2");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 2, name: "Z2" });
    expect(prismaMock.parkingzones.findUnique).toHaveBeenCalledTimes(1);
  });

  test("POST /api/parking-zones creates zone", async () => {
    prismaMock.parkingzones.findUnique.mockResolvedValue(null);
    prismaMock.parkingzones.create.mockResolvedValue({ id: 3, name: "Z3" });

    const response = await request(app).post("/api/parking-zones").send({
      name: "Z3",
      price_per_hour: 5,
      description: "Zone Z3",
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ id: 3, name: "Z3" });
    expect(prismaMock.parkingzones.create).toHaveBeenCalledTimes(1);
  });

  test("PUT /api/parking-zones/:id updates zone", async () => {
    prismaMock.parkingzones.findUnique.mockResolvedValue({
      id: 4,
      name: "Z4",
      price_per_hour: 2,
      description: null,
    });
    prismaMock.parkingzones.update.mockResolvedValue({ id: 4, name: "Z4A" });

    const response = await request(app)
      .put("/api/parking-zones/4")
      .send({ name: "Z4", price_per_hour: 2, description: null });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 4, name: "Z4A" });
    expect(prismaMock.parkingzones.update).toHaveBeenCalledTimes(1);
  });

  test("DELETE /api/parking-zones/:id deletes zone", async () => {
    prismaMock.parkingzones.findUnique.mockResolvedValue({ id: 5, name: "Z5" });
    prismaMock.parkings.count.mockResolvedValue(0);
    prismaMock.parkingzones.delete.mockResolvedValue({ id: 5 });

    const response = await request(app).delete("/api/parking-zones/5");

    expect(response.status).toBe(204);
    expect(prismaMock.parkingzones.delete).toHaveBeenCalledTimes(1);
  });
});

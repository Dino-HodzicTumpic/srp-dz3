import { jest } from "@jest/globals";
import request from "supertest";

const prismaMock = {
  parkings: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

jest.unstable_mockModule("../../src/config/prisma.js", () => ({
  default: prismaMock,
}));

const appModule = await import("../../src/app.js");
const parkingRoutes = (await import("../../src/routes/parkingRoutes.js"))
  .default;

const app = appModule.default;
app.use("/api/parkings", parkingRoutes);

describe("parking routes integration", () => {
  test("GET /api/parkings returns list", async () => {
    prismaMock.parkings.findMany.mockResolvedValue([
      { id: 1, name: "Central" },
    ]);

    const response = await request(app).get("/api/parkings");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1, name: "Central" }]);
    expect(prismaMock.parkings.findMany).toHaveBeenCalledTimes(1);
  });

  test("GET /api/parkings/:id returns single", async () => {
    prismaMock.parkings.findUnique.mockResolvedValue({ id: 2, name: "East" });

    const response = await request(app).get("/api/parkings/2");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 2, name: "East" });
    expect(prismaMock.parkings.findUnique).toHaveBeenCalledTimes(1);
  });

  test("POST /api/parkings creates parking", async () => {
    prismaMock.parkings.create.mockResolvedValue({ id: 3, name: "West" });

    const response = await request(app).post("/api/parkings").send({
      zone_id: 1,
      name: "West",
      location: "Loc",
      total_spaces: 10,
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ id: 3, name: "West" });
    expect(prismaMock.parkings.create).toHaveBeenCalledTimes(1);
  });

  test("PUT /api/parkings/:id updates parking", async () => {
    prismaMock.parkings.findUnique.mockResolvedValue({ id: 4, name: "Old" });
    prismaMock.parkings.update.mockResolvedValue({ id: 4, name: "New" });

    const response = await request(app)
      .put("/api/parkings/4")
      .send({ name: "New" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 4, name: "New" });
    expect(prismaMock.parkings.update).toHaveBeenCalledTimes(1);
  });

  test("DELETE /api/parkings/:id deletes parking", async () => {
    prismaMock.parkings.findUnique.mockResolvedValue({ id: 5, name: "X" });
    prismaMock.parkings.delete.mockResolvedValue({ id: 5 });

    const response = await request(app).delete("/api/parkings/5");

    expect(response.status).toBe(204);
    expect(prismaMock.parkings.delete).toHaveBeenCalledTimes(1);
  });
});

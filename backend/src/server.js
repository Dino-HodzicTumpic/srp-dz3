import app from "./app.js";
import prisma from "./config/prisma.js";
import express from "express";

app.get("/test", async (req, res) => {
  try {
    const parkings = await prisma.parkings.findMany();
    res.json(parkings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on 3000");
});

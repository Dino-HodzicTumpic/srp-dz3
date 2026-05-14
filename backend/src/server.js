import app from "./app.js";
import parkingRoutes from "./routes/parkingRoutes.js";
import parkingSpaceRoutes from "./routes/parkingSpaceRoutes.js";
import parkingZoneRoutes from "./routes/parkingZoneRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";

app.use("/api/parkings", parkingRoutes);
app.use("/api/parking-spaces", parkingSpaceRoutes);
app.use("/api/parking-zones", parkingZoneRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/vehicles", vehicleRoutes);

app.listen(3000, () => {
  console.log("Server running on 3000");
});

import { getAllVehicles as getAllVehiclesService } from "../services/vehicleService.js";

export const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await getAllVehiclesService();
    return res.json(vehicles);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

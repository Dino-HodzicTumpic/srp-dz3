import { findAllVehicles } from "../repositories/vehicleRepository.js";

export const getAllVehicles = async () => {
  return findAllVehicles();
};

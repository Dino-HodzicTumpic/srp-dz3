import { findAllUsers } from "../repositories/userRepository.js";

export const getAllUsers = async () => {
  return findAllUsers();
};

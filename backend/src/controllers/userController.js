import { getAllUsers as getAllUsersService } from "../services/userService.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersService();
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

import axios from "axios";

export const getParkings = async () => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/parkings`);
  return response.data;
};

export const getParkingById = async (id) => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/parkings/${id}`,
  );
  return response.data;
};

export const updateParking = async (id, payload) => {
  const response = await axios.put(
    `${import.meta.env.VITE_API_URL}/parkings/${id}`,
    payload,
  );
  return response.data;
};

export const createParking = async (payload) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/parkings`,
    payload,
  );
  return response.data;
};

export const deleteParking = async (id) => {
  await axios.delete(`${import.meta.env.VITE_API_URL}/parkings/${id}`);
};

export const getParkingSpaces = async (parkingId) => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/parking-spaces`,
    {
      params: { parkingId },
    },
  );
  return response.data;
};

export const getParkingZones = async () => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/parking-zones`,
  );
  return response.data;
};

export const getParkingZoneById = async (id) => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/parking-zones/${id}`,
  );
  return response.data;
};

export const createParkingZone = async (payload) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/parking-zones`,
    payload,
  );
  return response.data;
};

export const updateParkingZone = async (id, payload) => {
  const response = await axios.put(
    `${import.meta.env.VITE_API_URL}/parking-zones/${id}`,
    payload,
  );
  return response.data;
};

export const deleteParkingZone = async (id) => {
  await axios.delete(`${import.meta.env.VITE_API_URL}/parking-zones/${id}`);
};

export const createParkingSpace = async (payload) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/parking-spaces`,
    payload,
  );
  return response.data;
};

export const updateParkingSpace = async (id, payload) => {
  const response = await axios.put(
    `${import.meta.env.VITE_API_URL}/parking-spaces/${id}`,
    payload,
  );
  return response.data;
};

export const deleteParkingSpace = async (id) => {
  await axios.delete(`${import.meta.env.VITE_API_URL}/parking-spaces/${id}`);
};

export const getReservations = async () => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/reservations`,
  );
  return response.data;
};

export const getReservationById = async (id) => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/reservations/${id}`,
  );
  return response.data;
};

export const createReservation = async (payload) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/reservations`,
    payload,
  );
  return response.data;
};

export const updateReservation = async (id, payload) => {
  const response = await axios.put(
    `${import.meta.env.VITE_API_URL}/reservations/${id}`,
    payload,
  );
  return response.data;
};

export const deleteReservation = async (id) => {
  await axios.delete(`${import.meta.env.VITE_API_URL}/reservations/${id}`);
};

export const getUsers = async () => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/users`);
  return response.data;
};

export const getVehicles = async () => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/vehicles`);
  return response.data;
};

import { getReservations } from "@/api/parkingApi";
import { useQuery } from "@tanstack/react-query";

export const useReservations = () => {
  return useQuery({
    queryKey: ["reservations"],
    queryFn: async () => getReservations(),
  });
};

import { getVehicles } from "@/api/parkingApi";
import { useQuery } from "@tanstack/react-query";

export const useVehicles = () => {
  return useQuery({
    queryKey: ["vehicles"],
    queryFn: async () => getVehicles(),
  });
};

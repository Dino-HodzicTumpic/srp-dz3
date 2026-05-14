import { getParkingZones } from "@/api/parkingApi";
import { useQuery } from "@tanstack/react-query";

export const useParkingZones = () => {
  return useQuery({
    queryKey: ["parkingZones"],
    queryFn: async () => getParkingZones(),
  });
};

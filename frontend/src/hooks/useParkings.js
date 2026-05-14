import { getParkings } from "@/api/parkingApi";
import { useQuery } from "@tanstack/react-query";

export const useParkings = () => {
  return useQuery({
    queryKey: ["parkings"],
    queryFn: async () => getParkings(),
  });
};

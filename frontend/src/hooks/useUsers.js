import { getUsers } from "@/api/parkingApi";
import { useQuery } from "@tanstack/react-query";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => getUsers(),
  });
};

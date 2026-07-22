import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "../services/dashboard";

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      console.log("CALLING DASHBOARD API");

      const data = await getDashboardStats();

      console.log("DASHBOARD RESPONSE:", data);

      return data;
    },
    retry: false,
  });
}
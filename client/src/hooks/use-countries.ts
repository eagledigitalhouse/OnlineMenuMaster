import { useQuery } from "@tanstack/react-query";
import { Country } from "@shared/schema";

export function useCountries() {
  return useQuery<Country[]>({
    queryKey: ["/api/countries"],
    queryFn: async () => {
      const response = await fetch("/api/countries", {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch countries");
      }
      
      return response.json();
    },
  });
}

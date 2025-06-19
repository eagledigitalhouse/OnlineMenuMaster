import { useQuery } from "@tanstack/react-query";
import { DishWithCountry } from "@shared/schema";
import { DishFilters } from "@/lib/api";

export function useDishes(filters: DishFilters = {}) {
  return useQuery<DishWithCountry[]>({
    queryKey: ["/api/dishes", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.search) params.append("search", filters.search);
      if (filters.countryId) params.append("country", filters.countryId.toString());
      if (filters.category) params.append("category", filters.category);
      if (filters.featured) params.append("featured", "true");
      
      const queryString = params.toString();
      const response = await fetch(`/api/dishes${queryString ? `?${queryString}` : ""}`, {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch dishes");
      }
      
      return response.json();
    },
  });
}

export function useDish(id: number) {
  return useQuery<DishWithCountry>({
    queryKey: ["/api/dishes", id],
    queryFn: async () => {
      const response = await fetch(`/api/dishes/${id}`, {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch dish");
      }
      
      return response.json();
    },
    enabled: !!id,
  });
}

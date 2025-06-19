import { apiRequest } from "@/lib/queryClient";

export interface DishFilters {
  search?: string;
  countryId?: number;
  category?: string;
  featured?: boolean;
}

export const api = {
  // Countries
  getCountries: () => apiRequest("GET", "/api/countries"),
  createCountry: (data: any) => apiRequest("POST", "/api/countries", data),
  updateCountry: (id: number, data: any) => apiRequest("PUT", `/api/countries/${id}`, data),
  deleteCountry: (id: number) => apiRequest("DELETE", `/api/countries/${id}`),

  // Dishes
  getDishes: (filters: DishFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append("search", filters.search);
    if (filters.countryId) params.append("country", filters.countryId.toString());
    if (filters.category) params.append("category", filters.category);
    if (filters.featured) params.append("featured", "true");
    
    const queryString = params.toString();
    return apiRequest("GET", `/api/dishes${queryString ? `?${queryString}` : ""}`);
  },
  getDish: (id: number) => apiRequest("GET", `/api/dishes/${id}`),
  createDish: (data: any) => apiRequest("POST", "/api/dishes", data),
  updateDish: (id: number, data: any) => apiRequest("PUT", `/api/dishes/${id}`, data),
  deleteDish: (id: number) => apiRequest("DELETE", `/api/dishes/${id}`),
  recordDishView: (id: number) => apiRequest("POST", `/api/dishes/${id}/view`),

  // Admin
  login: (credentials: { username: string; password: string }) => 
    apiRequest("POST", "/api/admin/login", credentials),
  getStats: () => apiRequest("GET", "/api/admin/stats"),
  reorderCountries: (countryIds: number[]) => 
    apiRequest("PUT", "/api/countries/reorder", { countryIds }),
};

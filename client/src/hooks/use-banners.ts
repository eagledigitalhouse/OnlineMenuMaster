import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Banner, InsertBanner } from "@shared/schema";

export function useBanners() {
  return useQuery<Banner[]>({
    queryKey: ["banners"],
    queryFn: async () => {
      const res = await api.getBanners();
      return res.json();
    },
  });
}

export function useCreateBanner() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (banner: InsertBanner) => {
      const res = await api.createBanner(banner);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
  });
}

export function useUpdateBanner() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...banner }: Banner) => {
      const res = await api.updateBanner(id, banner);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
  });
}

export function useDeleteBanner() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await api.deleteBanner(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
  });
} 
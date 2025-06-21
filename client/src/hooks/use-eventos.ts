import { useQuery } from "@tanstack/react-query";
import type { EventoWithCountry } from "@shared/schema";

// Buscar todos os eventos ou por dia específico
export function useEventos(dia?: string) {
  return useQuery<EventoWithCountry[]>({
    queryKey: ["eventos", dia],
    queryFn: async () => {
      const params = dia ? `?dia=${dia}` : "";
      const response = await fetch(`/api/eventos${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch eventos");
      }
      return response.json();
    },
  });
}

// Buscar evento específico por ID
export function useEvento(id: number) {
  return useQuery<EventoWithCountry>({
    queryKey: ["evento", id],
    queryFn: async () => {
      const response = await fetch(`/api/eventos/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch evento");
      }
      return response.json();
    },
    enabled: !!id,
  });
} 
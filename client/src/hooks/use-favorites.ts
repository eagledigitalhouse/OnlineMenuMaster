import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'fenui-favorites';

export interface FavoriteDish {
  id: number;
  name: string;
  price: string;
  countryName: string;
  countryFlag: string;
  category: string;
  addedAt: string;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteDish[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega favoritos do localStorage na inicialização
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem(FAVORITES_KEY);
      if (savedFavorites) {
        const parsed = JSON.parse(savedFavorites);
        setFavorites(parsed);
      }
    } catch (error) {
      console.warn('Erro ao carregar favoritos:', error);
      // Se houver erro, limpa o localStorage
      localStorage.removeItem(FAVORITES_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Salva favoritos no localStorage sempre que a lista mudar
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      } catch (error) {
        console.warn('Erro ao salvar favoritos:', error);
      }
    }
  }, [favorites, isLoading]);

  // Adiciona um prato aos favoritos
  const addToFavorites = (dish: {
    id: number;
    name: string;
    price: string;
    country: { name: string; flagEmoji?: string };
    category: string;
  }) => {
    const favoriteDish: FavoriteDish = {
      id: dish.id,
      name: dish.name,
      price: dish.price,
      countryName: dish.country.name,
      countryFlag: dish.country.flagEmoji || '🏳️',
      category: dish.category,
      addedAt: new Date().toISOString(),
    };

    setFavorites(prev => {
      // Evita duplicatas
      if (prev.some(fav => fav.id === dish.id)) {
        return prev;
      }
      return [...prev, favoriteDish];
    });
  };

  // Remove um prato dos favoritos
  const removeFromFavorites = (dishId: number) => {
    setFavorites(prev => prev.filter(fav => fav.id !== dishId));
  };

  // Verifica se um prato está nos favoritos
  const isFavorite = (dishId: number) => {
    return favorites.some(fav => fav.id === dishId);
  };

  // Toggle favorito (adiciona se não está, remove se está)
  const toggleFavorite = (dish: {
    id: number;
    name: string;
    price: string;
    country: { name: string; flagEmoji?: string };
    category: string;
  }) => {
    if (isFavorite(dish.id)) {
      removeFromFavorites(dish.id);
    } else {
      addToFavorites(dish);
    }
  };

  // Limpa todos os favoritos
  const clearFavorites = () => {
    setFavorites([]);
  };

  // Estatísticas dos favoritos
  const getFavoritesStats = () => {
    const total = favorites.length;
    const byCategory = favorites.reduce((acc, fav) => {
      acc[fav.category] = (acc[fav.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const byCountry = favorites.reduce((acc, fav) => {
      acc[fav.countryName] = (acc[fav.countryName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalValue = favorites.reduce((acc, fav) => {
      return acc + parseFloat(fav.price);
    }, 0);

    return {
      total,
      byCategory,
      byCountry,
      totalValue,
    };
  };

  return {
    favorites,
    isLoading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    clearFavorites,
    getFavoritesStats,
  };
} 
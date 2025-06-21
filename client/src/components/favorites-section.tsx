import { motion, AnimatePresence } from "framer-motion";
import { Heart, Trash2, Coffee, UtensilsCrossed, Cookie, TrendingUp, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useFavorites } from "@/hooks/use-favorites";
import { cn } from "@/lib/utils";

export default function FavoritesSection() {
  const { favorites, clearFavorites, removeFromFavorites, getFavoritesStats } = useFavorites();
  const stats = getFavoritesStats();

  const getCategoryIcon = (category: string) => {
    const icons = {
      'salgados': UtensilsCrossed,
      'doces': Cookie,
      'bebidas': Coffee
    };
    return icons[category as keyof typeof icons] || UtensilsCrossed;
  };

  if (favorites.length === 0) {
    return (
      <div className="container-responsive py-8">
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nenhum prato favorito ainda
          </h3>
          <p className="text-gray-600 max-w-md mx-auto text-sm">
            Explore o cardápio e adicione seus pratos favoritos tocando no ❤️
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-responsive py-6 space-y-6">
      {/* Header com Estatísticas */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
                          <Heart className="w-5 h-5 text-fenui-red-600 fill-current" />
            <h2 className="text-lg font-bold text-gray-900">Meus Favoritos</h2>
            <Badge className="bg-fenui-red-600/10 text-fenui-red-600 border-fenui-red-600/20">
              {stats.total} {stats.total === 1 ? 'prato' : 'pratos'}
            </Badge>
          </div>
          
          {favorites.length > 0 && (
            <button
              onClick={clearFavorites}
              className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              Limpar tudo
            </button>
          )}
        </div>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <TrendingUp className="w-4 h-4 text-fenui-green mx-auto mb-1" />
            <div className="text-sm font-semibold text-gray-900">
              R$ {stats.totalValue.toFixed(2)}
            </div>
            <div className="text-xs text-gray-600">Valor Total</div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <UtensilsCrossed className="w-4 h-4 text-orange-500 mx-auto mb-1" />
            <div className="text-sm font-semibold text-gray-900">
              {stats.byCategory.salgados || 0}
            </div>
            <div className="text-xs text-gray-600">Salgados</div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <Cookie className="w-4 h-4 text-pink-500 mx-auto mb-1" />
            <div className="text-sm font-semibold text-gray-900">
              {stats.byCategory.doces || 0}
            </div>
            <div className="text-xs text-gray-600">Doces</div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <Coffee className="w-4 h-4 text-blue-500 mx-auto mb-1" />
            <div className="text-sm font-semibold text-gray-900">
              {stats.byCategory.bebidas || 0}
            </div>
            <div className="text-xs text-gray-600">Bebidas</div>
          </div>
        </div>
      </div>

      {/* Lista de Favoritos */}
      <div className="space-y-3">
        <AnimatePresence>
          {favorites.map((favorite, index) => {
            const CategoryIcon = getCategoryIcon(favorite.category);
            
            return (
              <motion.div
                key={favorite.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="badge-category-sm">
                        <CategoryIcon className="w-2.5 h-2.5 mr-1" />
                        {favorite.category}
                      </Badge>
                      
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="w-3 h-3" />
                        <span>{favorite.countryFlag}</span>
                        <span>{favorite.countryName}</span>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {favorite.name}
                    </h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-fenui-red-600">
                        R$ {parseFloat(favorite.price).toFixed(2)}
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        Adicionado {new Date(favorite.addedAt).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => removeFromFavorites(favorite.id)}
                    className="ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
} 
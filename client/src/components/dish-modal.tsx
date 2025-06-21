import { DishWithCountry } from "@shared/schema";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  X, 
  Heart, 
  MapPin, 
  Clock, 
  Star, 
  Minus, 
  Plus,
  Award,
  Leaf,
  Wheat,
  Milk,
  AlertTriangle
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { useFavorites } from "@/hooks/use-favorites";
import { cn } from "@/lib/utils";

interface DishModalProps {
  dish: DishWithCountry;
  isOpen: boolean;
  onClose: () => void;
}

export default function DishModal({ dish, isOpen, onClose }: DishModalProps) {
  const [quantity, setQuantity] = useState(1);
  const { isFavorite, toggleFavorite } = useFavorites();
  const isInFavorites = isFavorite(dish.id);
  
  const totalPrice = parseFloat(dish.price) * quantity;

  // Debug da imagem
  console.log("DishModal - Imagem do prato:", dish.image);
  console.log("DishModal - Dados completos do prato:", dish);

  // Função para obter imagem com fallback
  const getImageUrl = () => {
    if (dish.image) {
      return dish.image;
    }
    // Fallback para uma imagem genérica de comida
    return "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop&crop=center";
  };

  const recordView = async () => {
    try {
      await apiRequest("POST", `/api/dishes/${dish.id}/view`);
    } catch (error) {
      console.error("Failed to record dish view:", error);
    }
  };

  if (isOpen && dish.id) {
    recordView();
  }

  // Função para gerar tempo de preparo baseado no nome do prato
  const generatePrepTime = (dishName: string) => {
    const hash = dishName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return 15 + (hash % 31); // Entre 15 e 45 minutos
  };

  // Função para verificar se é prato popular
  const isPopularDish = (dish: DishWithCountry) => {
    const popularKeywords = ['pizza', 'hambúrguer', 'sushi', 'lasanha', 'feijoada', 'paella', 'ramen'];
    return popularKeywords.some(keyword => 
      dish.name.toLowerCase().includes(keyword) || 
      dish.description.toLowerCase().includes(keyword)
    );
  };

  // Função para mapear países para bandeiras circle flags
  const getCircleFlagUrl = (countryName: string) => {
    const countryToCode: Record<string, string> = {
      "Suíça": "ch",
      "Alemanha": "de", 
      "Japão": "jp",
      "África do Sul (Afro-Brasileira)": "za",
      "África": "za", 
      "Brasil": "br",
      "Rússia": "ru",
      "China": "cn",
      "Espanha": "es",
      "Estados Unidos": "us",
      "Síria": "sy",
      "França": "fr",
      "Itália": "it"
    };
    
    const code = countryToCode[countryName];
    return code ? `https://hatscripts.github.io/circle-flags/flags/${code}.svg` : null;
  };

  // Função para obter estilo do badge por tag
  const getTagBadgeStyle = (tag: string) => {
    const tagLower = tag.toLowerCase();
    
    const tagStyles: Record<string, { className: string; icon: React.ReactNode }> = {
      'vegetariano': { 
        className: 'badge-vegetarian-sm', 
        icon: <Leaf className="w-3 h-3 mr-1 fill-current" />
      },
      'vegano': { 
        className: 'badge-vegan-sm', 
        icon: <Leaf className="w-3 h-3 mr-1 fill-current" />
      },
      'sem glúten': { 
        className: 'badge-gluten-free-sm', 
        icon: <Wheat className="w-3 h-3 mr-1" />
      },
      'sem lactose': { 
        className: 'badge-lactose-free-sm', 
        icon: <Milk className="w-3 h-3 mr-1" />
      },
      'picante': { 
        className: 'badge-spicy-sm', 
        icon: <AlertTriangle className="w-3 h-3 mr-1 fill-current" />
      },
      'low carb': { 
        className: 'badge-low-carb-sm', 
        icon: null
      },
      'orgânico': { 
        className: 'badge-organic-sm', 
        icon: <Leaf className="w-3 h-3 mr-1" />
      }
    };
    
    return tagStyles[tagLower] || { className: 'badge-category-sm', icon: null };
  };

  const dishImage = getImageUrl();
  const flagUrl = getCircleFlagUrl(dish.country.name);
  const prepTime = generatePrepTime(dish.name);
  const isPopular = isPopularDish(dish);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 max-w-md mx-auto max-h-[90vh] overflow-hidden bg-white rounded-2xl">
        {/* Header com Imagem - Mesmo estilo do DishCard */}
        <div className="relative h-64 w-full overflow-hidden bg-gray-100">
          <img
            src={dishImage}
            alt={dish.name}
            className="w-full h-full object-cover"
          />
          
          {/* Gradient overlay para melhor contraste */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
          
          {/* Badge País - REPOSICIONADO PARA BAIXO */}
          <div className="absolute bottom-20 left-4">
            <div className="bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full flex items-center gap-2 shadow-lg border border-white/20">
              {flagUrl ? (
                <img
                  src={flagUrl}
                  alt={`Bandeira ${dish.country.name}`}
                  className="w-4 h-4 object-cover rounded-full"
                />
              ) : (
                <span className="text-sm">{dish.country.flagEmoji || '🏳️'}</span>
              )}
              <span className="text-sm font-semibold text-white drop-shadow-sm">
                {dish.country.name}
              </span>
            </div>
          </div>

          {/* Ícone de Coração - REPOSICIONADO PARA A ESQUERDA */}
          <div className="absolute top-4 left-4">
            <button
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200",
                "backdrop-blur-md shadow-sm border cursor-pointer",
                "hover:scale-110 active:scale-90",
                "focus:outline-none focus:ring-2 focus:ring-fenui-red-600/30 focus:ring-offset-1",
                isInFavorites 
                  ? "bg-fenui-red-600/95 border-fenui-red-600/30 text-white" 
                  : "bg-white/95 border-white/30 text-gray-600 hover:bg-fenui-red-600/10 hover:text-fenui-red-600"
              )}
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(dish);
              }}
              title={isInFavorites ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            >
              <Heart className={cn(
                "w-6 h-6 transition-all duration-200",
                isInFavorites ? "fill-current" : ""
              )} />
            </button>
          </div>

          {/* Badge Popular - AJUSTADO PARA NÃO CONFLITAR */}
          {isPopular && (
            <div className="absolute top-4 right-4">
              <div className="bg-gradient-to-r from-fenui-yellow-500 to-orange-400 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                <Award className="w-4 h-4" />
                <span className="text-sm font-bold">Popular</span>
              </div>
            </div>
          )}

          {/* Balão de Preço - MESMO ESTILO DO DISHCARD */}
          <div className="absolute bottom-4 right-4">
            <div className="bg-fenui-red-600 text-white px-4 py-2 rounded-xl font-bold text-lg shadow-lg">
              R$ {parseFloat(dish.price).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Conteúdo - Seguindo estrutura do DishCard */}
        <div className="p-6 space-y-4">
          {/* Título e Tempo - Mesmo layout do DishCard */}
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-2xl font-bold text-gray-900 leading-tight flex-1">
              {dish.name}
            </h2>
            
            <div className="flex items-center gap-1.5 text-sm text-gray-500 flex-shrink-0">
              <Clock className="w-4 h-4" />
              <span>{prepTime}min</span>
            </div>
          </div>

          {/* Descrição */}
          <p className="text-base text-gray-600 leading-relaxed">
            {dish.description}
          </p>
          
          {/* Tags informativas - MESMAS CLASSES DO DISHCARD */}
          {dish.tags && dish.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {dish.tags.map((tag, index) => {
                const { className, icon } = getTagBadgeStyle(tag);
                return (
                  <span key={index} className={className}>
                    {icon}
                    {tag}
                  </span>
                );
              })}
            </div>
          )}

          {/* Controle de Quantidade */}
          <div className="flex items-center justify-between py-4 border-t border-gray-100">
            <span className="text-lg font-semibold text-gray-900">Quantidade:</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-xl font-bold text-gray-900 min-w-[2rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Botão Principal - Usando classe CSS do sistema */}
          <button
            onClick={() => {
              toggleFavorite(dish);
              onClose();
            }}
            className="btn-primary w-full text-lg py-4"
          >
            <Heart className={cn(
              "w-5 h-5",
              isInFavorites ? "fill-current" : ""
            )} />
            {isInFavorites ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

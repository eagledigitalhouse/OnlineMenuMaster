import { DishWithCountry } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Leaf, Coffee, UtensilsCrossed, Cookie, Heart, AlertTriangle, Wheat, Milk, Clock, Flame, Award } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";
import { FENUI_COLORS } from "@/lib/theme-colors";

interface DishCardProps {
  dish: DishWithCountry;
  onClick: () => void;
  featured?: boolean;
}

// Função para gerar tempo de preparo estimado genérico
const generatePrepTime = (dishName: string) => {
  const baseTime = 15; // Tempo base genérico
  const hash = dishName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return baseTime + (hash % 25); // Variação de 15-40 min
};

// Função para verificar se é prato popular (baseado em características)
const isPopularDish = (dish: DishWithCountry) => {
  const popularKeywords = ['tradicional', 'especial', 'famoso', 'clássico', 'popular'];
  return dish.isFeatured || popularKeywords.some(keyword => 
    dish.name.toLowerCase().includes(keyword) || 
    dish.description.toLowerCase().includes(keyword)
  );
};

// Função para obter imagem padrão genérica
const getDefaultImage = (dishName: string) => {
  const genericImages = [
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=600&h=400&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=400&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=600&h=400&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&h=400&fit=crop&crop=center"
  ];
  
  const index = dishName.length % genericImages.length;
  return genericImages[index];
};

// Função para mapear países para bandeiras
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
      icon: <Leaf className="w-2.5 h-2.5 mr-1 fill-current" />
    },
    'vegano': { 
      className: 'badge-vegan-sm', 
      icon: <Leaf className="w-2.5 h-2.5 mr-1 fill-current" />
    },
    'sem glúten': { 
      className: 'badge-gluten-free-sm', 
      icon: <Wheat className="w-2.5 h-2.5 mr-1" />
    },
    'sem lactose': { 
      className: 'badge-lactose-free-sm', 
      icon: <Milk className="w-2.5 h-2.5 mr-1" />
    },
    'picante': { 
      className: 'badge-spicy-sm', 
      icon: <AlertTriangle className="w-2.5 h-2.5 mr-1 fill-current" />
    },
    'low carb': { 
      className: 'badge-low-carb-sm', 
      icon: null
    },
    'orgânico': { 
      className: 'badge-organic-sm', 
      icon: <Leaf className="w-2.5 h-2.5 mr-1" />
    }
  };
  
  return tagStyles[tagLower] || { className: 'badge-category-sm', icon: null };
};

export default function DishCard({ dish, onClick, featured = false }: DishCardProps) {
  const defaultImage = getDefaultImage(dish.name);
  const dishImage = dish.image || defaultImage;
  const flagUrl = getCircleFlagUrl(dish.country.name);
  const prepTime = generatePrepTime(dish.name);
  const isPopular = isPopularDish(dish);
  
  // Sistema de favoritos
  const { isFavorite, toggleFavorite } = useFavorites();
  const isInFavorites = isFavorite(dish.id);
  
  // Controle de escala do card - ajuste este valor para mudar o tamanho
  const cardScale = 0.8; // 80% do tamanho original
  
  // Calcular dimensões reais após o scale
  const realWidth = 288 * cardScale; // 230.4px
  const realHeight = 360 * cardScale; // 288px

  return (
    <div 
      className="flex items-center justify-center" 
      style={{ 
        width: `${realWidth}px`,
        height: `${realHeight}px`
      }}
    >
      <div 
        className="transform origin-center" 
        style={{ 
          transform: `scale(${cardScale})`
        }}
      >
        <article
          onClick={onClick}
          className={cn(
            "group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer",
            "w-72 h-[360px] mx-auto flex-shrink-0",
            "hover:shadow-lg hover:-translate-y-2 transition-all duration-300",
            "flex flex-col relative",
            featured && "ring-2 ring-fenui-yellow-500 shadow-lg"
          )}
        >
          {/* Imagem - ALTURA REDUZIDA */}
          <div className="relative h-36 w-full overflow-hidden bg-gray-100 flex-shrink-0">
            <img
              src={dishImage}
              alt={dish.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            
            {/* Gradient overlay para melhor contraste */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
            
            {/* Badge País - GLASSMORPHISM QUASE TRANSPARENTE */}
            <div className="absolute top-3 left-3">
              <div className="bg-white/10 backdrop-blur-xl px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border border-white/20">
                {flagUrl ? (
                  <img
                    src={flagUrl}
                    alt={`Bandeira ${dish.country.name}`}
                    className="w-3 h-3 object-cover rounded-full"
                  />
                ) : (
                  <span className="text-xs">{dish.country.flagEmoji || '🏳️'}</span>
                )}
                <span className="text-xs font-semibold text-white truncate max-w-16 drop-shadow-sm">{dish.country.name}</span>
              </div>
            </div>

            {/* Badge Popular/Novo - CANTO SUPERIOR DIREITO */}
            {isPopular && (
              <div className="absolute top-3 right-14">
                <div className="bg-gradient-to-r from-fenui-yellow-500 to-orange-400 text-white px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <Award className="w-3 h-3" />
                  <span className="text-xs font-bold">Popular</span>
                </div>
              </div>
            )}

            {/* NOVO: Ícone de Coração no Canto Superior Direito */}
            <div className="absolute top-3 right-3">
              <button
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200",
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
                aria-label={isInFavorites ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              >
                <Heart className={cn(
                  "w-5 h-5 transition-all duration-200",
                  isInFavorites ? "fill-current" : ""
                )} />
              </button>
            </div>

            {/* NOVO: Balão de Preço - Fundo Vermelho */}
            <div className="absolute bottom-3 right-3">
              <div className="bg-fenui-red-600 text-white px-3 py-1.5 rounded-xl font-bold text-sm shadow-lg">
                R$ {parseFloat(dish.price).toFixed(2)}
              </div>
            </div>
          </div>

          {/* Conteúdo - ALTURA OTIMIZADA COM MAIS PADDING */}
          <div className="p-5 flex flex-col h-[224px]">
            {/* Título e Tempo - Mais espaçado */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className="text-2xl font-bold text-gray-900 leading-snug flex-1 truncate">
                {dish.name}
              </h3>
              
              <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
                <Clock className="w-3 h-3" />
                <span>{prepTime}min</span>
              </div>
            </div>

            {/* Descrição com Tags - Mais espaçamento */}
            <div className="mb-4 space-y-3">
              <p className="text-base text-gray-600 line-clamp-2 leading-relaxed">
                {dish.description}
              </p>
              
              {/* Tags informativas */}
              <div className="flex flex-wrap gap-1.5">
                {/* Mostra tags existentes */}
                {dish.tags && dish.tags.length > 0 ? (
                  <>
                    {dish.tags.slice(0, 3).map((tag) => {
                      const { className, icon } = getTagBadgeStyle(tag);
                      return (
                        <Badge key={tag} className={className}>
                          {icon}
                          {tag}
                        </Badge>
                      );
                    })}
                    {dish.tags.length > 3 && (
                      <Badge className="badge-category-sm">
                        +{dish.tags.length - 3}
                      </Badge>
                    )}
                  </>
                ) : (
                  /* Tags padrão quando não há tags específicas */
                  <>
                    <Badge className="badge-category-sm">
                      <Flame className="w-2.5 h-2.5 mr-1" />
                      Saboroso
                    </Badge>
                    <Badge className="badge-category-sm">
                      <UtensilsCrossed className="w-2.5 h-2.5 mr-1" />
                      Tradicional
                    </Badge>
                  </>
                )}
              </div>
            </div>

            {/* Rodapé do Card - Mais espaçado */}
            <div className="mt-auto pt-4 border-t border-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Toque para mais detalhes
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-xs font-medium",
                  isInFavorites ? "text-fenui-red-600" : "text-gray-400"
                )}>
                  <Heart className={cn(
                    "w-3 h-3",
                    isInFavorites ? "fill-current" : ""
                  )} />
                  <span>{isInFavorites ? "Favorito" : "Favoritar"}</span>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

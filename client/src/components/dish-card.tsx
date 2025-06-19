import { DishWithCountry } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Leaf, AlertTriangle, Star, Coffee, UtensilsCrossed, Cookie } from "lucide-react";

interface DishCardProps {
  dish: DishWithCountry;
  onClick: () => void;
  featured?: boolean;
  horizontal?: boolean;
}

export default function DishCard({
  dish,
  onClick,
  featured = false,
  horizontal = false,
}: DishCardProps) {
  if (featured) {
    return (
      <div
        className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
        onClick={onClick}
      >
        <img
          src={dish.image || "/placeholder-dish.jpg"}
          alt={dish.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-lg text-fenui-dark line-clamp-1">
              {dish.name}
            </h3>
            <span className="text-lg font-bold text-fenui-red">
              R$ {parseFloat(dish.price).toFixed(2)}
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {dish.description}
          </p>
          <div className="flex items-center justify-between">
            <Badge className="bg-fenui-green text-white">
              {dish.country.flagEmoji} {dish.country.name}
            </Badge>
            <Badge variant="secondary">{dish.category}</Badge>
          </div>
        </div>
      </div>
    );
  }

  if (horizontal) {
    return (
      <div
        className="bg-white rounded-3xl shadow-md p-6 flex cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-gray-100"
        onClick={onClick}
      >
        <div className="flex-shrink-0 mr-5">
          <img
            src={dish.image || "/placeholder-dish.jpg"}
            alt={dish.name}
            className="w-32 h-32 rounded-2xl object-cover shadow-lg border-2 border-gray-100"
          />
        </div>
        <div className="flex-grow">
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-semibold text-lg text-gray-900 leading-tight max-w-[70%]">
              {dish.name}
            </h3>
            <div className="text-right ml-4">
              <span className="text-xl font-bold text-green-600">
                R$ {parseFloat(dish.price).toFixed(2)}
              </span>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-normal">
            {dish.description}
          </p>
          <div className="flex items-center gap-3">
            {/* Category Icon */}
            <div className="flex items-center gap-1 text-gray-500">
              {dish.category === 'salgados' && <UtensilsCrossed className="w-4 h-4" />}
              {dish.category === 'doces' && <Cookie className="w-4 h-4" />}
              {dish.category === 'bebidas' && <Coffee className="w-4 h-4" />}
              <span className="text-xs font-medium capitalize">{dish.category}</span>
            </div>
            
            {/* Tags */}
            {(dish.tags || []).includes('vegetariano') && (
              <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full">
                <Leaf className="w-3 h-3" />
                <span className="text-xs font-medium">Vegetariano</span>
              </div>
            )}
            
            {(dish.tags || []).includes('vegano') && (
              <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full">
                <Leaf className="w-3 h-3" />
                <span className="text-xs font-medium">Vegano</span>
              </div>
            )}
            
            {dish.isFeatured && (
              <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full">
                <Star className="w-3 h-3 fill-current" />
                <span className="text-xs font-medium">Destaque</span>
              </div>
            )}
            
            {(dish.allergens || []).length > 0 && (
              <div className="flex items-center gap-1 bg-red-50 text-red-700 px-2 py-1 rounded-full">
                <AlertTriangle className="w-3 h-3" />
                <span className="text-xs font-medium">Alérgenos</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <img
        src={dish.image || "/placeholder-dish.jpg"}
        alt={dish.name}
        className="w-full h-32 object-cover"
      />
      <div className="p-3">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-base text-fenui-dark line-clamp-1">
            {dish.name}
          </h3>
          <span className="text-base font-bold text-fenui-red">
            R$ {parseFloat(dish.price).toFixed(2)}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-2 line-clamp-1">
          {dish.description}
        </p>
        <div className="flex flex-wrap gap-1">
          <Badge variant="secondary" className="text-xs">
            {dish.category}
          </Badge>
          {dish.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

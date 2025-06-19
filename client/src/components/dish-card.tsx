import { DishWithCountry } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Leaf, AlertTriangle, Star, Coffee, UtensilsCrossed, Cookie, MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";

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
      <motion.div
        onClick={onClick}
        className="group relative bg-white rounded-3xl shadow-lg overflow-hidden cursor-pointer border border-gray-100"
        whileHover={{ scale: 1.03, y: -8 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        <div className="relative overflow-hidden">
          <div className="aspect-[4/3] w-full">
            <img
              src={dish.image || "/placeholder-dish.jpg"}
              alt={dish.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* Featured badge */}
          <div className="absolute top-4 left-4">
            <Badge className="bg-yellow-500 text-yellow-900 font-semibold shadow-lg">
              <Star className="w-3 h-3 mr-1 fill-current" />
              Destaque
            </Badge>
          </div>

          {/* Price overlay */}
          <div className="absolute bottom-4 right-4">
            <span className="bg-orange-500 text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg">
              R$ {parseFloat(dish.price).toFixed(2)}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <Badge className="bg-orange-50 text-orange-700 border-orange-200">
              <MapPin className="w-3 h-3 mr-1" />
              {dish.country.flagEmoji} {dish.country.name}
            </Badge>
            <Badge variant="outline" className="bg-gray-50">
              {dish.category}
            </Badge>
          </div>

          <h3 className="font-display font-bold text-xl text-gray-900 mb-3 leading-tight line-clamp-2 min-h-[2.5rem]">
            {dish.name}
          </h3>

          <p className="font-body text-gray-600 text-sm leading-relaxed line-clamp-3 min-h-[3.75rem]">
            {dish.description}
          </p>
        </div>
      </motion.div>
    );
  }

  if (horizontal) {
    return (
      <motion.div
        onClick={onClick}
        className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 flex min-h-[7rem]"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="relative w-28 h-28 flex-shrink-0 overflow-hidden">
          <img
            src={dish.image || "/placeholder-dish.jpg"}
            alt={dish.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
          <div className="flex-1">
            <h3 className="font-display font-semibold text-base text-gray-900 mb-1 leading-tight truncate">
              {dish.name}
            </h3>
            <p className="font-body text-sm text-gray-600 line-clamp-2 leading-relaxed mb-2">
              {dish.description}
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium text-orange-600 min-w-0">
              <span className="flex-shrink-0">{dish.country.flagEmoji}</span>
              <span className="truncate">{dish.country.name}</span>
            </div>
            <span className="text-lg font-bold text-orange-500 flex-shrink-0 ml-2">
              R$ {parseFloat(dish.price).toFixed(2)}
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      onClick={onClick}
      className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300"
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative overflow-hidden">
        <div className="aspect-[4/3] w-full">
          <img
            src={dish.image || "/placeholder-dish.jpg"}
            alt={dish.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute bottom-3 right-3">
          <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
            R$ {parseFloat(dish.price).toFixed(2)}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge className="bg-orange-50 text-orange-700 border-orange-200 text-xs">
            <MapPin className="w-3 h-3 mr-1" />
            {dish.country.flagEmoji} {dish.country.name}
          </Badge>
          <Badge variant="outline" className="text-xs bg-gray-50">
            {dish.category}
          </Badge>
        </div>

        <h3 className="font-display font-bold text-lg text-gray-900 mb-2 leading-tight line-clamp-2 min-h-[2.5rem]">
          {dish.name}
        </h3>

        <p className="font-body text-gray-600 text-sm leading-relaxed line-clamp-2 min-h-[2.5rem] mb-3">
          {dish.description}
        </p>

        {/* Tags */}
        {dish.tags && dish.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {dish.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                {tag}
              </Badge>
            ))}
            {dish.tags.length > 2 && (
              <Badge variant="outline" className="text-xs text-gray-500">
                +{dish.tags.length - 2}
              </Badge>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span className="font-medium">15-20 min</span>
          </div>
          {dish.allergens && dish.allergens.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-red-600">
              <AlertTriangle className="w-3 h-3" />
              <span className="font-medium">Alérgenos</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

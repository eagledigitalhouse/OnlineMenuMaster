import { DishWithCountry } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-bold text-xl text-fenui-dark line-clamp-2 leading-tight max-w-[60%]">
              {dish.name}
            </h3>
            <div className="text-right">
              <span className="text-2xl font-bold text-fenui-red">
                R$ {parseFloat(dish.price).toFixed(2)}
              </span>
            </div>
          </div>
          <p className="text-gray-600 text-base mb-4 line-clamp-3 leading-relaxed">
            {dish.description}
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-sm font-medium px-3 py-1">
              {dish.category}
            </Badge>
            {(dish.tags || []).slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-sm px-2 py-1">
                {tag}
              </Badge>
            ))}
            {(dish.allergens || []).length > 0 && (
              <Badge variant="destructive" className="text-sm px-2 py-1">
                ⚠️ Alérgenos
              </Badge>
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

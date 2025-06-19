import { DishWithCountry } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Share2, Heart, MapPin, Clock, Star, Minus, Plus } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";

interface DishModalProps {
  dish: DishWithCountry;
  isOpen: boolean;
  onClose: () => void;
}

export default function DishModal({ dish, isOpen, onClose }: DishModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [isFavorited, setIsFavorited] = useState(false);

  const handleShare = () => {
    const text = `Confira o prato "${dish.name}" da FENUI 2024! ${dish.country.flagEmoji} ${dish.country.name} - R$ ${parseFloat(dish.price).toFixed(2)}`;
    
    if (navigator.share) {
      navigator.share({
        title: dish.name,
        text: text,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(text);
      alert("Informações copiadas para a área de transferência!");
    }
  };

  const recordView = async () => {
    try {
      await apiRequest("POST", `/api/dishes/${dish.id}/view`);
    } catch (error) {
      console.error("Failed to record dish view:", error);
    }
  };

  // Record view when modal opens
  if (isOpen && dish.id) {
    recordView();
  }

  const totalPrice = parseFloat(dish.price) * quantity;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[95vh] overflow-hidden p-0 rounded-3xl">
        {/* Header with close and share buttons */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 bg-black/20 hover:bg-black/30 rounded-full text-white"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 bg-black/20 hover:bg-black/30 rounded-full text-white"
              onClick={handleShare}
            >
              <Share2 className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`w-10 h-10 rounded-full ${isFavorited ? 'bg-red-500 text-white' : 'bg-black/20 hover:bg-black/30 text-white'}`}
              onClick={() => setIsFavorited(!isFavorited)}
            >
              <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Image with price overlay */}
        <div className="relative">
          <img
            src={dish.image || "/placeholder-dish.jpg"}
            alt={dish.name}
            className="w-full h-72 object-cover"
          />
          <div className="absolute bottom-4 left-4">
            <span className="bg-orange-500 text-white px-3 py-1 rounded-full font-bold text-lg">
              R$ {parseFloat(dish.price).toFixed(2)}
            </span>
          </div>
        </div>

        <div className="p-6">
          {/* Title and rating */}
          <div className="flex items-start justify-between mb-2">
            <h2 className="text-2xl font-bold text-gray-900 leading-tight">
              {dish.name}
            </h2>
            {dish.isFeatured && (
              <div className="flex items-center gap-1 text-orange-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-medium">Destaque</span>
              </div>
            )}
          </div>

          {/* Country info */}
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-orange-500 text-sm font-medium">
              {dish.country.flagEmoji} {dish.country.name}
            </span>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Descrição</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              {dish.description}
            </p>
          </div>

          {/* Tags and allergens */}
          {((dish.tags && dish.tags.length > 0) || (dish.allergens && dish.allergens.length > 0)) && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Informações</h3>
              <div className="space-y-1 text-sm text-gray-600">
                {dish.tags && dish.tags.map((tag) => (
                  <div key={tag} className="flex items-center gap-1">
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    <span className="capitalize">{tag}</span>
                  </div>
                ))}
                {dish.allergens && dish.allergens.length > 0 && (
                  <div className="flex items-center gap-1 text-red-600">
                    <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                    <span>Alérgenos: {dish.allergens.join(", ")}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quantity selector */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Quantidade</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="w-10 h-10 rounded-full"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-10 h-10 rounded-full"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-lg font-bold">
                R$ {totalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Add to cart button */}
          <Button 
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-2xl text-lg"
            onClick={() => {
              // Handle add to cart logic here
              alert(`${quantity}x ${dish.name} - Total: R$ ${totalPrice.toFixed(2)}`);
              onClose();
            }}
          >
            Adicionar ao pedido
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

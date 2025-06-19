import { DishWithCountry } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Share2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface DishModalProps {
  dish: DishWithCountry;
  isOpen: boolean;
  onClose: () => void;
}

export default function DishModal({ dish, isOpen, onClose }: DishModalProps) {
  const handleShare = (platform: "whatsapp" | "instagram") => {
    const text = `Confira o prato "${dish.name}" da FENUI 2024! ${dish.country.flagEmoji} ${dish.country.name} - R$ ${parseFloat(dish.price).toFixed(2)}`;
    
    if (platform === "whatsapp") {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, "_blank");
    } else {
      // For Instagram, we'll copy to clipboard since direct sharing is complex
      navigator.clipboard.writeText(text);
      alert("Texto copiado! Cole no Instagram Stories.");
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden p-0">
        <div className="relative">
          <img
            src={dish.image || "/placeholder-dish.jpg"}
            alt={dish.name}
            className="w-full h-64 object-cover"
          />
          <Button
            variant="outline"
            size="icon"
            className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-lg"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6">
          <DialogHeader className="mb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold text-fenui-dark">
                {dish.name}
              </DialogTitle>
              <span className="text-2xl font-bold text-fenui-red">
                R$ {parseFloat(dish.price).toFixed(2)}
              </span>
            </div>
          </DialogHeader>

          <p className="text-gray-600 mb-4 leading-relaxed">
            {dish.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            <Badge className="bg-fenui-green text-white">
              {dish.country.flagEmoji} {dish.country.name}
            </Badge>
            <Badge variant="secondary">{dish.category}</Badge>
            {dish.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
            {dish.allergens.length > 0 && (
              <Badge variant="destructive">
                ⚠️ Alérgenos: {dish.allergens.join(", ")}
              </Badge>
            )}
          </div>

          <div className="border-t pt-4">
            <h3 className="font-bold text-fenui-dark mb-2 flex items-center">
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </h3>
            <div className="flex gap-3">
              <Button
                className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                onClick={() => handleShare("whatsapp")}
              >
                📱 WhatsApp
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white"
                onClick={() => handleShare("instagram")}
              >
                📷 Instagram
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

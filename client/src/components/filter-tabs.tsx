import { Coffee, UtensilsCrossed, Cookie, Grid3X3 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FilterTabsProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

const categories = [
  { id: "all", label: "Todos", icon: Grid3X3 },
  { id: "salgados", label: "Salgados", icon: UtensilsCrossed },
  { id: "doces", label: "Doces", icon: Cookie },
  { id: "bebidas", label: "Bebidas", icon: Coffee },
];

export default function FilterTabs({
  selectedCategory,
  onCategorySelect,
}: FilterTabsProps) {
  return (
    <section className="bg-white border-b border-gray-100 sticky top-0 z-30">
      <div className="container-responsive py-3">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {categories.map((category) => {
            const isActive = selectedCategory === category.id;
            const Icon = category.icon;
            
            return (
              <motion.button
                key={category.id}
                onClick={() => onCategorySelect(category.id)}
                className={cn(
                  "inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full font-medium text-xs whitespace-nowrap transition-all duration-200",
                  "border focus:outline-none focus:ring-2 focus:ring-fenui-red-600/30 focus:ring-offset-1",
                  isActive
                    ? "bg-fenui-red-600 text-white border-fenui-red-600 shadow-sm"
                    : "bg-white text-fenui-green-600 border-gray-100 hover:border-fenui-red-600/30 hover:bg-fenui-red-600/5 hover:text-fenui-green-700"
                )}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                transition={{ duration: 0.1 }}
              >
                <Icon className={cn(
                  "w-3.5 h-3.5",
                  isActive ? "text-white" : "text-fenui-green-600"
                )} />
                {category.label}
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

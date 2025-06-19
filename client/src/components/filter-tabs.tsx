import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FilterTabsProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

const categories = [
  { id: "all", label: "Todos" },
  { id: "salgados", label: "Salgados" },
  { id: "doces", label: "Doces" },
  { id: "bebidas", label: "Bebidas" },
];

export default function FilterTabs({
  selectedCategory,
  onCategorySelect,
}: FilterTabsProps) {
  return (
    <section className="bg-white border-b border-gray-200 sticky top-40 z-30">
      <div className="container mx-auto px-4 py-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              className={cn(
                "flex-shrink-0 rounded-full text-sm font-medium transition-colors",
                selectedCategory === category.id
                  ? "bg-fenui-dark text-white hover:bg-fenui-dark/90"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
              onClick={() => onCategorySelect(category.id)}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}

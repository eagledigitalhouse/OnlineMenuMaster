import { useState, useMemo } from "react";
import { Search, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import CountryStories from "@/components/country-stories";
import FilterTabs from "@/components/filter-tabs";
import DishCard from "@/components/dish-card";
import DishModal from "@/components/dish-modal";
import { useDishes } from "@/hooks/use-dishes";
import { useCountries } from "@/hooks/use-countries";
import { Dish, DishWithCountry } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDish, setSelectedDish] = useState<DishWithCountry | null>(null);

  const { data: countries = [] } = useCountries();
  const { data: allDishes = [] } = useDishes({
    search: searchQuery,
    countryId: selectedCountry || undefined,
    category: selectedCategory === "all" ? undefined : selectedCategory,
  });

  const featuredDishes = useMemo(() => 
    allDishes.filter(dish => dish.isFeatured).slice(0, 3),
    [allDishes]
  );

  const dishesByCountry = useMemo(() => {
    const grouped: Record<string, DishWithCountry[]> = {};
    
    allDishes.forEach(dish => {
      const countryName = dish.country.name;
      if (!grouped[countryName]) {
        grouped[countryName] = [];
      }
      grouped[countryName].push(dish);
    });

    return grouped;
  }, [allDishes]);

  const handleCountryFilter = (countryId: number | null) => {
    setSelectedCountry(countryId);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
  };

  const handleDishClick = (dish: DishWithCountry) => {
    setSelectedDish(dish);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        {/* FENUI Banner */}
        <div className="h-20 fenui-gradient relative overflow-hidden">
          <div className="absolute inset-0 fenui-mosaic opacity-20"></div>
          <div className="container mx-auto px-4 h-full flex items-center justify-center relative">
            <h1 className="text-white text-2xl md:text-3xl font-bold tracking-wide">
              FENUI 2024
            </h1>
          </div>
        </div>

        {/* Search Bar */}
        <div className="container mx-auto px-4 py-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Buscar pratos ou ingredientes..."
              className="pl-12 py-3 text-lg border-2 rounded-full focus:border-fenui-blue"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Country Stories Navigation */}
      <CountryStories
        countries={countries}
        selectedCountry={selectedCountry}
        onCountrySelect={handleCountryFilter}
      />

      {/* Filter Tabs */}
      <FilterTabs
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategoryFilter}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 pb-32">
        {/* Featured Dishes */}
        {featuredDishes.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-fenui-dark mb-4 flex items-center">
              <span className="text-fenui-yellow mr-2">⭐</span>
              Destaques do Festival
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredDishes.map((dish) => (
                <motion.div
                  key={dish.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <DishCard
                    dish={dish}
                    onClick={() => handleDishClick(dish)}
                    featured
                  />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Dishes by Country */}
        <AnimatePresence mode="wait">
          {selectedCountry === null ? (
            /* Show all dishes grouped by country when no country is selected */
            Object.entries(dishesByCountry)
              .sort(([, dishesA], [, dishesB]) => dishesA[0]?.country.order - dishesB[0]?.country.order)
              .map(([countryName, dishes]) => (
              <motion.section
                key={countryName}
                className="mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-bold text-fenui-dark mb-4 flex items-center sticky top-32 bg-gray-50 py-2 z-20">
                  <span className="text-2xl mr-3">
                    {dishes[0]?.country.flagEmoji}
                  </span>
                  {countryName}
                  <span className="ml-auto text-sm font-normal text-gray-500">
                    {dishes.length} {dishes.length === 1 ? 'prato' : 'pratos'}
                  </span>
                </h2>
                <div className="space-y-3">
                  {dishes.map((dish) => (
                    <motion.div
                      key={dish.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <DishCard
                        dish={dish}
                        onClick={() => handleDishClick(dish)}
                        horizontal
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            ))
          ) : (
            /* Show dishes from selected country only */
            selectedCountry && dishesByCountry[countries.find(c => c.id === selectedCountry)?.name || ''] && (
              <motion.section
                className="mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-bold text-fenui-dark mb-4 flex items-center sticky top-32 bg-gray-50 py-2 z-20">
                  <span className="text-2xl mr-3">
                    {countries.find(c => c.id === selectedCountry)?.flagEmoji}
                  </span>
                  {countries.find(c => c.id === selectedCountry)?.name}
                  <span className="ml-auto text-sm font-normal text-gray-500">
                    {allDishes.length} {allDishes.length === 1 ? 'prato' : 'pratos'}
                  </span>
                </h2>
                <div className="space-y-3">
                  {allDishes.map((dish) => (
                    <motion.div
                      key={dish.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <DishCard
                        dish={dish}
                        onClick={() => handleDishClick(dish)}
                        horizontal
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )
          )}
        </AnimatePresence>

        {allDishes.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              Nenhum prato encontrado para os filtros selecionados.
            </p>
          </div>
        )}
      </main>

      {/* Admin FAB */}
      <div className="fixed bottom-6 right-6 z-40">
        <Link href="/admin">
          <Button
            size="lg"
            className="w-14 h-14 rounded-full bg-fenui-dark hover:bg-fenui-dark/90 shadow-lg"
          >
            <Settings className="h-6 w-6" />
          </Button>
        </Link>
      </div>

      {/* Footer */}
      <footer className="bg-fenui-dark text-white py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2">FENUI 2024</h3>
            <p className="text-gray-300">Festa das Nações de Indaiatuba</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div>
              <h4 className="font-bold mb-2 text-fenui-yellow">📍 Local</h4>
              <p className="text-gray-300">Parque Ecológico de Indaiatuba</p>
              <p className="text-gray-300">Rua das Nações, 123</p>
            </div>
            
            <div>
              <h4 className="font-bold mb-2 text-fenui-yellow">📅 Datas</h4>
              <p className="text-gray-300">15 a 25 de Dezembro</p>
              <p className="text-gray-300">18h às 23h</p>
            </div>
            
            <div>
              <h4 className="font-bold mb-2 text-fenui-yellow">📱 Contato</h4>
              <div className="flex justify-center md:justify-start gap-4 mt-2">
                <a href="#" className="text-2xl hover:text-fenui-yellow transition-colors">
                  📷
                </a>
                <a href="#" className="text-2xl hover:text-fenui-yellow transition-colors">
                  📘
                </a>
                <a href="#" className="text-2xl hover:text-fenui-yellow transition-colors">
                  📱
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-6 pt-6 text-center text-gray-400">
            <p>&copy; 2024 FENUI - Festa das Nações de Indaiatuba. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Dish Modal */}
      {selectedDish && (
        <DishModal
          dish={selectedDish}
          isOpen={!!selectedDish}
          onClose={() => setSelectedDish(null)}
        />
      )}
    </div>
  );
}

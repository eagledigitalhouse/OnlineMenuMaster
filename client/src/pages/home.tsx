import { useState, useMemo } from "react";
import { Search, Settings, Coffee, MapPin, Clock, Users, Utensils, Star } from "lucide-react";
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
    
    // Separate drinks from other dishes
    const nonDrinkDishes = allDishes.filter(dish => dish.category !== 'bebidas');
    
    nonDrinkDishes.forEach(dish => {
      const countryName = dish.country.name;
      if (!grouped[countryName]) {
        grouped[countryName] = [];
      }
      grouped[countryName].push(dish);
    });

    return grouped;
  }, [allDishes]);

  const drinksByCountry = useMemo(() => {
    const grouped: Record<string, DishWithCountry[]> = {};
    
    const drinkDishes = allDishes.filter(dish => dish.category === 'bebidas');
    
    drinkDishes.forEach(dish => {
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
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Star className="w-7 h-7 text-yellow-500 mr-3 fill-current" />
              Destaques do Festival
              <span className="ml-auto text-sm font-normal text-gray-500 bg-yellow-50 px-3 py-1 rounded-full flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" />
                {featuredDishes.length} pratos
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredDishes.map((dish, index) => (
                <motion.div
                  key={dish.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
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

        {/* Food Dishes by Country */}
        <div className="mb-12">
          {selectedCountry === null ? (
            /* Show all dishes grouped by country when no country is selected */
            Object.entries(dishesByCountry)
              .sort(([, dishesA], [, dishesB]) => dishesA[0]?.country.order - dishesB[0]?.country.order)
              .map(([countryName, dishes]) => (
              <motion.section
                key={countryName}
                className="mb-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center sticky top-32 bg-white/95 backdrop-blur-sm py-4 px-4 mx--4 z-20 border-b border-gray-200 rounded-lg shadow-sm">
                  <MapPin className="w-6 h-6 text-blue-600 mr-3" />
                  <span className="text-2xl mr-3">
                    {dishes[0]?.country.flagEmoji}
                  </span>
                  {countryName}
                  <span className="ml-auto text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
                    <Utensils className="w-3 h-3" />
                    {dishes.length} {dishes.length === 1 ? 'prato' : 'pratos'}
                  </span>
                </h2>
                <div className="space-y-4">
                  {dishes.map((dish, index) => (
                    <motion.div
                      key={dish.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
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
                className="mb-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-fenui-dark mb-6 flex items-center sticky top-32 bg-gray-50 py-3 z-20 border-b-2 border-fenui-yellow">
                  <span className="text-3xl mr-4">
                    {countries.find(c => c.id === selectedCountry)?.flagEmoji}
                  </span>
                  {countries.find(c => c.id === selectedCountry)?.name}
                  <span className="ml-auto text-sm font-normal text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
                    {allDishes.filter(d => d.category !== 'bebidas').length} pratos
                  </span>
                </h2>
                <div className="space-y-4">
                  {allDishes.filter(d => d.category !== 'bebidas').map((dish, index) => (
                    <motion.div
                      key={dish.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
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
        </div>

        {/* Drinks Section - Separate */}
        {Object.keys(drinksByCountry).length > 0 && (
          <div className="mb-12">
            <motion.section
              className="mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center sticky top-32 bg-white/95 backdrop-blur-sm py-4 px-4 mx--4 z-20 border-b border-gray-200 rounded-lg shadow-sm">
                <Coffee className="w-6 h-6 text-blue-600 mr-3" />
                Bebidas & Sucos
                <span className="ml-auto text-sm font-normal text-gray-500 bg-blue-50 px-3 py-1 rounded-full flex items-center gap-1">
                  <Coffee className="w-3 h-3" />
                  {Object.values(drinksByCountry).flat().length} opções
                </span>
              </h2>
              
              <div className="space-y-8">
                {Object.entries(drinksByCountry)
                  .sort(([, dishesA], [, dishesB]) => dishesA[0]?.country.order - dishesB[0]?.country.order)
                  .map(([countryName, drinks]) => (
                  <div key={countryName} className="space-y-4">
                    <h3 className="text-lg font-semibold text-fenui-dark flex items-center">
                      <span className="text-xl mr-3">
                        {drinks[0]?.country.flagEmoji}
                      </span>
                      {countryName}
                    </h3>
                    <div className="space-y-3">
                      {drinks.map((drink, index) => (
                        <motion.div
                          key={drink.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <DishCard
                            dish={drink}
                            onClick={() => handleDishClick(drink)}
                            horizontal
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>
        )}

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
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-2">FENUI 2024</h3>
            <p className="text-gray-300 text-lg">Festa das Nações de Indaiatuba</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h4 className="font-bold mb-4 text-yellow-400 flex items-center justify-center md:justify-start gap-2">
                <MapPin className="w-5 h-5" />
                Local
              </h4>
              <p className="text-gray-300">Parque Ecológico de Indaiatuba</p>
              <p className="text-gray-300">Rua das Nações, 123</p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-yellow-400 flex items-center justify-center md:justify-start gap-2">
                <Clock className="w-5 h-5" />
                Datas & Horários
              </h4>
              <p className="text-gray-300">15 a 25 de Dezembro</p>
              <p className="text-gray-300">18h às 23h</p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-yellow-400 flex items-center justify-center md:justify-start gap-2">
                <Users className="w-5 h-5" />
                Contato
              </h4>
              <div className="flex justify-center md:justify-start gap-4 mt-2">
                <a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors p-2 bg-gray-800 rounded-full">
                  <Users className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors p-2 bg-gray-800 rounded-full">
                  <MapPin className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors p-2 bg-gray-800 rounded-full">
                  <Coffee className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
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

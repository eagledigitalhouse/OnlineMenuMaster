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

    // Sort countries alphabetically
    const sortedCountries = Object.keys(grouped).sort((a, b) => a.localeCompare(b, 'pt-BR'));
    const sortedGrouped = {} as Record<string, DishWithCountry[]>;
    sortedCountries.forEach(country => {
      sortedGrouped[country] = grouped[country];
    });

    return sortedGrouped;
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

    // Sort countries alphabetically for drinks too
    const sortedCountries = Object.keys(grouped).sort((a, b) => a.localeCompare(b, 'pt-BR'));
    const sortedGrouped = {} as Record<string, DishWithCountry[]>;
    sortedCountries.forEach(country => {
      sortedGrouped[country] = grouped[country];
    });

    return sortedGrouped;
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

  // Country colors mapping
  const getCountryTheme = (countryName: string) => {
    const themes: Record<string, { bg: string; text: string; border: string; accent: string }> = {
      'Suíça': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', accent: 'bg-red-500' },
      'Alemanha': { bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-200', accent: 'bg-yellow-500' },
      'Argentina': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', accent: 'bg-blue-500' },
      'Brasil': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', accent: 'bg-green-500' },
      'Chile': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', accent: 'bg-red-500' },
      'Coreia do Sul': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', accent: 'bg-purple-500' },
      'Espanha': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', accent: 'bg-orange-500' },
      'França': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', accent: 'bg-blue-500' },
      'Grécia': { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', accent: 'bg-cyan-500' },
      'Itália': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', accent: 'bg-emerald-500' },
      'Japão': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', accent: 'bg-rose-500' },
      'Portugal': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', accent: 'bg-indigo-500' },
    };
    
    return themes[countryName] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', accent: 'bg-gray-500' };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        {/* FENUI Banner */}
        <div className="h-20 fenui-gradient relative overflow-hidden">
          <div className="absolute inset-0 fenui-mosaic opacity-20"></div>
          <div className="container mx-auto px-4 h-full flex items-center justify-center relative">
            <h1 className="font-display text-white text-2xl md:text-3xl font-bold tracking-wide">
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
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-6 flex items-center flex-wrap gap-2">
              <div className="flex items-center">
                <Star className="w-7 h-7 text-yellow-500 mr-3 fill-current" />
                <span>Destaques do Festival</span>
              </div>
              <span className="text-sm font-body font-normal text-gray-500 bg-yellow-50 px-3 py-1 rounded-full flex items-center gap-1 ml-auto">
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
                <h2 className={`font-display text-xl font-bold mb-6 flex items-center flex-wrap gap-2 sticky top-32 backdrop-blur-sm py-4 px-4 mx-4 z-20 rounded-lg shadow-sm border ${getCountryTheme(countryName).bg} ${getCountryTheme(countryName).text} ${getCountryTheme(countryName).border}`}>
                  <div className="flex items-center">
                    <div className={`w-2 h-8 rounded-full mr-4 ${getCountryTheme(countryName).accent}`}></div>
                    <span className="text-2xl mr-3">
                      {dishes[0]?.country.flagEmoji}
                    </span>
                    <span>{countryName}</span>
                  </div>
                  <span className={`text-sm font-body font-normal px-3 py-1 rounded-full flex items-center gap-1 ml-auto ${getCountryTheme(countryName).bg} border ${getCountryTheme(countryName).border}`}>
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
                <h2 className="font-display text-2xl font-bold text-gray-900 mb-6 flex items-center flex-wrap gap-2 sticky top-32 bg-white/95 backdrop-blur-sm py-4 px-4 mx-4 z-20 border-b border-gray-200 rounded-lg shadow-sm">
                  <div className="flex items-center">
                    <span className="text-3xl mr-4">
                      {countries.find(c => c.id === selectedCountry)?.flagEmoji}
                    </span>
                    <span>{countries.find(c => c.id === selectedCountry)?.name}</span>
                  </div>
                  <span className="text-sm font-body font-normal text-gray-500 bg-orange-50 px-3 py-1 rounded-full ml-auto">
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
              <h2 className="font-display text-xl font-bold text-gray-900 mb-6 flex items-center flex-wrap gap-2 sticky top-32 bg-white/95 backdrop-blur-sm py-4 px-4 mx-4 z-20 border-b border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <Coffee className="w-6 h-6 text-blue-600 mr-3" />
                  <span>Bebidas & Sucos</span>
                </div>
                <span className="text-sm font-body font-normal text-gray-500 bg-blue-50 px-3 py-1 rounded-full flex items-center gap-1 ml-auto">
                  <Coffee className="w-3 h-3" />
                  {Object.values(drinksByCountry).flat().length} opções
                </span>
              </h2>
              
              <div className="space-y-8">
                {Object.entries(drinksByCountry).map(([countryName, drinks]) => (
                  <div key={countryName} className="space-y-4">
                    <h3 className={`font-display text-lg font-semibold flex items-center py-3 px-4 rounded-lg ${getCountryTheme(countryName).bg} ${getCountryTheme(countryName).text} border ${getCountryTheme(countryName).border}`}>
                      <div className={`w-1 h-6 rounded-full mr-3 ${getCountryTheme(countryName).accent}`}></div>
                      <span className="text-xl mr-3">
                        {drinks[0]?.country.flagEmoji}
                      </span>
                      <span>{countryName}</span>
                      <span className={`ml-auto text-sm font-body font-normal px-2 py-1 rounded-full ${getCountryTheme(countryName).bg} border ${getCountryTheme(countryName).border}`}>
                        <Coffee className="w-3 h-3 inline mr-1" />
                        {drinks.length} {drinks.length === 1 ? 'bebida' : 'bebidas'}
                      </span>
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
            <h3 className="font-display text-3xl font-bold mb-2">FENUI 2024</h3>
            <p className="font-body text-gray-300 text-lg">Festa das Nações de Indaiatuba</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h4 className="font-display font-bold mb-4 text-yellow-400 flex items-center justify-center md:justify-start gap-2">
                <MapPin className="w-5 h-5" />
                Local
              </h4>
              <p className="font-body text-gray-300">Parque Ecológico de Indaiatuba</p>
              <p className="font-body text-gray-300">Rua das Nações, 123</p>
            </div>
            
            <div>
              <h4 className="font-display font-bold mb-4 text-yellow-400 flex items-center justify-center md:justify-start gap-2">
                <Clock className="w-5 h-5" />
                Datas & Horários
              </h4>
              <p className="font-body text-gray-300">15 a 25 de Dezembro</p>
              <p className="font-body text-gray-300">18h às 23h</p>
            </div>
            
            <div>
              <h4 className="font-display font-bold mb-4 text-yellow-400 flex items-center justify-center md:justify-start gap-2">
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

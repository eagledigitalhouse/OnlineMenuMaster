import { useState, useMemo, useEffect } from "react";
import { useCountries } from "@/hooks/use-countries";
import { useDishes } from "@/hooks/use-dishes";
import { useBanners } from "@/hooks/use-banners";
import CountryStories from "@/components/country-stories";
import DishCarousel from "@/components/dish-carousel";
import BannerCarousel from "@/components/banner-carousel";
import FenuiBanner from "@/components/fenui-banner";
import DishModal from "@/components/dish-modal";
import NewBottomNavigation from "@/components/new-bottom-navigation";
import { HyperText } from "@/components/ui/hyper-text";
import { Input } from "@/components/ui/input";
import { Search, Coffee, UtensilsCrossed, Cookie, Grid3X3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { DishWithCountry } from "@shared/schema";
import { FENUI_COLORS } from "@/lib/theme-colors";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDish, setSelectedDish] = useState<DishWithCountry | null>(null);
  const [showWelcomeStamp, setShowWelcomeStamp] = useState(false);

  // Verificar se veio da página de boas-vindas
  useEffect(() => {
    const fromWelcome = sessionStorage.getItem('fromWelcome');
    if (fromWelcome === 'true') {
      sessionStorage.removeItem('fromWelcome');
      // Mostrar carimbo após 1 segundo
      setTimeout(() => {
        setShowWelcomeStamp(true);
      }, 1000);
      
      // Esconder carimbo após 4 segundos
      setTimeout(() => {
        setShowWelcomeStamp(false);
      }, 5000);
    }
  }, []);

  const { data: countries = [] } = useCountries();
  const { data: dishes = [] } = useDishes();
  const { data: banners = [] } = useBanners();

  // Categorias para os filtros
  const categories = [
    { id: "all", label: "Todos", icon: Grid3X3 },
    { id: "salgados", label: "Salgados", icon: UtensilsCrossed },
    { id: "doces", label: "Doces", icon: Cookie },
    { id: "bebidas", label: "Bebidas", icon: Coffee },
  ];

  // Filtros inteligentes
  const filteredDishes = useMemo(() => {
    return dishes.filter((dish) => {
      const matchesCategory = selectedCategory === "all" || dish.category === selectedCategory;
      const matchesCountry = !selectedCountry || dish.countryId === selectedCountry;
      const matchesSearch = !searchQuery || 
        dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.country?.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesCountry && matchesSearch;
    });
  }, [dishes, selectedCategory, selectedCountry, searchQuery]);

  // Handlers
  const handleDishClick = (dish: DishWithCountry) => {
    setSelectedDish(dish);
  };

  return (
    <div className="min-h-screen bg-white flex justify-center">
      {/* CONTAINER PRINCIPAL - LIMITES FIXOS COMO APP MOBILE */}
      <div className="app-container">
      
        {/* ========================================== */}
        {/* SEÇÃO: BANNER HEADER COM MOSAICO           */}
        {/* ========================================== */}
        <div className="fixed top-0 left-0 right-0 z-50">
          {/* Container do banner */}
          <div className="bg-white shadow-sm relative">
            {/* BANNER MOSAICO */}
            <FenuiBanner />
            
            {/* LOGO FENUI - Sempre centralizada e na mesma posição */}
            <div 
              className="absolute left-0 right-0 bottom-0 flex justify-center"
              style={{ transform: "translateY(40px)" }}
            >
              <motion.div
                className="bg-fenui-red-600 p-4 rounded-full shadow-2xl border-4 border-white"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <img 
                  src="/assets/LOGO FENUI.png" 
                  alt="Logo FENUI" 
                  className="w-16 h-16 md:w-20 md:h-20 object-contain"
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Espaçador para compensar o header fixo + logo */}
        <div className="h-20 md:h-24"></div>

        {/* ========================================== */}
        {/* SEÇÃO: TÍTULO PRINCIPAL                    */}
        {/* ========================================== */}
        <motion.section 
          className="bg-gray-100 transition-all duration-300"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="bg-gray-100 pt-16 pb-4 relative overflow-hidden">
            <div className="container-responsive relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center space-y-0"
              >
                <HyperText
                  as="h1"
                  className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-0 leading-tight"
                  startOnView={true}
                  duration={1000}
                  delay={500}
                >
                  Uma volta ao mundo!
                </HyperText>
                <p className="text-sm text-gray-600 max-w-lg mx-auto -mt-2">
                  22ª FENUI - FESTA DAS NAÇÕES UNIDAS DE INDAIATUBA
                </p>
              </motion.div>
            </div>
          </div>
        </motion.section>
        
        {/* ========================================== */}
        {/* SEÇÃO: BANDEIRAS DOS PAÍSES                */}
        {/* ========================================== */}
        <motion.section 
          className="bg-gray-100 border-b border-gray-200"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <div className="container-responsive py-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <CountryStories
                countries={countries}
                selectedCountry={selectedCountry}
                onCountrySelect={setSelectedCountry}
              />
            </motion.div>
          </div>
        </motion.section>

        {/* ========================================== */}
        {/* SEÇÃO: BUSCA E FILTROS                     */}
        {/* ========================================== */}
        <motion.section 
          className="bg-gray-100 border-b border-gray-200"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="container-responsive py-4 space-y-4">
            {/* Search Bar - Compacto */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="max-w-md mx-auto"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-fenui-red-600 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Buscar prato, país ou ingrediente..."
                  className="pl-10 pr-4 py-3 text-sm border-2 border-fenui-red-600/20 rounded-xl bg-white shadow-sm focus:border-fenui-red-600 focus:ring-fenui-red-600/20 transition-all duration-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </motion.div>

            {/* Filtros de Categoria - Novo Design */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex items-center justify-center gap-2 overflow-x-auto scrollbar-hide"
            >
              {categories.map((category, index) => {
                const isActive = selectedCategory === category.id;
                const Icon = category.icon;
                
                return (
                  <motion.button
                    key={category.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      "inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full font-medium text-xs whitespace-nowrap transition-all duration-200",
                      "border focus:outline-none focus:ring-2 focus:ring-fenui-red-600/30 focus:ring-offset-1",
                      isActive
                        ? "bg-fenui-red-600 text-white border-fenui-red-600 shadow-sm"
                        : "bg-white text-fenui-green-600 border-gray-100 hover:border-fenui-red-600/30 hover:bg-fenui-red-600/5 hover:text-fenui-green-700"
                    )}
                    whileHover={{ scale: isActive ? 1 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className={cn(
                      "w-3.5 h-3.5",
                      isActive ? "text-white" : "text-fenui-green-600"
                    )} />
                    {category.label}
                  </motion.button>
                );
              })}
            </motion.div>
          </div>
        </motion.section>

        {/* ========================================== */}
        {/* BANNER CAROUSEL - Se houver banners        */}
        {/* ========================================== */}
        {banners.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <BannerCarousel />
          </motion.div>
        )}

        {/* ========================================== */}
        {/* MAIN CONTENT - PRATOS                      */}
        {/* ========================================== */}
        <motion.main 
          id="pratos-section" 
          className="py-6 pb-36 bg-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 1 }}
        >
          {filteredDishes.length > 0 ? (
            <div className="space-y-8">
              {/* Pratos por País */}
              {countries
                .filter(country => 
                  filteredDishes.some(dish => dish.countryId === country.id)
                )
                .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
                .map((country, index) => {
                  const countryDishes = filteredDishes.filter(
                    dish => dish.countryId === country.id
                  );
                  
                  return (
                    <motion.div
                      key={country.id}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                    >
                      <DishCarousel
                        title={`${country.flagEmoji} ${country.name}`}
                        dishes={countryDishes}
                        onDishClick={handleDishClick}
                      />
                    </motion.div>
                  );
                })}
            </div>
          ) : (
            /* Estado Vazio */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Nenhum prato encontrado
              </h3>
              <p className="text-gray-600 max-w-md mx-auto mb-4 text-sm">
                Tente ajustar os filtros ou buscar por outros termos
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setSelectedCountry(null);
                  }}
                  className="px-6 py-2 bg-fenui-red-600 text-white rounded-lg font-medium hover:bg-fenui-red-700 transition-colors text-sm shadow-sm"
                >
                  Limpar Filtros
                </button>
                <button
                  onClick={() => setSelectedCategory("all")}
                  className="px-6 py-2 bg-white text-fenui-green-600 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
                >
                  Ver Todos
                </button>
              </div>
            </motion.div>
          )}
        </motion.main>

        {/* ========================================== */}
        {/* BOTTOM NAVIGATION                          */}
        {/* ========================================== */}
        <NewBottomNavigation />

        {/* ========================================== */}
        {/* MODAL DE PRATO                             */}
        {/* ========================================== */}
        <AnimatePresence>
          {selectedDish && (
            <DishModal
              dish={selectedDish}
              isOpen={!!selectedDish}
              onClose={() => setSelectedDish(null)}
            />
          )}
        </AnimatePresence>

        {/* ========================================== */}
        {/* CARIMBO DE BEM-VINDO                       */}
        {/* ========================================== */}
        <AnimatePresence>
          {showWelcomeStamp && (
            <motion.div
              initial={{ scale: 0, rotate: -45, opacity: 0 }}
              animate={{ scale: 1, rotate: -15, opacity: 1 }}
              exit={{ scale: 0, rotate: -45, opacity: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 10,
                duration: 0.8 
              }}
              className="fixed top-20 right-4 pointer-events-none z-50"
            >
              {/* Carimbo retangular simples */}
              <div className="relative">
                <div 
                  className="border-4 border-red-600 bg-red-100 px-4 py-3 text-center shadow-xl"
                  style={{
                    borderRadius: '12px',
                    borderStyle: 'solid',
                    transform: 'rotate(3deg)',
                  }}
                >
                  <div className="text-red-800 font-black text-lg tracking-wider leading-tight">
                    BEM-VINDO
                  </div>
                  <div className="text-red-700 font-bold text-sm tracking-wide leading-tight">
                    22ª FENUI 2025
                  </div>
                  <div className="text-red-600 font-semibold text-xs leading-tight">
                    04-06 JULHO
                  </div>
                  <div className="text-red-500 font-medium text-xs leading-tight mt-1">
                    BOA VIAGEM! 🌍
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

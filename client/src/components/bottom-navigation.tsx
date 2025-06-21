import { useState } from "react";
import { Home, UtensilsCrossed, Globe, Heart, User, X, Calendar } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useCountries } from "@/hooks/use-countries";
import { useFavorites } from "@/hooks/use-favorites";
import CountryGallery from "./country-gallery";
import { FENUI_COLORS } from "@/lib/theme-colors";

interface BottomNavigationProps {
  onCountrySelect?: (countryId: number | null) => void;
  selectedCountry?: number | null;
}

export default function BottomNavigation({ 
  onCountrySelect,
  selectedCountry 
}: BottomNavigationProps) {
  const [location] = useLocation();
  const [showCountrySelector, setShowCountrySelector] = useState(false);
  const { data: countries = [] } = useCountries();
  const { favorites } = useFavorites();

  // Filtrar países ativos e ordenar alfabeticamente
  const activeCountries = countries
    .filter(country => country.isActive)
    .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

  // Mapear países para códigos ISO das Circle Flags
  const getCircleFlagUrl = (countryName: string) => {
    const countryToCode: Record<string, string> = {
      "Suíça": "ch",
      "Alemanha": "de", 
      "Japão": "jp",
      "África do Sul (Afro-Brasileira)": "za",
      "África": "za",
      "Brasil": "br",
      "Rússia": "ru",
      "China": "cn",
      "Espanha": "es",
      "Estados Unidos": "us",
      "Síria": "sy",
      "França": "fr",
      "Itália": "it"
    };
    
    const code = countryToCode[countryName];
    return code ? `https://hatscripts.github.io/circle-flags/flags/${code}.svg` : null;
  };

  const navItems = [
    { icon: Home, label: "Início", href: "/" },
    { icon: Calendar, label: "Programação", href: "/programacao" },
    { icon: Globe, label: "Países", isCenter: true },
    { icon: Heart, label: "Favoritos", href: "/favorites" },
    { icon: User, label: "Admin", href: "/admin" },
  ];

  const handleCountryClick = (countryId: number | null) => {
    onCountrySelect?.(countryId);
    setShowCountrySelector(false);
  };

  return (
    <>
      {/* Nova Galeria Circular WebGL */}
      <CountryGallery
        countries={activeCountries.map(country => ({
          id: country.id,
          name: country.name,
          flagUrl: getCircleFlagUrl(country.name) || `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23f0f0f0"/><text x="50" y="50" text-anchor="middle" dy=".3em" font-size="40">${country.flagEmoji || '🏳️'}</text></svg>`
        }))}
        onCountrySelect={handleCountryClick}
        selectedCountry={selectedCountry ?? null}
        isOpen={showCountrySelector}
        onClose={() => setShowCountrySelector(false)}
      />

      {/* Barra de Navegação - NOVO DESIGN */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-30">
        <div className="flex items-center justify-around px-4 py-2">
          {navItems.map((item, index) => {
            if (item.isCenter) {
              return (
                <motion.button
                  key={index}
                  onClick={() => setShowCountrySelector(!showCountrySelector)}
                  className={cn(
                    "relative -mt-8 w-16 h-16 rounded-full bg-fenui-red-600 text-white shadow-xl",
                    "flex items-center justify-center transition-all duration-300",
                    "hover:scale-105 active:scale-95",
                    showCountrySelector && "scale-105 shadow-2xl"
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse" />
                  <motion.div
                    animate={{ rotate: showCountrySelector ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <item.icon className="w-7 h-7 relative z-10" />
                  </motion.div>
                </motion.button>
              );
            }

            const isActive = location === item.href;
            
            return (
              <Link key={index} href={item.href!}>
                <a className="flex flex-col items-center gap-1 py-2 px-3 group relative">
                  <div className="relative">
                    <item.icon 
                      className={cn(
                        "w-6 h-6 transition-colors duration-300",
                        isActive ? "text-fenui-yellow-500" : "text-fenui-green-600",
                        "group-hover:text-fenui-yellow-500"
                      )} 
                    />
                    {/* Badge de contador para favoritos */}
                    {item.label === "Favoritos" && favorites.length > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-fenui-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-sm"
                      >
                        {favorites.length > 99 ? '99+' : favorites.length}
                      </motion.div>
                    )}
                  </div>
                  <span 
                    className={cn(
                      "text-xs font-medium transition-colors duration-300",
                      isActive ? "text-fenui-yellow-500" : "text-fenui-green-600",
                      "group-hover:text-fenui-yellow-500"
                    )}
                  >
                    {item.label}
                  </span>
                </a>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
} 
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { X, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface CountryGalleryProps {
  countries: Array<{
    id: number;
    name: string;
    flagUrl: string;
  }>;
  onCountrySelect: (countryId: number | null) => void;
  selectedCountry: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CountryGallery({
  countries,
  onCountrySelect,
  selectedCountry,
  isOpen,
  onClose,
}: CountryGalleryProps) {
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Adicionar "Todos" no início da lista
  const allCountries = [
    { id: null, name: "Todos", flagUrl: "" },
    ...countries,
  ];

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);
    // Implementar snap para os itens se necessário
    const velocity = info.velocity.x;
    const offset = info.offset.x;
    
    // Calcular para qual posição deve ir baseado no drag
    const itemWidth = 80; // 64px + 16px de gap
    const newPosition = Math.round((dragX + offset) / itemWidth) * itemWidth;
    
    // Limitar o scroll
    const maxScroll = -(allCountries.length - 4) * itemWidth; // Mostrar 4 itens por vez
    const constrainedPosition = Math.max(Math.min(newPosition, 0), maxScroll);
    
    setDragX(constrainedPosition);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Carrossel Horizontal - CENTRALIZADO NO CONTAINER */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 400,
              duration: 0.4,
            }}
            className="fixed bottom-32 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm md:max-w-md lg:max-w-lg px-4"
          >
            <div className="relative bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h3 className="text-lg font-bold text-white">Selecione um País</h3>
                <motion.button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Carrossel Container */}
              <div className="p-4">
                <div className="relative overflow-hidden">
                  {/* Gradiente nas bordas para indicar scroll */}
                  <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/20 to-transparent z-10 pointer-events-none" />
                  <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/20 to-transparent z-10 pointer-events-none" />
                  
                  {/* Items Container */}
                  <motion.div
                    className="flex gap-4 cursor-grab active:cursor-grabbing"
                    drag="x"
                    dragConstraints={{
                      left: -(allCountries.length - 4) * 80,
                      right: 0,
                    }}
                    dragElastic={0.1}
                    onDragStart={() => setIsDragging(true)}
                    onDragEnd={handleDragEnd}
                    animate={{ x: dragX }}
                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                    style={{ x: dragX }}
                  >
                    {allCountries.map((country, index) => (
                      <motion.div
                        key={country.id || "todos"}
                        className="flex-shrink-0 flex flex-col items-center gap-2"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          delay: index * 0.1,
                          type: "spring",
                          stiffness: 500,
                          damping: 20,
                        }}
                      >
                        <motion.button
                          onClick={() => {
                            if (!isDragging) {
                              onCountrySelect(country.id);
                            }
                          }}
                          className={cn(
                            "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 overflow-hidden border-3 shadow-lg",
                            "relative group",
                            selectedCountry === country.id
                              ? "bg-fenui-red-600 border-fenui-red-600 ring-4 ring-fenui-red-600/40 shadow-fenui-red-600/50 scale-110"
                              : "bg-white/90 border-white/50 hover:border-fenui-red-600 hover:bg-white shadow-black/20 hover:shadow-fenui-red-600/30 hover:scale-105"
                          )}
                          whileHover={{ scale: selectedCountry === country.id ? 1.1 : 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {/* Efeito de seleção animado */}
                          {selectedCountry === country.id && (
                            <motion.div
                              className="absolute inset-0 rounded-full bg-fenui-red-600/20 animate-ping"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                            />
                          )}

                          {country.id === null ? (
                            // Botão "Todos"
                            <Globe className={cn(
                              "w-8 h-8 relative z-10",
                              selectedCountry === null ? "text-white" : "text-fenui-red-600"
                            )} />
                          ) : (
                            // Bandeira do país
                            <img
                              src={country.flagUrl}
                              alt={`Bandeira ${country.name}`}
                              className="w-full h-full object-cover rounded-full relative z-10"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `<span class="text-2xl font-bold text-fenui-red-600">${country.name.charAt(0)}</span>`;
                                }
                              }}
                            />
                          )}

                          {/* Overlay de seleção */}
                          {selectedCountry === country.id && (
                            <motion.div
                              className="absolute inset-0 rounded-full border-2 border-white"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.1 }}
                            />
                          )}
                        </motion.button>

                        {/* Nome do país */}
                        <motion.span
                          className={cn(
                            "text-xs font-medium text-center leading-tight transition-colors min-h-[2rem] flex items-center",
                            selectedCountry === country.id
                              ? "text-white font-bold"
                              : "text-white/80"
                          )}
                          style={{ width: "64px" }}
                        >
                          {country.name.replace("África do Sul (Afro-Brasileira)", "África do Sul")}
                        </motion.span>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                {/* Indicador de scroll */}
                <motion.div
                  className="flex justify-center mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex gap-1">
                    {Array.from({ length: Math.ceil(allCountries.length / 4) }).map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "w-2 h-2 rounded-full transition-colors",
                          Math.abs(dragX) >= i * 320 && Math.abs(dragX) < (i + 1) * 320
                            ? "bg-white"
                            : "bg-white/30"
                        )}
                      />
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Dica de uso */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-center mt-3"
            >
              <span className="text-xs text-white/60 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                👆 Arraste para ver mais países
              </span>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 
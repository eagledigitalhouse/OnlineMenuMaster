import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useBanners } from "@/hooks/use-banners";

export default function BannerCarousel() {
  const { data: banners = [] } = useBanners();
  const [currentIndex, setCurrentIndex] = useState(0);
  const activeBanners = banners.filter(b => b.isActive).sort((a, b) => a.order - b.order);

  useEffect(() => {
    if (activeBanners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [activeBanners.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? activeBanners.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  if (activeBanners.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden rounded-2xl shadow-lg mx-4 my-6">
      <div className="relative h-36 md:h-48 bg-gray-100">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            {activeBanners[currentIndex]?.link ? (
              <a 
                href={activeBanners[currentIndex].link!} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full h-full"
              >
                <img
                  src={activeBanners[currentIndex].image}
                  alt={activeBanners[currentIndex].title}
                  className="w-full h-full object-cover"
                />
              </a>
            ) : (
              <img
                src={activeBanners[currentIndex]?.image}
                alt={activeBanners[currentIndex]?.title}
                className="w-full h-full object-cover"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Controles */}
        {activeBanners.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center transition-all hover:bg-black/50"
              aria-label="Banner anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center transition-all hover:bg-black/50"
              aria-label="Próximo banner"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Indicadores */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {activeBanners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    index === currentIndex 
                      ? "bg-white w-6" 
                      : "bg-white/50"
                  )}
                  aria-label={`Ir para banner ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
} 
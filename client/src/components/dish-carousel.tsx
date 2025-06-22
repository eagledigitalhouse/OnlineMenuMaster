import { DishWithCountry } from "@shared/schema";
import DishCard from "./dish-card";
import DepartureBoard from "./ui/departure-board";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Star, MapPin, UtensilsCrossed } from 'lucide-react';
import { useState, useRef, memo } from 'react';
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

interface DishCarouselProps {
  dishes: DishWithCountry[];
  onDishClick: (dish: DishWithCountry) => void;
  title: string;
}

const DishCarousel = memo(function DishCarousel({
  dishes,
  onDishClick,
  title,
}: DishCarouselProps) {
  const [swiperRef, setSwiperRef] = useState<any>(null);
  const [isInView, setIsInView] = useState(false);

  if (!dishes || dishes.length === 0) {
    return null;
  }

  // Verificar se é seção de destaques
  const isFeatures = title.includes('🌟');
  
  // Extrair emoji e nome do país
  const parseTitle = (title: string) => {
    const parts = title.split(' ');
    const emoji = parts[0];
    const countryName = parts.slice(1).join(' ');
    return { emoji, countryName };
  };

  const { emoji, countryName } = parseTitle(title);



  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8 }}
      onViewportEnter={() => setIsInView(true)}
      className="mb-6"
    >
      {/* Section Header - LIMPO */}
      <div className="container-responsive pb-4">
        {isFeatures ? (
          // Título para Destaques
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-fenui-yellow fill-current" />
              <h2 className="text-lg font-bold text-gray-900">{title}</h2>
            </div>
          </div>
        ) : (
          // Título para países - LIMPO
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                {/* Bandeira Circle Flag */}
                <div className="flex-shrink-0">
                {(() => {
                  const getCircleFlagUrl = (countryName: string) => {
                    const countryToCode: Record<string, string> = {
                      "Suíça": "ch",
                      "Alemanha": "de", 
                      "Japão": "jp",
                      "Brasil": "br",
                      "Rússia": "ru",
                      "China": "cn",
                      "Espanha": "es",
                      "Estados Unidos": "us",
                      "Síria": "sy",
                      "França": "fr",
                      "Itália": "it"
                    };
                    
                    // Verificação especial para África do Sul - várias variações
                    const countryLower = countryName.toLowerCase();
                    if (countryLower.includes('áfrica do sul') || 
                        countryLower.includes('africa do sul') ||
                        countryLower.includes('afro-brasileira') ||
                        countryLower.includes('sul africana') ||
                        countryLower.includes('south africa')) {
                      return `https://hatscripts.github.io/circle-flags/flags/za.svg`;
                    }
                    
                    const code = countryToCode[countryName];
                    return code ? `https://hatscripts.github.io/circle-flags/flags/${code}.svg` : null;
                  };
                  
                  const flagUrl = getCircleFlagUrl(countryName);
                  
                  return flagUrl ? (
                    <motion.img
                      src={flagUrl}
                      alt={`Bandeira ${countryName}`}
                      className="w-10 h-10 object-cover rounded-full shadow-md border-2 border-white"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={isInView ? { scale: 1, opacity: 1 } : {}}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      whileHover={{ scale: 1.1 }}
                    />
                  ) : (
                    <motion.div 
                      className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={isInView ? { scale: 1, opacity: 1 } : {}}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      {emoji}
                    </motion.div>
                  );
                })()}
              </div>
              
              {/* Título com Departure Board */}
              <div className="flex-1 min-w-0">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <DepartureBoard 
                    text={countryName.toUpperCase()}
                    className="text-lg md:text-xl"
                    animationSpeed={1.5}
                    startAnimation={isInView}
                  />
                </motion.div>
              </div>
               
              {/* Badge de pratos */}
              <div className="flex-shrink-0">
                <motion.div 
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium text-xs whitespace-nowrap bg-white text-gray-700 border border-gray-200 shadow-sm"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={isInView ? { scale: 1, opacity: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <UtensilsCrossed className="w-3 h-3 text-gray-500" />
                  <span>
                    {dishes.length} {dishes.length === 1 ? 'prato' : 'pratos'}
                  </span>
                </motion.div>
              </div>
            </div>
            
            {/* Linha decorativa melhorada */}
            <motion.div 
              className="relative"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
              style={{ originX: 0 }}
            >
              <div className="h-1 bg-gradient-to-r from-fenui-blue via-fenui-red to-fenui-yellow rounded-full w-32 shadow-sm"></div>
              <div className="absolute inset-0 h-1 bg-gradient-to-r from-fenui-blue via-fenui-red to-fenui-yellow rounded-full w-32 opacity-30 blur-sm"></div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Carousel Container - TODAS AS VERSÕES */}
      <div className="relative group">
        {/* Botão Anterior */}
        {dishes.length > 1 && (
          <motion.button
            onClick={() => swiperRef?.slidePrev()}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/95 hover:bg-white shadow-xl rounded-full p-3 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 backdrop-blur-sm border border-gray-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </motion.button>
        )}

        {/* Botão Próximo */}
        {dishes.length > 1 && (
          <motion.button
            onClick={() => swiperRef?.slideNext()}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/95 hover:bg-white shadow-xl rounded-full p-3 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 backdrop-blur-sm border border-gray-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </motion.button>
        )}

        <Swiper
          onSwiper={setSwiperRef}
          modules={[Navigation]}
          spaceBetween={0}
          slidesPerView="auto"
          grabCursor={true}
          className="carousel-container !overflow-hidden"
          centeredSlides={false}
          loop={false}
          allowTouchMove={true}
          resistance={false}
          watchOverflow={true}
          slidesOffsetBefore={16}
          slidesOffsetAfter={16}
          breakpoints={{
            640: {
              slidesOffsetBefore: 24,
              slidesOffsetAfter: 24,
            },
            768: {
              slidesOffsetBefore: 32,
              slidesOffsetAfter: 32,
            }
          }}
        >
          {dishes.map((dish, index) => (
            <SwiperSlide key={dish.id} className="!h-auto !w-auto pr-1">
              <motion.div 
                className="flex items-center justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(index * 0.1, 0.5) }}
              >
                <DishCard
                  dish={dish}
                  onClick={() => onDishClick(dish)}
                  featured={dish.isFeatured && isFeatures}
                />
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>


    </motion.section>
  );
});

export default DishCarousel; 
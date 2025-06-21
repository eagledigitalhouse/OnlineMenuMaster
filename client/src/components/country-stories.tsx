import { Country } from "@shared/schema";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Globe, ArrowLeft, ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { useState } from 'react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

interface CountryStoriesProps {
  countries: Country[];
  selectedCountry: number | null;
  onCountrySelect: (countryId: number | null) => void;
}

export default function CountryStories({
  countries,
  selectedCountry,
  onCountrySelect,
}: CountryStoriesProps) {
  const [swiperRef, setSwiperRef] = useState<any>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  
  const activeCountries = countries
    .filter(country => country.isActive)
    .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

  // Mapear países para códigos ISO das Circle Flags
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

  // Renderizar item do país - TAMANHO AUMENTADO
  const renderCountryItem = (country: Country | null, isAllOption = false) => (
    <motion.div
      className="flex-shrink-0 text-center cursor-pointer w-16 mx-auto"
      onClick={() => onCountrySelect(isAllOption ? null : country?.id || null)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative">
        <div
          className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-sm overflow-hidden mx-auto",
            (isAllOption && selectedCountry === null) || (!isAllOption && selectedCountry === country?.id)
              ? "bg-fenui-red-600 ring-2 ring-fenui-red-600 ring-offset-1 scale-110" 
              : isAllOption ? "bg-gray-100 hover:bg-gray-200" : "bg-white border border-gray-200 hover:border-fenui-red-600/30"
          )}
        >
          {isAllOption ? (
            <Globe className={cn(
              "w-7 h-7",
              selectedCountry === null ? "text-white" : "text-gray-600"
            )} />
          ) : (
            <>
              <img
                src={getCircleFlagUrl(country?.name || '') || ''}
                alt={`Bandeira ${country?.name}`}
                className="w-full h-full object-cover"
                style={{ display: getCircleFlagUrl(country?.name || '') ? 'block' : 'none' }}
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.style.display = 'none';
                  const span = img.nextElementSibling as HTMLSpanElement;
                  if (span) span.style.display = 'flex';
                }}
              />
              <span 
                style={{ 
                  fontSize: '24px', 
                  lineHeight: 1,
                  display: getCircleFlagUrl(country?.name || '') ? 'none' : 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%'
                }}
              >
                {country?.flagEmoji || '🏳️'}
              </span>
            </>
          )}
        </div>
        {((isAllOption && selectedCountry === null) || (!isAllOption && selectedCountry === country?.id)) && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -bottom-1 -right-1 w-4 h-4 bg-fenui-green rounded-full flex items-center justify-center border-2 border-white"
          >
            <span className="text-white text-xs">✓</span>
          </motion.div>
        )}
      </div>
      <p className={cn(
        "mt-2 text-xs font-medium max-w-[64px] leading-tight text-center whitespace-pre-line break-words min-h-[28px] flex items-center justify-center",
        (isAllOption && selectedCountry === null) || (!isAllOption && selectedCountry === country?.id) 
          ? "text-fenui-red-600 font-bold" 
          : "text-gray-600"
      )}>
        {isAllOption ? "Todos" : country?.name.replace("África do Sul (Afro-Brasileira)", "África\ndo Sul")}
      </p>
    </motion.div>
  );

  return (
    <div className="relative overflow-visible py-2">
      <div className="px-4 py-4 relative">
        <Swiper
          onSwiper={setSwiperRef}
          modules={[Navigation]}
          spaceBetween={12}
          slidesPerView="auto"
          grabCursor={true}
          centeredSlides={false}
          loop={false}
          allowTouchMove={true}
          resistance={false}
          watchOverflow={true}
          speed={300}
          slidesOffsetBefore={16}
          slidesOffsetAfter={16}
          onSlideChange={(swiper) => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          breakpoints={{
            320: {
              spaceBetween: 10,
              slidesOffsetBefore: 12,
              slidesOffsetAfter: 12,
            },
            480: {
              spaceBetween: 12,
              slidesOffsetBefore: 14,
              slidesOffsetAfter: 14,
            },
            640: {
              spaceBetween: 14,
              slidesOffsetBefore: 16,
              slidesOffsetAfter: 16,
            },
          }}
          className="!overflow-visible"
        >
          {/* Opção "Todos" */}
          <SwiperSlide className="!w-auto">
            {renderCountryItem(null, true)}
          </SwiperSlide>

          {/* Países */}
          {activeCountries.map((country) => (
            <SwiperSlide key={country.id} className="!w-auto">
              {renderCountryItem(country)}
            </SwiperSlide>
          ))}
        </Swiper>
        
        {/* Indicação para arrastar - só aparece se não estiver no início e fim ao mesmo tempo */}
        {activeCountries.length > 4 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex items-center justify-center mt-2 gap-2"
          >
            <div className="flex items-center gap-1 text-gray-400 text-xs">
              <ArrowLeft className="w-3 h-3" />
              <span className="font-medium">Arraste para ver mais</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

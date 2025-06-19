import { Country } from "@shared/schema";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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
  const activeCountries = countries.filter(country => country.isActive);

  return (
    <section className="bg-white border-b border-gray-200 sticky top-24 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide">
          {/* "Todos" option */}
          <motion.div
            className={cn(
              "flex-shrink-0 text-center cursor-pointer transition-transform hover:scale-105",
              selectedCountry === null && "scale-105"
            )}
            onClick={() => onCountrySelect(null)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div
              className={cn(
                "w-16 h-16 md:w-20 md:h-20 rounded-full border-4 flex items-center justify-center text-white font-bold text-xs overflow-hidden fenui-gradient",
                selectedCountry === null ? "border-fenui-blue scale-110" : "border-gray-300"
              )}
            >
              🌍
            </div>
            <p className="mt-2 text-sm font-medium text-gray-700">Todos</p>
          </motion.div>

          {activeCountries
            .sort((a, b) => a.order - b.order)
            .map((country) => (
              <motion.div
                key={country.id}
                className={cn(
                  "flex-shrink-0 text-center cursor-pointer transition-transform hover:scale-105",
                  selectedCountry === country.id && "scale-105"
                )}
                onClick={() => onCountrySelect(country.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div
                  className={cn(
                    "w-16 h-16 md:w-20 md:h-20 rounded-full border-4 flex items-center justify-center text-2xl md:text-3xl overflow-hidden",
                    selectedCountry === country.id
                      ? "border-fenui-blue scale-110"
                      : "border-gray-300"
                  )}
                  style={{
                    background: country.flagImage
                      ? `url(${country.flagImage}) center/cover`
                      : "#f3f4f6",
                  }}
                >
                  {!country.flagImage && country.flagEmoji}
                </div>
                <p className="mt-2 text-sm font-medium text-gray-700">
                  {country.name}
                </p>
              </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
}

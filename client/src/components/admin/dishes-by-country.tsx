import { useState } from "react";
import { Plus, Edit2, Trash2, ChevronDown, ChevronRight, Eye, EyeOff, Star, MapPin, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { useDishes } from "@/hooks/use-dishes";
import { useCountries } from "@/hooks/use-countries";
import { apiRequest, queryClient } from "@/lib/queryClient";
import DishForm from "./dish-form";
import { Country, DishWithCountry } from "@shared/schema";
import { FENUI_COLORS } from "@/lib/theme-colors";
import { motion, AnimatePresence } from "framer-motion";

interface DishesByCountryProps {
  onEditDish?: (dish: DishWithCountry) => void;
}

export default function DishesByCountry({ onEditDish }: DishesByCountryProps) {
  const [openCountries, setOpenCountries] = useState<Set<number>>(new Set());
  const [editingDish, setEditingDish] = useState<DishWithCountry | null>(null);
  const [selectedCountryForNew, setSelectedCountryForNew] = useState<Country | null>(null);
  
  const { toast } = useToast();
  const { data: dishes = [] } = useDishes({});
  const { data: countries = [] } = useCountries();

  // Agrupar pratos por país
  const dishesByCountry = countries.map(country => ({
    country,
    dishes: dishes.filter(dish => dish.countryId === country.id),
    totalDishes: dishes.filter(dish => dish.countryId === country.id).length,
    featuredDishes: dishes.filter(dish => dish.countryId === country.id && dish.isFeatured).length,
    avgPrice: dishes.filter(dish => dish.countryId === country.id).length > 0 
      ? dishes.filter(dish => dish.countryId === country.id)
          .reduce((sum, dish) => sum + parseFloat(dish.price), 0) / 
        dishes.filter(dish => dish.countryId === country.id).length
      : 0
  })).sort((a, b) => b.totalDishes - a.totalDishes);

  const toggleCountry = (countryId: number) => {
    const newOpen = new Set(openCountries);
    if (newOpen.has(countryId)) {
      newOpen.delete(countryId);
    } else {
      newOpen.add(countryId);
    }
    setOpenCountries(newOpen);
  };

  const handleDeleteDish = async (dishId: number) => {
    if (!confirm("Tem certeza que deseja excluir este prato?")) return;
    
    try {
      await apiRequest("DELETE", `/api/dishes/${dishId}`);
      queryClient.invalidateQueries({ queryKey: ["/api/dishes"] });
      toast({ title: "✅ Prato excluído com sucesso!" });
    } catch (error) {
      toast({
        title: "❌ Erro",
        description: "Falha ao excluir o prato.",
        variant: "destructive",
      });
    }
  };

  const handleToggleAvailable = async (dish: DishWithCountry) => {
    try {
      await apiRequest("PUT", `/api/dishes/${dish.id}`, {
        ...dish,
        isAvailable: !dish.isAvailable
      });
      queryClient.invalidateQueries({ queryKey: ["/api/dishes"] });
      toast({ 
        title: `✅ Prato ${!dish.isAvailable ? 'ativado' : 'desativado'} com sucesso!` 
      });
    } catch (error) {
      toast({
        title: "❌ Erro",
        description: "Falha ao alterar status do prato.",
        variant: "destructive",
      });
    }
  };

  const handleToggleFeatured = async (dish: DishWithCountry) => {
    try {
      await apiRequest("PUT", `/api/dishes/${dish.id}`, {
        ...dish,
        isFeatured: !dish.isFeatured
      });
      queryClient.invalidateQueries({ queryKey: ["/api/dishes"] });
      toast({ 
        title: `${!dish.isFeatured ? '⭐' : '📝'} Prato ${!dish.isFeatured ? 'promovido a destaque' : 'removido do destaque'}!` 
      });
    } catch (error) {
      toast({
        title: "❌ Erro",
        description: "Falha ao alterar destaque do prato.",
        variant: "destructive",
      });
    }
  };

  // Se estiver editando ou criando um prato
  if (editingDish || selectedCountryForNew) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="pb-4 bg-gradient-to-r from-fenui-red-600 to-fenui-red-700 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  {editingDish ? (
                    <>
                      <Edit2 className="h-6 w-6" />
                      Editando: {editingDish.name}
                    </>
                  ) : (
                    <>
                      <Plus className="h-6 w-6" />
                      Novo Prato - {selectedCountryForNew?.flagEmoji} {selectedCountryForNew?.name}
                    </>
                  )}
                </CardTitle>
                <p className="text-red-100 text-sm mt-1">
                  {editingDish ? 'Faça as alterações necessárias' : 'Preencha os dados do novo prato'}
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => {
                  setEditingDish(null);
                  setSelectedCountryForNew(null);
                }}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Cancelar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <DishForm
              dish={editingDish}
              countries={countries}
              onCancel={() => {
                setEditingDish(null);
                setSelectedCountryForNew(null);
              }}
              onSuccess={() => {
                setEditingDish(null);
                setSelectedCountryForNew(null);
              }}
              defaultCountryId={selectedCountryForNew?.id}
            />
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header com estatísticas MODERNO */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <Card className="relative overflow-hidden bg-gradient-to-br from-fenui-red-500 to-fenui-red-600 border-0 text-white shadow-xl">
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-black">{dishes.length}</div>
                <p className="text-red-100 font-medium">Total de Pratos</p>
              </div>
              <TrendingUp className="h-8 w-8 text-red-200" />
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-fenui-green-500 to-fenui-green-600 border-0 text-white shadow-xl">
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-black">{countries.length}</div>
                <p className="text-green-100 font-medium">Países Ativos</p>
              </div>
              <MapPin className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-fenui-yellow-500 to-orange-500 border-0 text-white shadow-xl">
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-black">{dishes.filter(d => d.isFeatured).length}</div>
                <p className="text-yellow-100 font-medium">Em Destaque</p>
              </div>
              <Star className="h-8 w-8 text-yellow-200" />
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 border-0 text-white shadow-xl">
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-black">{dishes.filter(d => d.isAvailable).length}</div>
                <p className="text-blue-100 font-medium">Disponíveis</p>
              </div>
              <Eye className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
        </Card>
      </motion.div>

      {/* Lista de países SUPER MODERNA */}
      <div className="space-y-6">
        <AnimatePresence>
          {dishesByCountry.map(({ country, dishes: countryDishes, totalDishes, featuredDishes, avgPrice }, index) => (
            <motion.div
              key={country.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden shadow-lg border-0 bg-white hover:shadow-xl transition-all duration-300">
                <Collapsible 
                  open={openCountries.has(country.id)}
                  onOpenChange={() => toggleCountry(country.id)}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all duration-300 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-3">
                            {openCountries.has(country.id) ? (
                              <ChevronDown className="h-5 w-5 text-gray-600" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-gray-600" />
                            )}
                            
                            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-3xl border-2 border-gray-200">
                              {country.flagEmoji}
                            </div>
                            
                            <div>
                              <CardTitle className="text-xl font-bold text-gray-800">{country.name}</CardTitle>
                              <div className="flex gap-3 mt-1">
                                <span className="text-sm text-gray-500">
                                  💰 Média: R$ {avgPrice.toFixed(2)}
                                </span>
                                <span className="text-sm text-gray-500">
                                  📊 {totalDishes} prato{totalDishes !== 1 ? 's' : ''}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-3">
                            <Badge 
                              variant="secondary" 
                              className="bg-gray-100 text-gray-700 px-3 py-1 font-semibold"
                            >
                              {totalDishes} prato{totalDishes !== 1 ? 's' : ''}
                            </Badge>
                            {featuredDishes > 0 && (
                              <Badge 
                                className="px-3 py-1 font-semibold text-white"
                                style={{ backgroundColor: FENUI_COLORS.accentYellow }}
                              >
                                ⭐ {featuredDishes} destaque{featuredDishes > 1 ? 's' : ''}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCountryForNew(country);
                          }}
                          className="px-6 py-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                          style={{ backgroundColor: FENUI_COLORS.primaryRed }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Novo Prato
                        </Button>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className="p-6 bg-gray-50/50">
                      {countryDishes.length === 0 ? (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center py-12"
                        >
                          <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                            <Plus className="h-12 w-12 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-700 mb-2">
                            Nenhum prato cadastrado
                          </h3>
                          <p className="text-gray-500 mb-4">
                            Comece adicionando o primeiro prato para {country.name}
                          </p>
                          <Button 
                            onClick={() => setSelectedCountryForNew(country)}
                            className="px-8 py-3 font-semibold shadow-lg"
                            style={{ backgroundColor: FENUI_COLORS.primaryRed }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Adicionar Primeiro Prato
                          </Button>
                        </motion.div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {countryDishes.map((dish, dishIndex) => (
                            <motion.div
                              key={dish.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: dishIndex * 0.05 }}
                            >
                              <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white">
                                <div className="relative">
                                  <img
                                    src={dish.image || "/placeholder-dish.jpg"}
                                    alt={dish.name}
                                    className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent group-hover:from-black/60 transition-all duration-300"></div>
                                  
                                  {/* Badges flutuantes */}
                                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                                    {dish.isFeatured && (
                                      <Badge className="bg-yellow-500 text-white border-0 shadow-lg">
                                        <Star className="h-3 w-3 mr-1" />
                                        Destaque
                                      </Badge>
                                    )}
                                    {!dish.isAvailable && (
                                      <Badge variant="destructive" className="shadow-lg">
                                        <EyeOff className="h-3 w-3 mr-1" />
                                        Indisponível
                                      </Badge>
                                    )}
                                  </div>

                                  {/* Preço flutuante */}
                                  <div className="absolute bottom-3 left-3">
                                    <div className="bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                                      <span className="font-bold text-fenui-red-600">
                                        R$ {parseFloat(dish.price).toFixed(2)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                
                                <CardContent className="p-4">
                                  <h4 className="font-bold text-gray-800 mb-2 line-clamp-1 text-base">
                                    {dish.name}
                                  </h4>
                                  <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                                    {dish.description}
                                  </p>
                                  
                                  <div className="flex items-center justify-between mb-4">
                                    <Badge 
                                      variant="outline" 
                                      className="text-xs font-semibold border-fenui-green-600 text-fenui-green-600"
                                    >
                                      {dish.category}
                                    </Badge>
                                    <div className="text-xs text-gray-500">
                                      ⭐ {dish.rating || '4.5'} ({dish.reviewCount || '0'})
                                    </div>
                                  </div>
                                  
                                  {/* Botões de ação MODERNOS */}
                                  <div className="grid grid-cols-4 gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => setEditingDish(dish)}
                                      className="p-2 hover:bg-blue-50 hover:border-blue-300 transition-all"
                                      title="Editar prato"
                                    >
                                      <Edit2 className="h-4 w-4 text-blue-600" />
                                    </Button>
                                    
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleToggleAvailable(dish)}
                                      className={`p-2 transition-all ${
                                        dish.isAvailable 
                                          ? 'hover:bg-red-50 hover:border-red-300' 
                                          : 'hover:bg-green-50 hover:border-green-300'
                                      }`}
                                      title={dish.isAvailable ? 'Desativar prato' : 'Ativar prato'}
                                    >
                                      {dish.isAvailable ? (
                                        <EyeOff className="h-4 w-4 text-red-600" />
                                      ) : (
                                        <Eye className="h-4 w-4 text-green-600" />
                                      )}
                                    </Button>
                                    
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleToggleFeatured(dish)}
                                      className={`p-2 transition-all ${
                                        dish.isFeatured 
                                          ? 'hover:bg-gray-50 hover:border-gray-300' 
                                          : 'hover:bg-yellow-50 hover:border-yellow-300'
                                      }`}
                                      title={dish.isFeatured ? 'Remover destaque' : 'Promover a destaque'}
                                    >
                                      <Star className={`h-4 w-4 ${dish.isFeatured ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                                    </Button>
                                    
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleDeleteDish(dish.id)}
                                      className="p-2 hover:bg-red-50 hover:border-red-300 transition-all"
                                      title="Excluir prato"
                                    >
                                      <Trash2 className="h-4 w-4 text-red-600" />
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
} 
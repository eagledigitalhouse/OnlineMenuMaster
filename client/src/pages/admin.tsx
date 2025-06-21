import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Plus, BarChart3, ImageIcon, Settings, Users, Utensils, MapPin, Calendar, Banknote, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminDashboard from "@/components/admin/admin-dashboard";
import DishForm from "@/components/admin/dish-form";
import CountryForm from "@/components/admin/country-form";
import BannerForm from "@/components/admin/banner-form";
import EventoForm from "@/components/admin/evento-form";
import DishesByCountry from "@/components/admin/dishes-by-country";
import { UploadPratos } from "@/components/admin/upload-pratos";
import { useDishes } from "@/hooks/use-dishes";
import { useCountries } from "@/hooks/use-countries";
import { useBanners, useCreateBanner, useUpdateBanner, useDeleteBanner } from "@/hooks/use-banners";
import { useToast } from "@/hooks/use-toast";
import { FENUI_COLORS } from "@/lib/theme-colors";
import { motion } from "framer-motion";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("dishes-by-country");
  const [editingDish, setEditingDish] = useState<any>(null);
  const [editingCountry, setEditingCountry] = useState<any>(null);
  const [editingBanner, setEditingBanner] = useState<any>(null);

  const { toast } = useToast();
  const { data: dishes = [] } = useDishes({});
  const { data: countries = [] } = useCountries();
  const { data: banners = [] } = useBanners();
  
  const createBanner = useCreateBanner();
  const updateBanner = useUpdateBanner();
  const deleteBanner = useDeleteBanner();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header MODERNO */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-r from-fenui-red-600 via-fenui-red-700 to-fenui-red-800 text-white shadow-2xl"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 transition-all">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-black">Painel Administrativo</h1>
                <p className="text-red-100 text-sm">22ª FENUI - Gerenciamento Completo</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 rounded-full px-4 py-2">
              <BarChart3 className="h-5 w-5" />
              <span className="font-semibold">Admin</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Navegação MODERNA */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <TabsList className="grid w-full grid-cols-8 h-14 bg-white shadow-lg border-0 p-1 rounded-xl">
              <TabsTrigger 
                value="dashboard" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white font-semibold rounded-lg transition-all"
              >
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger 
                value="dishes-by-country"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-fenui-red-600 data-[state=active]:to-fenui-red-700 data-[state=active]:text-white font-semibold rounded-lg transition-all"
              >
                <MapPin className="h-4 w-4" />
                Pratos por País
              </TabsTrigger>
              <TabsTrigger 
                value="upload"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white font-semibold rounded-lg transition-all"
              >
                <Upload className="h-4 w-4" />
                Upload Lote
              </TabsTrigger>
              <TabsTrigger 
                value="dishes"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-fenui-green-600 data-[state=active]:to-fenui-green-700 data-[state=active]:text-white font-semibold rounded-lg transition-all"
              >
                <Utensils className="h-4 w-4" />
                Todos os Pratos
              </TabsTrigger>
              <TabsTrigger 
                value="countries"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white font-semibold rounded-lg transition-all"
              >
                <Users className="h-4 w-4" />
                Países
              </TabsTrigger>
              <TabsTrigger 
                value="banners"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-fenui-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white font-semibold rounded-lg transition-all"
              >
                <ImageIcon className="h-4 w-4" />
                Banners
              </TabsTrigger>
              <TabsTrigger 
                value="eventos"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white font-semibold rounded-lg transition-all"
              >
                <Calendar className="h-4 w-4" />
                Eventos
              </TabsTrigger>
              <TabsTrigger 
                value="settings"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-600 data-[state=active]:to-gray-700 data-[state=active]:text-white font-semibold rounded-lg transition-all"
              >
                <Settings className="h-4 w-4" />
                Config
              </TabsTrigger>
            </TabsList>
          </motion.div>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AdminDashboard />
            </motion.div>
          </TabsContent>

          {/* Pratos por País - PRINCIPAL */}
          <TabsContent value="dishes-by-country" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <DishesByCountry />
            </motion.div>
          </TabsContent>

          {/* Upload em Lote */}
          <TabsContent value="upload" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <UploadPratos />
            </motion.div>
          </TabsContent>

          {/* Lista de todos os pratos */}
          <TabsContent value="dishes" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="shadow-xl border-0">
                <CardHeader className="bg-gradient-to-r from-fenui-green-600 to-fenui-green-700 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <Utensils className="h-5 w-5" />
                        Gerenciar Todos os Pratos
                      </CardTitle>
                      <p className="text-green-100 text-sm">Lista completa de pratos cadastrados</p>
                    </div>
                    <Button 
                      onClick={() => setEditingDish({ isNew: true })}
                      className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Prato
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {editingDish ? (
                    <DishForm
                      dish={editingDish.isNew ? null : editingDish}
                      countries={countries}
                      onCancel={() => setEditingDish(null)}
                      onSuccess={() => setEditingDish(null)}
                    />
                  ) : (
                    <div className="space-y-4">
                      {dishes.map((dish) => (
                        <Card key={dish.id} className="overflow-hidden hover:shadow-lg transition-all">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <img
                                  src={dish.image || "/placeholder-dish.jpg"}
                                  alt={dish.name}
                                  className="w-16 h-16 rounded-lg object-cover"
                                />
                                <div>
                                  <h3 className="font-semibold text-gray-800">{dish.name}</h3>
                                  <p className="text-sm text-gray-500">
                                    {dish.country.flagEmoji} {dish.country.name} • R$ {parseFloat(dish.price).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setEditingDish(dish)}
                                  className="hover:bg-blue-50 hover:border-blue-300"
                                >
                                  Editar
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  className="hover:bg-red-600"
                                >
                                  Excluir
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Outros tabs existentes... */}
          <TabsContent value="countries" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="shadow-xl border-0">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Gerenciar Países
                    </CardTitle>
                    <Button 
                      onClick={() => setEditingCountry({ isNew: true })}
                      className="bg-white/20 hover:bg-white/30 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Novo País
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {editingCountry ? (
                    <CountryForm
                      country={editingCountry.isNew ? null : editingCountry}
                      onCancel={() => setEditingCountry(null)}
                      onSuccess={() => setEditingCountry(null)}
                    />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {countries.map((country) => (
                        <Card key={country.id} className="hover:shadow-lg transition-all">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl">
                                {country.flagEmoji}
                              </div>
                              <div>
                                <h3 className="font-semibold">{country.name}</h3>
                                <p className="text-sm text-gray-500">
                                  {dishes.filter(d => d.countryId === country.id).length} pratos
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingCountry(country)}
                                className="flex-1"
                              >
                                Editar
                              </Button>
                              <Button variant="destructive" size="sm" className="flex-1">
                                Excluir
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Placeholder para outras abas */}
          <TabsContent value="banners">
            <Card>
              <CardHeader>
                <CardTitle>🚧 Em desenvolvimento</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Gerenciamento de banners em breve...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="eventos">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <EventoForm />
            </motion.div>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>🚧 Em desenvolvimento</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Configurações do sistema em breve...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

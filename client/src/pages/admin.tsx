import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Plus, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminDashboard from "@/components/admin/admin-dashboard";
import DishForm from "@/components/admin/dish-form";
import CountryForm from "@/components/admin/country-form";
import { useDishes } from "@/hooks/use-dishes";
import { useCountries } from "@/hooks/use-countries";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editingDish, setEditingDish] = useState(null);
  const [editingCountry, setEditingCountry] = useState(null);

  const { data: dishes = [] } = useDishes({});
  const { data: countries = [] } = useCountries();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-fenui-dark text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Painel Administrativo</h1>
        </div>
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          <span className="text-sm">Admin</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="dishes">Pratos</TabsTrigger>
            <TabsTrigger value="countries">Países</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <AdminDashboard />
          </TabsContent>

          <TabsContent value="dishes" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Gerenciar Pratos</CardTitle>
                <Button 
                  onClick={() => setEditingDish({ isNew: true })}
                  className="bg-fenui-green hover:bg-fenui-green/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Prato
                </Button>
              </CardHeader>
              <CardContent>
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
                      <div
                        key={dish.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={dish.image || "/placeholder-dish.jpg"}
                            alt={dish.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div>
                            <h3 className="font-medium">{dish.name}</h3>
                            <p className="text-sm text-gray-500">
                              {dish.country.name} • R$ {parseFloat(dish.price).toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingDish(dish)}
                          >
                            Editar
                          </Button>
                          <Button variant="destructive" size="sm">
                            Excluir
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="countries" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Gerenciar Países</CardTitle>
                <Button 
                  onClick={() => setEditingCountry({ isNew: true })}
                  className="bg-fenui-blue hover:bg-fenui-blue/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Novo País
                </Button>
              </CardHeader>
              <CardContent>
                {editingCountry ? (
                  <CountryForm
                    country={editingCountry.isNew ? null : editingCountry}
                    onCancel={() => setEditingCountry(null)}
                    onSuccess={() => setEditingCountry(null)}
                  />
                ) : (
                  <div className="space-y-4">
                    {countries.map((country) => (
                      <div
                        key={country.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl">
                            {country.flagEmoji}
                          </div>
                          <div>
                            <h3 className="font-medium">{country.name}</h3>
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
                          >
                            Editar
                          </Button>
                          <Button variant="destructive" size="sm">
                            Excluir
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  Configurações avançadas do sistema serão implementadas aqui.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDishes } from "@/hooks/use-dishes";
import { useCountries } from "@/hooks/use-countries";
import { useQuery } from "@tanstack/react-query";

export default function AdminDashboard() {
  const { data: dishes = [] } = useDishes({});
  const { data: countries = [] } = useCountries();
  
  const { data: stats } = useQuery({
    queryKey: ["/api/admin/stats"],
  });

  const totalDishes = dishes.length;
  const totalCountries = countries.length;
  const featuredDishes = dishes.filter(dish => dish.isFeatured).length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total de Pratos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-fenui-blue">{totalDishes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Países
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-fenui-green">{totalCountries}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pratos em Destaque
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-fenui-yellow">{featuredDishes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Visualizações Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-fenui-red">
              {stats?.todayViews || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-fenui-green rounded-full flex items-center justify-center text-white font-bold">
                +
              </div>
              <div>
                <p className="font-medium">Novo prato adicionado</p>
                <p className="text-sm text-gray-500">2 horas atrás</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-fenui-blue rounded-full flex items-center justify-center text-white font-bold">
                ↑
              </div>
              <div>
                <p className="font-medium">Prato promovido para destaque</p>
                <p className="text-sm text-gray-500">5 horas atrás</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats by Country */}
      <Card>
        <CardHeader>
          <CardTitle>Pratos por País</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {countries.map((country) => {
              const countryDishes = dishes.filter(dish => dish.countryId === country.id);
              return (
                <div key={country.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{country.flagEmoji}</span>
                    <span className="font-medium">{country.name}</span>
                  </div>
                  <span className="bg-gray-100 px-2 py-1 rounded-full text-sm">
                    {countryDishes.length} pratos
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

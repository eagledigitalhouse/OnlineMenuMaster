import FavoritesSection from "@/components/favorites-section";
import NewBottomNavigation from "@/components/new-bottom-navigation";

export default function Favorites() {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="app-container shadow-lg md:shadow-xl lg:shadow-2xl pb-28">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="container-responsive py-4">
          <h1 className="text-2xl font-bold text-gray-900 text-center">
            💖 Meus Favoritos
          </h1>
          <p className="text-sm text-gray-600 text-center mt-1">
            Seus pratos selecionados do Festival FENUI
          </p>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main>
        <FavoritesSection />
      </main>

      {/* Navegação Inferior */}
      <NewBottomNavigation />
      </div>
    </div>
  );
} 
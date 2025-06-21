import { Home, Calendar, Heart, User } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/hooks/use-favorites";
import { Dock, DockIcon } from "@/components/ui/dock";

export default function NewBottomNavigation() {
  const [location] = useLocation();
  const { favorites } = useFavorites();

  // Não mostrar na página administrativa
  if (location === "/admin") {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-30">
      <div className="flex justify-center">
        <Dock
          iconSize={58}
          iconMagnification={75}
          iconDistance={115}
          className="bg-fenui-yellow border-t-4 border-white/20 shadow-[0_-8px_32px_rgba(0,0,0,0.15)] px-6 py-3 rounded-2xl"
        >
          {/* Início */}
          <DockIcon>
            <Link href="/">
              <a className={cn(
                "w-full h-full flex flex-col items-center justify-center rounded-xl transition-all duration-300 py-2 px-2",
                location === "/" 
                  ? "bg-fenui-red-600 text-white shadow-lg" 
                  : "text-white hover:text-white hover:bg-white/20"
              )}>
                <Home className="w-6 h-6 mb-0.5" />
                <span className="text-[10px] font-medium">Início</span>
              </a>
            </Link>
          </DockIcon>

          {/* Programação */}
          <DockIcon>
            <Link href="/programacao">
              <a className={cn(
                "w-full h-full flex flex-col items-center justify-center rounded-xl transition-all duration-300 py-2 px-2",
                location === "/programacao" 
                  ? "bg-fenui-red-600 text-white shadow-lg" 
                  : "text-white hover:text-white hover:bg-white/20"
              )}>
                <Calendar className="w-6 h-6 mb-0.5" />
                <span className="text-[10px] font-medium">Programação</span>
              </a>
            </Link>
          </DockIcon>

          {/* Favoritos */}
          <DockIcon>
            <Link href="/favorites">
              <a className={cn(
                "w-full h-full flex flex-col items-center justify-center rounded-xl transition-all duration-300 relative py-2 px-2",
                location === "/favorites" 
                  ? "bg-fenui-red-600 text-white shadow-lg" 
                  : "text-white hover:text-white hover:bg-white/20"
              )}>
                <Heart className="w-6 h-6 mb-0.5" />
                <span className="text-[10px] font-medium">Favoritos</span>
                {favorites.length > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-fenui-red-600 rounded-full flex items-center justify-center text-white text-[8px] font-bold border-2 border-white">
                    {favorites.length}
                  </div>
                )}
              </a>
            </Link>
          </DockIcon>

          {/* Perfil */}
          <DockIcon>
            <Link href="/admin">
              <a className={cn(
                "w-full h-full flex flex-col items-center justify-center rounded-xl transition-all duration-300 py-2 px-2",
                location === "/admin" 
                  ? "bg-fenui-red-600 text-white shadow-lg" 
                  : "text-white hover:text-white hover:bg-white/20"
              )}>
                <User className="w-6 h-6 mb-0.5" />
                <span className="text-[10px] font-medium">Perfil</span>
              </a>
            </Link>
          </DockIcon>
        </Dock>
      </div>
    </div>
  );
} 
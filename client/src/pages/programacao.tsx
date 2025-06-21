import { useState, useMemo } from "react";
import { useEventos } from "@/hooks/use-eventos";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, MapPin, ArrowLeft, Plane, Mic, Star } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import NewBottomNavigation from "@/components/new-bottom-navigation";
import type { EventoWithCountry } from "@shared/schema";

// Configuração dos dias do evento
const DIAS_EVENTO = [
  {
    id: "2025-07-04",
    label: "SEXTA",
    fullDate: "04 JUL",
    number: "04"
  },
  {
    id: "2025-07-05", 
    label: "SÁBADO",
    fullDate: "05 JUL",
    number: "05"
  },
  {
    id: "2025-07-06",
    label: "DOMINGO", 
    fullDate: "06 JUL",
    number: "06"
  }
];

export default function Programacao() {
  const [diaAtivo, setDiaAtivo] = useState(DIAS_EVENTO[0].id);
  const { data: eventos = [], isLoading } = useEventos();

  // Filtrar eventos do dia ativo
  const eventosDoDia = useMemo(() => {
    return eventos.filter(evento => evento.dia === diaAtivo && evento.isActive);
  }, [eventos, diaAtivo]);

  // Função para formatar horário
  const formatarHorario = (horario: string) => {
    return horario.slice(0, 5);
  };

  // Função para mapear países para Circle Flags - IGUAL AO DISH CARD
  const getCircleFlagUrl = (countryName: string) => {
    const countryToCode: Record<string, string> = {
      "Suíça": "ch",
      "Alemanha": "de", 
      "Japão": "jp",
      "África do Sul (Afro-Brasileira)": "za",
      "África": "za",
      "Brasil": "br",
      "Rússia": "ru",
      "China": "cn",
      "Espanha": "es",
      "Estados Unidos": "us",
      "Síria": "sy",
      "França": "fr",
      "Itália": "it"
    };
    
    const code = countryToCode[countryName];
    return code ? `https://hatscripts.github.io/circle-flags/flags/${code}.svg` : null;
  };

  // Cores personalizadas para cada dia - SÓLIDAS
  const getDayColors = (diaId: string) => {
    const colors = {
      "2025-07-04": {
        bg: "bg-blue-600",
        border: "border-blue-600",
        ring: "ring-blue-600", 
        text: "text-blue-600",
        check: "bg-blue-500"
      },
      "2025-07-05": {
        bg: "bg-green-600", 
        border: "border-green-600",
        ring: "ring-green-600",
        text: "text-green-600", 
        check: "bg-green-500"
      },
      "2025-07-06": {
        bg: "bg-yellow-500",
        border: "border-yellow-500", 
        ring: "ring-yellow-500",
        text: "text-yellow-600",
        check: "bg-yellow-500"
      }
    };
    return colors[diaId as keyof typeof colors] || colors["2025-07-04"];
  };

  // Renderizar item do dia - Estilo Stories com Cores Personalizadas
  const renderDayStory = (dia: typeof DIAS_EVENTO[0]) => {
    const dayColors = getDayColors(dia.id);
    
    return (
      <motion.div
        className="flex-shrink-0 text-center cursor-pointer w-16 mx-auto"
        onClick={() => setDiaAtivo(dia.id)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative">
          <div
            className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-sm overflow-hidden mx-auto border-2",
              diaAtivo === dia.id
                ? `${dayColors.bg} ${dayColors.border} ring-2 ${dayColors.ring} ring-offset-1 scale-110 text-white` 
                : "bg-white border-gray-200 hover:border-red-300 text-gray-700"
            )}
          >
            <div className="text-center">
              <div className="text-lg font-numeric leading-none">{dia.number}</div>
            </div>
          </div>
          {diaAtivo === dia.id && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`absolute -bottom-1 -right-1 w-4 h-4 ${dayColors.check} rounded-full flex items-center justify-center border-2 border-white`}
            >
              <span className="text-white text-xs">✓</span>
            </motion.div>
          )}
        </div>
        <p className={cn(
          "mt-2 text-xs font-caption max-w-[64px] leading-tight text-center min-h-[28px] flex items-center justify-center",
          diaAtivo === dia.id 
            ? `${dayColors.text} font-semibold` 
            : "text-gray-600"
        )}>
          {dia.label}
        </p>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="app-container shadow-lg md:shadow-xl lg:shadow-2xl relative flex flex-col p-2">
      
      {/* Background com mosaico FENUI sendo pintado - IGUAL À WELCOME */}
      <div className="absolute inset-0 w-full h-full">
        {/* Pincelada 1 - Diagonal esquerda */}
        <motion.div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: 'url(/assets/MOSAICO.png)',
            backgroundSize: '600px auto',
            backgroundRepeat: 'repeat',
            filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))',
          }}
          initial={{ 
            opacity: 0,
            clipPath: 'polygon(0% 20%, 5% 15%, 15% 25%, 10% 30%, 0% 25%)',
            scale: 1.1
          }}
          animate={{ 
            opacity: 1,
            clipPath: 'polygon(0% 0%, 40% 10%, 45% 90%, 5% 100%, 0% 95%)',
            scale: 1
          }}
          transition={{
            duration: 0.8,
            ease: [0.6, 0.1, 0.3, 0.9],
            delay: 0.2,
          }}
        />

        {/* Pincelada 2 - Centro */}
        <motion.div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: 'url(/assets/MOSAICO.png)',
            backgroundSize: '600px auto',
            backgroundRepeat: 'repeat',
            filter: 'drop-shadow(1px 1px 3px rgba(0,0,0,0.15))',
          }}
          initial={{ 
            opacity: 0,
            clipPath: 'polygon(35% 15%, 40% 10%, 50% 20%, 45% 25%, 35% 20%)',
            scale: 1.05
          }}
          animate={{ 
            opacity: 1,
            clipPath: 'polygon(30% 0%, 75% 5%, 80% 95%, 35% 100%, 30% 90%)',
            scale: 1
          }}
          transition={{
            duration: 0.9,
            ease: [0.4, 0.0, 0.2, 1],
            delay: 0.6,
          }}
        />

        {/* Pincelada 3 - Direita */}
        <motion.div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: 'url(/assets/MOSAICO.png)',
            backgroundSize: '600px auto',
            backgroundRepeat: 'repeat',
            filter: 'drop-shadow(0px 2px 6px rgba(0,0,0,0.1))',
          }}
          initial={{ 
            opacity: 0,
            clipPath: 'polygon(70% 25%, 75% 20%, 85% 30%, 80% 35%, 70% 30%)',
            scale: 1.08
          }}
          animate={{ 
            opacity: 1,
            clipPath: 'polygon(65% 0%, 100% 8%, 100% 92%, 70% 100%, 65% 85%)',
            scale: 1
          }}
          transition={{
            duration: 0.7,
            ease: [0.7, 0.0, 0.3, 1],
            delay: 1.1,
          }}
        />

        {/* Pincelada 4 - Acabamento final */}
        <motion.div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: 'url(/assets/MOSAICO.png)',
            backgroundSize: '600px auto',
            backgroundRepeat: 'repeat',
            filter: 'brightness(1.05) saturate(1.1)',
          }}
          initial={{ 
            opacity: 0,
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
          }}
          animate={{ 
            opacity: 1,
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          }}
          transition={{
            duration: 0.4,
            ease: "easeOut",
            delay: 1.6,
          }}
        />
      </div>

      {/* Nuvens de fundo - IGUAIS À WELCOME */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-5">
        <motion.img
          src="/assets/cloud.png"
          alt="nuvem"
          className="absolute top-0 w-64 h-40 select-none"
          style={{
            filter: 'brightness(1.3) contrast(0.9)',
            transform: 'rotate(-5deg)',
          }}
          animate={{
            x: [-250, window.innerWidth + 200],
            opacity: 0.7,
          }}
          transition={{
            duration: 45,
            repeat: Infinity,
            ease: "linear",
            delay: 2,
            repeatDelay: Math.random() * 8,
          }}
        />

        <motion.img
          src="/assets/cloud.png"
          alt="nuvem"
          className="absolute w-40 h-25 select-none"
          style={{
            filter: 'brightness(1.3) contrast(0.9)',
            top: `${Math.random() * 60 + 5}%`,
          }}
          animate={{
            x: [-160, window.innerWidth + 100],
            opacity: 0.6,
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: Math.random() * 5,
          }}
        />
      </div>

      {/* Overlay suave */}
      <div className="absolute inset-0 bg-black/15" />

      {/* Botão Voltar - Mais compacto */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative z-30 p-3"
      >
        <Link href="/" className="inline-flex items-center gap-2 text-white hover:text-white/80 transition-colors bg-black/20 backdrop-blur-sm px-3 py-2 rounded-xl">
          <ArrowLeft className="w-4 h-4" />
          <span className="font-caption text-sm">VOLTAR</span>
        </Link>
      </motion.div>

      {/* Container Principal - Otimizado para usar toda a tela */}
      <div className="flex-1 flex flex-col px-4 pb-4 relative z-20">
        <motion.div
          initial={{ y: 100, opacity: 0, rotateX: -15 }}
          animate={{ y: 0, opacity: 1, rotateX: 0 }}
          transition={{ 
            duration: 1.2, 
            type: "spring", 
            stiffness: 100,
            damping: 15
          }}
          className="w-full max-w-5xl flex flex-col mx-auto"
        >
          {/* Ticket Container - Altura flexível para o conteúdo */}
          <div className="shadow-2xl overflow-hidden relative flex flex-col" style={{
            borderRadius: '25px 25px 40px 40px'
          }}>
            
            {/* Header Compacto */}
            <div className="relative overflow-hidden z-20" style={{
              borderRadius: '25px 25px 25px 25px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}>
              <div 
                className="absolute inset-0 bg-fenui-red-600"
                style={{
                  borderRadius: '25px 25px 25px 25px'
                }}
              />
              
              <div className="relative pt-6 pb-6 px-6 text-white">
                {/* Logo FENUI */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
                  className="absolute top-3 right-4"
                >
                  <img 
                    src="/assets/LOGO FENUI.png" 
                    alt="FENUI" 
                    className="h-16 w-auto"
                  />
                </motion.div>
                
                {/* Título compacto */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="pr-16"
                >
                  <div className="text-xl font-display mb-1">PROGRAMAÇÃO</div>
                  <div className="text-xs opacity-90 font-caption">Festa das Nações • 04 a 06 de Julho</div>
                </motion.div>
              </div>
            </div>

            {/* Container Flexível */}
            <div className="bg-gray-100 flex flex-col" style={{
              borderRadius: '20px',
              padding: '6px',
              marginTop: '-30px',
              position: 'relative',
              zIndex: 5,
              paddingTop: '36px'
            }}>

              {/* Stories dos Dias - Igual às Country Flags */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="px-3 py-4 bg-white relative shadow-sm mb-2 flex-shrink-0"
                style={{ borderRadius: '16px' }}
              >
                <div className="text-center mb-3">
                  <h2 className="text-sm font-heading text-gray-800 mb-1">Escolha o Dia</h2>
                  <div className="w-8 h-0.5 bg-fenui-red-600 rounded-full mx-auto"></div>
                </div>
                
                <div className="flex justify-center items-center gap-8">
                  {DIAS_EVENTO.map((dia) => (
                    <div key={dia.id}>
                      {renderDayStory(dia)}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Lista de Eventos - Scroll vertical */}
              <div className="relative">
                <div className="px-3 pb-3 flex flex-col max-h-[60vh] overflow-y-auto" style={{scrollbarWidth: 'thin'}}>
                {isLoading && (
                  <div className="text-center py-8 flex-1 flex items-center justify-center">
                    <div>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-8 h-8 border-4 border-fenui-red-500 border-t-transparent rounded-full mx-auto mb-4"
                      />
                      <p className="text-gray-600 font-body">Carregando programação...</p>
                    </div>
                  </div>
                )}

                <AnimatePresence mode="wait">
                  <motion.div
                    key={diaAtivo}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col"
                  >
                    {eventosDoDia.length > 0 ? (
                      <div className="flex flex-col gap-4">
                        {eventosDoDia.map((evento, index) => (
                          <EventoTicket key={evento.id} evento={evento} index={index} />
                        ))}
                        
                        {/* Indicador de fim da lista */}
                        <div className="text-center py-4 text-gray-500 text-sm font-caption">
                          {eventosDoDia.length > 1 && (
                            <span>• {eventosDoDia.length} eventos no total •</span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-12 bg-white rounded-2xl flex-1 flex items-center justify-center"
                      >
                        <div>
                          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-lg font-heading text-gray-800 mb-2">
                            Nenhum evento programado
                          </h3>
                          <p className="text-gray-600 text-sm font-body">
                            Ainda não há eventos cadastrados para este dia.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>
                </div>
                
                {/* Indicador de scroll - gradiente fade */}
                {eventosDoDia.length > 3 && (
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-50 pointer-events-none rounded-b-2xl" />
                )}
              </div>

            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Navegação Inferior */}
      <NewBottomNavigation />
      </div>
    </div>
  );
}

// Componente do Ticket de Evento - Mais compacto
interface EventoTicketProps {
  evento: EventoWithCountry;
  index: number;
}

function EventoTicket({ evento, index }: EventoTicketProps) {
  const formatarHorario = (horario: string) => horario.slice(0, 5);
  
  // Cores baseadas em se o evento é destaque ou não
  const getEventColors = () => {
    if (evento.isFeatured) {
      return {
        headerBg: "bg-fenui-red-600",
        headerBorder: "border-fenui-red-600",
        primaryBtn: "bg-fenui-red-600 text-white",
        secondaryBtn: "bg-white text-fenui-red-700 border-fenui-red-600",
        planeBg: "text-fenui-red-400",
        microphoneBg: "bg-fenui-red-600",
        microphoneIcon: "text-white",
        accent: "fenui-red"
      };
    } else {
      return {
        headerBg: "bg-fenui-red-50",
        headerBorder: "border-fenui-red-200",
        primaryBtn: "bg-fenui-red-600 text-white",
        secondaryBtn: "bg-white text-fenui-red-700 border-fenui-red-200",
        planeBg: "text-fenui-red-400",
        microphoneBg: "bg-fenui-red-100",
        microphoneIcon: "text-fenui-red-600",
        accent: "fenui-red"
      };
    }
  };

  const colors = getEventColors();

  // Função para mapear países para Circle Flags
  const getCircleFlagUrl = (countryName: string) => {
    const countryToCode: Record<string, string> = {
      "Suíça": "ch",
      "Alemanha": "de", 
      "Japão": "jp",
      "África do Sul (Afro-Brasileira)": "za",  
      "África": "za",
      "Brasil": "br",
      "Rússia": "ru",
      "China": "cn",
      "Espanha": "es",
      "Estados Unidos": "us",
      "Síria": "sy",
      "França": "fr",
      "Itália": "it"
    };
    
    const code = countryToCode[countryName];
    return code ? `https://hatscripts.github.io/circle-flags/flags/${code}.svg` : null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50, y: 20 }}
      animate={{ 
        opacity: 1, 
        x: 0, 
        y: 0
      }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.15,
        type: "spring",
        stiffness: 80,
        damping: 12
      }}
      whileHover={{ scale: 1.01, y: -1 }}
      className={cn(
        "bg-white rounded-xl border overflow-hidden h-[140px]",
        evento.isFeatured ? "border-fenui-red-600" : "border-gray-100"
      )}
    >
      <div className="flex flex-col h-full relative">
        {/* Badge de destaque */}
        {evento.isFeatured && (
          <div className="absolute top-2 right-2 z-10">
            <div className="bg-fenui-red-600 text-white p-1.5 rounded-full shadow-xl shadow-fenui-red-500/50 border-2 border-white">
              <Star className="w-3 h-3 fill-current" />
            </div>
          </div>
        )}
        
        {/* Horário no topo */}
        <div className={`px-3 pt-2 pb-2 ${colors.headerBg} border-b ${colors.headerBorder}`}>
          <div className="flex items-center justify-center gap-2">
            <div className={`${colors.primaryBtn} px-3 py-1 rounded-full font-mono text-sm flex items-center gap-1 shadow-sm`}>
              <Clock className="w-3 h-3" />
              {formatarHorario(evento.horario_inicio)}
            </div>
            <Plane className={`w-3 h-3 ${colors.planeBg} rotate-45 flex-shrink-0`} />
            <div className={`${colors.secondaryBtn} px-3 py-1 rounded-full font-mono text-sm flex items-center gap-1 shadow-sm border`}>
              <Clock className="w-3 h-3" />
              {formatarHorario(evento.horario_fim)}
            </div>
          </div>
        </div>
        
        {/* Conteúdo principal */}
        <div className="flex flex-1 min-h-0">
          <div className="flex-1 p-3 min-w-0 flex flex-col justify-center">
            {/* Nome da atração com microfone */}
            <div className="flex items-center gap-2 mb-2">
              <div className={`${colors.microphoneBg} p-1 rounded-full flex-shrink-0`}>
                <Mic className={`w-3 h-3 ${colors.microphoneIcon}`} />
              </div>
              <h3 className="font-heading text-gray-900 text-base leading-tight line-clamp-2 flex-1">
                {evento.titulo}
              </h3>
              {evento.isFeatured && (
                <div className="text-white text-xs font-bold bg-fenui-red-600 px-2 py-0.5 rounded-full shadow-lg shadow-fenui-red-500/30">
                  DESTAQUE
                </div>
              )}
            </div>

            {/* Local */}
            <div className="flex items-center gap-1 text-gray-600">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="text-sm font-caption truncate">{evento.local}</span>
            </div>
          </div>

          {/* Imagem com Badge */}
          {evento.imagem_url && (
            <div className="w-20 h-20 flex-shrink-0 my-auto mr-2 rounded-xl overflow-hidden relative">
              <img
                src={evento.imagem_url}
                alt={evento.titulo}
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500";
                }}
              />
              
              {/* Badge País - Sobreposto */}
              {evento.country && (
                <div className="absolute bottom-0.5 left-0.5 right-0.5">
                  <div className="bg-white/90 backdrop-blur-md px-1 py-0.5 rounded-full flex items-center gap-1 shadow-sm border border-white/20">
                    {getCircleFlagUrl(evento.country.name) ? (
                      <img
                        src={getCircleFlagUrl(evento.country.name)!}
                        alt={`Bandeira ${evento.country.name}`}
                        className="w-2 h-2 object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-xs">{evento.country.flagEmoji || '🏳️'}</span>
                    )}
                    <span className="text-xs font-caption text-gray-800 truncate">{evento.country.name}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Decoração Lateral - Estilo Ticket */}
          <div className="w-4 flex flex-col justify-center items-center bg-gray-50 border-l border-dashed border-gray-200">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 bg-gray-200 rounded-full mb-1" />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
} 
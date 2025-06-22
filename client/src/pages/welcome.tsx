import { motion, AnimatePresence } from "framer-motion";
import { Calendar, UtensilsCrossed, Plane, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useState, useEffect, useMemo } from "react";

// Componente de animação de digitação
const TypewriterText = ({ text, delay = 0, speed = 50 }: { text: string, delay?: number, speed?: number }) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }
    }, currentIndex === 0 ? delay : speed);

    return () => clearTimeout(timer);
  }, [currentIndex, text, delay, speed]);

  return <span>{displayText}</span>;
};

export default function Welcome() {
  const [, setLocation] = useLocation();
  const [showCloudTransition, setShowCloudTransition] = useState(false);

  // Otimização: Calcular valores aleatórios apenas uma vez
  const cloudData = useMemo(() => Array.from({ length: 6 }).map(() => ({
    top: `${Math.random() * 60 + 5}%`,
    duration: Math.random() * 20 + 25, // Duração entre 25s e 45s
    delay: Math.random() * 10,
    repeatDelay: Math.random() * 8,
    xFrom: -250,
    xTo: window.innerWidth + 200,
    yKeyframes: [0, -20 + Math.random() * 40, 10 - Math.random() * 20, 0],
    scale: Math.random() * 0.4 + 0.8, // Escala entre 0.8 e 1.2
    opacity: Math.random() * 0.3 + 0.4, // Opacidade entre 0.4 e 0.7
    filter: `brightness(${Math.random() * 0.4 + 1.1}) contrast(${Math.random() * 0.3 + 0.8})`,
  })), []);

  const particleData = useMemo(() => Array.from({ length: 20 }).map(() => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    duration: Math.random() * 2 + 2, // Duração entre 2s e 4s
    delay: Math.random() * 3,
  })), []);

  const handleExploreMenu = () => {
    // Definir flag para mostrar carimbo na página home
    sessionStorage.setItem('fromWelcome', 'true');
    
    setShowCloudTransition(true);
    
    // Após 5 segundos, redirecionar para o cardápio
    setTimeout(() => {
      setLocation("/");
    }, 5000);
  };

  const handleViewSchedule = () => {
    setLocation("/programacao");
  };

      return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="app-container shadow-lg md:shadow-xl lg:shadow-2xl h-screen relative flex items-center justify-center p-2 overflow-hidden">
      {/* Fundo do mosaico FENUI sendo pintado com pincel */}
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

        {/* Efeito de textura de tinta */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 1px, transparent 2px),
              radial-gradient(circle at 80% 60%, rgba(0,0,0,0.05) 1px, transparent 2px),
              radial-gradient(circle at 40% 80%, rgba(255,255,255,0.08) 1px, transparent 2px)
            `,
            backgroundSize: '30px 30px, 45px 45px, 25px 25px',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 2.0 }}
        />
      </div>
      
      {/* Nuvens de fundo - ATRÁS DO CARTÃO */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-5">
        {cloudData.map((cloud, i) => (
          <motion.img
            key={i}
            src="/assets/cloud.png"
            alt="nuvem"
            className="absolute select-none"
            style={{
              top: cloud.top,
              filter: cloud.filter,
              willChange: 'transform, opacity', // Otimização de performance
              transform: `scale(${cloud.scale}) ${i % 2 === 0 ? 'scaleX(-1)' : ''}`,
            }}
            animate={{
              x: [cloud.xFrom, cloud.xTo],
              y: cloud.yKeyframes,
              opacity: cloud.opacity,
            }}
            transition={{
              duration: cloud.duration,
              repeat: Infinity,
              ease: "linear",
              delay: cloud.delay,
              repeatDelay: cloud.repeatDelay,
            }}
          />
        ))}

        {/* NUVEM GIGANTE EMBAIXO - Fixa */}
        <motion.img
          src="/assets/cloud.png"
          alt="nuvem"
          className="absolute bottom-2 w-96 h-60 select-none"
          style={{
            filter: 'brightness(1.4) contrast(1.0)',
            transform: 'rotate(-3deg)',
          }}
          animate={{
            x: [-350, window.innerWidth + 300],
            opacity: 0.8,
          }}
          transition={{
            duration: 55,
            repeat: Infinity,
            ease: "linear",
            delay: 10,
          }}
        />
      </div>

      {/* Overlay suave para não ofuscar o e-ticket */}
      <div className="absolute inset-0 bg-black/15" />
              {/* E-Ticket Container */}
      <motion.div
        initial={{ y: 100, opacity: 0, rotateX: -15 }}
        animate={{ y: 0, opacity: 1, rotateX: 0 }}
        transition={{ 
          duration: 1.2, 
          type: "spring", 
          stiffness: 100,
          damping: 15
        }}
        className="relative max-w-xs w-full max-h-[95vh] overflow-visible"
      >
        {/* Ticket - Formato Moderno orgânico */}
        <div className="shadow-2xl overflow-hidden relative" style={{
          borderRadius: '25px 25px 40px 40px'
        }}>
          {/* Header Moderno com Gradiente */}
          <div className="relative overflow-hidden z-20" style={{
            borderRadius: '25px 25px 25px 25px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}>
            {/* Fundo com gradiente do Ver Programação */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(90deg, #EF2B2D, #F9B000)',
                borderRadius: '25px 25px 25px 25px'
              }}
            ></div>
            

            
                         <div className="relative pt-8 pb-8 px-4 text-white">
              {/* Logo FENUI no canto superior direito */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
                className="absolute top-4 right-4"
              >
                 <img 
                   src="/assets/fenui airlines.png" 
                   alt="FENUI Airlines" 
                   className="h-16 w-auto"
                 />
              </motion.div>
              
              {/* Título principal */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="pr-20"
              >
                 <div className="text-xl font-black mb-1">E-TICKET</div>
                 <div className="text-xs opacity-90 font-medium">Uma volta ao mundo!</div>
                 <div className="text-xs opacity-75 mt-1 font-semibold">04 A 06 DE JULHO • 11H ÀS 22H</div>
              </motion.div>
            </div>
          </div>

          {/* Container com fundo cinza para as seções de passagem */}
          <div className="bg-gray-100" style={{
            borderRadius: '20px',
            padding: '8px',
            marginTop: '-40px',
            position: 'relative',
            zIndex: 5,
            paddingTop: '50px'
          }}>

          {/* Seção de Informações - Layout Moderno */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="px-4 py-4 bg-white relative shadow-sm"
            style={{
              borderRadius: '20px',
              marginTop: '8px',
              paddingTop: '12px',
              paddingBottom: '12px'
            }}
          >
                         {/* Rota visual estilo bilhete de avião */}
             <div className="flex items-center justify-between mb-4 relative">
               <div className="bg-white rounded-xl p-2.5 shadow-sm border border-gray-100 text-left flex-1 min-h-[70px] flex flex-col justify-center">
                 <div className="text-xs text-gray-500 uppercase font-mono font-semibold mb-0.5 tracking-wider">
                   DE: 
                 </div>
                 <div className="text-sm font-mono font-black text-gray-800 tracking-wide leading-tight whitespace-nowrap">
                   <TypewriterText text="INDAIATUBA" delay={1500} speed={80} />
                 </div>
                 <div className="text-xs text-gray-600 font-mono tracking-wide">São Paulo</div>
               </div>
               
               {/* Linha de voo */}
               <div className="mx-2 relative w-16">
                 <div className="border-t-2 border-dashed border-gray-300"></div>
                 <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                   <Plane className="w-3 h-3 text-orange-500 rotate-90" />
                 </div>
               </div>
               
               <div className="bg-white rounded-xl p-2.5 shadow-sm border border-gray-100 text-left flex-1 min-h-[70px] flex flex-col justify-center">
                 <div className="text-xs text-gray-500 uppercase font-mono font-semibold mb-0.5 tracking-wider">
                   PARA:
                 </div>
                 <div className="text-sm font-mono font-black text-orange-600 tracking-wide leading-tight whitespace-nowrap">
                   <TypewriterText text="22ª FENUI" delay={2200} speed={80} />
                 </div>
                 <div className="text-xs text-gray-600 font-mono tracking-wide">Mundo</div>
               </div>
             </div>

                         {/* Informações detalhadas */}
             <div className="space-y-3">
               <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                <div className="text-xs text-gray-500 uppercase font-mono font-semibold mb-1 tracking-wider">
                  Passageiro
                </div>
                                 <div className="text-base font-mono font-bold text-gray-800 tracking-wide uppercase">
                   <TypewriterText text="Explorador Gastronômico" delay={2800} speed={60} />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                                 <div className="bg-white rounded-xl p-2.5 shadow-sm border border-gray-100">
                   <div className="text-xs text-gray-500 uppercase font-mono font-semibold mb-1 tracking-wider">
                     Portão
                   </div>
                   <div className="text-sm font-mono font-bold text-gray-800 tracking-wide">
                     <TypewriterText text="VIBER" delay={3500} speed={70} />
                   </div>
                 </div>
                 <div className="bg-white rounded-xl p-2.5 shadow-sm border border-gray-100">
                   <div className="text-xs text-gray-500 uppercase font-mono font-semibold mb-1 tracking-wider">
                     Classe
                   </div>
                   <div className="text-sm font-mono font-bold text-gray-800 tracking-wide">
                     <TypewriterText text="GOURMET" delay={4200} speed={90} />
                   </div>
                 </div>
              </div>
            </div>
          </motion.div>

          {/* Botões de Ação - Design Moderno */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.6 }}
            className="px-4 py-1 space-y-2 bg-white shadow-sm"
            style={{
              borderRadius: '20px',
              marginTop: '8px',
              paddingTop: '8px'
            }}
          >
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="relative overflow-hidden rounded-2xl"
            >
              <div 
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(90deg, #EF2B2D, #F9B000)'
                }}
              ></div>
              <Button
                onClick={handleViewSchedule}
                className="relative w-full h-12 bg-transparent hover:bg-transparent text-white font-bold text-base border-0 flex items-center justify-center space-x-2 shadow-xl"
              >
                <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <span>VER PROGRAMAÇÃO</span>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="relative overflow-hidden rounded-2xl"
            >
              <div 
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(90deg, #F9B000, #006B3F)'
                }}
              ></div>
              <Button
                onClick={handleExploreMenu}
                className="relative w-full h-12 bg-transparent hover:bg-transparent text-white font-bold text-base border-0 flex items-center justify-center space-x-2 shadow-xl"
              >
                <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
                <span>EXPLORAR CARDÁPIO</span>
              </Button>
            </motion.div>
          </motion.div>

          {/* Código de barras estilo moderno */}
          <div className="px-4 py-1 bg-white shadow-sm" style={{
            borderRadius: '20px',
            marginTop: '8px',
            paddingTop: '8px'
          }}>
            <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
              <div className="flex justify-center items-center space-x-1 mb-2">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className={`bg-gray-800 ${
                      i % 3 === 0 ? 'w-1 h-8' : i % 2 === 0 ? 'w-0.5 h-6' : 'w-0.5 h-8'
                    }`}
                  />
                ))}
              </div>
              <div className="text-center text-xs text-gray-500 font-mono">
                FENUI2025-GASTRO-{Math.random().toString(36).substr(2, 6).toUpperCase()}
              </div>
            </div>
          </div>
          
          </div> {/* Fechamento do container cinza */}
        </div>


      </motion.div>

      {/* Particles/Stars Background Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particleData.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{ 
              willChange: 'opacity', // Otimização de performance
              x: particle.x, 
              y: particle.y 
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      {/* Cloud Transition Animation */}
      <AnimatePresence>
        {showCloudTransition && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 bg-gradient-to-b from-sky-300 via-sky-200 to-blue-100 overflow-hidden"
          >
            {/* Linha tracejada que fica na tela */}
            <motion.div
              className="absolute z-20 w-full h-0.5"
              style={{
                top: window.innerHeight / 2,
                left: 0,
                backgroundImage: 'repeating-linear-gradient(to right, rgba(255,255,255,0.8) 0, rgba(255,255,255,0.8) 15px, transparent 15px, transparent 30px)',
              }}
              initial={{ scaleX: 0, transformOrigin: 'left center' }}
              animate={{ scaleX: 1 }}
              transition={{ 
                delay: 0.5,
                duration: 4,
                ease: "easeOut"
              }}
            />

            {/* Aviãozinho que atravessa */}
            <motion.div
              className="absolute z-30"
              initial={{ x: -100, y: window.innerHeight / 2 - 20 }}
              animate={{ 
                x: window.innerWidth + 100, 
                y: [
                  window.innerHeight / 2 - 20,
                  window.innerHeight / 2 - 70,
                  window.innerHeight / 2 - 50,
                  window.innerHeight / 2 - 100,
                  window.innerHeight / 2 - 60
                ]
              }}
              transition={{ 
                duration: 4, 
                ease: "easeInOut",
                times: [0, 0.25, 0.5, 0.75, 1]
              }}
            >
              <Plane className="w-10 h-10 text-white rotate-45 drop-shadow-xl" />
            </motion.div>

            {/* Logo FENUI Airlines e Texto de transição */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.8 }}
              className="absolute inset-0 flex items-center justify-center z-20"
            >
              <div className="text-center">
                {/* Logo FENUI Airlines */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                  className="mb-6"
                >
                  <img 
                    src="/assets/FENUI AIR PRETO .png" 
                    alt="FENUI Airlines" 
                    className="h-32 w-auto mx-auto drop-shadow-xl" 
                  />
                </motion.div>


                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.5, duration: 0.8 }}
                  className="text-3xl font-bold mb-4 drop-shadow-lg text-slate-800 leading-tight tracking-wide text-center uppercase"
                  style={{ 
                    fontFamily: '"Inter", "Segoe UI", system-ui, -apple-system, sans-serif'
                  }}
                >
                  PREPARANDO SUA<br />
                  VIAGEM GASTRONÔMICA
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 3.0, duration: 0.8 }}
                  className="text-xl drop-shadow-lg text-slate-700 font-semibold tracking-wide text-center uppercase"
                  style={{ 
                    fontFamily: '"Inter", "Segoe UI", system-ui, -apple-system, sans-serif'
                  }}
                >
                  DESTINO: FENUI
                </motion.p>
              </div>
            </motion.div>

            {/* Container com overflow escondido */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <motion.img
                src="/assets/cloud (1).png"
                alt="cloud"
                className="absolute select-none pointer-events-none"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center center',
                  transform: 'rotate(90deg)',
                  width: '120vh', // Maior para não mostrar bordas
                  height: '120vw', // Maior para não mostrar bordas
                  minWidth: '120vw',
                  minHeight: '120vh',
                  left: '-10vw', // Centralizar a imagem maior
                  top: '-10vh',
                  filter: 'contrast(1.8) brightness(1.5) saturate(1.3) drop-shadow(0 0 20px rgba(255,255,255,0.3))', // MUITO mais visível
                }}
                initial={{ 
                  scale: 1.4,
                  x: 30,
                  opacity: 1.0 
                }}
                animate={{ 
                  scale: 1.2,
                  x: -30,
                  opacity: 1.0 
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              />
            </div>

            {/* Efeito de neblina forte - Camada 1 */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 800px 400px at 30% 60%, rgba(255,255,255,0.4) 0%, transparent 50%)',
                filter: 'blur(20px)',
              }}
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: [0, 0.8, 0.6, 0.9, 0.3], x: 100 }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Efeito de neblina forte - Camada 2 */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 600px 300px at 70% 40%, rgba(200,200,255,0.5) 0%, transparent 60%)',
                filter: 'blur(25px)',
              }}
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: [0, 0.7, 0.4, 0.8, 0.2], y: 50 }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
            />

            {/* Efeito de neblina forte - Camada 3 */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 1000px 500px at 50% 80%, rgba(255,255,255,0.3) 0%, transparent 70%)',
                filter: 'blur(30px)',
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 0.6, 0.8, 0.4, 0.7], scale: [0.8, 1.2, 1, 1.1, 0.9] }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 4,
              }}
            />

            {/* Neblina densa no centro */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(circle 400px at center, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 40%, transparent 70%)',
                filter: 'blur(15px)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.9, 0.5, 0.8, 0.3] }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />

            {/* Efeito de vento/movimento */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: -200, opacity: 0 }}
              animate={{ x: window.innerWidth + 200, opacity: [0, 0.5, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                repeatDelay: 1,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nuvens que passam por cima do cartão - POUCAS E SUTIS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
        {/* Nuvem sutil 1 - Muito transparente */}
        <motion.img
          src="/assets/cloud.png"
          alt="nuvem"
          className="absolute w-20 h-12 select-none"
          style={{
            filter: 'brightness(1.8) contrast(0.3)',
            transform: 'rotate(-5deg) scale(0.8)',
            top: `${Math.random() * 40 + 30}%`,
            opacity: 0.15,
          }}
          animate={{
            x: [-80, window.innerWidth + 60],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "linear",
            delay: 8,
            repeatDelay: Math.random() * 10,
          }}
        />

        {/* Nuvem sutil 2 - Bem pequena e transparente */}
        <motion.img
          src="/assets/cloud.png"
          alt="nuvem"
          className="absolute w-16 h-10 select-none"
          style={{
            filter: 'brightness(2.0) contrast(0.2)',
            transform: 'scaleX(-1) rotate(12deg) scale(0.6)',
            top: `${Math.random() * 30 + 20}%`,
            opacity: 0.12,
          }}
          animate={{
            x: [window.innerWidth + 50, -60],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
            delay: 25,
            repeatDelay: Math.random() * 12,
          }}
        />

        {/* NUVEM GRANDE sobre a parte AZUL - Passa de vez em quando */}
        <motion.img
          src="/assets/cloud.png"
          alt="nuvem"
          className="absolute w-52 h-32 select-none"
          style={{
            filter: 'brightness(1.1) contrast(0.9)',
            transform: 'rotate(-8deg)',
            top: '35%', // Posicionada para cobrir a parte azul do e-ticket
            opacity: 0.25,
          }}
          animate={{
            x: [-200, window.innerWidth + 150],
          }}
          transition={{
            duration: 50,
            repeat: Infinity,
            ease: "linear",
            delay: 20, // Demora 20s para começar
            repeatDelay: 30, // Pausa 30s entre cada passada
          }}
        />
      </div>
      </div>
    </div>
  );
} 
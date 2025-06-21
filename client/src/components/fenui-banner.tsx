import { motion } from "framer-motion";

export default function FenuiBanner() {
  return (
    <div className="relative overflow-hidden">
      {/* Banner Principal com Mosaico FENUI */}
      <div className="relative h-24 md:h-28 bg-gray-100">
        {/* Mosaico oficial da FENUI como fundo */}
        <div 
          className="absolute inset-0 bg-center bg-repeat"
          style={{
            backgroundImage: "url('/assets/MOSAICO.png')",
            backgroundSize: '250px auto'
          }}
        />
        
        {/* Faixa decorativa inferior */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-fenui-red via-fenui-yellow via-fenui-green to-fenui-blue"></div>
      </div>
    </div>
  );
} 
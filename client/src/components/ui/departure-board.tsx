import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface DepartureBoardProps {
  text: string;
  className?: string;
  letterCount?: number;
  animationSpeed?: number;
  startAnimation?: boolean;
}

interface LetterState {
  current: string;
  target: string;
  isAnimating: boolean;
}

const LETTERS = " ABCDEFGHIJKLMNOPQRSTUVWXYZÀÁÂÃÄÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝ0123456789.,':()&!?+-";
const DROP_TIME = 100;

export default function DepartureBoard({ 
  text, 
  className = "", 
  letterCount,
  animationSpeed = 1,
  startAnimation = true
}: DepartureBoardProps) {
  const [letters, setLetters] = useState<LetterState[]>([]);
  const intervalRefs = useRef<NodeJS.Timeout[]>([]);
  const isInitialized = useRef(false);
  
  // Detectar se é África do Sul para usar tamanho menor
  const textLower = text.toLowerCase();
  const isAfricaDoSul = textLower.includes('áfrica do sul') || 
                        textLower.includes('africa do sul') ||
                        textLower.includes('afro-brasileira') ||
                        textLower.includes('sul africana') ||
                        textLower.includes('south africa');

  // Inicializar as letras
  useEffect(() => {
    if (isInitialized.current) return;
    
    const textUpper = text.toUpperCase();
    const actualLength = letterCount || textUpper.length;
    const initialLetters: LetterState[] = [];
    
    for (let i = 0; i < actualLength; i++) {
      initialLetters.push({
        current: ' ',
        target: textUpper[i] || ' ',
        isAnimating: false
      });
    }
    
    setLetters(initialLetters);
    isInitialized.current = true;
  }, [text, letterCount]);

  // Animar quando o texto muda ou quando startAnimation é true
  useEffect(() => {
    if (!startAnimation || letters.length === 0) return;

    const textUpper = text.toUpperCase();
    
    // Limpar intervalos anteriores
    intervalRefs.current.forEach(interval => clearInterval(interval));
    intervalRefs.current = [];

    // Animar cada letra com delay menor - mais rápido e limpo
    letters.forEach((_, index) => {
      const targetChar = textUpper[index] || ' ';
      const delay = index * (50 * animationSpeed); // Delay mais previsível
      
      setTimeout(() => {
        animateLetter(index, targetChar);
      }, delay);
    });

    return () => {
      intervalRefs.current.forEach(interval => clearInterval(interval));
    };
  }, [text, startAnimation, letters.length, animationSpeed, letterCount]);

  const animateLetter = (index: number, targetChar: string) => {
    setLetters(prev => {
      const newLetters = [...prev];
      newLetters[index] = { ...newLetters[index], isAnimating: true };
      return newLetters;
    });

    let stepCount = 0;
    const maxSteps = 3; // Apenas 3 variações

    const interval = setInterval(() => {
      stepCount++;
      
      let currentChar;
      if (stepCount >= maxSteps) {
        // Na 3ª variação, mostra a letra correta
        currentChar = targetChar;
      } else {
        // Mostra caracteres aleatórios nas primeiras variações
        const randomIndex = Math.floor(Math.random() * LETTERS.length);
        currentChar = LETTERS[randomIndex];
      }

      // Mudar o caractere no meio do flip
      setTimeout(() => {
        setLetters(prev => {
          const newLetters = [...prev];
          newLetters[index] = { 
            ...newLetters[index], 
            current: currentChar 
          };
          return newLetters;
        });
      }, 300); // Meio da animação flip

      if (stepCount >= maxSteps) {
        clearInterval(interval);
        setTimeout(() => {
          setLetters(prev => {
            const newLetters = [...prev];
            newLetters[index] = { 
              ...newLetters[index], 
              isAnimating: false 
            };
            return newLetters;
          });
        }, 600); // Final da animação
      }
    }, 600); // Tempo completo da animação flip

    intervalRefs.current.push(interval);
  };

  return (
    <div className={cn("departure-board inline-block", className)}>
      <div 
        className="inline-block px-2 py-1 rounded font-mono leading-6 whitespace-nowrap"
        style={{
          padding: '0.36em',
          background: 'rgb(30, 30, 30)',
          borderRadius: '0.21em',
          color: '#eee',
          fontFamily: 'Helvetica, monospace',
          whiteSpace: 'nowrap',
          display: 'inline-flex',
          alignItems: 'center'
        }}
      >
        {letters.map((letter, index) => (
          <DepartureLetter
            key={index}
            char={letter.current}
            isAnimating={letter.isAnimating}
            isSmall={isAfricaDoSul}
          />
        ))}
      </div>
    </div>
  );
}

interface DepartureLetterProps {
  char: string;
  isAnimating: boolean;
  isSmall?: boolean;
}

function DepartureLetter({ char, isAnimating, isSmall = false }: DepartureLetterProps) {
  return (
    <span 
      className={cn(
        "letter",
        "inline-block relative text-center text-white font-mono font-bold flex-shrink-0",
        isSmall ? "w-2.5 h-4 text-xs mx-0" : "w-3.5 h-5 text-xs mx-0",
        isAnimating && "animate-flip"
      )}
      style={{
        boxShadow: `
          inset 0 -0.07em 0 rgba(50, 50, 50, 0.7), 
          inset 0 -0.14em 0 rgba(0, 0, 0, 0.7), 
          inset 0.14em 0 0.28em rgba(0, 0, 0, 0.9), 
          inset -0.14em 0 0.28em rgba(0, 0, 0, 0.9),
          0 0.07em 0 rgba(255, 255, 255, 0.2)
        `,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.3s ease-in-out'
      }}
    >
             {/* Linha divisória central - igual ao original */}
       <span 
         className="absolute w-full h-0 left-0 block z-10"
         style={{
           top: isSmall ? '0.5em' : '0.6em',
           borderTop: '0.05em solid rgba(0, 0, 0, 0.4)',
           borderBottom: '0.05em solid rgba(255, 255, 255, 0.08)',
           transform: 'translate(0, -0.03em)'
         }}
       />
       
       {/* Flap superior */}
       <span 
         className="absolute block overflow-hidden w-full"
         style={{
           top: '0em',
           height: isSmall ? '0.5em' : '0.6em',
           margin: 0
         }}
       >
         <span className="w-full text-center block">{char === ' ' ? '\u00A0' : char}</span>
       </span>
       
       {/* Flap inferior */}
       <span 
         className="absolute block overflow-hidden w-full"
         style={{
           top: isSmall ? '0.5em' : '0.6em',
           height: isSmall ? '0.5em' : '0.6em',
           margin: 0
         }}
       >
         <span 
           className="w-full text-center block relative"
           style={{ top: isSmall ? '-0.5em' : '-0.6em' }}
         >
           {char === ' ' ? '\u00A0' : char}
         </span>
       </span>
    </span>
  );
} 
// Paleta de Cores FENUI - Sistema Centralizado
export const FENUI_COLORS = {
  // Cor principal vermelha (usando a cor padrão do projeto)
  primaryRed: '#dc2626',        // fenui-red-600
  
  // Cores de destaque do mosaico
  accentYellow: '#f59e0b',      // fenui-yellow-500
  darkGreen: '#16a34a',         // fenui-green-600
  
  // Cores de texto e fundo
  textBlack: '#1a1a1a',         // Texto principal escuro
  backgroundWhite: '#ffffff',   // Fundo branco limpo
  
  // Cores neutras para elementos sutis
  neutralGray: '#e5e7eb',       // Bordas e elementos sutis
  lightGray: '#f3f4f6',         // Fundos sutis
  mediumGray: '#6b7280',        // Texto secundário
  
  // Variações do vermelho para diferentes contextos
  primaryRedHover: '#b91c1c',   // fenui-red-700
  primaryRedLight: '#fee2e2',   // fenui-red-100
  
  // Variações do amarelo
  accentYellowHover: '#d97706',
  accentYellowLight: '#fef3c7',
  
  // Variações do verde
  darkGreenHover: '#15803d',
  darkGreenLight: '#dcfce7',
} as const;

// Função helper para obter cores com opacidade
export const getColorWithOpacity = (color: string, opacity: number) => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Classes CSS úteis para usar com Tailwind
export const FENUI_CSS_CLASSES = {
  // Fundos
  primaryRedBg: 'bg-fenui-red-600',
  accentYellowBg: 'bg-fenui-yellow-500',
  darkGreenBg: 'bg-fenui-green-600',
  whiteBg: 'bg-white',
  
  // Textos
  primaryRedText: 'text-fenui-red-600',
  accentYellowText: 'text-fenui-yellow-500',
  darkGreenText: 'text-fenui-green-600',
  blackText: 'text-gray-900',
  
  // Bordas
  primaryRedBorder: 'border-fenui-red-600',
  neutralGrayBorder: 'border-gray-200',
  
  // Hovers
  primaryRedHover: 'hover:bg-fenui-red-700',
  accentYellowHover: 'hover:bg-fenui-yellow-600',
  darkGreenHover: 'hover:bg-fenui-green-700',
} as const; 
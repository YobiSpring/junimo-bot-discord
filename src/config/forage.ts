// src/config/forage.ts

export const itemEmojis: { [key: string]: string } = {
    'Puerro': '🥬',
    'Diente de León': '🌼',
    'Colmenilla': '🫚', 
    'Uva': '🍇',
    'Guisante Dulce': '🌱',
    'Helecho': '🌿', 
    'Seta Común': '🍄',
    'Avellana': '🌰',
    'Mora': '🫐', 
    'Raíz Invernal': '🥔',
    'Azafrán': '🪻', 
    'Acebo': '🌸',

    'Semillas de Chirivía': '🌱',
    'Semillas de Coliflor': '🥬',
    'Semillas de Judía': '🌿',
    'Semillas de Patata': '🥔',
    'Fertilizante Básico': '🟤',
    'Aspersor de Calidad': '💧',
    'Espantapájaros': '🗿',
    'Ramo de Flores': '💐',
    'Mochila Grande': '🎒',
    'Recetario Básico': '📖',
};

export const forageItems: { 
    [season: string]: {
        common: string[],
        rare: string[]
    }
} = {
    primavera: {
        common: ['Puerro', 'Diente de León'],
        rare: ['Colmenilla']
    },
    verano: {
        common: ['Uva', 'Guisante Dulce'],
        rare: ['Helecho']
    },
    otono: {
        common: ['Seta Común', 'Avellana'],
        rare: ['Mora']
    },
    invierno: {
        common: ['Raíz Invernal', 'Acebo'],
        rare: ['Azafrán']
    }
};
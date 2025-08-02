// src/config/forage.ts (VERSIÓN CON RAREZA)

export const itemEmojis: { [key: string]: string } = {
    'Puerro': '🥬',
    'Diente de León': '🌼',
    'Colmenilla': '🫚', // ¡Raro!
    'Uva': '🍇',
    'Guisante Dulce': '🌱',
    'Helecho': '🌿', // Raro
    'Seta Común': '🍄',
    'Avellana': '🌰',
    'Mora': '🫐', // Raro
    'Raíz Invernal': '🥔',
    'Azafrán': '🪻', // Raro
    'Acebo': '🌸',
};

// Define qué objetos se pueden encontrar, ahora separados por rareza.
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
// src/config/prices.ts

// Precio base de cada objeto recolectable
export const basePrices: { [key: string]: number } = {
    'Puerro': 60,
    'Diente de León': 40,
    'Colmenilla': 150,
    'Uva': 80,
    'Guisante Dulce': 50,
    'Helecho': 90,
    'Seta Común': 40,
    'Avellana': 90,
    'Mora': 20,
    'Raíz Invernal': 70,
    'Azafrán': 60,
    'Acebo': 80,
};

// Multiplicadores de precio por calidad
export const qualityMultipliers: { [key: string]: number } = {
    'normal': 1,
    'plata': 1.25,
    'oro': 1.5,
    'iridio': 2,
};
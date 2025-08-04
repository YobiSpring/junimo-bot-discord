// src/config/prices.ts

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

    'Semillas de Chirivía': 10, 
    'Semillas de Coliflor': 40,
    'Semillas de Judía': 30,
    'Semillas de Patata': 25,
    'Fertilizante Básico': 50,
    'Aspersor de Calidad': 225,
    'Espantapájaros': 25,
    'Ramo de Flores': 100,
    'Mochila Grande': 0, 
    'Recetario Básico': 0,
};

export const qualityMultipliers: { [key: string]: number } = {
    'normal': 1,
    'plata': 1.25,
    'oro': 1.5,
    'iridio': 2,
};
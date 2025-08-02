// src/config/seasons.ts

// Define una estructura para cada estación
export interface Season {
    name: string;
    displayName: string;
    status: string;
    avatar: string;
    patpatResponses: string[]; // La nueva respuesta temática
}

// Exporta un array con la información de cada estación
export const seasons: Season[] = [
    {
        name: 'Primavera',
        displayName: 'primavera',
        status: '¡Buscando narcisos! 🌷',
        avatar: './assets/primavera.png',
        patpatResponses: [ // Lista de respuestas de Primavera
            '¡Gracias! (*El Junimo te ofrece una flor silvestre que acaba de brotar.*) 🌼',
            '¡Miiip! (*Huele a tierra mojada y a flores nuevas.*)',
            '(*Saltitos entre pétalos flotantes*) 🌸'
        ],
    },
    {
        name: 'Verano',
        displayName: 'verano',
        status: '¡Disfrutando de la playa! ✨',
        avatar: './assets/verano.png',
        patpatResponses: [ // Lista de respuestas de Verano
            '¡Meep! (*Se siente tan cálido como el sol de verano en tu mano.*) ☀️',
            '(El Junimo te ofrece una rodaja de sandía fresca) 🍉',
            '¡*Bzzzz*! (*Una abeja pasa volando cerca, pero no os molesta.*) 🐝'
        ],
    },
    {
        name: 'Otoño',
        displayName: 'otono',
        status: '¡Saltando sobre un montón de hojas! 🍂',
        avatar: './assets/otono.png',
        patpatResponses: [ // Lista de respuestas de Otoño
            '¡*Cruj, zang*! (*El Junimo apila unas hojas secas a tu lado, como un regalo.*) 🍂',
            '(*Te ofrece una avellana que encontró bajo un árbol.*) 🌰',
            '(*El viento sopla suavemente, levantando algunas hojas a vuestro alrededor.*)'
        ],
    },
    {
        name: 'Invierno',
        displayName: 'invierno',
        status: '¡Haciendo muñecos de nieve!❄️',
        avatar: './assets/invierno.png',
        patpatResponses: [ // Lista de respuestas de Invierno
            '¡*Brrr*! (*El Junimo se pega a ti para entrar en calor. ¡Gracias!*) ❄️',
            '(*Se pueden ver pequeños cristales de hielo en su cabeza. ¡Qué frío!*)',
            '(*Te ofrece una taza de chocolate caliente*) ☕️'
        ],
    },
];
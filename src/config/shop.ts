// src/config/shop.ts (VERSIÓN CON CATEGORÍAS)

export interface ShopItem {
    id: string; // El ID único que usará el usuario para comprar
    name: string;
    price: number;
    description: string;
    emoji: string;
}

export interface ShopCategory {
    name: string;
    items: ShopItem[];
}

// Nuestro nuevo catálogo, ahora un array de categorías.
export const shopCategories: ShopCategory[] = [
    {
        name: "🌱 Semillas de Temporada",
        items: [
            { id: 'semillas-chirivia', name: 'Semillas de Chirivía', price: 20, description: 'Tardan 4 días en crecer.', emoji: '🌱' },
            { id: 'semillas-coliflor', name: 'Semillas de Coliflor', price: 80, description: 'Tardan 12 días en crecer.', emoji: '🥬' },
            { id: 'semillas-judia', name: 'Semillas de Judía', price: 60, description: 'Tardan 10 días y siguen produciendo.', emoji: '🌿' },
            { id: 'semillas-patata', name: 'Semillas de Patata', price: 50, description: 'Tardan 6 días. ¡Posibilidad de cosecha múltiple!', emoji: '🥔' },
        ]
    },
    {
        name: "🛠️ Herramientas y Mejoras",
        items: [
            { id: 'fertilizante-basico', name: 'Fertilizante Básico', price: 100, description: 'Mejora la calidad del suelo.', emoji: '🟤' },
            { id: 'aspersor-calidad', name: 'Aspersor de Calidad', price: 450, description: 'Riega las 8 casillas adyacentes cada mañana.', emoji: '💧' },
            { id: 'espantapajaros', name: 'Espantapájaros', price: 50, description: 'Evita que los cuervos se coman tus cosechas.', emoji: '🗿' },
        ]
    },
    {
        name: "✨ Especiales de Pierre",
        items: [
            { id: 'ramo-flores', name: 'Ramo de Flores', price: 200, description: 'Un regalo universal para empezar una amistad.', emoji: '💐' },
            { id: 'mochila-grande', name: 'Mochila Grande', price: 2000, description: 'Aumenta el espacio de tu inventario a 24 ranuras.', emoji: '🎒' },
            { id: 'recetario-basico', name: 'Recetario Básico', price: 2000, description: 'Aprende a cocinar recetas sencillas.', emoji: '📖' },
        ]
    }
];
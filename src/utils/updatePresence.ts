// src/utils/updatePresence.ts

import { Client, ActivityType } from 'discord.js';
import { seasons } from '../config/seasons.js';

// Función para determinar la estación actual
export function getCurrentSeasonIndex(): number {
    // Stardew Valley tiene 28 días por estación. Simularemos esto con semanas.
    // Hay aprox. 52 semanas en un año. 52 / 4 estaciones = 13 semanas por estación.
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
    
    // Calculamos la semana del año
    const weekOfYear = Math.floor(dayOfYear / 7);

    // Cada estación dura 13 semanas. El % 4 hace que el ciclo se repita cada 4 estaciones.
    // Primavera: semanas 0-12, Verano: 13-25, Otoño: 26-38, Invierno: 39-51
    const seasonIndex = Math.floor(weekOfYear / 13) % 4;
    
    return seasonIndex;
}

export async function updatePresence(client: Client) {
    if (!client.user) {
        console.log('Cliente no listo, no se puede actualizar la presencia.');
        return;
    }
    
    try {
        const seasonIndex = getCurrentSeasonIndex();
        const currentSeason = seasons[seasonIndex];

        console.log(`Cambiando a la estación: ${currentSeason.name}`);

        // Cambiar el estado/actividad
        client.user.setPresence({
            activities: [{ name: currentSeason.status, type: ActivityType.Playing }],
            status: 'online',
        });

        // Cambiar el avatar
        await client.user.setAvatar(currentSeason.avatar);

        console.log(`¡Presencia y avatar actualizados a ${currentSeason.name}!`);

    } catch (error) {
        console.error('Error al actualizar la presencia:', error);
    }
}
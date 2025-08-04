// src/utils/updatePresence.ts

import { Client, ActivityType } from 'discord.js';
import { seasons } from '../config/seasons.js';

export function getCurrentSeasonIndex(): number {

    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
    const weekOfYear = Math.floor(dayOfYear / 7);
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

        client.user.setPresence({
            activities: [{ name: currentSeason.status, type: ActivityType.Playing }],
            status: 'online',
        });

        await client.user.setAvatar(currentSeason.avatar);

        console.log(`¡Presencia y avatar actualizados a ${currentSeason.name}!`);

    } catch (error) {
        console.error('Error al actualizar la presencia:', error);
    }
}
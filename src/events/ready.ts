// src/events/ready.ts

// --- Sección de Importaciones ---

import { Client, Events } from 'discord.js';
import { updatePresence } from '../utils/updatePresence.js';
import { generateNewMission, announceNewMission } from '../utils/missionManager.js';

// --- Código ---

export default {
    name: Events.ClientReady,
    once: true,
    async execute(client: Client) {
        console.log(`¡Junimo listo! Conectado como ${client.user?.tag}`);
        
        await updatePresence(client);
        setInterval(() => updatePresence(client), 1000 * 60 * 60 * 6);

        const runMissionCycle = async () => {
            console.log("Iniciando ciclo de misión...");
            generateNewMission();
            setTimeout(() => announceNewMission(client), 1000); 
        };

        runMissionCycle();
        setInterval(runMissionCycle, 1000 * 60 * 60 * 24);
    },
};
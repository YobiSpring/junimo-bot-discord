// src/utils/missionManager.ts

// --- Sección de Importaciones ---

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client, TextChannel } from 'discord.js'; 
import { seasonalMissionTemplates } from '../config/missions.js';
import { qualityMultipliers, basePrices } from '../config/prices.js';
import { seasons } from '../config/seasons.js';
import { getCurrentSeasonIndex } from './updatePresence.js';
import { getUserData, Item, saveUserData } from './inventoryManager.js';

type Quality = 'normal' | 'plata' | 'oro' | 'iridio';

interface ActiveMission {
    active: boolean;
    requester: string;
    itemName: string;
    quantity: number;
    reward: number;
    dialogue: string;
    expiresAt: number;
    itemPool: string[];
    missionType?: 'ANY_ONE';
    basketQuantity?: number;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const missionDbPath = path.resolve(__dirname, '../../mission.json');


export function getActiveMission(): ActiveMission {
    try {
        if (!fs.existsSync(missionDbPath)) return { active: false } as ActiveMission;
        const data = fs.readFileSync(missionDbPath, 'utf-8');
        return JSON.parse(data);
    } catch {
        return { active: false } as ActiveMission;
    }
}


function saveActiveMission(mission: ActiveMission) {
    fs.writeFileSync(missionDbPath, JSON.stringify(mission, null, 2), 'utf-8');
}


export function generateNewMission() {
    const currentMission = getActiveMission(); 
    
    if (currentMission.active && Date.now() < currentMission.expiresAt) {
        console.log('Ya hay una misión activa y vigente. No se generará una nueva');
        return;
    }

    const seasonIndex = getCurrentSeasonIndex();
    const currentSeasonName = seasons[seasonIndex].displayName;
    const missionPool = seasonalMissionTemplates[currentSeasonName];

    if (!missionPool || missionPool.length === 0) {
        console.log(`No hay plantillas de misiones para la estación: ${currentSeasonName}.`);
        return;
    }

    const template = missionPool[Math.floor(Math.random() * missionPool.length)];
    const expirationTime = Date.now() + (4 * 60 * 60 * 1000);

    const newMission: ActiveMission = {
        active: true,
        requester: template.requester,
        reward: Math.floor(Math.random() * (template.maxReward - template.minReward + 1)) + template.minReward,
        dialogue: template.dialogue,
        expiresAt: expirationTime,
        itemPool: template.itemPool,
        missionType: template.missionType,
        basketQuantity: template.basketQuantity,

        itemName: template.missionType === 'ANY_ONE' 
            ? '' 
            : template.itemPool[Math.floor(Math.random() * template.itemPool.length)], 
        
        quantity: template.missionType === 'ANY_ONE' 
            ? 0
            : Math.floor(Math.random() * 4) + 2, 
    };
    
    saveActiveMission(newMission);
    console.log(`Nueva misión de ${currentSeasonName} generada.`);
}

export function attemptDelivery(userId: string, targetItemName?: string | null): { success: boolean; message: string } {
    const mission = getActiveMission();

    if (!mission.active) return { success: false, message: 'No hay ninguna misión activa.' };
    if (Date.now() > mission.expiresAt) {
        mission.active = false;
        saveActiveMission(mission);
        return { success: false, message: '¡La petición de ayuda ha expirado!' };
    }

    const userData = getUserData(userId);
    let itemsToDeliver: { name: string, quantity: number };

    if (mission.missionType === 'ANY_ONE') {
        if (!targetItemName) {
            return { success: false, message: `Para esta misión, debes especificar qué objeto entregar. Usa \`/entregar objeto: [nombre]\`.` };
        }
        if (!mission.itemPool.includes(targetItemName)) {
            return { success: false, message: `"${targetItemName}" no es una opción válida para esta misión. Opciones: **${mission.itemPool.join(', ')}**.` };
        }
        itemsToDeliver = { name: targetItemName, quantity: mission.basketQuantity || 1 };
    } else {
        if (targetItemName) {
            return { success: false, message: `Para esta misión de recolección, no necesitas especificar un objeto. El tablón solo pide **${mission.itemName}**. Inténtalo de nuevo sin usar la opción "objeto".` };
        }
        itemsToDeliver = { name: mission.itemName, quantity: mission.quantity };
    }

    const qualities: Quality[] = ['normal', 'plata', 'oro', 'iridio'];
    const availableStacks = userData.inventory
        .filter(item => item.name === itemsToDeliver.name)
        .sort((a, b) => qualities.indexOf(a.quality) - qualities.indexOf(b.quality));

    const totalAvailable = availableStacks.reduce((sum, stack) => sum + stack.quantity, 0);

    if (totalAvailable < itemsToDeliver.quantity) {
        return { success: false, message: `No tienes suficientes **${itemsToDeliver.name}**. Necesitas **${itemsToDeliver.quantity}** y solo tienes **${totalAvailable}**.` };
    }

    let quantityToCollect = itemsToDeliver.quantity;
    let totalValueDelivered = 0; 
    const collectedItemsSummary: string[] = [];

    for (const stack of availableStacks) {
        if (quantityToCollect <= 0) break;
        const amountToTake = Math.min(stack.quantity, quantityToCollect);
        const basePrice = basePrices[stack.name] || 0;
        const multiplier = qualityMultipliers[stack.quality] || 1;
        totalValueDelivered += Math.floor(amountToTake * basePrice * multiplier);
        stack.quantity -= amountToTake;
        quantityToCollect -= amountToTake;
        collectedItemsSummary.push(`**${amountToTake}x** ${stack.name} (${stack.quality})`);
    }

    userData.inventory = userData.inventory.filter(item => item.quantity > 0);
    
    const finalReward = mission.reward + totalValueDelivered;
    
    userData.money += finalReward;

    saveUserData(userId, userData);
    mission.active = false;
    saveActiveMission(mission);

    
    userData.money += finalReward;

    saveUserData(userId, userData);

    mission.active = false;
    saveActiveMission(mission);

    const successMessage = `¡Has completado la petición de ${mission.requester} entregando ${collectedItemsSummary.join(' y ')}! Has ganado **${finalReward} G**.`;
    return { success: true, message: successMessage };
}

export async function announceNewMission(client: Client) {
    const mission = getActiveMission();
    if (!mission.active) return;
    const channelId = process.env.MISSION_CHANNEL_ID;
    const roleId = process.env.ADVENTURER_ROLE_ID;

    if (!channelId || !roleId) return;

    try {
        const channel = await client.channels.fetch(channelId);
        if (channel instanceof TextChannel) {
            await channel.send(`¡Ding, ding, ding! 🔔 <@&${roleId}>, ¡hay una nueva petición de ayuda en el tablón!`);
        }
    } catch (error) {
        console.error("Error al anunciar la misión:", error);
    }
}
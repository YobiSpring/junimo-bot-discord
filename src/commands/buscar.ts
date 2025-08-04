// src/commands/buscar.ts

import { SlashCommandBuilder, Interaction, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import { getCurrentSeasonIndex } from '../utils/updatePresence.js';
import { seasons } from '../config/seasons.js';
import { forageItems, itemEmojis } from '../config/forage.js';
import { addItem, getUserData, saveUserData } from '../utils/inventoryManager.js';

const COOLDOWN_AMOUNT = 5 * 60 * 1000;
const FIND_CHANCE = 0.8;
const RARE_CHANCE = 0.15;
const QUALITY_CHANCES = { iridio: 0.02, oro: 0.10, plata: 0.25 };

function generateLoot(seasonLoot: { common: string[], rare: string[] }) {
    const isRare = Math.random() < RARE_CHANCE;
    const foundItemName = isRare
        ? seasonLoot.rare[Math.floor(Math.random() * seasonLoot.rare.length)]
        : seasonLoot.common[Math.floor(Math.random() * seasonLoot.common.length)];

    const qualityRoll = Math.random();
    let qualityName: 'normal' | 'plata' | 'oro' | 'iridio' = 'normal';
    if (qualityRoll < QUALITY_CHANCES.iridio) qualityName = 'iridio';
    else if (qualityRoll < QUALITY_CHANCES.oro) qualityName = 'oro';
    else if (qualityRoll < QUALITY_CHANCES.plata) qualityName = 'plata';
    
    const quantity = Math.floor(Math.random() * 3) + 1;

    return { name: foundItemName, quality: qualityName, quantity, isRare };
}

function getTitleText(quality: string, isRare: boolean): string {
    if (quality === 'iridio') return '¡¡¡UN PREMIO GORDO!!!';
    if (isRare && quality === 'oro') return '¡Un tesoro legendario!';
    if (isRare && quality === 'plata') return '¡Un hallazgo brillante y raro!';
    if (isRare) return '¡Un objeto curioso y raro!';
    if (quality === 'oro') return '¡Brilla como el sol!';
    if (quality === 'plata') return '¡Reluce con elegancia!';
    return '¡Un pequeño hallazgo!';
}

export default {
    data: new SlashCommandBuilder()
        .setName('buscar')
        .setDescription('El Junimo busca objetos de recolección por la zona.'),
    
    async execute(interaction: ChatInputCommandInteraction) {
        const userId = interaction.user.id;
        const userData = getUserData(userId);

        const lastForage = userData.lastForageTimestamp ?? 0;
        const timePassed = Date.now() - lastForage;

        if (timePassed < COOLDOWN_AMOUNT) {
            const timeLeft = (COOLDOWN_AMOUNT - timePassed) / 1000;
            return interaction.reply({ 
                content: `¡Tranquilo! El Junimo está descansando. Podrás buscar de nuevo en **${Math.ceil(timeLeft / 60)} minuto(s)**.`,
                ephemeral: true
            });
        }
        
        userData.lastForageTimestamp = Date.now();
        saveUserData(userId, userData); 

        const seasonIndex = getCurrentSeasonIndex();
        const currentSeason = seasons[seasonIndex];
        
        if (Math.random() < FIND_CHANCE) {
            const seasonLoot = forageItems[currentSeason.displayName];
            const foundItem = generateLoot(seasonLoot);
            
            addItem(interaction.user.id, foundItem);
            
            const qualityEmojis = { normal: '', plata: '✨', oro: '⭐', iridio: '🌟' };
            const qualityColors = { normal: 0x58D68D, plata: 0xAAB7B8, oro: 0xF1C40F, iridio: 0x9B59B6 };
            
            const titleText = getTitleText(foundItem.quality, foundItem.isRare);

            const embed = new EmbedBuilder()
                .setColor(qualityColors[foundItem.quality])
                .setTitle(titleText) 
                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                .setDescription(`¡*Bip-bop*! El Junimo ha encontrado **${foundItem.quantity}x ${foundItem.name}** ${itemEmojis[foundItem.name] || '❔'} ${qualityEmojis[foundItem.quality]}`)
                .setFooter({ text: `Recolectado en ${currentSeason.name}` });

            await interaction.reply({ embeds: [embed] });
        } else {
            const embed = new EmbedBuilder()
                .setColor(0xAFB4B8)
                .setTitle('¡No hubo suerte!')
                .setDescription('¡Oh! El Junimo ha buscado por todas partes pero no ha encontrado nada esta vez. ¡Inténtalo de nuevo más tarde!');
            await interaction.reply({ embeds: [embed] });
        }
    },
};
// src/commands/inventario.ts (VERSIÓN CON VALOR DE OBJETOS)

import { SlashCommandBuilder, Interaction, EmbedBuilder } from 'discord.js';
import { getInventory } from '../utils/inventoryManager.js';
import { itemEmojis } from '../config/forage.js';
import { basePrices, qualityMultipliers } from '../config/prices.js';

export default {
    data: new SlashCommandBuilder()
        .setName('inventario')
        .setDescription('El Junimo te muestra los objetos que has recolectado y su valor.'),
    
    async execute(interaction: Interaction) {
        if (!interaction.isChatInputCommand()) return;
        
        const userInventory = getInventory(interaction.user.id);

        const embed = new EmbedBuilder()
            .setColor(0x8E44AD)
            .setTitle(`Inventario de ${interaction.user.username}`)
            .setThumbnail(interaction.user.displayAvatarURL());

        if (userInventory.length === 0) {
            embed.setDescription('¡Tu mochila está vacía! Usa `/buscar` para encontrar objetos.');
        } else {
            let totalInventoryValue = 0;

            const inventoryString = userInventory.map(item => {
                const emoji = itemEmojis[item.name] || '❔';
                let qualityEmoji = '';
                if (item.quality === 'plata') qualityEmoji = '✨ (Plata)';
                if (item.quality === 'oro') qualityEmoji = '⭐ (Oro)';
                if (item.quality === 'iridio') qualityEmoji = '🌟 (Iridio)';

                const pricePerItem = basePrices[item.name] || 0;
                const multiplier = qualityMultipliers[item.quality] || 1;
                const stackValue = Math.floor(item.quantity * pricePerItem * multiplier);
                
                totalInventoryValue += stackValue;

                return `${emoji} **${item.name}** (x${item.quantity}) ${qualityEmoji} - \`${stackValue} G\``;
            }).join('\n');

            embed.setDescription(inventoryString);
            
            embed.setFooter({ text: `Valor total de la mochila: ${totalInventoryValue} G` });
        }

        await interaction.reply({ embeds: [embed] });
    },
};
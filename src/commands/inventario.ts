// src/commands/inventario.ts (VERSIÓN CON VALOR DE OBJETOS)

import { SlashCommandBuilder, Interaction, EmbedBuilder } from 'discord.js';
import { getInventory } from '../utils/inventoryManager.js';
import { itemEmojis } from '../config/forage.js';
// ¡PASO 1: IMPORTAMOS LAS HERRAMIENTAS DE PRECIOS!
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
            // ¡PASO 2: CALCULAMOS EL VALOR TOTAL MIENTRAS CONSTRUIMOS LA LISTA!
            let totalInventoryValue = 0;

            const inventoryString = userInventory.map(item => {
                const emoji = itemEmojis[item.name] || '❔';
                let qualityEmoji = '';
                if (item.quality === 'plata') qualityEmoji = '✨';
                if (item.quality === 'oro') qualityEmoji = '⭐';
                if (item.quality === 'iridio') qualityEmoji = '🌟';

                // --- INICIO DE LA NUEVA LÓGICA DE CÁLCULO ---
                const pricePerItem = basePrices[item.name] || 0;
                const multiplier = qualityMultipliers[item.quality] || 1;
                const stackValue = Math.floor(item.quantity * pricePerItem * multiplier);
                
                // Sumamos el valor de esta pila al total del inventario.
                totalInventoryValue += stackValue;
                // --- FIN DE LA NUEVA LÓGICA DE CÁLCULO ---

                // Añadimos el valor de la pila al final de la línea.
                return `${emoji} **${item.name}** (x${item.quantity}) ${qualityEmoji} - \`${stackValue} G\``;
            }).join('\n');

            embed.setDescription(inventoryString);
            
            // ¡PASO 3: AÑADIMOS EL VALOR TOTAL AL PIE DEL MENSAJE!
            embed.setFooter({ text: `Valor total de la mochila: ${totalInventoryValue} G` });
        }

        await interaction.reply({ embeds: [embed] });
    },
};
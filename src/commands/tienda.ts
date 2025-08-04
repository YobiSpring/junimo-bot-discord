// src/commands/tienda.ts (VERSIÓN CON PAGINACIÓN)

import { SlashCommandBuilder, Interaction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } from 'discord.js';
import { shopCategories } from '../config/shop.js';

export function createShopEmbed(page: number): EmbedBuilder {
    const category = shopCategories[page];
    
    const embed = new EmbedBuilder()
        .setColor(0xD16132)
        .setTitle(`🛒 ${category.name}`)
        .setDescription('Usa `/comprar` para adquirir un artículo.')
        .setFooter({ text: `Página ${page + 1} de ${shopCategories.length}` });

    category.items.forEach(item => {
        embed.addFields({
            name: `${item.emoji} ${item.name} - ${item.price} G`,
            value: `${item.description}\n*ID:* \`${item.id}\``,
            inline: false,
        });
    });

    return embed;
}

export function createShopButtons(page: number): ActionRowBuilder<ButtonBuilder> {
    const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`shop_prev_${page}`)
                .setLabel('⬅️ Anterior')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(page === 0), 
            new ButtonBuilder()
                .setCustomId(`shop_next_${page}`)
                .setLabel('Siguiente ➡️')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(page === shopCategories.length - 1) 
        );
    return row;
}

export default {
    data: new SlashCommandBuilder()
        .setName('tienda')
        .setDescription('Abre el catálogo interactivo de la tienda de Pierre\'s.'),
    
    async execute(interaction: Interaction) {
        if (!interaction.isChatInputCommand()) return;
        
        const initialPage = 0;
        const embed = createShopEmbed(initialPage);
        const buttons = createShopButtons(initialPage);

        await interaction.reply({ 
            embeds: [embed],
            components: [buttons],
            flags: [MessageFlags.Ephemeral] 
        });
    },
};
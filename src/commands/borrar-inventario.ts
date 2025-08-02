// src/commands/borrar-inventario.ts

import { SlashCommandBuilder, Interaction, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, MessageFlags } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('borrar-inventario')
        .setDescription('¡CUIDADO! Elimina permanentemente todo tu inventario.'),
    
    async execute(interaction: Interaction) {
        if (!interaction.isChatInputCommand()) return;

        const embed = new EmbedBuilder()
            .setColor(0xE74C3C) // Rojo peligro
            .setTitle('⚠️ Confirmación de Borrado ⚠️')
            .setDescription('¿Estás absolutamente seguro de que quieres borrar todo tu inventario? **Esta acción no se puede deshacer.**');

        const confirmButton = new ButtonBuilder()
            .setCustomId('confirm_delete_inv')
            .setLabel('Sí, borrar todo')
            .setStyle(ButtonStyle.Danger);

        const cancelButton = new ButtonBuilder()
            .setCustomId('cancel_delete_inv')
            .setLabel('No, cancelar')
            .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(confirmButton, cancelButton);

        await interaction.reply({ 
            embeds: [embed], 
            components: [row],
            flags: [MessageFlags.Ephemeral] // Solo tú puedes ver esto
        });
    },
};
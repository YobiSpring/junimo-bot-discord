// src/commands/entregar.ts 

import { SlashCommandBuilder, Interaction, EmbedBuilder, MessageFlags } from 'discord.js';
import { attemptDelivery } from '../utils/missionManager.js'; 

export default {
    data: new SlashCommandBuilder()
        .setName('entregar')
        .setDescription('Intenta completar la misión activa del tablón.')
        .addStringOption(option =>
            option.setName('objeto')
                .setDescription('Para misiones de cesta, especifica qué objeto quieres entregar.')
                .setRequired(false)
        ),

    async execute(interaction: Interaction) {
        if (!interaction.isChatInputCommand()) return;
        
        const itemName = interaction.options.getString('objeto');
        const result = attemptDelivery(interaction.user.id, itemName);

        // Refinamiento: Construimos el embed base aquí.
        const embed = new EmbedBuilder()
            .setDescription(result.message);

        if (result.success) {
            embed.setColor(0x2ECC71).setTitle('¡Misión Completada!');
            await interaction.reply({ embeds: [embed] });
        } else {
            embed.setColor(0xE74C3C).setTitle('¡Oh, no!');
            await interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
        }
    },
};
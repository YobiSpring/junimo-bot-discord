// src/commands/dinero.ts

import { SlashCommandBuilder, Interaction, EmbedBuilder } from 'discord.js';
import { getMoney } from '../utils/inventoryManager.js';

export default {
    data: new SlashCommandBuilder()
        .setName('dinero')
        .setDescription('El Junimo cuenta cuántos G tienes.'),

    async execute(interaction: Interaction) {
        if (!interaction.isChatInputCommand()) return;

        const userMoney = getMoney(interaction.user.id);

        const embed = new EmbedBuilder()
            .setColor(0xF1C40F) 
            .setTitle(`Billetera de ${interaction.user.username}`)
            .setDescription(`Actualmente tienes... **${userMoney} G** 💰`);
        
        await interaction.reply({ embeds: [embed] });
    },
};
// src/commands/vender.ts (VERSIÓN SIMPLIFICADA)

import { SlashCommandBuilder, Interaction, EmbedBuilder } from 'discord.js';
// ¡Solo necesitamos importar nuestra nueva función!
import { sellItem } from '../utils/inventoryManager.js';

export default {
    data: new SlashCommandBuilder()
        .setName('vender')
        .setDescription('Vende objetos de tu inventario para ganar G.')
        .addStringOption(option => 
            option.setName('objeto')
                .setDescription('El nombre del objeto que quieres vender.')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('cantidad')
                .setDescription('La cantidad que quieres vender.')
                .setRequired(true)
                .setMinValue(1))
        .addStringOption(option =>
            option.setName('calidad')
                .setDescription('La calidad del objeto a vender.')
                .setRequired(true)
                .addChoices(
                    { name: 'Normal', value: 'normal' },
                    { name: 'Plata ✨', value: 'plata' },
                    { name: 'Oro ⭐', value: 'oro' },
                    { name: 'Iridio 🌟', value: 'iridio' },
                )),
    
    async execute(interaction: Interaction) {
        if (!interaction.isChatInputCommand()) return;
        
        const itemName = interaction.options.getString('objeto', true);
        const quantity = interaction.options.getInteger('cantidad', true);
        const quality = interaction.options.getString('calidad', true) as 'normal' | 'plata' | 'oro' | 'iridio';

        // Llamamos a nuestra nueva y potente función.
        const result = sellItem(interaction.user.id, itemName, quality, quantity);

        if (result.success) {
            const embed = new EmbedBuilder()
                .setColor(0x2ECC71)
                .setTitle('¡Venta Exitosa!')
                .setDescription(`¡Has vendido **${quantity}x ${itemName} (${quality})** por **${result.moneyGained} G**! 💰`);
            
            await interaction.reply({ embeds: [embed] });
        } else {
            // Si la venta falló (no tenía objetos, nombre incorrecto, etc.)
            await interaction.reply({ content: `❌ No se pudo realizar la venta. ¿Seguro que tienes **${quantity}x ${itemName}** de calidad **${quality}**?`, ephemeral: true });
        }
    },
};
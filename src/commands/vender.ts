// src/commands/vender.ts

import { SlashCommandBuilder, EmbedBuilder, AutocompleteInteraction, ChatInputCommandInteraction } from 'discord.js';
import { sellItem, getInventory } from '../utils/inventoryManager.js';
import { basePrices } from '../config/prices.js';
import { Command } from '../index.js'; 

const VenderCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('vender')
        .setDescription('Vende objetos de tu inventario para ganar G.')
        .addStringOption(option => 
            option.setName('objeto')
                .setDescription('El nombre del objeto que quieres vender (empieza a escribir para ver opciones).')
                .setRequired(true)
                .setAutocomplete(true)) 
        .addIntegerOption(option =>
            option.setName('cantidad')
                .setDescription('La cantidad que quieres vender.')
                .setRequired(true)
                .setMinValue(1))
        .addStringOption(option =>
            option.setName('calidad')
                .setDescription('La calidad del objeto (si no se especifica, se asume Normal).')
                .setRequired(false) 
                .addChoices(
                    { name: 'Normal', value: 'normal' },
                    { name: 'Plata ✨', value: 'plata' },
                    { name: 'Oro ⭐', value: 'oro' },
                    { name: 'Iridio 🌟', value: 'iridio' },
                )),
    
    async autocomplete(interaction: AutocompleteInteraction) {
        const focusedValue = interaction.options.getFocused().toLowerCase();
        const userInventory = getInventory(interaction.user.id);
        
        const choices = userInventory
            .filter(item => 
                basePrices[item.name] !== undefined && 
                item.name.toLowerCase().startsWith(focusedValue)
            )
            .map(item => item.name);
        
        const uniqueChoices = [...new Set(choices)];
        
        await interaction.respond(
            uniqueChoices.slice(0, 25).map(choice => ({ name: choice, value: choice })),
        );
    },
    
    async execute(interaction: ChatInputCommandInteraction) {
        const itemName = interaction.options.getString('objeto', true);
        const quantity = interaction.options.getInteger('cantidad', true);
        const quality = (interaction.options.getString('calidad') ?? 'normal') as 'normal' | 'plata' | 'oro' | 'iridio';

        const result = sellItem(interaction.user.id, itemName, quality, quantity);
        const embed = new EmbedBuilder();

        if (result.success) {
            embed.setColor(0x2ECC71) 
                .setTitle('¡Venta Exitosa!')
                .setDescription(`¡Has vendido **${quantity}x ${itemName}** (Calidad: ${quality}) por **${result.moneyGained} G**! 💰`);
            
            await interaction.reply({ embeds: [embed] });
        } else {
            embed.setColor(0xE74C3C)
                .setTitle('¡Venta Fallida!')
                .setDescription(`❌ ${result.message}`);
            
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
};

export default VenderCommand;
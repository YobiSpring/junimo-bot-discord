// src/commands/comprar.ts (VERSIÓN FINAL Y UNIFICADA)

import { SlashCommandBuilder, Interaction, EmbedBuilder, AutocompleteInteraction, ChatInputCommandInteraction, MessageFlags } from 'discord.js';
import { purchaseItem } from '../utils/inventoryManager.js';
import { shopCategories } from '../config/shop.js';
import { Command } from '../index.js';

const ComprarCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('comprar')
        .setDescription('Compra un artículo de la tienda.')
        .addStringOption(option =>
            option.setName('articulo_id')
                .setDescription('El ID del artículo que quieres comprar (empieza a escribir).')
                .setRequired(true)
                .setAutocomplete(true))
        .addIntegerOption(option =>
            option.setName('cantidad')
                .setDescription('La cantidad que quieres comprar. Por defecto es 1.')
                .setMinValue(1)),
    
    async autocomplete(interaction: AutocompleteInteraction) {
        const focusedValue = interaction.options.getFocused().toLowerCase();
        
        const allItems = shopCategories.flatMap(category => category.items);
        const choices = allItems
            .filter(item => 
                item.name.toLowerCase().startsWith(focusedValue) || item.id.toLowerCase().startsWith(focusedValue)
            )
            .map(item => ({ name: `${item.emoji} ${item.name}`, value: item.id }));

        await interaction.respond(choices.slice(0, 25));
    },
    
    async execute(interaction: ChatInputCommandInteraction) {
        const itemId = interaction.options.getString('articulo_id', true);
        const quantity = interaction.options.getInteger('cantidad') ?? 1;

        const allItems = shopCategories.flatMap(category => category.items);
        const itemToBuy = allItems.find(item => item.id === itemId);

        if (!itemToBuy) {
            const errorEmbed = new EmbedBuilder()
                .setColor(0xE74C3C)
                .setTitle('Artículo no encontrado')
                .setDescription(`❌ No he podido encontrar ningún artículo con el ID \`${itemId}\`.`);
            
            await interaction.reply({ embeds: [errorEmbed], flags: [MessageFlags.Ephemeral] });
            return; 
        }


        const result = purchaseItem(interaction.user.id, itemToBuy, quantity);
        const embed = new EmbedBuilder();

        if (result.success) {
            embed.setColor(0x2ECC71)
                .setTitle('¡Compra Realizada!')
                .setDescription(`¡Has comprado **${quantity}x ${itemToBuy.name}** ${itemToBuy.emoji} por **${itemToBuy.price * quantity} G**!`)
                .setFooter({ text: '¡Gracias por tu compra!' });
            
            await interaction.reply({ embeds: [embed] });
        } else {
            embed.setColor(0xE74C3C)
                .setTitle('¡Compra Fallida!')
                .setDescription(`❌ ${result.message}`);
            
            await interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
        }
    },
};

export default ComprarCommand;
// src/events/interactionCreate.ts

import { Events, Interaction } from 'discord.js';

export default {
    name: Events.InteractionCreate,
    
    async execute(interaction: Interaction) {
        
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`No se encontró ningún comando llamado ${interaction.commandName}.`);
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(`Error al ejecutar el comando ${interaction.commandName}:`, error);
                await interaction.reply({ content: '¡Oh no! Algo salió mal al ejecutar este comando.', ephemeral: true });
            }
            return;
        }

        if (interaction.isButton()) {
            const { customId, user } = interaction;

            if (customId === 'confirm_delete_inv') {
                const { deleteInventory } = await import('../utils/inventoryManager.js');
                deleteInventory(user.id);
                await interaction.update({ 
                    content: '✅ ¡Tu inventario y tu dinero han sido borrados!',
                    embeds: [],
                    components: [] 
                });
            } else if (customId === 'cancel_delete_inv') {
                await interaction.update({
                    content: '👍 Operación cancelada. Tu inventario está a salvo.',
                    embeds: [],
                    components: []
                });
            }

            if (customId.startsWith('shop_')) {
                const { createShopEmbed, createShopButtons } = await import('../commands/tienda.js');
                const [_, action, currentPageStr] = customId.split('_');
                let currentPage = parseInt(currentPageStr, 10);

                if (action === 'next') {
                    currentPage++;
                } else if (action === 'prev') {
                    currentPage--;
                }

                const newEmbed = createShopEmbed(currentPage);
                const newButtons = createShopButtons(currentPage);

                await interaction.update({
                    embeds: [newEmbed],
                    components: [newButtons]
                });
            }
            return;
        }

        if (interaction.isAutocomplete()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command || !command.autocomplete) return;

            try {
                await command.autocomplete(interaction);
            } catch (error) {
                console.error(`Error en el autocompletado para ${interaction.commandName}:`, error);
            }
        }
    },
};
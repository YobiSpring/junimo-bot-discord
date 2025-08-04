// src/events/interactionCreate.ts

import { Events, Interaction } from 'discord.js';

export default {
    // Define el nombre del evento que este archivo manejará.
    name: Events.InteractionCreate,
    
    // La función 'execute' se llamará cada vez que ocurra una interacción.
    async execute(interaction: Interaction) {
        
        // --- GESTOR DE COMANDOS DE BARRA DIAGONAL ---
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`No se encontró ningún comando llamado ${interaction.commandName}.`);
                return;
            }

            try {
                // Ejecuta la función 'execute' del comando correspondiente.
                await command.execute(interaction);
            } catch (error) {
                console.error(`Error al ejecutar el comando ${interaction.commandName}:`, error);
                // Envía una respuesta de error genérica y efímera al usuario.
                await interaction.reply({ content: '¡Oh no! Algo salió mal al ejecutar este comando.', ephemeral: true });
            }
            return; // Termina la ejecución para no procesar otros tipos de interacción.
        }

        // --- GESTOR DE BOTONES ---
        if (interaction.isButton()) {
            const { customId, user } = interaction;

            // Lógica para los botones de borrar inventario
            if (customId === 'confirm_delete_inv') {
                // Importamos la función dinámicamente solo cuando se necesita.
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

            // Lógica para los botones de la tienda
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

        // --- GESTOR DE AUTOCOMPLETADO ---
        if (interaction.isAutocomplete()) {
            const command = interaction.client.commands.get(interaction.commandName);

            // Si el comando no existe o no tiene una función de autocompletado, no hacemos nada.
            if (!command || !command.autocomplete) return;

            try {
                // Ejecuta la función 'autocomplete' del comando correspondiente.
                await command.autocomplete(interaction);
            } catch (error) {
                console.error(`Error en el autocompletado para ${interaction.commandName}:`, error);
            }
        }
    },
};
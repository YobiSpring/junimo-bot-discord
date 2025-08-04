// src/commands/tablon.ts

import { SlashCommandBuilder, Interaction, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import { getActiveMission } from '../utils/missionManager.js';
import { Command } from '../index.js';

const TablonCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('tablon')
        .setDescription('Revisa el tablón de anuncios en busca de peticiones de ayuda.'),

    async execute(interaction: ChatInputCommandInteraction) {
        const mission = getActiveMission();

        const embed = new EmbedBuilder()
            .setColor(0xD2691E) 
            .setTitle('📌 Tablón de Anuncios del Pueblo')
            .setThumbnail('attachment://tablon.png'); 

        if (mission.active && Date.now() < mission.expiresAt) {
            const discordTimestamp = Math.floor(mission.expiresAt / 1000);

            embed.addFields(
                { name: `Ayuda solicitada por: ${mission.requester}`, value: `*“${mission.dialogue}”*` }
            );

            if (mission.missionType === 'ANY_ONE') {
                const requiredQuantity = mission.basketQuantity || 1;
                const itemList = mission.itemPool.map((item: string) => `• **${requiredQuantity}x** ${item}`).join('\n');

                embed.addFields(
                    { name: 'Se necesita (uno de los siguientes lotes):', value: itemList },
                    { name: 'Recompensa Base:', value: `**${mission.reward} G**`, inline: true },
                    { name: 'Tiempo Restante:', value: `<t:${discordTimestamp}:R>`, inline: true }
                );
            } else {
                embed.addFields(
                    { name: 'Objeto Necesario:', value: `**${mission.quantity}x ${mission.itemName}**`, inline: true },
                    { name: 'Recompensa Base:', value: `**${mission.reward} G**`, inline: true },
                    { name: 'Tiempo Restante:', value: `<t:${discordTimestamp}:R>`, inline: true }
                );
            }
            
            embed.setFooter({ text: 'Usa /entregar para completar la misión.' });

        } else {  
            embed.setDescription('Parece que no hay ninguna petición de ayuda por ahora. ¡Vuelve mañana!');
        }

        await interaction.reply({
             embeds: [embed],
             files: [{
                attachment: './assets/tablon.png',
                name: 'tablon.png'
            }]
        });
    },
};

export default TablonCommand;
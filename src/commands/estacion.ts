// src/commands/estacion.ts

import { SlashCommandBuilder, Interaction, EmbedBuilder } from 'discord.js';
import { getCurrentSeasonIndex } from '../utils/updatePresence.js';
import { seasons } from '../config/seasons.js';

export default {
    data: new SlashCommandBuilder()
        .setName('estacion')
        .setDescription('El Junimo te cuenta en qué estación del año se encuentra.'),
    
    async execute(interaction: Interaction) {
        if (!interaction.isChatInputCommand()) return;

        const seasonIndex = getCurrentSeasonIndex();
        const currentSeason = seasons[seasonIndex];

        const embed = new EmbedBuilder()
            .setTitle(`¡Estamos en ${currentSeason.name}!`)
            .setDescription(`*${currentSeason.status}*`)
            .setColor(getSeasonColor(currentSeason.name)) 
            .setThumbnail(`attachment://${currentSeason.displayName}.png`)
            .addFields(
                { name: 'Consejo de la Estación', value: getSeasonTip(currentSeason.name), inline: false },
            )


        await interaction.reply({ 
            embeds: [embed],
            files: [{
                attachment: currentSeason.avatar,
                name: `${currentSeason.displayName}.png`
            }]
        });
    },
};

function getSeasonColor(seasonName: string): number {
    switch (seasonName) {
        case 'Primavera': return 0x90EE90;
        case 'Verano': return 0xFFD700;   
        case 'Otoño': return 0xD2691E;     
        case 'Invierno': return 0xADD8E6;  
        default: return 0xFFFFFF;
    }
}

function getSeasonTip(seasonName: string): string {
    switch (seasonName) {
        case 'Primavera': return 'Es el mejor momento para buscar Puerros y Dientes de León. ¡Planta muchas Chirivías!';
        case 'Verano': return '¡Los Arándanos y los Melones dan mucho dinero! No te olvides de visitar la playa.';
        case 'Otoño': return '¡La estación de las Grosellas! También es un buen momento para mejorar tus herramientas.';
        case 'Invierno': return '¡Hora de ir a las minas! También puedes mejorar tus relaciones con los aldeanos.';
        default: return 'Cada día es una nueva oportunidad.';
    }
}
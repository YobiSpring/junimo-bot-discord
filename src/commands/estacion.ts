// src/commands/estacion.ts

// Importamos las herramientas necesarias de discord.js
import { SlashCommandBuilder, Interaction, EmbedBuilder } from 'discord.js';
// Importamos la lógica que ya creamos (¡reutilizar es de pros!)
import { getCurrentSeasonIndex } from '../utils/updatePresence.js';
import { seasons } from '../config/seasons.js';

export default {
    // 1. DEFINICIÓN DEL COMANDO
    data: new SlashCommandBuilder()
        .setName('estacion')
        .setDescription('El Junimo te cuenta en qué estación del año se encuentra.'),
    
    // 2. LÓGICA DE EJECUCIÓN
    async execute(interaction: Interaction) {
        // Nos aseguramos de que estamos tratando con un comando de chat
        if (!interaction.isChatInputCommand()) return;

        // Obtenemos el índice de la estación actual llamando a nuestra función
        const seasonIndex = getCurrentSeasonIndex();
        // Usamos ese índice para obtener toda la información de la estación
        const currentSeason = seasons[seasonIndex];

        // 3. CREACIÓN DE LA RESPUESTA VISUAL (Embed)
        // Los 'Embeds' son tarjetas especiales que hacen que las respuestas del bot se vean geniales.
        const embed = new EmbedBuilder()
            .setTitle(`¡Estamos en ${currentSeason.name}!`)
            .setDescription(`*${currentSeason.status}*`) // El estado del bot como descripción
            .setColor(getSeasonColor(currentSeason.name)) // Un color temático
            .setThumbnail(`attachment://${currentSeason.displayName}.png`) // La imagen del avatar
            .addFields(
                { name: 'Consejo de la Estación', value: getSeasonTip(currentSeason.name), inline: false },
            )

        // 4. RESPONDER AL USUARIO
        // Enviamos el embed como respuesta.
        await interaction.reply({ 
            embeds: [embed],
            // Adjuntamos el archivo de imagen para que el thumbnail funcione
            files: [{
                attachment: currentSeason.avatar,
                name: `${currentSeason.displayName}.png`
            }]
        });
    },
};

// Funciones de ayuda para mantener el código limpio
function getSeasonColor(seasonName: string): number {
    switch (seasonName) {
        case 'Primavera': return 0x90EE90; // Verde claro
        case 'Verano': return 0xFFD700;    // Dorado
        case 'Otoño': return 0xD2691E;     // Chocolate
        case 'Invierno': return 0xADD8E6;   // Azul claro
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
// src/commands/buscar.ts (VERSIÓN CON LÓGICA DE RAREZA)

import { SlashCommandBuilder, Interaction, EmbedBuilder, MessageFlags } from 'discord.js';
import { getCurrentSeasonIndex } from '../utils/updatePresence.js';
import { seasons } from '../config/seasons.js';
import { forageItems, itemEmojis } from '../config/forage.js';
import { addItem } from '../utils/inventoryManager.js'; // Asegúrate de tener esta función para manejar el inventario

// Cooldown para evitar spam (5 minutos)
const cooldowns = new Map<string, number>();
// const cooldownAmount = 5 * 60 * 1000;
const cooldownAmount = 1000;


export default {
    data: new SlashCommandBuilder()
        .setName('buscar')
        .setDescription('El Junimo busca objetos de recolección por la zona.'),
    
    async execute(interaction: Interaction) {
        if (!interaction.isChatInputCommand()) return;
        const userId = interaction.user.id;

        // --- LÓGICA DE COOLDOWN ---
        if (cooldowns.has(userId)) {
            const expirationTime = cooldowns.get(userId)! + cooldownAmount;
            if (Date.now() < expirationTime) {
                const timeLeft = (expirationTime - Date.now()) / 1000;
                return interaction.reply({ 
                    content: `¡Tranquilo! El Junimo está descansando. Podrás buscar de nuevo en **${Math.ceil(timeLeft / 60)} minuto(s)**.`,
                    flags: [MessageFlags.Ephemeral]
                });
            }
        }
        cooldowns.set(userId, Date.now());

        // --- LÓGICA DE BÚSQUEDA ---
        const seasonIndex = getCurrentSeasonIndex();
        const currentSeason = seasons[seasonIndex];
        const seasonLoot = forageItems[currentSeason.displayName];

        if (Math.random() < 0.8) { // 80% de probabilidad de encontrar algo
            // ¡Éxito!
            const seasonLoot = forageItems[currentSeason.displayName];
            const isRare = Math.random() > 0.85; // 15% de probabilidad
            const foundItem = isRare 
                ? seasonLoot.rare[Math.floor(Math.random() * seasonLoot.rare.length)]
                : seasonLoot.common[Math.floor(Math.random() * seasonLoot.common.length)];

             // Decidir la calidad del objeto
            const qualityRoll = Math.random();
            let qualityEmoji = '';
            let qualityColor = 0x58D68D; // Verde por defecto
            let qualityName = 'normal'; // Guardamos el nombre de la calidad

            if (qualityRoll > 0.99) {
                qualityEmoji = '🌟';
                qualityColor = 0x9B59B6;
                qualityName = 'iridio'; // ¡Es iridio!
            } else if (qualityRoll > 0.9) {
                qualityEmoji = '⭐';
                qualityColor = 0xF1C40F;
                qualityName = 'oro';
            } else if (qualityRoll > 0.7) {
                qualityEmoji = '✨';
                qualityColor = 0xAAB7B8;
                qualityName = 'plata';
            }

             // Decidir la cantidad
            const quantity = Math.floor(Math.random() * 3) + 1;
            const itemEmoji = itemEmojis[foundItem] || '❔';


            // --- PASO 2: ELEGIR EL TÍTULO BASADO EN EL BOTÍN ---

            let titleText = '¡Un pequeño hallazgo!'; // Título por defecto

            if (qualityName === 'iridio') {
                titleText = '¡¡¡UN PREMIO GORDO!!!'; // ¡El título más emocionante para el mejor botín!
            } else if (isRare && qualityName === 'oro') {
                titleText = '¡Un tesoro legendario!'; // Raro Y de buena calidad
            } else if (isRare && qualityName === 'plata') {
                titleText = '¡Un hallazgo brillante y raro!'; // Raro pero de calidad normal
            } else if (isRare) {
                titleText = '¡Un objeto curioso y raro!';
            } else if (qualityName === 'oro') {
                titleText = '¡Brilla como el sol!'; // Común pero de calidad oro
            } else if (qualityName === 'plata') {
                titleText = '¡Reluce con elegancia!';
            }

            const newItem = {
                name: foundItem,
                quantity: quantity,
                quality: qualityName as 'normal' | 'plata' | 'oro' | 'iridio'
            };

            addItem(interaction.user.id, newItem); // Añadimos el objeto al inventario del usuario
            
            // --- PASO 3: CONSTRUIR Y ENVIAR EL EMBED ---
    
            const embed = new EmbedBuilder()
                .setColor(qualityColor)
                .setTitle(titleText) // Usamos nuestro nuevo título dinámico
                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                .setDescription(`¡*Bip-bop*! ¡El Junimo ha encontrado **${quantity}x ${foundItem}** ${itemEmoji} ${qualityEmoji} (${qualityName})!`)
                .setFooter({ text: `Recolectado en ${currentSeason.name}` });

            await interaction.reply({ embeds: [embed] });
 
        } else {
            // Fracaso
            const embed = new EmbedBuilder()
                .setColor(0xAFB4B8)
                .setTitle('¡No hubo suerte!')
                .setDescription('¡Oh! El Junimo ha buscado por todas partes pero no ha encontrado nada esta vez. ¡Inténtalo de nuevo más tarde!');
            
            await interaction.reply({ embeds: [embed] });
        }
    },
};
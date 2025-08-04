// src/events/messageCreate.ts

import { Events, Message } from 'discord.js';
import { getCurrentSeasonIndex } from '../utils/updatePresence.js';
import { seasons } from '../config/seasons.js';

export default {
    name: Events.MessageCreate,
    async execute(message: Message) {
        if (message.author.bot) return;

        if (message.content.toLowerCase() === 'pat pat') {
            const seasonIndex = getCurrentSeasonIndex();
            const currentSeason = seasons[seasonIndex];
            const respuestasEstacionales = currentSeason.patpatResponses;
            const respuestasCariñosas = [
                '¡Mip mip! (*El Junimo te da un saltito de felicidad.*)',
                '¡Aunque sea un bot igual me gustan los pat pats!',
                '(*El Junimo gira en círculos de emoción.*) 💫',
                '¡Bip-bop! (*Te da un pequeño golpecito con su cabeza como agradecimiento.*)',
                '¡Chirp chirp! (*Te canta un mini tonito de gratitud*)',
            ];

            const todasLasRespuestas = [...respuestasCariñosas, ...respuestasEstacionales];
            const respuesta = todasLasRespuestas[Math.floor(Math.random() * todasLasRespuestas.length)];
            
            try {
                await message.reply(respuesta);
            } catch (error) {
                console.error("No se pudo responder al 'pat pat':", error);
            }
        }
    },
};
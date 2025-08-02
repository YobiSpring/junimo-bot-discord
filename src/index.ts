// src/index.ts
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Client, Events, GatewayIntentBits, Collection, MessageFlags, Interaction } from 'discord.js';
import { updatePresence, getCurrentSeasonIndex } from './utils/updatePresence.js';
import { seasons } from './config/seasons.js';
import { deleteInventory } from './utils/inventoryManager.js';     



// --- INICIO DE LA CONFIGURACIÓN DEL BOT ---
const token = process.env.DISCORD_TOKEN;
if (!token) throw new Error("No se encontró el token en el archivo .env.");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, // Solo necesitamos 'Guilds' para comandos de barra
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent, // Necesario para leer el contenido de los mensajes
    ]
});

// --- CARGADOR DINÁMICO DE COMANDOS ---
// Creamos una 'Collection' (un mapa mejorado) para guardar nuestros comandos.
client.commands = new Collection();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const fileUrl = pathToFileURL(filePath);
    const command = (await import(fileUrl.href)).default;

    // Guardamos cada comando en la Collection, usando su nombre como clave.
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[ADVERTENCIA] El comando en ${filePath} no tiene "data" o "execute".`);
    }
}

// Declaración para que TypeScript sepa que 'commands' existe en client
declare module "discord.js" {
    export interface Client {
        commands: Collection<unknown, any>
    }
}

// --- EVENTO PRINCIPAL: EL BOT ESTÁ LISTO ---
client.once(Events.ClientReady, async (readyClient) => {
    console.log(`¡Junimo listo! Conectado como ${readyClient.user.tag}`);
    
    // Actualiza la presencia al iniciar
    await updatePresence(readyClient);
    
    // Y la actualiza periódicamente (cada 6 horas)
    setInterval(() => updatePresence(readyClient), 1000 * 60 * 60 * 6);
});

// --- EVENTO DE INTERACCIÓN: EL BOT ESCUCHA LOS COMANDOS ---
client.on(Events.InteractionCreate, async interaction => {
    // Manejador para comandos de barra
    if (interaction.isChatInputCommand()) {
        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) {
            console.error(`No se encontró el comando ${interaction.commandName}.`);
            return;
        }
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '¡Oh no! Algo salió mal.', flags: [MessageFlags.Ephemeral] });
        }
        return;
    }

    // Manejador para botones
    if (interaction.isButton()) {
        const userId = interaction.user.id;
        
        // Lógica para los botones de borrado
        if (interaction.customId === 'confirm_delete_inv') {
            deleteInventory(userId);
            await interaction.update({ 
                content: '✅ ¡Tu inventario ha sido borrado exitosamente!',
                embeds: [],
                components: [] // Quitamos los botones
            });
        } else if (interaction.customId === 'cancel_delete_inv') {
            await interaction.update({
                content: '👍 Operación cancelada. Tu inventario está a salvo.',
                embeds: [],
                components: []
            });
        }
        return;
    }
});

client.on(Events.MessageCreate, async message => {
    // 1. Evitar bucles infinitos: ¡No respondas a tus propios mensajes ni a los de otros bots!
    if (message.author.bot) return;

    // 2. Comprobamos si el contenido del mensaje es exactamente "pat pat" (ignorando mayúsculas/minúsculas).
    if (message.content.toLowerCase() === 'pat pat') {

        // 1. Obtenemos la estación actual.
        const seasonIndex = getCurrentSeasonIndex();
        const currentSeason = seasons[seasonIndex];

        // 2. Obtenemos la LISTA de respuestas únicas de esa estación.
        const respuestasEstacionales = currentSeason.patpatResponses; 
        
        // 3. Preparamos una lista de respuestas cariñosas para que no sea siempre la misma.
        const respuestasCariñosas = [
            '¡Mip mip! (*El Junimo te da un saltito de felicidad.*)',
            '¡Aunque sea un bot igual me gustan los pat pats!',
            '(*El Junimo gira en círculos de emoción.*) 💫',
            '¡Bip-bop! (*Te da un pequeño golpecito con su cabeza como agradecimiento.*)',
            '¡Chirp chirp! (*Te canta un mini tonito de gratitud*)',
        ];

        // 4. Elegimos una respuesta al azar de la lista.
        const todasLasRespuestas = [...respuestasCariñosas, ...respuestasEstacionales];
       
        const respuesta = todasLasRespuestas[Math.floor(Math.random() * todasLasRespuestas.length)];

    

        // 5. Enviamos la respuesta. Usamos .reply() para que se vea como una contestación directa.
        try {
            await message.reply(respuesta);
        } catch (error) {
            console.error("No se pudo responder al 'pat pat':", error);
        }
    }
});

// --- INICIAR SESIÓN ---
client.login(token);
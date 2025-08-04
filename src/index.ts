// src/index.ts 

import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Client, GatewayIntentBits, Collection, ChatInputCommandInteraction, AutocompleteInteraction, SlashCommandBuilder } from 'discord.js';


export interface Command {
    data: any; 
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
    autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;
}

declare module "discord.js" {
    export interface Client {
        commands: Collection<string, Command>
    }
}

const token = process.env.DISCORD_TOKEN;
if (!token) {
    throw new Error("¡No se encontró DISCORD_TOKEN en el archivo .env!");
}

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ] 
});

client.commands = new Collection();


const __dirname = path.dirname(fileURLToPath(import.meta.url));
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));

console.log('Cargando comandos...');
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const fileUrl = pathToFileURL(filePath);
    const command = (await import(fileUrl.href)).default;

    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        console.log(`[✔] Comando cargado: ${command.data.name}`);
    } else {
        console.log(`[❌] ADVERTENCIA: El comando en ${filePath} no tiene "data" o "execute".`);
    }
}


const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.ts'));

console.log('Cargando eventos...');
for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const fileUrl = pathToFileURL(filePath);
    const event = (await import(fileUrl.href)).default;

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
    console.log(`[✔] Evento cargado: ${event.name}`);
}

client.login(token);
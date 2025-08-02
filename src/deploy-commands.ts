// src/deploy-commands.ts
import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const token = process.env.DISCORD_TOKEN!;
const clientId = process.env.CLIENT_ID!;
const guildId = process.env.GUILD_ID!; // El ID de tu servidor de pruebas

const commands = [];
// Esta lógica es para encontrar la carpeta 'commands' de forma segura
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));

console.log('Cargando archivos de comandos...');

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const fileUrl = pathToFileURL(filePath);

    try {
        const command = (await import(fileUrl.href)).default;
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
            console.log(`[✔] Comando cargado: ${command.data.name}`);
        } else {
            console.log(`[❌] ADVERTENCIA: El comando en ${filePath} no tiene "data" o "execute".`);
        }
    } catch (error) {
        console.error(`[❌] ERROR al cargar el comando en ${filePath}:`, error);
    }
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log(`\nEmpezando a registrar ${commands.length} comandos (/) en tu servidor de pruebas.`);

        const data = await rest.put(
            // Esto asegura que los comandos solo se registren en tu servidor de pruebas
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log(`\n¡Éxito! Se han registrado ${(data as any[]).length} comandos.`);
    } catch (error) {
        console.error('\nHubo un error al registrar los comandos:', error);
    }
})();
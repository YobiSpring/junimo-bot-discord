// src/utils/inventoryManager.ts (VERSIÓN CON VENTA ATÓMICA)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { basePrices, qualityMultipliers } from '../config/prices.js'; // ¡Importamos los precios aquí!

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const inventoryPath = path.join(__dirname, '..', '..', 'inventories.json');

// ... (las interfaces UserData, InventoryItem y Database no cambian) ...
interface InventoryItem {
    name: string;
    quantity: number;
    quality: 'normal' | 'plata' | 'oro' | 'iridio';
}
interface UserData {
    money: number;
    items: InventoryItem[];
}
type Database = Record<string, UserData>;


// Las funciones load/save/ensureUser no cambian...
function loadDatabase(): Database {
    try {
        if (fs.existsSync(inventoryPath)) {
            const data = fs.readFileSync(inventoryPath, 'utf-8');
            return data ? JSON.parse(data) : {};
        }
    } catch (error) { console.error("Error al cargar la base de datos:", error); }
    return {};
}
function saveDatabase(db: Database) {
    try {
        fs.writeFileSync(inventoryPath, JSON.stringify(db, null, 2));
    } catch (error) { console.error("Error al guardar la base de datos:", error); }
}
function ensureUser(db: Database, userId: string) {
    if (!db[userId]) {
        db[userId] = { money: 0, items: [] };
    }
}


// --- ¡LA NUEVA FUNCIÓN MÁGICA! ---
export function sellItem(userId: string, itemName: string, quality: InventoryItem['quality'], quantity: number): { success: boolean, moneyGained: number } {
    const db = loadDatabase();
    ensureUser(db, userId);

    const userInventory = db[userId].items;
    const itemIndex = userInventory.findIndex(i => i.name === itemName && i.quality === quality);
    const price = basePrices[itemName];

    // 1. Verificamos si la venta es posible
    if (price && itemIndex > -1 && userInventory[itemIndex].quantity >= quantity) {
        // 2. Hacemos todos los cálculos
        const item = userInventory[itemIndex];
        const moneyGained = Math.floor(price * quantity * qualityMultipliers[quality]);

        // 3. Modificamos los datos
        item.quantity -= quantity;
        db[userId].money += moneyGained;

        // Si la cantidad llega a 0, eliminamos el objeto
        if (item.quantity === 0) {
            userInventory.splice(itemIndex, 1);
        }

        // 4. Guardamos la base de datos UNA SOLA VEZ
        saveDatabase(db);
        
        // 5. Devolvemos el resultado completo
        return { success: true, moneyGained: moneyGained };
    }

    // Si algo falla, devolvemos un fracaso
    return { success: false, moneyGained: 0 };
}


// --- FUNCIONES ANTIGUAS Y ACTUALES ---
// addItem, getInventory, getMoney y deleteInventory no necesitan cambios.

export function addItem(userId: string, item: InventoryItem) {
    const db = loadDatabase();
    ensureUser(db, userId);
    const userInventory = db[userId].items;
    const existingItem = userInventory.find(i => i.name === item.name && i.quality === item.quality);
    if (existingItem) {
        existingItem.quantity += item.quantity;
    } else {
        userInventory.push(item);
    }
    saveDatabase(db);
}

export function getInventory(userId: string): InventoryItem[] {
    const db = loadDatabase();
    return db[userId]?.items || [];
}

export function getMoney(userId: string): number {
    const db = loadDatabase();
    return db[userId]?.money || 0;
}

export function deleteInventory(userId: string): boolean {
    const db = loadDatabase();
    if (db[userId]) {
        db[userId].items = [];
        saveDatabase(db);
        return true;
    }
    return false;
}
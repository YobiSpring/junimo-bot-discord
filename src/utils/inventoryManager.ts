// src/utils/inventoryManager.ts 

// --- Sección de Importaciones ---

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { basePrices, qualityMultipliers } from '../config/prices.js';
import { ShopItem } from '../config/shop.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, '../../database.json');

type Quality = 'normal' | 'plata' | 'oro' | 'iridio';

export interface Item {
    name: string;
    quality: Quality;
    quantity: number;
}

interface UserData {
    id: string;
    money: number;
    inventory: Item[];
    lastForageTimestamp?: number;
}

type Database = Record<string, UserData>;


function getDatabase(): Database {
    try {
        if (!fs.existsSync(dbPath)) {
            fs.writeFileSync(dbPath, JSON.stringify({}));
            return {};
        }
        const data = fs.readFileSync(dbPath, 'utf-8');
        return JSON.parse(data) || {};
    } catch (error) {
        console.error("Error al cargar la base de datos:", error);
        return {};
    }
}

function saveDatabase(db: Database) {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
    } catch (error) {
        console.error("Error al guardar la base de datos:", error);
    }
}


export function getUserData(userId: string): UserData {
    const db = getDatabase();
    if (!db[userId]) {
        return { id: userId, money: 0, inventory: [] };
    }
    return db[userId];
}

export function saveUserData(userId: string, data: UserData) {
    const db = getDatabase();
    db[userId] = data;
    saveDatabase(db);
}

export function addItem(userId: string, newItem: Item) {
    const userData = getUserData(userId);
    const existingItem = userData.inventory.find(item => item.name === newItem.name && item.quality === newItem.quality);

    if (existingItem) {
        existingItem.quantity += newItem.quantity;
    } else {
        userData.inventory.push(newItem);
    }
    
    saveUserData(userId, userData);
}

export function sellItem(userId: string, itemName: string, quality: Quality, quantity: number): { success: boolean, moneyGained: number, message: string } {
    const userData = getUserData(userId);
    const basePrice = basePrices[itemName];

    if (basePrice === undefined) {
        return { success: false, moneyGained: 0, message: `El objeto "${itemName}" no se puede vender.` };
    }
    const itemIndex = userData.inventory.findIndex(item => item.name === itemName && item.quality === quality);

    if (itemIndex === -1 || userData.inventory[itemIndex].quantity < quantity) {
        return { success: false, moneyGained: 0, message: `No tienes suficientes **${itemName} (${quality})**.` };
    }

    const moneyGained = Math.floor(basePrice * qualityMultipliers[quality] * quantity);
    
    userData.inventory[itemIndex].quantity -= quantity;
    if (userData.inventory[itemIndex].quantity <= 0) {
        userData.inventory.splice(itemIndex, 1);
    }
    userData.money += moneyGained;
    
    saveUserData(userId, userData); 
    
    return { success: true, moneyGained, message: `¡Vendido!` };
}

export function purchaseItem(userId: string, itemToBuy: ShopItem, quantity: number): { success: boolean, message: string } {
    const userData = getUserData(userId);
    const totalCost = itemToBuy.price * quantity;

    if (userData.money < totalCost) {
        return { success: false, message: `¡No tienes suficiente dinero! Te faltan **${totalCost - userData.money} G**.` };
    }

    userData.money -= totalCost;
    
    const newItem = { name: itemToBuy.name, quality: 'normal' as Quality, quantity };
    const existingItem = userData.inventory.find(item => item.name === newItem.name && item.quality === newItem.quality);
    if (existingItem) {
        existingItem.quantity += newItem.quantity;
    } else {
        userData.inventory.push(newItem);
    }
    
    saveUserData(userId, userData); 
    
    return { success: true, message: '¡Compra realizada con éxito!' };
}

export function getMoney(userId:string): number {
    return getUserData(userId).money;
}
export function getInventory(userId:string): Item[] {
    return getUserData(userId).inventory;
}

export function deleteInventory(userId: string): boolean {
    const userData = getUserData(userId);
    userData.inventory = [];
    userData.money = 0;
    saveUserData(userId, userData);
    return true;
}
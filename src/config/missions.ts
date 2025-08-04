// src/config/missions.ts (VERSIÓN ESTACIONAL)

export interface MissionTemplate {
    requester: string;
    dialogue: string;
    itemPool: string[];
    minReward: number;
    maxReward: number;
    missionType?: 'ANY_ONE';
    basketQuantity?: number;
}

// Ahora, en lugar de un solo array, tenemos un objeto que mapea cada estación a su propio array de misiones.
export const seasonalMissionTemplates: Record<string, MissionTemplate[]> = {
    primavera: [
        {
            requester: 'Evelyn',
            dialogue: '¡Oh, querido/a! Con la primavera, me encantaría plantar más flores en el jardín del pueblo. ¿Podrías traerme algo?',
            itemPool: ['Diente de Leon', 'Puerro', 'Narciso'],
            minReward: 200,
            maxReward: 400,
        },
        {
            requester: 'Caroline',
            dialogue: 'Estoy preparando una ensalada de primavera, pero me falta el ingrediente principal. ¡Te lo agradecería mucho!',
            itemPool: ['Puerro', 'Diente de Leon'],
            minReward: 250,
            maxReward: 450,
        }
    ],
    verano: [
        {
            requester: 'Gus',
            dialogue: '¡El Salón está a tope en verano! Estoy buscando ingredientes exóticos para un nuevo plato. ¿Tienes algo jugoso?',
            itemPool: ['Guisante Dulce', 'Fruto Especiado', 'Uva'],
            minReward: 350,
            maxReward: 600,
        },
        {
            requester: 'Demetrius',
            dialogue: 'Estoy estudiando la flora local de verano para mi investigación. ¿Podrías conseguirme un espécimen?',
            itemPool: ['Guisante Dulce', 'Helecho'],
            minReward: 400,
            maxReward: 700,
        }
    ],
    otono: [
        {
            requester: 'Lewis',
            dialogue: '¡Hola! Estoy preparando la sopa para el festival del Luau y necesito un ingrediente con sabor a hogar. ¿Podrías ayudarme?',
            itemPool: ['Seta Común', 'Avellana'],
            minReward: 300,
            maxReward: 550,
        },
        {
            requester: 'Linus',
            dialogue: 'El aire se vuelve frío... Necesito recolectar comida para el invierno. Cualquier cosa ayuda.',
            itemPool: ['Avellana', 'Mora', 'Seta Común'],
            minReward: 150,
            maxReward: 300,
        },
        {
            requester: 'Robin',
            dialogue: 'Estoy trabajando en un nuevo proyecto de carpintería y necesito algo de material del bosque. ¡Cualquiera de estos me vendría de perlas!',
            itemPool: ['Seta Común', 'Avellana', 'Mora'], // La "cesta" de opciones
            missionType: 'ANY_ONE', // ¡La marcamos como tipo "Cesta"!
            basketQuantity: 3,
            minReward: 600,
            maxReward: 800,
        }
    ],
    invierno: [
        {
            requester: 'Clint',
            dialogue: 'El invierno es largo y aburrido. ¡Estoy buscando gemas o minerales interesantes que encontrarías en la cueva de hielo!',
            itemPool: ['Raiz Invernal', 'Helecho'], // Usamos estos como sustitutos de gemas
            minReward: 400,
            maxReward: 800,
        },
        {
            requester: 'Wizard',
            dialogue: 'Necesito un catalizador imbuido con la esencia del invierno para un encantamiento... ¿Me traerías algo?',
            itemPool: ['Azafrán', 'Raíz Invernal'],
            minReward: 500,
            maxReward: 1000,
        }
    ]
};
import { Armament } from './items/armament.js';
import { Consumables } from './items/consumables.js';
import { Elementals } from './items/elementals.js';
import { Keys } from './items/keys.js';
import { Potions } from './items/potions.js';
import { Relics } from './items/relics.js';
import { Tools } from './items/tools.js';
import { Vehicles } from './items/vehicles.js';

export const Items = {
    ...Armament,
    ...Consumables,
    ...Elementals,
    ...Keys,
    ...Potions,
    ...Relics,
    ...Tools,
    ...Vehicles    
}
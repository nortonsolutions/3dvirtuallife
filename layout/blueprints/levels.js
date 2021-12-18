/**
 * LevelManager will keep track of layouts by level
 */
import {Entities} from './entities.js';
import {Items} from './items.js';
import {Structures} from './structures.js';

export const levels = [

    {
        level: 0,
        width: 8, //26
        length: 8, //26
        name: "In the valley of mist",
        background: 'clouds.png',
        terrain: {
            gltf: 'valley.gltf',
            scale: 100,
            fog: true,
            hemisphereLight: true,
            overheadPointLight: true
        },
        items: [
            Items.keyToShed,
            Items.smallSword
        ],
        structures: [
            Structures.shed,
            Structures.rock1,
            Structures.rock1,
            Structures.grate
        ],
        entities: [
            Entities.evilOne,
            Entities.evilOne,
            Entities.john

        ]
    },
    {
        level: 1,
        width: 29,
        length: 29,
        name: "In the dungeon",
        background: '',
        terrain: {
            gltf: 'dungeon.gltf',
            scale: 100,
            fog: false,
            hemisphereLight: false,
            overheadPointLight: true
        },
        items: [
            Items.bagOfGems
        ],
        structures: [
            Structures.ancientChest
        ],
        entities: [
            Entities.john,
            Entities.evilOne,
            Entities.evilOne
        ]
    }
 


]
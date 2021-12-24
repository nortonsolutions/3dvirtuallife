/**
 * LevelBuilder will keep track of layouts by level
 */
import {Entities} from './entities.js';
import {Items} from './items.js';
import {Structures} from './structures.js';

export const levels = [

    {
        level: 0,
        width: 12, //26
        length: 12, //26
        name: "In the valley of mist",
        background: 'clouds.png',
        terrain: {
            description: 'valley',
            gltf: 'valley.gltf',
            fog: true,
            fogColor: 'white',
            hemisphereLight: true,
            overheadPointLight: false,
            attributes: {
                scale: 100
            }

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


        ]
    },
    {
        level: 1,
        width: 32, //32
        length: 32,  //32
        name: "In the dungeon",
        background: '',
        terrain: {
            description: 'dungeon',
            gltf: 'dungeon.gltf',
            fog: true,
            fogColor: 'black',
            hemisphereLight: false,
            overheadPointLight: true,
            attributes: {
                scale: 100
            }
        },
        items: [
            Items.bagOfGems,
            Items.mace,
            Items.keyToChest
        ],
        structures: [
            Structures.ancientChest,
            Structures.archway
        ],
        entities: [
            Entities.john,
            Entities.evilOne,
            Entities.evilOne
        ]
    }
 


]
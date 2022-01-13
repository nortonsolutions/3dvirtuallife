/**
 * LevelBuilder will keep track of layouts by level
 */
import {Entities} from './entities.js';
import {Items} from './items.js';
import {Structures} from './structures.js';

export const levels = [

    {
        level: 0,
        width: 6, //26
        length: 6, //26
        name: "In the valley of mist",
        background: 'clouds.png',
        terrain: {
            name: 'floor',
            type: 'floor',
            description: 'valley',
            gltf: 'valley.glb',
            fog: true,
            fogColor: 'white',
            hemisphereLight: true,
            sunLight: true,
            overheadPointLight: false,
            attributes: {
                scale: 100
            }

        },
        items: [
            Items.keyToShed,
            Items.smallSword,
            Items.redpotion
        ],
        structures: [
            Structures.shed,
            Structures.rock1,
            Structures.rock1,
            Structures.grate
        ],
        entities: [
            Entities.john,
            Entities.evilOne,
            Entities.evilOne
        ]
    },
    {
        level: 1,
        width: 32, //32
        length: 32,  //32
        name: "In the dungeon",
        background: '',
        terrain: {
            name: 'floor',
            type: 'floor',
            description: 'dungeon',
            gltf: 'dungeon.glb',
            fog: true,
            fogColor: 'black',
            hemisphereLight: false,
            sunLight: false,
            overheadPointLight: true,
            attributes: {
                scale: 100
            }
        },
        items: [
            Items.bagOfGems,
            Items.mace,
            {...Items.torch, location: { x: 0, y: 0, z: 0}},
            {...Items.keyToChest, location: { x: 1, y: 0, z: 0 }}
        ],
        structures: [
            {...Structures.ancientChest, location: { x: 0, y: 0, z: -1 }},
            Structures.archway0,
            Structures.archway2,
        ],
        entities: [
            Entities.john,
            Entities.evilOne,
            Entities.evilOne,
            Entities.rat,
            Entities.rat

        ]
    },
    {
        level: 2,
        width: 45, //32
        length: 45,  //32
        name: "Catacomb",
        background: '',
        terrain: {
            name: 'floor',
            type: 'floor',
            description: 'catacomb',
            gltf: 'catacomb.glb',
            fog: true,
            fogColor: 'black',
            hemisphereLight: false,
            sunLight: false,
            overheadPointLight: true,
            attributes: {
                scale: 100
            }
        },
        items: [
            {...Items.crystalBall, location: { x: 10, y: 0, z: 0 }}
        ],
        structures: [
            Structures.archway1
        ],
        entities: [
            {...Entities.rat, location: { x: 10, y: 0, z: 0 }}
        ]
    }
 


]
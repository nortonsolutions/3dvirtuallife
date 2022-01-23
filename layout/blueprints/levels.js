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
            attributes: {
                scale: 100,
                borderTrees: true,
                light: {
                    sunLight: true,
                    overheadPointLight: false,
                },
                fog: {
                    color: 'white',
                    density: 1
                }
            }

        },
        items: [
            Items.keyToShed,
            Items.smallSword,
            Items.redpotion,
            Items.greenpotion,
            Items.crystalBall,
            Items.gold3,
            Items.bagOfGems,
            Items.gold25,
            Items.gold10,
            Items.gold3,
            Items.bow,
            {...Items.arrow25, location: { x: 0, y: 0, z: 0}}
        ],
        structures: [
            Structures.shed,
            Structures.rock1,
            Structures.rock1,
            Structures.grate,
            Structures.swampPortal
        ],
        entities: [
            Entities.john,
            Entities.evilOne,
            Entities.shopkeep
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
            attributes: {
                scale: 100,
                light: {
                    sunLight: false,
                    overheadPointLight: true,
                },
                fog: {
                    color: 'black',
                    density: 1
                }
            }
        },
        items: [
            Items.bagOfGems,
            Items.mace,
            Items.bluepotion,
            Items.busterbuckler,
            {...Items.torch, location: { x: 0, y: 0, z: 0}},
            {...Items.keyToChest, location: { x: 1, y: 0, z: 0 }},
            Items.gold3,
            Items.gold25,
            Items.gold1,
            Items.gold10,
            {...Items.arrow, location: { x: 0, y: 0, z: 0}}
        ],
        structures: [
            {...Structures.ancientChest, location: { x: 0, y: 0, z: -1 }},
            Structures.archway0,
            Structures.archway2
        ],
        entities: [
            Entities.john,
            Entities.evilOne,
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
            attributes: {
                scale: 100,
                light: {
                    sunLight: false,
                    overheadPointLight: true,
                },
                fog: {
                    color: 'black',
                    density: 1
                }
            }
        },
        items: [
            {...Items.crystalBall, location: { x: 10, y: 0, z: 0 }},
            {...Items.busterblade, location: { x: 0, y: 0, z: 0 }},
            {...Items.gold25, location: { x: 1, y: 0, z: -1 }}
        ],
        structures: [
            Structures.archway1,
            {...Structures.ancientChest2, location: { x: 10, y: 0, z: -1 }},

        ],
        entities: [
            {...Entities.rat, location: { x: 10, y: 0, z: 0 }}
        ]
    },
    {
        level: 3,
        width: 26, //26
        length: 26, //26
        name: "In the swamp",
        background: 'clouds.png',
        terrain: {
            name: 'floor',
            type: 'floor',
            description: 'swamp',
            gltf: 'swamp.glb',
            attributes: {
                scale: 100,
                borderTrees: true,
                light: {
                    sunLight: true,
                    overheadPointLight: false,
                },
                fog: {
                    color: 'darkgreen',
                    density: 2
                },
                water: {
                    elevation: 0,
                    color: "green",
                    gltf: 'water.glb',
                    scale: 100
                }
            }
        },
        items: [

        ],
        structures: [
            Structures.swampToValley
        ],
        entities: [

        ]
    }
 
]
/**
 * LevelManager will keep track of layouts by level
 */
import {Entities} from './entities.js';
import {Items} from './items.js';
import {Structures} from './structures.js';

export const levels = [
    {
        level: 0,
        width: 8,
        height: 8,
        name: "Introduction",
        background: 'clouds.png',
        terrain: 'valley.gltf',

        items: [
            Items.keyToShed
        ],
        structures: [
            Structures.shed,
            Structures.rock1,
            Structures.rock1
        ],
        entities: [
            Entities.john,
            Entities.evilOne,
            Entities.evilOne
        ]
    },
    {
        level: 1,
        width: 8,
        height: 8,
        name: "Through the Corridor",
        background: 'clouds.png',
        terrain: 'valley1.gltf',

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
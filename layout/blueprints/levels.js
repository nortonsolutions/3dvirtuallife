/**
 * LevelManager will keep track of layouts by level
 */
import {Size,Color,Entity} from './constants.js'

export const levels = [
    {
        level: 0,
        width: 8,
        height: 8,
        name: "Introduction",
        background: 'clouds.png',
        terrain: 'valley',

        items: [
            {
                name: 'keyToShed',
                gltf: 'key',
                description: 'A rusty old key with faint engravings',
                type: 'key',
                attributes: {
                    scale: .1,
                    elevation: 0
                }
            }
        ],
        structures: [
            {
                name: 'shed',
                gltf: 'sceneHouse',
                description: 'Wooden Shed with a locked door',
                type: 'building',
                location: { x: 0, y: 0, z: 0},
                attributes: {
                    key: 'keyToShed',
                    scale: 1,
                    elevation: 0,
                    routeToLevel: 1
                }
            },
            {
                name: 'rock1',
                gltf: 'rock1',
                description: 'Standard rock',
                type: 'rock',
                attributes: {
                    scale: 1,
                    elevation: 0
                }
            }
        ],
        entities: [
            {
                name: 'john',
                gltf: 'john',
                description: 'A strappling middle-aged man with a friendly face',
                type: 'man',
                attributes: {
                    scale: 1,
                    elevation: 0,
                    conversation: [],
                    offers: [],
                    accepts: []
                }
            },
            Entity.evilOne,
            Entity.evilOne

        ]
    },
    {
        level: 1,
        width: 4,
        height: 4,
        name: "Inside the Shed",
        background: 'chamber.jpg',
        terrain: 'valley1',

        items: [
            {
                name: 'bagOfGems',
                gltf: 'blueball',
                description: 'A small velvet bag full of gems',
                type: 'gems',
                attributes: {
                    color: Color.multicolored,
                    size: Size.small
                }
            }
        ],
        structures: [
            {
                name: 'ancientChest',
                gltf: 'sceneHouse',
                description: 'An old but sturdy wooden chest',
                type: 'chest',
                attributes: {
                    color: Color.bronze,
                    contentItems: [
                        {
                            name: 'smallSword',
                            description: 'A slender metallic blade, strong yet flexible',
                            type: 'sword',
                            properties: {
                                color: Color.silver,
                                size: Size.small
                            } 
                        }
                    ]
                }
            }
        ]
    }
]
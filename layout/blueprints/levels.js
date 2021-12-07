/**
 * LevelManager will keep track of layouts by level
 */
import {Size,Color,Entity} from './constants.js'

export const levels = [
    {
        level: 0,
        width: 4,
        height: 4,
        name: "Introduction",
        background: 'clouds.png',

        self: {

        },
        items: [
            {
                name: 'keyToShed',
                gltf: 'blueball',
                description: 'A rusty old key with faint engravings',
                type: 'key',
                attributes: {
                    color: Color.bronze,
                    size: Size.small
                }
            }
        ],
        structures: [
            {
                name: 'shed',
                gltf: 'sceneHouse',
                description: 'Wooden Shed with a locked door',
                type: 'building',
                attributes: {
                    color: Color.brown,
                    key: 'Rusty Old Key',
                    routeToLevel: 1
                }
            }
        ],
        entities: [
            {
                name: 'john',
                gltf: 'greenball',
                description: 'A strappling middle-aged man with a friendly face',
                type: 'man',
                attributes: {
                    size: Size.medium,
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
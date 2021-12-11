import {Items} from './items.js'

export const Structures = {
    
    shed: {
        name: 'shed',
        gltf: 'sceneHouse',
        description: 'Wooden Shed with a locked door',
        type: 'structure',
        location: { x: 0, y: 0, z: 0},
        attributes: {
            key: 'keyToShed',
            scale: 1,
            elevation: 0,
            routeToLevel: 1
        }
    
    },

    rock1: {
        name: 'rock1',
        gltf: 'rock1',
        description: 'Standard rock',
        type: 'structure',
        attributes: {
            scale: 1,
            elevation: 0
        }
    },
    
    ancientChest: {
        name: 'ancientChest',
        gltf: 'sceneHouse',
        description: 'An old but sturdy wooden chest',
        type: 'structure',
        attributes: {
            contentItems: [
                Items.smallSword
            ]
        }
    }
}


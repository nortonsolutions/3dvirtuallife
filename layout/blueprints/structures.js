import {Items} from './items.js'

export const Structures = {
    
    shed: {
        name: 'shed',
        gltf: 'sceneHouse.gltf',
        description: 'Wooden Shed with a locked door',
        type: 'structure',
        location: { x: 0, y: 0, z: 0},
        attributes: {
            animates: false,
            scale: 1,
            elevation: 0,
        }
    
    },

    grate: {
        name: 'grate',
        gltf: 'grate.gltf',
        description: 'Locked rusty iron grate',
        type: 'structure',
        attributes: {
            animates: true,
            key: 'keyToShed',
            scale: 10,
            elevation: 1,
            routeToLevel: 1
        }
    
    },

    rock1: {
        name: 'rock1',
        gltf: 'rock1.gltf',
        description: 'Standard rock',
        type: 'structure',
        attributes: {
            animates: false,
            scale: 1,
            elevation: 0
        }
    },
    
    ancientChest: {
        name: 'ancientChest',
        gltf: 'sceneHouse.gltf',
        description: 'An old but sturdy wooden chest',
        type: 'structure',
        attributes: {
            animates: true,
            contentItems: [
                Items.smallSword
            ]
        }
    }
}


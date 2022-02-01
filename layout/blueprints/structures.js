import {Items} from './items.js'

export const Structures = {
    
    shed: {
        name: 'shed',
        gltf: 'sceneHouse.glb',
        description: 'Wooden Shed with a locked door',
        type: 'structure',
        attributes: {
            animates: false,
            scale: 100,
            elevation: -6,
            sprites: [{ 
                name: "Fount",
                regex: "fount",
                frames: 10,
                scale: 5,
                elevation: 1,
                flip: false
            }]
        }
    
    },

    tavern: {
        name: 'tavern',
        gltf: 'tavern.glb',
        description: 'Old-fashioned tavern and shop',
        type: 'structure',
        attributes: {
            animates: false,
            scale: 20,
            elevation: 0
            // sprites: [{ 
            //     name: "Fount",
            //     regex: "fount",
            //     frames: 10,
            //     scale: 5,
            //     elevation: 1,
            //     flip: false
            // }]
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
            scale: 100,
            elevation: 0,
            unlocked: false,
        }
    
    },

    portal: {
        name: 'swampPortal',
        gltf: 'grate.gltf',
        description: 'Portal to swamp',
        type: 'structure',
        attributes: {
            visible: false,
            animates: false,
            scale: 200,
            elevation: -20,
            unlocked: true,
        }
    },
    
    archway: {
        name: 'archway',
        gltf: 'archway.gltf',
        description: 'Dark gothic archway',
        type: 'structure',
        attributes: {
            animates: false,
            scale: 100,
            elevation: 1,
            unlocked: true
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

    tree1: {
        name: 'tree1',
        gltf: 'tree.glb',
        description: 'Standard tree',
        type: 'structure',
        attributes: {
            animates: false,
            scale: 100,
            elevation: 0
        }
    },
    
    ancientChest: {
        name: 'ancientChest',
        gltf: 'chest.glb',
        description: 'An old but sturdy wooden chest',
        type: 'structure',
        attributes: {
            scale: 60,
            elevation: 0,
            animates: true,
            unlocked: false,
        }
    }
}


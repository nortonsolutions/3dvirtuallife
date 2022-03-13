export const Structures = {
    
    shed: {
        name: 'shed',
        gltf: 'sceneHouse.glb',
        description: 'Mighty regal castle',
        type: 'structure',
        attributes: {
            animates: true,
            position: "down",
            scale: 100,
            elevation: -6,
            sprites: [{ 
                name: "Fount",
                regex: "fount",
                frames: 10,
                scale: 5,
                elevation: 1,
                flip: false,
                animates: true,
                showOnSeed: true
            }]
        }
    
    },

    bridge: {
        name: 'bridge',
        gltf: 'bridge.glb',
        description: 'Sturdy bridge',
        type: 'structure',
        attributes: {
            transparentWindows: true,
            animates: false,
            scale: 120,
            elevation: -90,
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
        }
    
    },

    grate: {
        name: 'grate',
        gltf: 'grate.gltf',
        description: 'Rusty iron grate',
        type: 'structure',
        attributes: {
            defaultSingleAction: true,
            animates: true,
            key: 'keyToShed',
            scale: 100,
            elevation: 0,
            locked: true,
            position: "down"
        }
    
    },

    kingdomGate: {
        name: 'kingdomGate',
        gltf: 'kingdomGate.glb',
        description: 'Large Gate',
        type: 'structure',
        attributes: {
            animates: true,
            scale: 200,
            elevation: 0,
            key: 'passphrase', // switch to passphrase
            locked: true, // lock and require password
            position: "down"
        }
    
    },

    platformWood: {
        name: 'platformWood',
        gltf: 'platformWood.glb',
        description: 'Platform',
        type: 'structure',
        attributes: {
            scale: 100,
            elevation: 0
        }
    },

    platformBlock: {
        name: 'platformBlock',
        gltf: 'platformBlock.glb',
        description: 'Platform',
        type: 'structure',
        attributes: {
            scale: 100,
            elevation: 0
        }
    },

    firesteedAltar: {
        name: 'firesteedAltar',
        gltf: 'firesteedAltar.glb',
        description: 'Strange altar in the lava field',
        type: 'structure',
        attributes: {
            scale: 100,
            elevation: 0,
            sprites: [{ 
                name: 'flame',  
                regex: "sconce",
                frames: 40,
                scale: 2.5,
                elevation: -.5,
                flip: true,
                animates: true,
                showOnSeed: false
            }],
            keyCode: 'firesteedAltar',
            locked: true
        }
    },

    elevatorL_1m: {
        name: 'elevatorL_1m',
        gltf: 'elevatorL_1m.glb',
        description: 'Elevator',
        type: 'structure',
        attributes: {
            animates: true,
            scale: 200,
            elevation: 0,
            position: "down"
        }
    },

    elevatorS_1m: {
        name: 'elevatorS_1m',
        gltf: 'elevatorS_1m.glb',
        description: 'Elevator',
        type: 'structure',
        attributes: {
            animates: true,
            scale: 200,
            elevation: 0,
            position: "down"
        }
    },

    elevatorL_4m: {
        name: 'elevatorL_4m',
        gltf: 'elevatorL_4m.glb',
        description: 'Elevator',
        type: 'structure',
        attributes: {
            animates: true,
            scale: 200,
            elevation: -5,
            position: "down"
        }
    },

    elevatorS_4m: {
        name: 'elevatorS_4m',
        gltf: 'elevatorS_4m.glb',
        description: 'Elevator',
        type: 'structure',
        attributes: {
            animates: true,
            scale: 200,
            elevation: -5,
            position: "down"
        }
    },

    elevatorL_6m: {
        name: 'elevatorL_6m',
        gltf: 'elevatorL_6m.glb',
        description: 'Elevator',
        type: 'structure',
        attributes: {
            animates: true,
            scale: 200,
            elevation: -5,
            position: "down"
        }
    },

    elevatorS_6m: {
        name: 'elevatorS_6m',
        gltf: 'elevatorS_6m.glb',
        description: 'Elevator',
        type: 'structure',
        attributes: {
            animates: true,
            scale: 200,
            elevation: -5,
            position: "down"
        }
    },

    tavernShop: {
        name: 'tavernShop',
        gltf: 'tavernShop2.glb',
        description: 'Tavern and shop',
        type: 'structure',
        attributes: {
            transparentWindows: true,
            animates: true,
            scale: 35,
            elevation: 0 
        }
    
    },

    vikingShop: {
        name: 'vikingShop',
        gltf: 'vikingShop.glb',
        description: 'Humble abode of a troubled family',
        type: 'structure',
        attributes: {
            animates: true,
            transparentWindows: true,
            scale: 30,
            elevation: 0,
            sprites: [{ 
                name: "fireplace",
                regex: "fireplace",
                frames: 8,
                scale: 16,
                elevation: 1,
                flip: false,
                animates: true,
                showOnSeed: true
            }] 
        }
    
    },

    ricketyPlatform: {
        name: 'ricketyPlatform',
        gltf: 'ricketyPlatform.glb',
        description: 'Rickety Platform',
        type: 'structure',
        attributes: {
            animates: false,
            scale: 30,
            elevation: 0
        }
    },

    lever: {
        name: 'lever',
        gltf: 'lever.glb',
        description: 'Control switch',
        type: 'structure',
        attributes: {
            defaultSingleAction: true,
            animates: true,
            scale: 100,
            elevation: 0,
            position: "down"
        }
    
    },

    leverTristate: {
        name: 'leverTristate',
        gltf: 'leverTristate.glb',
        description: 'Tristate Control switch',
        type: 'structure',
        attributes: {
            animates: true,
            scale: 100,
            elevation: 0,
            position: "middle"
        }
    
    },



    portal: {
        name: 'portal',
        gltf: 'portal.glb',
        description: 'Portal',
        type: 'structure',
        attributes: {
            visible: false,
            animates: false,
            scale: 40,
            elevation: 0,
        }
    },
    
    portalStone: {
        name: 'portalStone',
        gltf: 'platformBlock.glb',
        description: 'Portal',
        type: 'structure',
        attributes: {
            visible: false,
            animates: false,
            scale: 40,
            elevation: 0,
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

    cart: {
        name: 'cart',
        gltf: 'cart.glb',
        description: 'Old Cart',
        type: 'structure',
        attributes: {
            animates: false,
            scale: 10,
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
            locked: true,
            position: "down"
        }
    },

    houseLarge: {
        name: 'houseLarge',
        gltf: 'houseLarge2.glb',
        image: 'houseLarge.png',
        description: 'Large house',
        type: 'structure',
        attributes: {
            transparentWindows: true,
            animates: true,
            scale: 140,
            elevation: 0,
            sprites: [{ 
                name: "fireplace",
                regex: "fireplace",
                frames: 8,
                scale: 16,
                elevation: 1,
                flip: false,
                animates: true,
                showOnSeed: true
            }],
            animations: 'DoorAction/2/2/1/autorestore/false',
            locked: true
        }
    
    },

    houseMedium: {
        name: 'houseMedium',
        gltf: 'houseMedium.glb',
        image: 'houseMedium.png',
        description: 'Medium house',
        type: 'structure',
        attributes: {
            transparentWindows: true,
            animates: true,
            scale: 140,
            elevation: 0,
            sprites: [{ 
                name: "fireplace",
                regex: "fireplace",
                frames: 8,
                scale: 16,
                elevation: 1,
                flip: false,
                animates: true,
                showOnSeed: true
            }],
            animations: 'DoorAction/2/2/1/autorestore/false',
            locked: true
        }
    
    },

    houseSmall: {
        name: 'houseSmall',
        gltf: 'houseSmall.glb',
        image: 'houseSmall.png',
        description: 'Large house',
        type: 'structure',
        attributes: {
            transparentWindows: true,
            animates: true,
            scale: 140,
            elevation: 0,
            sprites: [{ 
                name: "fireplace",
                regex: "fireplace",
                frames: 8,
                scale: 16,
                elevation: 1,
                flip: false,
                animates: true,
                showOnSeed: true
            }],
            animations: 'DoorAction/2/2/1/autorestore/false',
            locked: true
        }
    
    }
}


/**
 * LevelBuilder will keep track of layouts by level
 */

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
            { name: "keyToShed" },
            { name: "smallSword" },
            { name: "redpotion" },
            { name: "greenpotion" },
            { name: "crystalBall" },
            { name: "gold3" },
            { name: "bagOfGems" },
            { name: "bow" },
            { name: "arrow25" },
            { name: "orb" },
            { name: "helmet" }

        ],
        structures: [
            { name: "shed", location: { x: 0, y: 0, z: 0} },
            { name: "rock1" },
            { name: "rock1" },
            { 
                name: "grate", location: { x: 3, y: 0, z: 4}, 
                attributes: { routeTo: { level: 1, location: { x: 16, y: 0, z: 4 } } } 
            },
            { 
                name: "portal", location: { x: 19.5, y: 0, z: -6.5}, 
                attributes: { routeTo: { level: 3, location: { x: -18.0, y: 0, z: -6.5 } } } 
            }
        ],
        entities: [
            { name: "john" },
            { name: "evilOne" },
            { name: "shopkeep" },
            { name: "rosenBot" }
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
            { name: "bagOfGems" },
            { name: "mace" },
            { name: "bluepotion" },
            { name: "busterbuckler" },
            { name: "torch", location: { x: 0, y: 0, z: 0}},
            { name: "keyToChest", location: { x: 1, y: 0, z: 0 }},
            { name: "gold3" },
            { name: "gold25" },
            { name: "gold1" },
            { name: "gold10" },
            { name: "arrow", location: { x: 0, y: 0, z: 0}}
        ],
        structures: [
            { 
                name: "ancientChest", location: { x: 0, y: 0, z: -1 },
                attributes: { key: 'keyToChest', contentItems: [ "bagOfGems" ] }
            },
            { 
                name: "archway", location: { x: 16, y: 0, z: 4 },
                attributes: { routeTo: { level: 0, location: { x: 3, y: 0, z: 4} } } 
            },
            { 
                name: "archway", location: { x: 16, y: 0, z: -4 },
                attributes: { routeTo: { level: 2, location: { x: 0, y: 0, z: 0} } } 
            }
        ],
        entities: [
            { name: "john" },
            { name: "evilOne" },
            { name: "evilOne" },
            { name: "evilOne" },
            { name: "rat" },
            { name: "rat" }

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
            { name: "crystalBall", location: { x: 10, y: 0, z: 0 }},
            { name: "busterblade", location: { x: 0, y: 0, z: 0 }},
            { name: "gold25", location: { x: 1, y: 0, z: -1 }}
        ],
        structures: [
            { 
                name: "archway", location: { x: 1, y: 0, z: 0},
                attributes: { routeTo: { level: 1, location: { x: 16, y: 0, z: -4 } } }
            },
            { 
                name: "ancientChest", location: { x: 10, y: 0, z: -1 },
                attributes: { key: 'keyToChest2', contentItems: [ "orb" ] }
            }

        ],
        entities: [
            { name: "rat", location: { x: 10, y: 0, z: 0 }}
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
            { 
                name: "portal", location: { x: -21.5, y: 0, z: -6.5},
                attributes: { routeTo: { level: 0, location: { x: 19.5, y: 0, z: -6.5 } } } 
            }
        ],
        entities: [

        ]
    }
 
]
/**
 * LevelBuilder will keep track of layouts by level
 */

export const levels = [

    {
        level: 0,
        width: 26, //26
        length: 26, //26
        description: "Valley of Mist",
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
            { name: "lightSaber", location: { x: -1, y: 0, z: -1} },
            { name: "keyToShed", location: { x: -1, y: 0, z: -1} },
            { name: "smallSword", location: { x: -1, y: 0, z: -1} },
            { name: "redpotion" },
            { name: "blackpotion" },
            { name: "gold3" },
            { name: "bagOfGems" },
            { name: "bow" },
            { name: "arrow25" },
        ],
        structures: [
            { name: "shed", location: { x: 0, y: 0, z: 0} },
            
            { name: "rock1" },
            { 
                name: "grate", location: { x: 3, y: 0, z: 4}, 
                attributes: { routeTo: { level: 1, location: { x: 16, y: 0, z: 4 } } } 
            },
            { 
                name: "portal", location: { x: 19.5, y: 0, z: -6.5}, 
                attributes: { routeTo: { level: 3, location: { x: -18.0, y: 0, z: -6.5 } } } 
            },
            { 
                name: "portal", location: { x: -19.5, y: 0, z: -6.5}, 
                attributes: { routeTo: { level: 4, location: { x: -18.0, y: 0, z: -6.5 } } } 
            },
            { 
                name: "portal", location: { x: -6.5, y: 0, z: -19.5}, 
                attributes: { routeTo: { level: 5, location: { x: -40.0, y: 0, z: -6.5 } } } 
            },
            { 
                name: "portal", location: { x: -6.5, y: 0, z: 19.5}, 
                attributes: { routeTo: { level: 6, location: { x: -18.0, y: 0, z: -6.5 } } } 
            }

        ],
        entities: [
            { name: "john" },
            { name: "evilOne" },
            { name: "shopkeep" },
            { name: "bat" },
            { name: "murderBear" },
            { name: "ghoul" },
            { name: "dragon"}
            
        ]
    },
    {
        level: 1,
        width: 32, //32
        length: 32,  //32
        description: "Dungeon",
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
            { name: "arrow25", location: { x: 0, y: 0, z: 0}}
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
            { name: "rat" },
            { name: "bat" },
            { name: "bat" },
            { name: "ghoul" }

        ]
    },
    {
        level: 2,
        width: 45, //32
        length: 45,  //32
        description: "Catacomb",
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
            { name: "busterblade", location: { x: 10, y: 0, z: -2 }},
            { name: "gold25", location: { x: 10, y: 0, z: -2 }},
            { name: "redpotion" },
            { name: "greenpotion" }
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
            { name: "rat", location: { x: 10, y: 0, z: 0 }},
            { name: "spiderQueen", location: { x: 10, y: 0, z: 0 }},
            { name: "ghoul", location: { x: 10, y: 0, z: 0 } },
            { name: "ghoul", location: { x: 10, y: 0, z: 0 } },
            { name: "elfgirl" }
        ]
    },
    {
        level: 3,
        width: 26, //26
        length: 26, //26
        description: "Swamp",
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
                    color: 'white',
                    density: 1.2
                },
                water: {
                    attributes: {
                        elevation: 0,
                        color: "green",
                        scale: 100
                    },
                    gltf: 'water.glb'
                }
            }
        },
        items: [
            { name: "busterboot", location: { x: 0, y: 0, z: 0} },
            { name: "gold25", location: { x: 10, y: 0, z: -1 }},
            { name: "redpotion" },
            { name: "greenpotion" },
            { name: "lightSaber", location: { x: -1, y: 0, z: -1} }
        ],
        structures: [
            { 
                name: "portal", location: { x: -21.5, y: 0, z: -6.5},
                attributes: { routeTo: { level: 0, location: { x: 19.5, y: 0, z: -6.5 } } } 
            }
        ],
        entities: [
            { name: "crystalMan" },
            { name: "crystalMan" },
            { name: "crystalMan" },
            { name: "crystalMan" },
            { name: "viking" },
        ]
    },
    {
        level: 4,
        width: 26, //26
        length: 26, //26
        description: "Lavafield",
        background: 'clouds.png',
        terrain: {
            name: 'floor',
            type: 'floor',
            description: 'lavafield',
            gltf: 'lavafield.glb',
            attributes: {
                scale: 100,
                borderTrees: true,
                light: {
                    sunLight: true,
                    overheadPointLight: false,
                },
                fog: {
                    color: 'whites',
                    density: 1.2
                },
                water: {

                    attributes: {
                        elevation: 0,
                        color: "green",
                        scale: 100,
                        lava: true
                    },
                    gltf: 'lava.glb'
                }
            }
        },
        items: [
            { name: "gold25", location: { x: 10, y: 0, z: -1 }},
            { name: "redpotion" },
            { name: "greenpotion" },
            { name: "helmet" }
        ],
        structures: [
            { 
                name: "portal", location: { x: -21.5, y: 0, z: -6.5},
                attributes: { routeTo: { level: 0, location: { x: -17.0, y: 0, z: -6.0 } } } 
            }
        ],
        entities: [
            { name: "lavaMan", location: { x: -21.5, y: 0, z: -6.5} },
            { name: "lavaMan", location: { x: -21.5, y: 0, z: -6.5} },
            { name: "lavaMan", location: { x: -21.5, y: 0, z: -6.5} },
            { name: "lavaMan" },
            { name: "ghoul" },
            { name: "ghoul" },
            { name: "ghoul" }
            
        ]
    },
    {
        level: 5,
        width: 52, //26
        length: 52, //26
        description: "Kingdom",
        background: 'clouds.png',
        terrain: {
            name: 'floor',
            type: 'floor',
            description: 'kingdom',
            gltf: 'kingdom.glb',
            attributes: {
                scale: 140,
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
            // { name: "crystalBall" },
            { name: "mushroom" },
        ],
        structures: [
            { 
                name: "portal", location: { x: -43, y: 0, z: -6.5},
                attributes: { routeTo: { level: 0, location: { x: -6.5, y: 0, z: -18.5 } } } 
            },
            // { name: "tree1" },
            // { name: "tavern", location: { x: -45, y: 0, z: -4.5} },
        ],
        entities: [
            { name: "shopkeep" },
            { name: "rockyMan" },
            { name: "ghoul" },
            { name: "ghoul" }
            // { name: "rockyMan" },
            // { name: "rockyMan" },
            // { name: "rockyMan" },
            // { name: "lobot" },
            // { name: "blueShirt" }
            // { name: "rosenBot" }
        ]
    },
    {
        level: 7,
        width: 26, //26
        length: 26, //26
        description: "Snowyland",
        background: 'clouds.png',
        terrain: {
            name: 'floor',
            type: 'floor',
            description: 'swamp',
            gltf: 'snowyland.glb',
            attributes: {
                scale: 100,
                borderTrees: true,
                light: {
                    sunLight: true,
                    overheadPointLight: false,
                },
                fog: {
                    color: 'white',
                    density: 1.2
                }
            }
        },
        items: [

        ],
        structures: [
            { 
                name: "portal", location: { x: -21.5, y: 0, z: -6.5},
                attributes: { routeTo: { level: 0, location: { x: -6.5, y: 0, z: 19.5 } } } 
            }
        ],
        entities: [
            { name: "crystalMan" },
            { name: "crystalMan" },
            { name: "crystalMan" },
            { name: "crystalMan" },
            { name: "ghoul" },
            { name: "ghoul" }
        ]
    },
    {
        level: 6,
        width: 14, //26
        length: 12, //26
        description: "Ruins",
        background: 'clouds.png',
        terrain: {
            name: 'floor',
            type: 'floor',
            description: 'ruins',
            gltf: 'ruins.glb',
            attributes: {
                scale: 40,
                borderTrees: true,
                light: {
                    sunLight: true,
                    overheadPointLight: false,
                },
                fog: {
                    color: 'white',
                    density: 1.2
                }
            }
        },
        items: [

        ],
        structures: [
            { 
                name: "portal", location: { x: -21.5, y: 0, z: -6.5},
                attributes: { routeTo: { level: 0, location: { x: -6.5, y: 0, z: 19.5 } } } 
            }
        ],
        entities: [
            { name: "crystalMan" },
            { name: "crystalMan" },
            { name: "crystalMan" },
            { name: "crystalMan" },
            { name: "ghoul" },
            { name: "ghoul" }
        ]
    }
 
]
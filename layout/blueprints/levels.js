/**
 * LevelBuilder will keep track of layouts by level
 */

export const levels = [

    {
        level: 5,   
        width: 26, //26
        length: 26, //26
        description: "Valley of Mist",
        background: 'clouds.png', // 'clouds.png',
        backgroundNight: 'stars.png',
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
            { name: "keyToShed", location: { x: -1, y: 0, z: -1} },
            { name: "redpotion" },
            { name: "gold3" },
            { name: "bow" },
            { name: "arrow25" },
            { name: "smallSword" },
            { name: "aluminium", location: { x: -1, y: 0, z: -1}},
            { name: "gold" },
            { name: "iron" },
            { name: "silver" },
            { name: "cavalier", location: { x: -1, y: 0, z: -1} }

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
                attributes: { routeTo: { level: 5, location: { x: -14.5, y: 0, z: 35.2 } } } 
            },
            { 
                name: "portal", location: { x: -6.5, y: 0, z: 19.5}, 
                attributes: { routeTo: { level: 6, location: { x: -15.5, y: 0, z: -18.5 } } }
            },
            { 
                name: "portal", location: { x: 6.5, y: 0, z: 19.5}, 
                attributes: { routeTo: { level: 7, location: { x: -18.0, y: 0, z: -6.5 } } } 
            }

        ],
        entities: [
            { name: "john" },
            { name: "evilOne" },
            { name: "shopkeep", location: { x: 1, y: 0, z: 1} },
            { name: "ghoul" },
            // { name: "horse" },
            // { name: "murderBear" },
            // { name: "rosen" },
            // { name: "viking" },
            // { name: "blacksmith" },
            // { name: "elfgirl" }
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
            { name: "arrow25" },
            { name: "aluminium" },
            { name: "iron" }
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
            { name: "bat" },
            { name: "bat" },
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
            { name: "greenpotion" },
            { name: "aluminium" },
            { name: "chromium" },
            { name: "iron" }
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
            { name: "ghoul", location: { x: 10, y: 0, z: 0 } }
            
        ]
    },
    {
        level: 3,
        width: 26, //26
        length: 26, //26
        description: "Swamp",
        background: 'clouds.png',
        backgroundNight: 'stars.png',
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
            { name: "lightSaber", location: { x: -1, y: 0, z: -1} },
            { name: "rosenRelic" },
            { name: "smallSword" },
            { name: "blackpotion" },
            { name: "bagOfGems" },
            { name: "chromium" },
            { name: "copper" }
        ],
        structures: [
            { name: "bridge", location: { x: 5.3, y: 0, z: -18} },
            { name: "bridge", location: { x: 10.8, y: 0, z: 17.5} },
            { 
                name: "portal", location: { x: -21.5, y: 0, z: -6.5},
                attributes: { routeTo: { level: 0, location: { x: 19.5, y: 0, z: -6.5 } } } 
            },
            { 
                name: "grate", location: { x: 8.4, y: 0, z: 21.1},
                attributes: { unlocked: true, elevation: 10, routeTo: { level: 5, location: { x: 19.5, y: 0, z: -6.5 } } } 
            },
            { 
                name: "grate", location: { x: 3.2, y: 0, z: -21}, 
                attributes: { unlocked: true, elevation: 60, routeTo: { level: 7, location: { x: 19.5, y: 0, z: -6.5 } } } 
            }
        ],
        entities: [
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
        backgroundNight: 'stars.png',
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
            { name: "helmet" },
            { name: "copper" },
            { name: "iron" },
            { name: "silver" }
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
            { name: "lavaMan" },
            { name: "lavaMan" },
            { name: "ghoul" },
            { name: "ghoul" },
            { name: "ghoul" },
            { name: "dragon", location: { x: -21.5, y: 0, z: -6.5}}
            
        ]
    },
    {
        level: 0,
        width: 52, //26
        length: 52, //26
        description: "Kingdom",
        background: 'clouds.png',
        backgroundNight: 'stars.png',
        terrain: {
            name: 'floor',
            type: 'floor',
            description: 'kingdom',
            gltf: 'kingdom.glb',
            attributes: {
                animates: true,
                scale: 200,
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
            { name: "copper" },
            { name: "iron" },
            { name: "silver" },
            { name: "titanium" },
            { name: "wolfram" },
            { name: "silver" },
            { 
                name: "lever", location: { x: -10.8, y: 0, z: 26.1 },
                attributes: { controls: "door" }
            }
        ],
        structures: [
            { 
                name: "portal", location: { x: -12.5, y: 0, z: 35.2 },
                attributes: { routeTo: { level: 0, location: { x: -6.5, y: 0, z: -18.5 } } } 
            },
            { 
                name: "grate", location: { x: 19.5, y: 0, z: -6.5 },
                attributes: { unlocked: true, elevation: 5, routeTo: { level: 3, location: { x: 8.4, y: 0, z: 21.1} } } 
            },
            { 
                name: "balloon", location: { x: -6, y: 0, z: -.35},
                // attributes: { routeTo: { level: 0, location: { x: -6.5, y: 0, z: -18.5 } } } 
            },
            
        ],
        entities: [
            { name: "blacksmith", location: { x: -5, y: 0, z: -41.1 } },
            { name: "rockyMan" },
            { name: "rockyMan" },
            { name: "ghoul" },
            { name: "ghoul" },
            { name: "ghoul" },
            { name: "ghoul" },
            { name: "ghoul" },
            { name: "ghoul" },
            { name: "elfgirl" }
        ]
    },
    {
        level: 6,
        width: 78, //26
        length: 78, //26
        description: "Ruins",
        background: 'ruinsSky.jpg',
        backgroundNight: 'stars.png',
        terrain: {
            name: 'floor',
            type: 'floor',
            description: 'ruins',
            gltf: 'ruins.glb',
            attributes: {
                scale: 100,
                borderTrees: true,
                light: {
                    sunLight: true,
                    overheadPointLight: true,
                },
                fog: {
                    color: 'white',
                    density: 1.2
                }
            }
        },
        items: [
            { name: "iron" },
            { name: "silver" },
            { name: "titanium" },
            { name: "wolfram" },
            { name: "silver" },
            { name: "iron" },
            { name: "silver" },
            { name: "titanium" },
            { name: "wolfram" },
            { name: "silver" }
        ],
        structures: [
            { 
                name: "portal", location: { x: -13.5, y: 0, z: -18.5},
                attributes: { routeTo: { level: 0, location: { x: -8.5, y: 0, z: 18.5 } } } 
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
        level: 7,
        width: 72, //26
        length: 72, //26
        description: "Snowyland",
        background: 'clouds.png',
        backgroundNight: 'stars.png',
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
            { name: "iron" },
            { name: "silver" },
            { name: "titanium" },
            { name: "wolfram" },
            { name: "silver" },
            { name: "cavalier" }

        ],
        structures: [
            { 
                name: "portal", location: { x: -21.5, y: 0, z: -6.5},
                attributes: { routeTo: { level: 0, location: { x: 6.5, y: 0, z: 19.5 } } } 
            },
            { 
                name: "grate", location: { x: 21.5, y: 0, z: -6.5 },
                attributes: { unlocked: true, elevation: 60, routeTo: { level: 3, location: { x: 5.2, y: 0, z: -21} } } 
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
/**
 * LevelBuilder will keep track of layouts by level
 */

export const levels = [

    {
        level: 100,   
        width: 10, //26
        length: 10, //26
        description: "Rosenetta Stone",
        background: '', // 'clouds.png',
        backgroundNight: '',
        terrain: {
            name: 'floor',
            type: 'floor',
            description: 'concourse',
            gltf: 'concourse.glb',
            attributes: {
                scale: 100,
                borderTrees: false,
                light: {
                    sunLight: false,
                    overheadPointLight: false,
                },
                fog: {
                    color: 'white',
                    density: 0
                }
            }
        },
        items: [
        ],
        structures: [
            { 
                name: "portalStone", location: { x: 2.66, y: 0, z: -10 }, 
                attributes: { routeTo: { level: 1, location: { x: 16, y: 0, z: 4 } } } 
            },
            { 
                name: "portalStone", location: { x: 5.2, y: 0, z: -8.9}, 
                attributes: { routeTo: { level: 0, location: { x: -0, y: 0, z: 0 } } } 
            },
            { 
                name: "portalStone", location: { x: 7.4, y: 0, z: -7.3}, 
                attributes: { routeTo: { level: 4, location: { x: -18.0, y: 0, z: -6.5 } } } 
            },
            { 
                name: "portalStone", location: { x: 9.1, y: 0, z: -5.3}, 
                attributes: { routeTo: { level: 8, location: { x: -5.7, y: 0, z: 40 } } } 
            },
            { 
                name: "portalStone", location: { x: 10.3, y: 0, z: -2.7}, 
                attributes: { routeTo: { level: 3, location: { x: -18.0, y: 0, z: -6.5 } } } 
            },
            { 
                name: "portalStone", location: { x: 10.5, y: 0, z: .05}, 
                attributes: { routeTo: { level: 6, location: { x: -15.5, y: 0, z: -18.5 } } }
            },
            { 
                name: "portalStone", location: { x: 10.2, y: 0, z: 2.7},
                attributes: { routeTo: { level: 5, location: { x: -14.5, y: 0, z: 35.2 } } } 
            },
            { 
                name: "portalStone", location: { x: 9.15, y: 0, z: 5.3}, 
                attributes: { routeTo: { level: 7, location: { x: 3.5, y: 0, z: 21.1 } } } 
            },
            { 
                name: "portalStone", location: { x: 7.4, y: 0, z: 7.5 },
                attributes: { routeTo: { level: 2, location: { x: 0, y: 0, z: 0} } } 
            }


        ],
        entities: [
        ]
    },
    {
        level: 0,   
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
            { name: "cavalier", location: { x: -1, y: 0, z: -1} },
            { name: "direMace", location: { x: -1, y: 0, z: -1} },
            { name: "iceSword", location: { x: -1, y: 0, z: -1} },
            { name: "heavyAxe", location: { x: -1, y: 0, z: -1} },
            

        ],
        structures: [
            { name: "shed", location: { x: 0, y: 0, z: 0} },
            { name: "rock1" },
            { name: "cart" },
            { 
                name: "grate", location: { x: 3, y: 0, z: 4},
                attributes: { routeTo: { level: 1, location: { x: 16, y: 0, z: 4 } } } //dungeon
            },
            { 
                name: "platformBlock", location: { x: 19.5, y: 0, z: -6.5}, 
                attributes: { routeTo: { level: 3, location: { x: -18.0, y: 0, z: -6.5 } } } //swamp
            },
            { 
                name: "platformBlock", location: { x: -17.0, y: 0, z: -6.0 },
                attributes: { routeTo: { level: 4, location: { x: -23.5, y: 0, z: -6.5} } } //lavafield
            },
            { 
                name: "elevatorS_1m", location: { x: -4.9, y: 0, z: 5.1 },
            },
            { 
                name: "lever", location: { x: -4, y: 0, z: 3.1 },
                attributes: { controls: "elevatorS_1m:Move" }
            },
            { 
                name: "lever", location: { x: -4.2, y: 2.6, z: 3.3 },
                attributes: { controls: "elevatorS_1m:Move", staticStartingElevation: true, position: "up" }
            },
        ],
        entities: [
            // { name: "rockyMan"},
            { name: "john" },
            // { name: "evilOne" },
            { name: "shopkeep", location: { x: 1, y: 0, z: 1} },
            // { name: "ghoul" },
            // // { name: "demonLord"},
            // // { name: "horse" },
            // { name: "murderBear" },
            // // { name: "rosen" },
            // // { name: "blacksmith" },
            // // { name: "elfgirl" }
            // { name: "iceGhoul" },
            // { name: "shockGhoul" },
            // { name: "gasGhoul" },
            // { name: "ghostGhoul" },
            // { name: "zombie" },
            { name: "daveDragon"},

            // { name: "jelly", location: { x: -1, y: 0, z: -1}}
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
                attributes: { routeTo: { level: 0, location: { x: 3, y: 0, z: 4} } } //valley
            },
            { 
                name: "archway", location: { x: 16, y: 0, z: -4 },
                attributes: { routeTo: { level: 2, location: { x: 0, y: 0, z: 0} } } //catacomb
            },
            
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
                attributes: { routeTo: { level: 1, location: { x: 16, y: 0, z: -4 } } } //dungeon
            },
            { 
                name: "ancientChest", location: { x: 10, y: 0, z: -1 },
                attributes: { key: 'keyToChest2', contentItems: [ "orb" ] }
            }

        ],
        entities: [
            { name: "rat", location: { x: 10, y: 0, z: 0 }},
            { name: "demonLord", location: { x: 10, y: 0, z: 0 }},
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
                name: "platformBlock", location: { x: -21.5, y: 0, z: -6.5},
                attributes: { elevation: 5, routeTo: { level: 0, location: { x: 19.5, y: 0, z: -6.5 } } } //valley
            },
            { 
                name: "platformBlock", location: { x: 8.4, y: 0, z: 21.1},
                attributes: { locked: false, elevation: 10, routeTo: { level: 5, location: { x: -14.5, y: 0, z: 35.5 } } } //kingdom
            },
            { 
                name: "platformBlock", location: { x: 3.2, y: 0, z: -21}, 
                attributes: { locked: false, elevation: 60, routeTo: { level: 7, location: { x: 16.9, y: 0, z: -25.5 } } } //snowyland
            }
        ],
        entities: [
            { name: "crystalMan" },
            { name: "crystalMan" },
            { name: "crystalMan" },
            
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
                name: "platformBlock", location: { x: -21.5, y: 0, z: -6.5},
                attributes: { routeTo: { level: 0, location: { x: -17.0, y: 0, z: -6.0 } } } //valley
            },
            { 
                name: "platformBlock", location: { x: -17.0, y: 0, z: -6.5 },
                attributes: { routeTo: { level: 8, location: { x: -17.5, y: 0, z: -6.5} } } //lavaLabyrinth
            },
            { 
                name: "platformBlock", location: { x: -7.5, y: 0, z: 18.5 },
                attributes: { routeTo: { level: 6, location: { x: -11.5, y: 0, z: -18.5} } } // ruins
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
            { name: "dragon", location: { x: -21.5, y: 0, z: -6.5}},
            { name: "daveDragon", location: { x: -21.5, y: 0, z: -6.5}}
            
        ]
    },
    {
        level: 5,
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
                },
                position: "down"
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

        ],
        structures: [

            { 
                name: "platformBlock", location: { x: -13.5, y: 0, z: 35.5 },
                attributes: { locked: false, elevation: 10, routeTo: { level: 3, location: { x: 6.4, y: 0, z: 21.1} } } //swamp
            },
            { 
                name: "platformBlock", location: { x: -92.4, y: 0, z: 100.8 },
                attributes: { locked: false, elevation: 5, routeTo: { level: 7, location: { x: 6.4, y: 0, z: 21.1} } } //snowyLand
            },
            { 
                name: "balloon", location: { x: -5.3, y: 0, z: -67.5 }, 
                attributes: { staticStartingElevation: false, routeTo: { level: 8, location: { x: -3.5, y: 0, z: 40 } } } //lavaLabyrinth
            },
            { 
                name: "tavernShop", location: { x: 1.1, y: 0, z: -34.5 },
                attributes: { rotateY: true }
            },
            { 
                name: "platformBlock", location: { x: -2.1, y: 0, z: -34.6 },
                attributes: { elevation: -5, controls: "tavernShop:Walking in" }
            },
            { 
                name: "platformWood", location: { x: -.7, y: 0, z: -34.6 },
                attributes: { elevation: 0, controls: "tavernShop:Walking out" }
            },

            { 
                name: "kingdomGate", location: { x: -15.2, y: 0, z: 27.4 },
                attributes: { locked: true, elevation: 5 }
            },
            { 
                name: "lever", location: { x: -11.2, y: 0, z: 26.1 },
                attributes: { locked: true, key: "keyToKingdom", controls: "kingdomGate:OpenL+OpenR+OpenBars" }
            },
            { 
                name: "lever", location: { x: -11.2, y: 0, z: 28.4 },
                attributes: { rotateY: true, locked: true, key: "keyToKingdom", controls: "kingdomGate:OpenL+OpenR+OpenBars", position: "up" }
            },
            { 
                name: "elevatorL_6m", location: { x: -3.8, y: 0, z: 25.8 },
            },
            { 
                name: "lever", location: { x: -7, y: 0, z: 24.4 },
                attributes: { controls: "elevatorL_6m:Move" }
            },
            { 
                name: "lever", location: { x: -6.2, y: 12.4, z: 24.8 },
                attributes: { controls: "elevatorL_6m:Move", staticStartingElevation: true, position: "up" }
            },
            { 
                name: "elevatorS_6m", location: { x: -26.1, y: 0, z: 25.8 },
            },
            { 
                name: "lever", location: { x: -24.2, y: 0, z: 25 },
                attributes: { controls: "elevatorS_6m:Move" }
            },
            { 
                name: "lever", location: { x: -27.2, y: 12.3, z: 24.3 },
                attributes: { controls: "elevatorS_6m:Move", staticStartingElevation: true, position: "up" }
            }
        ],
        entities: [
            { name: "blacksmith", location: { x: 5, y: 0, z: -37.1 } },
            { name: "centurion", location: { x: -10.8, y: 0, z: 28.4 } },
            { name: "viking", location: { x: -8.8, y: 0, z: 11.15 } },
            // { name: "rockyMan" },
            // { name: "rockyMan" },
            // { name: "ghoul" },
            // { name: "ghoul" },
            // { name: "ghoul" },
            // { name: "ghoul" },
            // { name: "ghoul" },
            // { name: "ghoul" },
            // { name: "elfgirl" }
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
                name: "platformBlock", location: { x: -13.5, y: 0, z: -18.5},
                attributes: { routeTo: { level: 4, location: { x: -8.5, y: 0, z: 18.5 } } } // lavaField
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
        width: 26, //26
        length: 26, //26
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
                name: "platformBlock", location: { x: 18.4, y: 0, z: -23.1 }, 
                attributes: { locked: false, routeTo: { level: 3, location:{ x: 3.2, y: 0, z: -19} } } //swamp
            },
            { 
                name: "platformBlock", location: { x: 4.4, y: 0, z: 21.1},
                attributes: { locked: false, elevation: 5, routeTo: { level: 5, location: { x: -90.4, y: 0, z: 100.8 } } } //kingdom
            },
            { name: "tavernShop", location: { x: -3.5, y: 0, z: 0} },
            { 
                name: "platformBlock", location: { x: -.5, y: 0, z: .15 },
                attributes: { elevation: -5,controls: "tavernShop:Walking in" }
            },
            { 
                name: "platformWood", location: { x: -1.5, y: 0, z: .15 },
                attributes: { elevation: 5, controls: "tavernShop:Walking out" }
            }
        ],
        entities: [
            { name: "daveDragon" },
            { name: "viking", location: { x: -7.5, y: 0, z: 2.7 } },
            { name: "dragon", location: { x: -21.5, y: 0, z: -6.5}},
            { name: "daveDragon", location: { x: -21.5, y: 0, z: -6.5}}
            // { name: "crystalMan" },
            // { name: "crystalMan" },
            // { name: "ghoul" },
            // { name: "ghoul" }
        ]
    },
    
    {
        level: 8,
        width: 72, //26
        length: 72, //26
        description: "Lava Labyrinth",
        background: 'clouds.png',
        backgroundNight: 'stars.png',
        terrain: {
            name: 'floor',
            type: 'floor',
            description: 'Lava Labyrinth',
            gltf: 'lavalabyrinth.glb',
            attributes: {
                emissiveIntensity: 10,
                scale: 100,
                borderTrees: false,
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
            { name: "ricketyPlatform", location: { x: -7.2, y: 0, z: 40 }  },
            { name: "balloon", location: { x: -7.2, y: 5.85, z: 40 }  },
            { 
                name: "platformBlock", location: { x: -8.8, y: 0, z: 38.4 }, 
                attributes: { routeTo: { level: 5, location: { x: -3.3, y: 0, z: -67.5 } }} //kingdom
            },
            { 
                name: "platformBlock", location: { x: -19.5, y: 0, z: -6.5}, 
                attributes: { routeTo: { level: 4, location: { x: -18.0, y: 0, z: -6.5 } } } //lavaField
            }

        ],
        entities: [
            { name: "lavaGhoul" },
            { name: "lavaGhoul" },
            { name: "lavaGhoul" },
            { name: "lavaGhoul" },

        ]
    }
 
]
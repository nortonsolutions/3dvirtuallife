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
                attributes: { routeTo: { level: 3, location: { x: -15.5, y: -.7, z: 38.75} } } 
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
            },
            { 
                name: "portalStone", location: { x: 5.3, y: 0, z: 9 },
                attributes: { routeTo: { level: 9, location: { x: 2, y: 0, z: 2} } } 
            },
            { 
                name: "portalStone", location: { x: 2.7, y: 0, z: 10.1 },
                attributes: { routeTo: { level: 10, location: { x: 2, y: 0, z: 2} } } 
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
                cutScenes: {
                    intro: "volcanoIntro.mkv"    
                },
                addPonds: true,
                scale: 100,
                borderTrees: true,
                light: {
                    sunLight: true,
                    overheadPointLight: false,
                },
                fog: {
                    color: 'white',
                    density: 1
                },
                designateNPCs: true
            }
        },
        items: [
            { name: "keyToShed", location: { x: -1, y: 0, z: -1} },
            { name: "redpotion" },
            { name: "greenpotion", location: { x: -1, y: 0, z: -1} },
            { name: "greenpotion", location: { x: -1, y: 0, z: -1} },
            { name: "gold3" },
            { name: "bow" },
            { name: "arrow25" },
            { name: "smallSword" },
            { name: "aluminium", location: { x: -1, y: 0, z: -1}},
            { name: "gold" },
            { name: "iron" },
            { name: "silver" },
            { 
                name: "balloon", location: { x: -3, y: 0, z: -1},
                attributes: { staticStartingElevation: false }
            },
        ],
        structures: [
            { name: "shed", location: { x: 0, y: 0, z: 0},
                attributes: { transparentWindows: true} 
            }, 
            { name: "rock1" },
            { name: "cart", location: { x: -2, y: 0, z: 2} },
            { 
                name: "grate", location: { x: 3, y: 0, z: 4},
                attributes: { routeTo: { level: 1, location: { x: 16, y: 0, z: 4 } } } //dungeon
            },
            { 
                name: "platformBlock", location: { x: 5, y: -1, z: -4.9 },
                attributes: { scale: 150, staticStartingElevation: true, routeTo: { level: 1, location: { x: 16, y: 0, z: 4 } } } //dungeon
            },
            { 
                name: "platformBlock", location: { x: 35.15, y: 9.25, z: -.70 },
                attributes: { staticStartingElevation: true, routeTo: { level: 2, location: { x: 0, y: 0, z: 0} } } //catacomb
            },
            { 
                name: "platformBlock", location: { x: -21.4, y: 0, z: 48.5}, 
                attributes: { routeTo: { level: 3, location: { x: 9.2, y: 0, z: 39.6} } } //swamp
            },
            { 
                name: "platformBlock", location: { x: -17.0, y: 0, z: -6.0 },
                attributes: { routeTo: { level: 4, location: { x: -23.5, y: 0, z: -6.5} } } //lavafield
            },
            { 
                name: "elevatorS_1m", location: { x: -4.75, y: 0, z: 4.75 }, attributes: { scale: 200 }
            },
            { 
                name: "lever", location: { x: -4, y: 0, z: 3.1 },
                attributes: { controls: "elevatorS_1m:Move/3/3/0", rotateY: 270 }
            },
            { 
                name: "lever", location: { x: -4.5, y: 2.6, z: 3.45 },
                attributes: { controls: "elevatorS_1m:Move/3/3/1", staticStartingElevation: true, position: "up", rotateY: 315 }
            },
            { 
                name: "lever", location: { x: -.8, y: 0, z: 4.1 },
                attributes: { controls: "shed:gateaction/2/2/1/false/concurrent+invgateaction/2/2/1/false/concurrent" }
            },
            { 
                name: "lever", location: { x: -.9, y: 2.6, z: 5 },
                attributes: { rotateY: 180, controls: "shed:gateaction/2/2/1/false/concurrent+invgateaction/2/2/1/false/concurrent", position: "up" }
            },
        ],
        entities: [
            { name: "evilOne", type: "beast" },
            { name: "evilOne", type: "beast" },
            { name: "evilOne", type: "beast" },
            { name: "evilOne", type: "beast" },
            { name: "evilOne", type: "beast" },
            { name: "evilOne", type: "beast" },
            { name: "evilOne", type: "beast" },
            { name: "evilOne", type: "beast" },

            { name: "triceratops", type: "beast" },
            { name: "trex", type: "beast" },
            // { name: "ghoul", type: "beast"  },
            // { name: "crocodile", type: "beast", location: { x: 1, y: 0, z: 1} },
            // { name: "rockyMan", type: "beast" },
            // { name: "demonLord", type: "beast" },
            { name: "horse", location: { x: 1, y: 0, z: 1} },
            // { name: "murderBear", type: "beast"  },
            // { name: "rosen", type: "beast"  },
            // { name: "iceGhoul", type: "beast"  },
            // { name: "shockGhoul", type: "beast"  },
            // { name: "gasGhoul", type: "beast"  },
            // { name: "ghostGhoul", type: "beast"  },
            // { name: "zombie", type: "beast" },
            // { name: "daveDragon", type: "beast"},
            // { name: "jelly", location: { x: -1, y: 0, z: -1}, type: "beast"}
            { name: "john" },
            { name: "shopkeep", location: { x: 1, y: 0, z: 1} },
            // { name: "blacksmith" },
            // { name: "elfgirl" },
            { name: "sunSeed", location: { x: 1, y: 0, z: 1}},
            { name: "sunSeed", location: { x: 1, y: 0, z: 1}},
            { name: "sunSeed", location: { x: 1, y: 0, z: 1}},
            { name: "sunSeed", location: { x: 1, y: 0, z: 1}}
            
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
                cutScenes: {
                    intro: "volcanoIntro.mkv"    
                },
                scale: 100,
                light: {
                    sunLight: false,
                    overheadPointLight: true,
                },
                fog: {
                    color: 'black',
                    density: 1
                },
                designateNPCs: true
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
            
            { name: "evilOne", type: "beast" },
            { name: "evilOne", type: "beast" },
            { name: "evilOne", type: "beast" },
            { name: "rat", type: "beast" },
            { name: "rat", type: "beast" },
            { name: "bat", type: "beast" },
            { name: "bat", type: "beast" },
            { name: "bat", type: "beast" },
            { name: "bat", type: "beast" },
            { name: "bat", type: "beast" },
            { name: "bat", type: "beast" },
            { name: "ghoul", type: "beast", attributes: { boss: false } },
            { name: "john" },
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
                cutScenes: {
                    intro: "volcanoIntro.mkv"    
                },
                scale: 100,
                light: {
                    sunLight: false,
                    overheadPointLight: true,
                },
                fog: {
                    color: 'black',
                    density: 1
                },
                designateNPCs: true
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
            { name: "rat", location: { x: 10, y: 0, z: 0 }, type: "beast"},
            { name: "demonLord", location: { x: 10, y: 0, z: 0 }, type: "beast"},
            { name: "ghoul", location: { x: 10, y: 0, z: 0 }, type: "beast" },
            { name: "ghoul", location: { x: 10, y: 0, z: 0 }, type: "beast" }
            
        ]
    },
    {
        level: 3,
        width: 52, //26
        length: 52, //26
        description: "Swamp",
        background: 'swampBackground.png',
        backgroundNight: '',
        terrain: {
            name: 'floor',
            type: 'floor',
            description: 'swamp',
            gltf: 'swamp.glb',
            attributes: {
                cutScenes: {
                    intro: "volcanoIntro.mkv"    
                },
                scale: 100,
                borderTrees: false,
                grassSprites: true,
                leaves: true,
                light: {
                    sunLight: true,
                    overheadPointLight: false,
                },
                fog: {
                    color: '#88e732',
                    density: .5
                },
                water: {
                    attributes: {
                        elevation: -120,
                        color: "green",
                        scale: 200
                    },
                    gltf: 'water.glb'
                },
                designateNPCs: true
            }
        },
        items: [
            // { name: "busterboot", location: { x: 0, y: 0, z: 0} },
            // { name: "lightSaber", location: { x: -1, y: 0, z: -1} },
            // { name: "rosenRelic" },
            // { name: "gold25", location: { x: 10, y: 0, z: -1 }},
            { name: "redpotion" },
            { name: "greenpotion" },
            { name: "smallSword" },
            { name: "blackpotion" },
            { name: "bagOfGems" },
            { name: "chromium" },
            { name: "copper" }
        ],
        structures: [
            { name: "bridge", location: { x: -14.4, y: 0, z: 31.9} },
            { name: "bridge", location: { x: 33.2, y: 0, z: 18.5}, attributes: { rotateY: 90 } },
            { 
                name: "platformBlock", location: { x: 11.2, y: 0, z: 39.6},
                attributes: { routeTo: { level: 0, location: { x: -18.4, y: 0, z: 47.8} } } //valley
            },
            { 
                name: "platformBlock", location: { x: -14.4, y: -.65, z: 38.7},
                attributes: { staticStartingElevation: true, routeTo: { level: 5, location: { x: -7.4, y: 0, z: 38.5 } } } //kingdom
            },
            { 
                name: "platformBlock", location: { x: 40.2, y: 0, z: 18.6}, 
                attributes: { routeTo: { level: 7, location: { x: 16.9, y: 0, z: -25.5 } } } //snowyland
            }
        ],
        entities: [
            // { name: "crystalMan", type: "beast" },
            // { name: "crystalMan", type: "beast" },
            { name: "crocodile", type: "beast" },
            { name: "crocodile", type: "beast" },
            { name: "crocodile", type: "beast" },
            // { name: "crocodile", type: "beast" },
            // { name: "crocodile", type: "beast" },
            // { name: "crocodile", type: "beast" },
            // { name: "crocodile", type: "beast" },
            // { name: "iceGhoul", type: "beast"  },
            // { name: "shockGhoul", type: "beast"  },
            // { name: "gasGhoul", type: "beast"  },
            // { name: "ghostGhoul", type: "beast"  },
            // { name: "john" },
            // { name: "shopkeep", location: { x: 1, y: 0, z: 1} },
            // { name: "evilOne", type: "beast" },
            // { name: "ghoul", type: "beast"  },
            // { name: "triceratops", type: "beast" },
            // { name: "crocodile", type: "beast", location: { x: 1, y: 0, z: 1} },
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
                cutScenes: {
                    intro: "volcanoIntro.mkv"    
                },
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
                },
                designateNPCs: true

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
            { name: "lavaMan", location: { x: -21.5, y: 0, z: -6.5}, type: "beast" },
            { name: "lavaMan", location: { x: -21.5, y: 0, z: -6.5}, type: "beast" },
            { name: "lavaMan", type: "beast" },
            { name: "lavaMan", type: "beast" },
            { name: "ghoul", type: "beast" },
            { name: "ghoul", type: "beast" },
            { name: "ghoul", type: "beast" },
            { name: "dragon", location: { x: -21.5, y: 0, z: -6.5}, type: "beast"},
            { name: "daveDragon", location: { x: -21.5, y: 0, z: -6.5}, type: "beast"}
            
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
                cutScenes: {
                    intro: "volcanoIntro.mkv"    
                },
                animates: false,
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
                designateNPCs: true,
                // grass: {
                //     attributes: {
                //         elevation: 0,
                //         color: "green",
                //         scale: 200
                //     },
                //     gltf: 'water.glb'
                // },
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
                name: "platformBlock", location: { x: -5.3, y: 0, z: -67.5 }, 
                attributes: { routeTo: { level: 8, location: { x: -3.5, y: 0, z: 40 } } } //lavaLabyrinth
            },
            { 
                name: "platformBlock", location: { x: -13.5, y: 0, z: 35.5 },
                attributes: { locked: false, elevation: 10, routeTo: { level: 3, location: { x: -15.5, y: 0, z: 38.7} } } //swamp
            },
            { 
                name: "platformBlock", location: { x: -92.4, y: 0, z: 100.8 },
                attributes: { locked: false, elevation: 5, routeTo: { level: 7, location: { x: 6.4, y: 0, z: 21.1} } } //snowyLand
            },
            { 
                name: "tavernShop", location: { x: 1.1, y: 0, z: -34.5 },
                attributes: { rotateY: 180 }
            },
            { // animationName,duration,fadeOutDuration,fadeOutDelay,autorestore,concurrent
                name: "platformBlock", location: { x: -2.1, y: 0, z: -34.6 },
                attributes: { elevation: -5, footControls: "tavernShop:Walking in/1/0/0/0/0" }
            },
            { 
                name: "platformWood", location: { x: -.7, y: 0, z: -34.6 },
                attributes: { elevation: 0, footControls: "tavernShop:Walking out/1/0/0/0/0" }
            },

            { 
                name: "kingdomGate", location: { x: -15.2, y: 0, z: 27.4 },
                attributes: { locked: true, elevation: 5 }
            },
            { 
                name: "lever", location: { x: -11.2, y: 0, z: 26.1 },
                attributes: { locked: true, key: "keyToKingdom", controls: "kingdomGate:OpenL/3/5/1/noAutorestore/concurrent+OpenR/3/5/1/noAutorestore/concurrent+OpenBars/3/5/1/noAutorestore/concurrent" }
            },
            { 
                name: "lever", location: { x: -11.2, y: 0, z: 28.4 },
                attributes: { rotateY: 180, locked: true, key: "keyToKingdom", controls: "kingdomGate:OpenL/3/5/1/noAutorestore/concurrent+OpenR/3/5/1/noAutorestore/concurrent+OpenBars/3/5/1/noAutorestore/concurrent", position: "up" }
            },
            { 
                name: "elevatorL_6m", location: { x: -3.8, y: 0, z: 25.8 },
            },
            { 
                name: "lever", location: { x: -7, y: 0, z: 24.4 },
                attributes: { controls: "elevatorL_6m:Move/5/9/1", rotateY: 45 }
            },
            { 
                name: "lever", location: { x: -6.2, y: 12.4, z: 24.8 },
                attributes: { controls: "elevatorL_6m:Move/5/9/1", staticStartingElevation: true, position: "up", rotateY: 45 }
            },
            { 
                name: "elevatorS_6m", location: { x: -26.1, y: 0, z: 25.8 },
            },
            { 
                name: "lever", location: { x: -24.2, y: 0, z: 25 },
                attributes: { controls: "elevatorS_6m:Move/5/9/1", rotateY: 315 }
            },
            { 
                name: "lever", location: { x: -27.2, y: 12.3, z: 24.3 },
                attributes: { controls: "elevatorS_6m:Move/5/9/1", staticStartingElevation: true, position: "up", rotateY: 45 }
            },
            { 
                name: "vikingShop", location: { x: -64.5, y: 0, z:  59 },
                attributes: { rotateY: 180 }
            },
            { 
                name: "platformBlock", location: { x: -64.5, y: 0, z: 55 },
                attributes: { elevation: -2, footControls: "vikingShop:doorAction/3/3/1/autorestore" } // duration/fadeOutDuration/fadeOutDelay/autorestore
            },
            { 
                name: "platformWood", location: { x: -64.5, y: 0, z:  57 },
                attributes: { elevation: 2, footControls: "vikingShop:doorAction/3/3/1/autorestore" }
            },
        ],
        entities: [
            { name: "rockyMan", type: "beast" },
            { name: "rockyMan", type: "beast" },
            { name: "rockyMan", type: "beast" },
            { name: "ghoul", type: "beast" },
            { name: "ghoul", type: "beast" },
            { name: "ghoul", type: "beast" },
            { name: "ghoul", type: "beast" },
            { name: "ghoul", type: "beast" },
            { name: "ghoul", type: "beast" },
            { name: "blacksmith", location: { x: 5, y: 0, z: -37.1 } },
            { name: "centurion", location: { x: -10.8, y: 0, z: 28.4 } },
            { name: "viking", location: { x: -8.8, y: 0, z: 11.15 } },
            { name: "elfgirl", location: { x: -62.4, y: 0, z: 59.1} },
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
                cutScenes: {
                    intro: "volcanoIntro.mkv"    
                },
                scale: 100,
                borderTrees: true,
                light: {
                    sunLight: true,
                    overheadPointLight: true,
                },
                fog: {
                    color: 'white',
                    density: 1.2
                },
                designateNPCs: true

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
            { name: "crystalMan", type: "beast" },
            { name: "crystalMan", type: "beast" },
            { name: "crystalMan", type: "beast" },
            { name: "crystalMan", type: "beast" },
            { name: "ghoul", type: "beast" },
            { name: "ghoul", type: "beast" },
            { name: "ghoul", type: "beast"  },
            { name: "triceratops", type: "beast" },
            { name: "triceratops", type: "beast" },
            { name: "iceGhoul", type: "beast"  },
            { name: "shockGhoul", type: "beast"  },
            { name: "gasGhoul", type: "beast"  },
            { name: "ghostGhoul", type: "beast"  },
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
                cutScenes: {
                    intro: "volcanoIntro.mkv"    
                },
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
                designateNPCs: true

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
                attributes: { locked: false, routeTo: { level: 3, location: { x: 40.45, y: 0, z: 19.9}  } } //swamp
            },
            { 
                name: "platformBlock", location: { x: 4.4, y: 0, z: 21.1},
                attributes: { locked: false, elevation: 5, routeTo: { level: 5, location: { x: -90.4, y: 0, z: 100.8 } } } //kingdom
            },
            { name: "tavernShop", location: { x: -3.5, y: 0, z: 0} },
            { 
                name: "platformBlock", location: { x: -.5, y: 0, z: .15 },
                attributes: { elevation: -5, footControls: "tavernShop:Walking in/3/3/0" }
            },
            { 
                name: "platformWood", location: { x: -1.5, y: 0, z: .15 },
                attributes: { elevation: 5, footControls: "tavernShop:Walking out/3/3/0" }
            }
        ],
        entities: [
            { name: "daveDragon", type: "beast" },
            { name: "viking", location: { x: -7.5, y: 0, z: 2.7 } },
            { name: "dragon", location: { x: -21.5, y: 0, z: -6.5}, type: "beast"},
            { name: "daveDragon", location: { x: -21.5, y: 0, z: -6.5}, type: "beast"},
            { name: "crystalMan", type: "beast" },
            { name: "crystalMan", type: "beast" },
            { name: "ghoul", type: "beast" },
            { name: "ghoul", type: "beast" }
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
                cutScenes: {
                    intro: "volcanoIntro.mkv"    
                },
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
                },
                designateNPCs: true

            }
        },
        items: [
            { name: "balloon", location: { x: -7.2, y: 6.0, z: 40 }  },
        ],
        structures: [
            { name: "ricketyPlatform", location: { x: -7.2, y: 0, z: 40 }  },
            { 
                name: "platformBlock", location: { x: -2.5, y: 0, z: 38.4 }, 
                attributes: { routeTo: { level: 5, location: { x: -3.3, y: 0, z: -67.5 } }} //kingdom
            },
            { 
                name: "platformBlock", location: { x: -19.5, y: 0, z: -6.5}, 
                attributes: { routeTo: { level: 4, location: { x: -18.0, y: 0, z: -6.5 } } } //lavaField
            }

        ],
        entities: [
            { name: "lavaGhoul", type: "beast" },
            { name: "lavaGhoul", type: "beast" },
            { name: "lavaGhoul", type: "beast" },
            // { name: "lavaGhoul", type: "beast" },
            // { name: "ghoul", type: "beast"  },
            // { name: "triceratops", type: "beast" },
            // { name: "triceratops", type: "beast" },
            // { name: "iceGhoul", type: "beast"  },
            // { name: "shockGhoul", type: "beast"  },
            // { name: "gasGhoul", type: "beast"  },
            // { name: "ghostGhoul", type: "beast"  },

        ]
    },
    {
        level: 9,
        width: 104, //26
        length: 104, //26
        description: "Volcano",
        background: 'clouds.png',
        backgroundNight: 'stars.png',
        terrain: {
            name: 'floor',
            type: 'floor',
            description: 'Volcano',
            gltf: 'volcano.glb',
            attributes: {
                emissiveIntensity: 10,
                cutScenes: {
                    intro: "volcanoIntro.mkv"    
                },
                scale: 100,
                borderTrees: false,
                light: {
                    sunLight: true,
                    overheadPointLight: false,
                },
                fog: {
                    color: 'white',
                    density: 1.2
                },
                designateNPCs: true

            }
        },
        items: [
            
        ],
        structures: [
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
            // { name: "lavaGhoul", type: "beast" },
            // { name: "lavaGhoul", type: "beast" },
            // { name: "lavaGhoul", type: "beast" },
            // { name: "lavaGhoul", type: "beast" },
        ]
    },
    {
        level: 10,
        width: 70, //26
        length: 70, //26
        description: "elvandor",
        background: 'clouds.png',
        backgroundNight: 'stars.png',
        terrain: {
            name: 'elvandor',
            type: 'floor',
            description: 'Elvandor',
            gltf: 'elvandor.glb',
            attributes: {
                cutScenes: {
                    intro: "volcanoIntro.mkv"    
                },
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
                },
                designateNPCs: true

            }
        },
        items: [
            
        ],
        structures: [
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
            // { name: "lavaGhoul", type: "beast" },
            // { name: "lavaGhoul", type: "beast" },
            // { name: "lavaGhoul", type: "beast" },
            // { name: "lavaGhoul", type: "beast" },
        ]
    }
 
]
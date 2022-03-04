export const Items = {
    gold: {
        name: 'gold',
        gltf: 'gold1.glb',
        image: 'gold.png',
        description: 'Gold',
        type: 'item',
        attributes: {
            value: 1, // in gold
            animates: false,
            scale: 100,
            elevation: 20
        }
    },    
    gold1: {
        name: 'gold1',
        gltf: 'gold1.glb',
        description: 'One perfect gold coin',
        type: 'item',
        attributes: {
            baseItemName: 'gold',
            quantity: 1,
            animates: false,
            scale: 100,
            elevation: 20
        }
    },
    gold3: {
        name: 'gold3',
        gltf: 'gold3.glb',
        description: 'Three gold coins',
        type: 'item',
        attributes: {
            baseItemName: 'gold',
            quantity: 3,
            animates: false,
            scale: 100,
            elevation: 20
        }
    },
    gold10: {
        name: 'gold10',
        gltf: 'gold10.glb',
        description: 'Ten gold coins',
        type: 'item',
        attributes: {
            baseItemName: 'gold',
            quantity: 10,
            animates: false,
            scale: 100,
            elevation: 20
        }
    },
    gold25: {
        name: 'gold25',
        gltf: 'gold25.glb',
        description: 'Twenty-five gold coins',
        type: 'item',
        attributes: {
            baseItemName: 'gold',
            quantity: 25,
            animates: false,
            scale: 100,
            elevation: 20
        }
    },
    rosenRelic: {
        name: 'rosenRelic',
        gltf: 'rosenRelic.glb',
        image: 'rosenRelic.png',
        description: 'A mystical figurine....',
        type: 'item',
        attributes: {
            animates: false,
            scale: 10,
            elevation: 20
        }
    },
    keyToShed: {
        name: 'keyToShed',
        gltf: 'key.gltf',
        image: 'keyCopper.png',
        description: 'A rusty old key with faint engravings',
        type: 'item',
        attributes: {
            animates: false,
            scale: 100,
            elevation: 20
        }
    },
    keyToHouse: {
        name: 'keyToHouse',
        gltf: 'key.gltf',
        image: 'keyCopper.png',
        description: 'A shiny housekey',
        type: 'item',
        attributes: {
            animates: false,
            scale: 30,
            elevation: 20
        }
    },
    keyToChest: {
        name: 'keyToChest',
        gltf: 'key.gltf',
        image: 'keyGolden.png',
        description: 'A small golden key',
        type: 'item',
        attributes: {
            animates: false,
            scale: 50,
            elevation: 10
        }
    },
    keyToChest2: {
        name: 'keyToChest2',
        gltf: 'key.gltf',
        image: 'keyGolden.png',
        description: 'A special key',
        type: 'item',
        attributes: {
            animates: false,
            scale: 50,
            elevation: 10
        }
    },
    keyToKingdom: {
        name: 'keyToKingdom',
        gltf: 'key.gltf',
        image: 'keyGolden.png',
        description: 'Key to the Kingdom',
        type: 'item',
        attributes: {
            animates: false,
            scale: 20,
            elevation: 10
        }
    },
    bagOfGems: {
        name: 'bagOfGems',
        gltf: 'bagOfGems.glb',
        image: 'bagOfGems.png',
        description: 'A small velvet bag full of gems',
        type: 'item',
        attributes: {
            value: 30, // in gold
            animates: false,
            scale: 100,
            elevation: 10
        }
    },
    bluepotion: {
        name: 'bluepotion',
        gltf: 'bluepotion.glb',
        image: 'bluepotion.png',
        description: 'A glowing blue mana potion',
        type: 'item',
        attributes: {
            animates: false,
            scale: 5,
            elevation: 10,
            effect: "mana/2",
            sprites: [{ 
                name: "heal",
                regex: "",
                frames: 10,
                scale: 50,
                elevation: 30,
                flip: false,
                time: 3
            }]
        }
    },
    greenpotion: {
        name: 'greenpotion',
        gltf: 'greenpotion.glb',
        image: 'greenpotion.png',
        description: 'A bubbling green potion',
        type: 'item',
        attributes: {
            animates: false,
            throwable: true,
            throwableAttributes: {
                pitch: .7, // angle up (percentage of 90 degrees)
                weight: 2, // lbs
                distance: 700, // px
                speed: 4 // 1 = full walking speed
            },
            scale: 5,
            equippedScale: 0.005,
            elevation: 10,
            effect: "damage/3",
            range: 40,
            sprites: [{ 
                name: "greenExplosion",
                regex: "",
                frames: 10,
                scale: 300,
                elevation: 30,
                flip: false,
                time: 3
            }]
        }
    },
    redpotion: {
        name: 'redpotion',
        gltf: 'redpotion.glb',
        image: 'redpotion.png',
        description: 'A gleaming red life potion',
        type: 'item',
        attributes: {
            animates: false,
            scale: 5,
            elevation: 10,
            effect: "health/2",
            sprites: [{ 
                name: "Heal",
                regex: "",
                frames: 15,
                scale: 50,
                elevation: 30,
                flip: false,
                time: 1
            }]
        }
    },
    blackpotion: {
        name: 'blackpotion',
        gltf: 'greenpotion.glb',
        image: 'greenpotion.png',
        description: 'A bubbling black potion',
        type: 'item',
        attributes: {
            animates: false,
            throwable: true,
            throwableAttributes: {
                pitch: .7, // angle up (percentage of 90 degrees)
                weight: 2, // lbs
                distance: 700, // px
                speed: 4 // 1 = full walking speed
            },
            scale: 5,
            equippedScale: 0.005,
            elevation: 10,
            effect: "damage/3",
            range: 40,
            sprites: [{ 
                name: "hitEffect",
                regex: "",
                frames: 9,
                scale: 1200,
                elevation: 30,
                flip: false,
                time: 3
            },
            { 
                name: "Heal",
                regex: "",
                frames: 15,
                scale: 500,
                elevation: 30,
                flip: false,
                time: 3
            }]
        }
    },
    mushroom: {
        name: 'mushroom',
        gltf: 'mushroom.glb',
        image: 'mushroom.png',
        description: 'A mysterious mushroom',
        type: 'item',
        attributes: {
            animates: false,
            scale: 100,
            elevation: 10,
            effect: "scale/1.5",
            sprites: [{ 
                name: "Heal",
                regex: "",
                frames: 15,
                scale: 50,
                elevation: 30,
                flip: false,
                time: 1
            }]
        }
    },
    smallSword: {
        name: 'smallSword',
        gltf: 'broadsword.glb',
        image: 'broadsword.png',
        description: 'A metallic blade, strong yet flexible',
        type: 'item',
        subtype: 'sword',
        attributes: {
            value: 1,
            equippable: ['Middle2R', 'Middle2L'],
            animates: false,
            scale: 100,
            elevation: 20,
            effect: "strength/1",
            effect: "light/15",
            sprites: [
                { 
                    name: "flame",
                    frames: 40,
                    scale: .05,
                    scaleY: 1.5,
                    translateZ: -.10,
                    flip: true,
                    showOnSeed: false,
                    showOnEquip: true,
                    elevation: 0
                },
                { 
                    name: "flame",
                    frames: 40,
                    scale: .05,
                    scaleY: 1.5,
                    translateZ: -.20,
                    flip: true,
                    showOnSeed: false,
                    showOnEquip: true,
                    elevation: 0
                },
                { 
                    name: "flame",
                    frames: 40,
                    scale: .05,
                    scaleY: 1.5,
                    translateZ: -.30,
                    flip: true,
                    showOnSeed: false,
                    showOnEquip: true,
                    elevation: 0
                },
                { 
                    name: "flame",
                    frames: 40,
                    scale: .05,
                    scaleY: 1.5,
                    translateZ: -.40,
                    flip: true,
                    showOnSeed: false,
                    showOnEquip: true,
                    elevation: 0
                },                { 
                    name: "flame",
                    frames: 40,
                    scale: .05,
                    scaleY: 1.5,
                    translateZ: -.15,
                    flip: true,
                    showOnSeed: false,
                    showOnEquip: true,
                    elevation: 0
                },
                { 
                    name: "flame",
                    frames: 40,
                    scale: .05,
                    scaleY: 1.5,
                    translateZ: -.25,
                    flip: true,
                    showOnSeed: false,
                    showOnEquip: true,
                    elevation: 0
                },
                { 
                    name: "flame",
                    frames: 40,
                    scale: .05,
                    scaleY: 1.5,
                    translateZ: -.35,
                    flip: true,
                    showOnSeed: false,
                    showOnEquip: true,
                    elevation: 0
                },
                { 
                    name: "flame",
                    frames: 40,
                    scale: .05,
                    scaleY: 1.5,
                    translateZ: -.45,
                    flip: true,
                    showOnSeed: false,
                    showOnEquip: true,
                    elevation: 0
                }

            ],
        } 
    },
    lightSaber: {
        name: 'lightSaber',
        gltf: 'lightSaber.glb',
        image: 'lightSaber.png',
        description: 'Red light saber',
        type: 'item',
        subtype: 'sword',
        attributes: {
            equippable: ['Middle2R', 'Middle2L'],
            animates: true,
            scale: 3,
            equippedScale: 0.003,
            elevation: 20,
            effect: "strength/1",
            animationOnEquip: true
        } 
    },
    axe: {
        name: 'axe',
        gltf: 'axe.glb',
        image: 'axe.png',
        description: 'Pokeman axe',
        type: 'item',
        subtype: 'sword',
        attributes: {
            equippable: ['Middle2R', 'Middle2L'],
            animates: false,
            scale: 30,
            equippedScale: 0.03,
            elevation: 20,
            effect: "strength/1",
            animationOnEquip: false
        } 
    },
    blackBlade: {
        name: 'blackBlade',
        gltf: 'blackBlade.glb',
        image: 'blackBlade.png',
        description: 'Black blade',
        type: 'item',
        subtype: 'sword',
        attributes: {
            equippable: ['Middle2R', 'Middle2L'],
            animates: false,
            scale: 60,
            equippedScale: 0.06,
            elevation: 20,
            effect: "strength/1",
            animationOnEquip: false
        } 
    },
    hammer: {
        name: 'hammer',
        gltf: 'hammer.glb',
        image: 'hammer.png',
        description: 'Hammer',
        type: 'item',
        subtype: 'sword',
        attributes: {
            equippable: ['Middle2R', 'Middle2L'],
            animates: false,
            scale: 30,
            equippedScale: 0.03,
            elevation: 20,
            effect: "strength/1",
            animationOnEquip: false
        } 
    },
    blazingBlade: {
        name: 'blazingBlade',
        gltf: 'blazingBlade.glb',
        image: 'blazingBlade.png',
        description: 'Blazing Blade',
        type: 'item',
        subtype: 'sword',
        attributes: {
            equippable: ['Middle2R', 'Middle2L'],
            animates: false,
            scale: 60,
            equippedScale: 0.06,
            elevation: 20,
            effect: "strength/1",
            animationOnEquip: false
        } 
    },
    natureBlade: {
        name: 'natureBlade',
        gltf: 'natureBlade.glb',
        image: 'natureBlade.png',
        description: 'Nature Blade',
        type: 'item',
        subtype: 'sword',
        attributes: {
            equippable: ['Middle2R', 'Middle2L'],
            animates: false,
            scale: 60,
            equippedScale: 0.06,
            elevation: 20,
            effect: "strength/1",
            animationOnEquip: false
        } 
    },
    waterBlade: {
        name: 'waterBlade',
        gltf: 'waterBlade.glb',
        image: 'waterBlade.png',
        description: 'Water Blade',
        type: 'item',
        subtype: 'sword',
        attributes: {
            equippable: ['Middle2R', 'Middle2L'],
            animates: false,
            scale: 60,
            equippedScale: 0.06,
            elevation: 20,
            effect: "strength/1",
            animationOnEquip: false
        } 
    },
    axe2: {
        name: 'axe2',
        gltf: 'axe2.glb',
        image: 'axe2.png',
        description: 'Viking war axe',
        type: 'item',
        subtype: 'sword',
        attributes: {
            equippable: ['Middle2R', 'Middle2L'],
            animates: false,
            scale: 1,
            equippedScale: 0.001,
            elevation: 20,
            effect: "strength/1",
            animationOnEquip: false
        } 
    },
    armor: {
        name: 'armor',
        gltf: 'armor.glb',
        image: 'armor.png',
        description: 'Heavy-duty armor',
        type: 'item',
        attributes: {
            equippable: ['Torso'],
            animates: false,
            scale: 20,
            equippedScale: 0.02,
            elevation: 20,
            effect: "defense/1"
        } 
    },
    supermanArmor: {
        name: 'supermanArmor',
        gltf: 'supermanArmor.glb',
        image: 'supermanArmor.png',
        description: 'Heavy-duty armor',
        type: 'item',
        attributes: {
            equippable: ['Torso'],
            animates: false,
            scale: 20,
            equippedScale: 0.02,
            elevation: 20,
            effect: "defense/3"
        } 
    },
    legacyArmor: {
        name: 'legacyArmor',
        gltf: 'legacyArmor.glb',
        image: 'legacyArmor.png',
        description: 'Heavy-duty armor',
        type: 'item',
        attributes: {
            equippable: ['Torso'],
            animates: false,
            scale: 20,
            equippedScale: 0.02,
            elevation: 20,
            effect: "defense/3"
        } 
    },
    chevyArmor: {
        name: 'chevyArmor',
        gltf: 'chevyArmor.glb',
        image: 'chevyArmor.png',
        description: 'Heavy-duty armor',
        type: 'item',
        attributes: {
            equippable: ['Torso'],
            animates: false,
            scale: 20,
            equippedScale: 0.02,
            elevation: 20,
            effect: "defense/2"
        } 
    },
    busterboot: {
        name: 'busterboot',
        gltf: 'busterboot.glb',
        image: 'busterboot.png',
        description: 'Light-weight armored boots',
        type: 'item',
        attributes: {
            equippable: ['FootL, FootR'],
            animates: false,
            scale: 40,
            equippedScale: 0.02,
            elevation: 0,
            effect: "agility/1"
        } 
    },
    helmet: {
        name: 'helmet',
        gltf: 'helmet.glb',
        image: 'helmet.png',
        description: 'Heavy-duty armor',
        type: 'item',
        attributes: {
            equippable: ['Head_end'],
            animates: false,
            scale: 40,
            equippedScale: .035,
            elevation: 20,
            effect: "defense/1"
        } 
    },
    bow: {
        name: 'bow',
        gltf: 'bow.glb',
        image: 'bow.png',
        description: 'A buster bow',
        type: 'item',
        subtype: 'bow',
        attributes: {
            equippable: ['Middle2R', 'Middle2L'],
            animates: true,
            defaultAction: "ArmatureAction",
            throwable: false,
            throws: "arrow",
            scale: 200,
            equippedScale: .2,
            elevation: 20,
            effect: "strength/1",
        } 
    },
    arrow: {
        name: 'arrow',
        gltf: 'arrow.glb',
        image: 'arrow.png',
        description: 'A buster arrow',
        type: 'item',
        attributes: {
            equippable: ['Middle2R', 'Middle2L'],
            animates: false,
            scale: 250,
            equippedScale: 0.3,
            throwable: true,
            throwableAttributes: {
                pitch: .5, // angle up (percentage of 90 degrees)
                weight: 1, // lbs
                distance: 1200, // px
                speed: 4, // 1 = full walking speed
                chanceToLeaveOnGround: 0.5
            },
            elevation: 10,
            effect: "damage/5",
            range: 20
        }         
    },
    arrow25: {
        name: 'arrow25',
        gltf: 'arrow25.glb',
        description: 'Twenty-five arrows',
        type: 'item',
        attributes: {
            baseItemName: 'arrow',
            quantity: 25,
            animates: false,
            scale: 200,
            elevation: 10
        }
    },
    busterblade: {
        name: 'busterblade',
        gltf: 'busterblade.glb',
        image: 'busterblade.png',
        description: 'A buster blade',
        type: 'item',
        subtype: 'sword',
        attributes: {
            equippable: ['Middle2R', 'Middle2L'],
            animates: false,
            scale: 100,
            elevation: 20,
            effect: "strength/2"
        } 
    },
    busterbuckler: {
        name: 'busterbuckler',
        gltf: 'busterbuckler.glb',
        image: 'busterbuckler.png',
        description: 'A buster buckler',
        type: 'item',
        subtype: 'shield',
        attributes: {
            equippable: ['Middle2R', 'Middle2L'],
            animates: false,
            scale: 100,
            elevation: 20,
            effect: "defense/1"
        } 
    },
    waterShield: {
        name: 'waterShield',
        gltf: 'waterShield.glb',
        image: 'waterShield.png',
        description: 'A water shield',
        type: 'item',
        subtype: 'shield',
        attributes: {
            equippable: ['Middle2R', 'Middle2L'],
            animates: false,
            scale: 100,
            elevation: 20,
            effect: "defense/2"
        } 
    },
    thunderShield: {
        name: 'thunderShield',
        gltf: 'thunderShield.glb',
        image: 'thunderShield.png',
        description: 'A thunder shield',
        type: 'item',
        subtype: 'shield',
        attributes: {
            equippable: ['Middle2R', 'Middle2L'],
            animates: false,
            scale: 100,
            elevation: 20,
            effect: "defense/3"
        } 
    },
    blazingShield: {
        name: 'blazingShield',
        gltf: 'blazingShield.glb',
        image: 'blazingShield.png',
        description: 'A blazing shield',
        type: 'item',
        subtype: 'shield',
        attributes: {
            equippable: ['Middle2R', 'Middle2L'],
            animates: false,
            scale: 100,
            elevation: 20,
            effect: "defense/3"
        } 
    },
    torch: {
        name: 'torch',
        gltf: 'torch.glb',
        image: 'torch.png',
        description: 'A simple wooden torch',
        type: 'item',
        attributes: {
            equippable: ['Middle2R', 'Middle2L'],
            animates: false,
            scale: 100,
            elevation: 5,
            effect: "light/15",
            sprites: [{ 
                name: "flame",
                frames: 40,
                scale: .05,
                scaleY: 1.5,
                translateZ: -.30,
                flip: true,
                showOnSeed: false,
                showOnEquip: true,
                elevation: 0
            }],
        } 
    },
    mace: {
        name: 'mace',
        gltf: 'mace.glb',
        image: 'mace.png',
        description: 'A metallic mace',
        type: 'item',
        subtype: 'sword',
        attributes: {
            equippable: ['Middle2R', 'Middle2L'],
            animates: false,
            scale: 100,
            elevation: 0,
            effect: "strength/2"
        } 
    },
    direMace: {
        name: 'direMace',
        gltf: 'direMace.glb',
        image: 'direMace.png',
        description: 'A dire mace',
        type: 'item',
        subtype: 'sword',
        attributes: {
            equippable: ['Middle2R', 'Middle2L'],
            animates: false,
            equippedScale: 0.003,
            scale: 3,
            elevation: 0,
            effect: "strength/2"
        } 
    },
    crystalBall: {
        name: 'crystalBall',
        gltf: 'crystalball.glb',
        image: 'crystalBall.png',
        description: 'A gleaming ball of crystal',
        type: 'item',
        attributes: {
            equippable: ['special'],
            animates: false,
            scale: 50,
            elevation: 30,
            effect: "mana/2"
        }
    },
    orb: {
        name: 'orb',
        gltf: 'orb.glb',
        image: 'orb.png',
        description: 'Gyrating elements in a sphere',
        type: 'item',
        attributes: {
            equippable: ['special'],
            animates: true,
            scale: 50,
            elevation: 30,
            effect: "mana/2",
            animatesRecurring: true
        }
    },
    katana: {
        name: 'katana',
        gltf: 'katana.glb',
        image: 'katana.png',
        description: 'Blood-stained weapon of the Samurai',
        type: 'item',
        subtype: 'sword',
        attributes: {
            flipWeapon: true,
            equippable: ['Middle2R', 'Middle2L'],
            equippedScale: 0.015,
            animates: false,
            scale: 15,
            elevation: 0,
            effect: "strength/3"
        } 
    },
    zyphosSword: {
        name: 'zyphosSword',
        gltf: 'zyphosSword.glb',
        image: 'zyphosSword.png',
        description: 'Ancient sword',
        type: 'item',
        subtype: 'sword',
        attributes: {
            flipWeapon: true,
            equippable: ['Middle2R', 'Middle2L'],
            equippedScale: 0.003,
            animates: false,
            scale: 3,
            elevation: 0,
            effect: "strength/3"
        } 
    },    
    gladiusSword: {
        name: 'gladiusSword',
        gltf: 'gladiusSword.glb',
        image: 'gladiusSword.png',
        description: 'Ancient Long Sword',
        type: 'item',
        subtype: 'sword',
        attributes: {
            flipWeapon: true,
            equippable: ['Middle2R', 'Middle2L'],
            equippedScale: 0.002,
            animates: false,
            scale: 2,
            elevation: 0,
            effect: "strength/3"
        } 
    },
    cavalier: {
        name: 'cavalier',
        gltf: 'cavalier.glb',
        image: 'cavalier.png',
        description: 'Cavalier Sword',
        type: 'item',
        subtype: 'sword',
        attributes: {
            flipWeapon: true,
            equippable: ['Middle2R', 'Middle2L'],
            equippedScale: 0.0015,
            animates: false,
            scale: 1.5,
            elevation: 0,
            effect: "strength/3"
        } 
    },
    crusader: {
        name: 'crusader',
        gltf: 'crusader.glb',
        image: 'crusader.png',
        description: 'The crusader sword',
        type: 'item',
        subtype: 'sword',
        attributes: {
            flipWeapon: true,
            equippable: ['Middle2R', 'Middle2L'],
            equippedScale: 0.003,
            animates: false,
            scale: 3,
            elevation: 0,
            effect: "strength/3"
        } 

    },
    aluminium: {
        name: 'aluminium',
        gltf: 'aluminium.glb',
        image: 'aluminium.png',
        description: 'Aluminium',
        type: 'item',
        attributes: {
            value: 1, // in gold
            animates: false,
            scale: 400,
            elevation: 20
        }
    },
    chromium: {
        name: 'chromium',
        gltf: 'chromium.glb',
        image: 'chromium.png',
        description: 'Chromium',
        type: 'item',
        attributes: {
            value: 1, // in gold
            animates: false,
            scale: 400,
            elevation: 20
        }
    },
    copper: {
        name: 'copper',
        gltf: 'copper.glb',
        image: 'copper.png',
        description: 'Copper',
        type: 'item',
        attributes: {
            value: 1, // in gold
            animates: false,
            scale: 400,
            elevation: 20
        }
    },
    iron: {
        name: 'iron',
        gltf: 'iron.glb',
        image: 'iron.png',
        description: 'Iron',
        type: 'item',
        attributes: {
            value: 1, // in gold
            animates: false,
            scale: 400,
            elevation: 20
        }
    },
    manganese: {
        name: 'manganese',
        gltf: 'manganese.glb',
        image: 'manganese.png',
        description: 'Manganese',
        type: 'item',
        attributes: {
            value: 1, // in gold
            animates: false,
            scale: 400,
            elevation: 20
        }
    },
    molybdenum: {
        name: 'molybdenum',
        gltf: 'molybdenum.glb',
        image: 'molybdenum.png',
        description: 'Molybdenum',
        type: 'item',
        attributes: {
            value: 1, // in gold
            animates: false,
            scale: 400,
            elevation: 20
        }
    },
    platinum: {
        name: 'platinum',
        gltf: 'platinum.glb',
        image: 'platinum.png',
        description: 'Platinum',
        type: 'item',
        attributes: {
            value: 1, // in gold
            animates: false,
            scale: 400,
            elevation: 20
        }
    },
    rhenium: {
        name: 'rhenium',
        gltf: 'rhenium.glb',
        image: 'rhenium.png',
        description: 'Rhenium',
        type: 'item',
        attributes: {
            value: 1, // in gold
            animates: false,
            scale: 400,
            elevation: 20
        }
    },
    ruthenium: {
        name: 'ruthenium',
        gltf: 'ruthenium.glb',
        image: 'ruthenium.png',
        description: 'Ruthenium',
        type: 'item',
        attributes: {
            value: 1, // in gold
            animates: false,
            scale: 400,
            elevation: 20
        }
    },
    silver: {
        name: 'silver',
        gltf: 'silver.glb',
        image: 'silver.png',
        description: 'Silver',
        type: 'item',
        attributes: {
            value: 1, // in gold
            animates: false,
            scale: 400,
            elevation: 20
        }
    },
    titanium: {
        name: 'titanium',
        gltf: 'titanium.glb',
        image: 'titanium.png',
        description: 'Titanium',
        type: 'item',
        attributes: {
            value: 1, // in gold
            animates: false,
            scale: 400,
            elevation: 20
        }
    },
    wolfram: {
        name: 'wolfram',
        gltf: 'wolfram.glb',
        image: 'wolfram.png',
        description: 'Wolfram',
        type: 'item',
        attributes: {
            value: 1, // in gold
            animates: false,
            scale: 400,
            elevation: 20
        }
    },
    iceSword: {
        name: 'iceSword',
        gltf: 'iceSword.glb',
        image: 'iceSword.png',
        description: 'Ice sword of the north',
        type: 'item',
        subtype: 'sword',
        attributes: {
            flipWeapon: true,
            equippable: ['Middle2R', 'Middle2L'],
            equippedScale: 0.003,
            animates: false,
            scale: 3,
            elevation: 0,
            effect: "strength/3"
        } 
    },    
    heavyAxe: {
        name: 'heavyAxe',
        gltf: 'heavyAxe.glb',
        image: 'heavyAxe.png',
        description: 'Deadly piercing weapon',
        type: 'item',
        subtype: 'sword',
        attributes: {
            flipWeapon: true,
            equippable: ['Middle2R', 'Middle2L'],
            equippedScale: 0.003,
            animates: false,
            scale: 3,
            elevation: 0,
            effect: "strength/3"
        } 
    },

    balloon: {
        name: 'balloon',
        gltf: 'balloon.glb',
        description: 'Festive hot-air balloon',
        type: 'item',
        attributes: {
            equippedScale: 30,
            staticStartingElevation: true,
            rotateY: 180,
            animates: false,
            scale: 30,
            elevation: 30,
            addToStructureModels: true
        }
    },
}
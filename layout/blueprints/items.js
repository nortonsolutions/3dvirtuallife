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
                time: 1
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
        attributes: {
            equippable: ['Middle2R', 'Middle2L'],
            animates: false,
            scale: 100,
            elevation: 20,
            effect: "strength/1"
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
            scale: 100,
            equippedScale: 0.02,
            elevation: 20,
            effect: "defense/1"
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
                speed: 4 // 1 = full walking speed
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
        attributes: {
            equippable: ['Middle2R', 'Middle2L'],
            animates: false,
            scale: 100,
            elevation: 20,
            effect: "defense/1"
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
            effect: "light/15"
        } 
    },
    mace: {
        name: 'mace',
        gltf: 'mace.glb',
        image: 'mace.png',
        description: 'A metallic mace',
        type: 'item',
        attributes: {
            equippable: ['Middle2R', 'Middle2L'],
            animates: false,
            scale: 100,
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
    }
}
let convo = {
    accept: { text: "Yes, I accept", type: "engage" },
    decline: { text: "No, thank you", type: "disengage" },
    engage: { text: "<Engage the conversation>", type: "engage" },
    disengage: { text: "<Disengage the conversation>", type: "disengage" },
    wellwish: { text: "Well wishes to you, my friend.", type: "neutral" },
    empathize: { text: "<Empathize and ask more>", type: "engage" },
    shop: { type: "shop" }
}

export const Entities = {
    evilOne: {
        name: 'evilOne',
        gltf: 'boy.glb',
        description: 'An autonomous machine with no apparent motive',
        type: 'beast',
        attributes: {
            moves: true,
            animates: true,
            height: 30,
            length: 20,
            width: 20,
            elevation: 0,
            scale: 20,
            stats: {
                health: "2/2/0",
                mana: "0/0/0",
                strength: "2/2/0",
                agility: "2/2/0",
                defense: "1/1/0", // rock, weapon, arrow damage defense
                fire: "0/0/0",
                ice: "0/0/0",
                poison: "1/1/0",
                thunder: "0/0/0"
            },
            grants: ["gold3"]
        }
    },
    lavaMan: {
        name: 'lavaMan',
        gltf: 'lavaMan.glb',
        description: 'Lava man',
        type: 'beast',
        attributes: {
            moves: true,
            animates: true,
            height: 80,
            length: 20,
            width: 20,
            elevation: 0,
            scale: 100,
            stats: {
                health: "5/5/0",
                mana: "0/0/0",
                strength: "4/4/0",
                agility: "2/2/0",
                defense: "0/0/0", // rock, weapon, arrow damage defense
                fire: "5/5/0",
                ice: "0/0/0",
                poison: "0/0/0",
                thunder: "0/0/0"
            },
            grants: ["gold25"]
        }
    },
    rockyMan: {
        name: 'rockyMan',
        gltf: 'rockyMan.glb',
        description: 'Rocky man',
        type: 'beast',
        attributes: {
            moves: true,
            animates: true,
            height: 30,
            length: 20,
            width: 20,
            elevation: 0,
            scale: 100,
            stats: {
                health: "5/5/0",
                mana: "0/0/0",
                strength: "4/4/0",
                agility: "2/2/0",
                defense: "1/1/0", // rock, weapon, arrow damage defense
                fire: "0/0/0",
                ice: "0/0/0",
                poison: "0/0/0",
                thunder: "0/0/0"
            },
            grants: ["gold25"],
            rangedSpell: 'rockProjectileSpell'
        }
    },
    crystalMan: {
        name: 'crystalMan',
        gltf: 'crystalMan.glb',
        description: 'Crystal man',
        type: 'beast',
        attributes: {
            moves: true,
            animates: true,
            height: 80,
            length: 20,
            width: 20,
            elevation: 0,
            scale: 100,
            stats: {
                health: "5/5/0",
                mana: "0/0/0",
                strength: "4/4/0",
                agility: "2/2/0",
                defense: "0/0/0", // rock, weapon, arrow damage defense
                fire: "1/1/0",
                ice: "1/1/0",
                poison: "1/1/0",
                thunder: "1/1/0"
            },
            grants: ["gold25"]
        }
    },
    rosen: {
        name: 'rosen',
        gltf: 'rosen.glb',
        description: 'UDC Inmate',
        type: 'beast',
        attributes: {
            moves: true,
            animates: true,
            height: 50,
            length: 20,
            width: 20,
            elevation: 100,
            scale: 10,
            stats: {
                health: "2/2/0",
                mana: "0/0/0",
                strength: "2/2/0",
                agility: "2/2/0",
                defense: "0/0/0", // rock, weapon, arrow damage defense
                fire: "0/0/0",
                ice: "0/0/0",
                poison: "0/0/0",
                thunder: "0/0/0"
            },
            grants: ["gold3"]
        }
    },
    lobot: {
        name: 'lobot',
        gltf: 'lobot.glb',
        description: 'Gnomish freakazoid',
        type: 'beast',
        attributes: {
            moves: true,
            animates: true,
            height: 30,
            length: 20,
            width: 20,
            elevation: 100,
            scale: 10,
            stats: {
                health: "2/2/0",
                mana: "0/0/0",
                strength: "2/2/0",
                agility: "2/2/0",
                defense: "0/0/0", // rock, weapon, arrow damage defense
                fire: "0/0/0",
                ice: "0/0/0",
                poison: "0/0/0",
                thunder: "0/0/0"
            },
            grants: ["gold3"]
        }
    },
    blueShirt: {
        name: 'blueShirt',
        gltf: 'blueShirt.glb',
        description: 'Blue-shirted guy',
        type: 'beast',
        attributes: {
            moves: true,
            animates: true,
            height: 30,
            length: 20,
            width: 20,
            elevation: 100,
            scale: 40,
            stats: {
                health: "2/2/0",
                mana: "0/0/0",
                strength: "2/2/0",
                agility: "2/2/0",
                defense: "0/0/0", // rock, weapon, arrow damage defense
                fire: "0/0/0",
                ice: "0/0/0",
                poison: "0/0/0",
                thunder: "0/0/0"
            },
            grants: ["gold3"]
        }
    },
    rat: {
        name: 'rat',
        gltf: 'rat.glb',
        description: 'A rat with fire in its eyes; ready to attack',
        type: 'beast',
        attributes: {
            moves: true,
            animates: true,
            height: 10,
            length: 80,
            width: 20,
            elevation: 0,
            scale: 60,
            stats: {
                health: "4/4/0",
                mana: "0/0/0",
                strength: "2/2/0",
                agility: "3/3/0",
                defense: "1/1/0", // rock, weapon, arrow damage defense
                fire: "0/0/0",
                ice: "0/0/0",
                poison: "0/0/0",
                thunder: "0/0/0"
            },
            grants: ["gold10"]
        }
    },
    crocodile: {
        name: 'crocodile',
        gltf: 'crocodile.glb',
        description: 'Slithering crocodile',
        type: 'beast',
        attributes: {
            moves: true,
            animates: true,
            swims: true,
            height: 10,
            length: 80,
            width: 20,
            elevation: 0,
            scale: 10,
            stats: {
                health: "4/4/0",
                mana: "0/0/0",
                strength: "2/2/0",
                agility: "3/3/0",
                defense: "2/2/0", // rock, weapon, arrow damage defense
                fire: "0/0/0",
                ice: "0/0/0",
                poison: "0/0/0",
                thunder: "0/0/0"
            },
            grants: ["gold10"]
        }
    },
    catFish: {
        name: 'catFish',
        gltf: 'catFish.glb',
        image: 'catFish.png',
        description: 'Gangly catfish',
        type: 'beast',
        subtype: 'fish',
        attributes: {
            moves: true,
            animates: true,
            swims: true,
            docile: true,
            catchable: true,
            movementRadius: 100,
            height: 10,
            length: 30,
            width: 20,
            elevation: 0,
            scale: 5,
            stats: {
                health: "4/4/0",
                mana: "0/0/0",
                strength: "2/2/0",
                agility: "3/3/0",
                defense: "2/2/0", // rock, weapon, arrow damage defense
                fire: "0/0/0",
                ice: "0/0/0",
                poison: "0/0/0",
                thunder: "0/0/0"
            },
            grants: ["gold10"]
        }
    },

    carp: {
        name: 'carp',
        gltf: 'carp.glb',
        image: 'carp.png',
        description: 'Slimy carp',
        type: 'beast',
        subtype: 'fish',
        attributes: {
            moves: true,
            animates: true,
            swims: true,
            docile: true,
            catchable: true,
            movementRadius: 100,
            height: 10,
            length: 30,
            width: 20,
            elevation: 0,
            scale: 5,
            stats: {
                health: "4/4/0",
                mana: "0/0/0",
                strength: "2/2/0",
                agility: "3/3/0",
                defense: "2/2/0", // rock, weapon, arrow damage defense
                fire: "0/0/0",
                ice: "0/0/0",
                poison: "0/0/0",
                thunder: "0/0/0"
            },
            grants: ["gold10"]
        }
    },
    jelly: {
        name: 'jelly',
        gltf: 'jelly.glb',
        description: 'Jelly',
        type: 'beast',
        attributes: {
            moves: true,
            animates: true,
            height: 10,
            length: 40,
            width: 20,
            elevation: 0,
            scale: 30,
            stats: {
                health: "4/4/0",
                mana: "0/0/0",
                strength: "0/0/0",
                agility: "3/3/0",
                defense: "0/0/0", // rock, weapon, arrow damage defense
                fire: "0/0/0",
                ice: "0/0/0",
                poison: "0/0/0",
                thunder: "0/0/0"
            },
            grants: ["gold10"]
        }
    },
    dragon: {
        name: 'dragon',
        gltf: 'dragon.glb',
        description: 'Dragon',
        type: 'beast',
        attributes: {
            moves: true,
            animates: true,
            height: 10,
            length: 120,
            width: 20,
            elevation: 0,
            scale: 60,
            stats: {
                health: "4/4/0",
                mana: "60/60/0",
                strength: "2/2/0",
                agility: "3/3/0",
                defense: "1/1/0", // rock, weapon, arrow damage defense
                fire: "5/5/0",
                ice: "1/1/0",
                poison: "1/1/0",
                thunder: "0/0/0"
            },
            grants: ["gold10"],
            rangedSpell: 'fireProjectileSpell'
        }
    },
    triceratops: {
        name: 'triceratops',
        gltf: 'triceratops.glb',
        description: 'Triceratops',
        type: 'beast',
        attributes: {
            moves: true,
            animates: true,
            height: 10,
            length: 100,
            width: 20,
            elevation: 0,
            scale: 25,
            stats: {
                health: "4/4/0",
                mana: "60/60/0",
                strength: "2/2/0",
                agility: "1/1/0",
                defense: "4/4/0", // rock, weapon, arrow damage defense
                fire: "0/0/0",
                ice: "0/0/0",
                poison: "0/0/0",
                thunder: "0/0/0"
            },
            grants: ["animalskin", "food"],
            // rangedSpell: 'fireProjectileSpell'
      
        }
    },
    trex: {
        name: 'trex',
        gltf: 'trex.glb',
        description: 'Tyranosaurus Rex',
        type: 'beast',
        attributes: {
            moves: true,
            animates: true,
            height: 50,
            length: 40,
            width: 20,
            elevation: 0,
            scale: 200,
            stats: {
                health: "4/4/0",
                mana: "60/60/0",
                strength: "2/2/0",
                agility: "1/1/0",
                defense: "5/5/0", // rock, weapon, arrow damage defense
                fire: "0/0/0",
                ice: "0/0/0",
                poison: "0/0/0",
                thunder: "2/2/0"
            },
            grants: ["gold10"],
            // rangedSpell: 'fireProjectileSpell'
        }
    },
    daveDragon: {
        name: 'daveDragon',
        gltf: 'daveDragon.glb',
        description: 'Lobato Dragon',
        type: 'beast',
        attributes: {
            moves: true,
            animates: true,
            height: 10,
            length: 300,
            width: 20,
            elevation: 0,
            scale: 50,
            stats: {
                health: "4/4/0",
                mana: "60/60/0",
                strength: "2/2/0",
                agility: "3/3/0",
                defense: "7/7/0", // rock, weapon, arrow damage defense
                fire: "7/7/0",
                ice: "0/0/0",
                poison: "7/7/0",
                thunder: "3/3/0"
            },
            grants: ["gold10"],
            rangedSpell: 'fireProjectileSpell'
        }
    },
    bat: {
        name: 'bat',
        gltf: 'bat.glb',
        description: 'A bat',
        type: 'beast',
        attributes: {
            moves: true,
            animates: true,
            height: 10,
            length: 80,
            width: 20,
            elevation: 0,
            scale: 5,
            stats: {
                health: "4/4/0",
                mana: "0/0/0",
                strength: "2/2/0",
                agility: "3/3/0",
                defense: "1/1/0", // rock, weapon, arrow damage defense
                fire: "0/0/0",
                ice: "0/0/0",
                poison: "0/0/0",
                thunder: "0/0/0"
            },
            grants: ["gold10"]
        }
    },
    murderBear: {
        name: 'murderBear',
        gltf: 'murderBear.glb',
        description: 'Crazy yet agile man dressed in a bear suit',
        type: 'beast',
        attributes: {
            moves: true,
            animates: true,
            height: 30,
            length: 20,
            width: 20,
            elevation: 0,
            scale: 15,
            stats: {
                health: "4/4/0",
                mana: "0/0/0",
                strength: "2/2/0",
                agility: "3/3/0",
                defense: "2/2/0", // rock, weapon, arrow damage defense
                fire: "0/0/0",
                ice: "0/0/0",
                poison: "0/0/0",
                thunder: "2/2/0"
            },
            grants: ["gold10","katana"]
        }
    },
    viking: {
        name: 'viking',
        gltf: 'viking.glb',
        description: 'Viking with violent tendencies',
        type: 'friendly',
        inventory: [
            {itemName:"zyphosSword",quantity:1,price:"gold/3,smallSword/1,aluminium/1"},
            {itemName:"gladiusSword",quantity:1,price:"gold/700"},
            {itemName:"cavalier",quantity:1,price:"gold/900"},
            {itemName:"crusader",quantity:1,price:"gold/500"},
            {itemName:"iceSword",quantity:1,price:"gold/250"},
            {itemName:"heavyAxe",quantity:1,price:"gold/300"},
        ],
        attributes: {
            moves: true,
            animates: true,
            height: 30,
            dialogHeight: 60,
            length: 20,
            width: 20,
            elevation: 0,
            scale: 17,
            goldValue: 1.1, // Slightly higher value of gold on exchanges
            conversation: {
                conversationState: "intro",
                engagementState: 0,
                special: {
                    condition: ["bagOfGems","gold","aluminium","smallSword"],
                    speech: 'Welcome to my shop, my friend.',
                    action: 'showWares'
                },
                intro: {
                    speech: "Hello there, stranger.  Come back when you have something to trade.", 
                    responses: [convo.wellwish]
                }
            },
            stats: {
                health: "4/4/0",
                mana: "0/0/0",
                strength: "2/2/0",
                agility: "3/3/0",
                defense: "1/1/0", // rock, weapon, arrow damage defense
                fire: "1/1/0",
                ice: "1/1/0",
                poison: "1/1/0",
                thunder: "1/1/0"
            },
            handScaleFactor: 60,
            grants: ["gold10","axe2"]
        },
        equipped: {"Middle2R":["axe2",false,null]}
    },
    elfgirl: {
        name: 'elfgirl',
        gltf: 'elfgirl.glb',
        description: 'Elvish woman',
        type: 'friendly',
        inventory: [
            {itemName:"houseSmall",quantity:1,price:"gold/2"},
            {itemName:"houseMedium",quantity:1,price:"gold/2"},
            {itemName:"houseLarge",quantity:1,price:"gold/3"},
        ],
        attributes: {
            moves: true,
            animates: true,
            height: 30,
            dialogHeight: 45,
            length: 20,
            width: 20,
            elevation: 0,
            scale: 30,
            goldValue: 1.1, // Slightly higher value of gold on exchanges
            conversation: {
                conversationState: "intro",
                engagementState: 0,
                special: {
                    condition: ["bagOfGems","gold"],
                    speech: 'Welcome to my shop, my friend.',
                    action: 'showWares'
                },
                intro: {
                    speech: "Hello there, stranger.  Come back when you have something to trade.", 
                    responses: [convo.wellwish]
                }
            },
            stats: {
                health: "4/4/0",
                mana: "0/0/0",
                strength: "2/2/0",
                agility: "1/1/0",
                defense: "0/0/0", // rock, weapon, arrow damage defense
                fire: "0/0/0",
                ice: "0/0/0",
                poison: "0/0/0",
                thunder: "0/0/0"
            }
        },
    },
    zombie: {
        name: 'zombie',
        gltf: 'zombie.glb',
        description: 'Zombie',
        type: 'beast',
        attributes: {
            moves: true,
            animates: true,
            height: 30,
            dialogHeight: 30,
            length: 20,
            width: 20,
            elevation: 0,
            scale: 15,
            stats: {
                health: "4/4/0",
                mana: "0/0/0",
                strength: "2/2/0",
                agility: "3/3/0",
                defense: "0/0/0", // rock, weapon, arrow damage defense
                fire: "0/0/0",
                ice: "0/0/0",
                poison: "0/0/0",
                thunder: "0/0/0"
            },
            grants: ["gold10"]
        },
    },
    ghoul: {
        name: 'ghoul',
        gltf: 'ghoul.glb',
        description: 'Menacing ghoul',
        type: 'beast',
        attributes: {
            moves: true,
            animates: true,
            height: 30,
            length: 20,
            width: 20,
            elevation: 0,
            scale: 15,
            stats: {
                health: "4/4/0",
                mana: "0/0/0",
                strength: "2/2/0",
                agility: "3/3/0",
                defense: "2/2/0", // rock, weapon, arrow damage defense
                fire: "0/0/0",
                ice: "0/0/0",
                poison: "0/0/0",
                thunder: "0/0/0"
            },
            grants: ["gold10"],
            // rangedSpell: 'poisonProjectileSpell'
        }
    },
    lavaGhoul: {
        name: 'lavaGhoul',
        gltf: 'lavaGhoul.glb',
        description: 'Menacing red lava ghoul',
        type: 'beast',
        attributes: {
            moves: true,
            animates: true,
            height: 30,
            length: 20,
            width: 20,
            elevation: 600,
            scale: 15,
            stats: {
                health: "4/4/0",
                mana: "0/0/0",
                strength: "2/2/0",
                agility: "3/3/0",
                defense: "1/1/0", // rock, weapon, arrow damage defense
                fire: "5/5/0",
                ice: "0/0/0",
                poison: "1/1/0",
                thunder: "0/0/0"
            },
            grants: ["gold10"],
            rangedSpell: 'fireProjectileSpell'
        }
    },
    shockGhoul: {
        name: 'shockGhoul',
        gltf: 'shockGhoul.glb',
        description: 'Menacing blue shock ghoul',
        type: 'beast',
        attributes: {
            moves: true,
            animates: true,
            height: 30,
            length: 20,
            width: 20,
            elevation: 600,
            scale: 15,
            stats: {
                health: "4/4/0",
                mana: "0/0/0",
                strength: "2/2/0",
                agility: "3/3/0",
                defense: "1/1/0", // rock, weapon, arrow damage defense
                fire: "0/0/0",
                ice: "0/0/0",
                poison: "1/1/0",
                thunder: "5/5/0"
            },
            grants: ["gold10"],
            rangedSpell: 'lightningBoltSpell'
        }
    },
    iceGhoul: {
        name: 'iceGhoul',
        gltf: 'iceGhoul.glb',
        description: 'Menacing ice ghoul',
        type: 'beast',
        attributes: {
            moves: true,
            animates: true,
            height: 30,
            length: 20,
            width: 20,
            elevation: 600,
            scale: 15,
            stats: {
                health: "4/4/0",
                mana: "0/0/0",
                strength: "2/2/0",
                agility: "3/3/0",
                defense: "1/1/0", // rock, weapon, arrow damage defense
                fire: "0/0/0",
                ice: "5/5/0",
                poison: "0/0/0",
                thunder: "0/0/0"
            },
            grants: ["gold10"],
            rangedSpell: 'iceProjectileSpell'
        }
    },
    ghostGhoul: {
        name: 'ghostGhoul',
        gltf: 'ghostGhoul.glb',
        description: 'Menacing ghost ghoul',
        type: 'beast',
        attributes: {
            moves: true,
            animates: true,
            height: 30,
            length: 20,
            width: 20,
            elevation: 600,
            scale: 15,
            stats: {
                health: "4/4/0",
                mana: "0/0/0",
                strength: "2/2/0",
                agility: "3/3/0",
                defense: "1/1/0", // rock, weapon, arrow damage defense
                fire: "1/1/0",
                ice: "1/1/0",
                poison: "1/1/0",
                thunder: "5/5/0"
            },
            grants: ["gold10"],
            rangedSpell: 'lightningBoltSpell'
        }
    },
    gasGhoul: {
        name: 'gasGhoul',
        gltf: 'gasGhoul.glb',
        description: 'Menacing gas ghoul',
        type: 'beast',
        attributes: {
            moves: true,
            animates: true,
            height: 30,
            length: 20,
            width: 20,
            elevation: 600,
            scale: 15,
            stats: {
                health: "4/4/0",
                mana: "0/0/0",
                strength: "2/2/0",
                agility: "3/3/0",
                defense: "1/1/0", // rock, weapon, arrow damage defense
                fire: "0/0/0",
                ice: "0/0/0",
                poison: "5/5/0",
                thunder: "0/0/0"
            },
            grants: ["gold10"],
            rangedSpell: 'poisonProjectileSpell'
        }
    },

    pug: {
        name: 'pug',
        gltf: 'pug.glb',
        image: 'pug.png',
        description: 'Regal pug',
        type: 'friendly',
        attributes: {
            moves: true,
            animates: true,
            height: 35,
            length: 30,
            width: 20,
            elevation: 0,
            equippedScale: .35,
            scale: 20,
            stats: {
                health: "4/4/0",
                mana: "0/0/0",
                strength: "0/0/0",
                agility: "1/1/0",
                defense: "5/5/0", // rock, weapon, arrow damage defense
                fire: "0/0/0",
                ice: "0/0/0",
                poison: "0/0/0",
                thunder: "0/0/0"
            },
            grants: ["gold10"]
        }
    },

    horse: {
        name: 'horse',
        gltf: 'horse.glb',
        image: 'horse.png',
        description: 'Strong horse',
        type: 'friendly',
        attributes: {
            movingAnimations: "horse_A_/2/1/1/false/false/looprepeat",
            runningAnimations: "horse_A_/2/1/1/false/false/looprepeat",
            mountable: true,
            moves: true,
            animates: true,
            height: 35,
            length: 50,
            width: 20,
            elevation: -10,
            equippedScale: .35,
            scale: .35,
            stats: {
                health: "4/4/0",
                mana: "0/0/0",
                strength: "0/0/0",
                agility: "7/7/0",
                defense: "5/5/0", // rock, weapon, arrow damage defense
                fire: "0/0/0",
                ice: "0/0/0",
                poison: "0/0/0",
                thunder: "0/0/0"
            },
            grants: ["gold10"]
        }
    },

    fireSteed: {
        name: 'fireSteed',
        gltf: 'fireSteed.glb',
        image: 'fireSteed.png',
        description: 'Mystical fire steed',
        type: 'friendly',
        attributes: {
            shouldAnimate: true,
            emissiveIntensity: 3,
            mountable: true,
            moves: true,
            animates: true,
            height: 40,
            length: 50,
            width: 20,
            elevation: 0,
            equippedScale: 30,
            scale: 30,
            stats: {
                health: "4/4/0",
                mana: "0/0/0",
                strength: "0/0/0",
                agility: "1/1/0",
                defense: "5/5/0", // rock, weapon, arrow damage defense
                fire: "10/10/0",
                ice: "0/0/0",
                poison: "0/0/0",
                thunder: "0/0/0"
            },
            grants: ["gold10"],
            sprites: [{ 
                name: 'firesteed',
                regex: "sconce",
                frames: 16,
                scale: 5,
                elevation: 1,
                flip: false,
                animates: true,
                showOnSeed: true
            }]
        }
    },

    cosmichorse: {
        name: 'cosmichorse',
        gltf: 'cosmichorse.glb',
        image: 'cosmichorse.png',
        description: 'Mystical steed',
        type: 'friendly',
        attributes: {
            shouldAnimate: true,
            mountable: true,
            moves: true,
            animates: true,
            height: 40,
            length: 50,
            width: 20,
            elevation: 0,
            equippedScale: 30,
            scale: 30,
            stats: {
                health: "4/4/0",
                mana: "0/0/0",
                strength: "0/0/0",
                agility: "1/1/0",
                defense: "5/5/0", // rock, weapon, arrow damage defense
                fire: "10/10/0",
                ice: "0/0/0",
                poison: "0/0/0",
                thunder: "0/0/0"
            },
            grants: ["gold10"],
        }
    },

    painthorse: {
        name: 'painthorse',
        gltf: 'painthorse.glb',
        image: 'painthorse.png',
        description: 'Mystical steed',
        type: 'friendly',
        attributes: {
            shouldAnimate: true,
            mountable: true,
            moves: true,
            animates: true,
            height: 40,
            length: 50,
            width: 20,
            elevation: 0,
            equippedScale: 30,
            scale: 30,
            stats: {
                health: "4/4/0",
                mana: "0/0/0",
                strength: "0/0/0",
                agility: "1/1/0",
                defense: "5/5/0", // rock, weapon, arrow damage defense
                fire: "10/10/0",
                ice: "0/0/0",
                poison: "0/0/0",
                thunder: "0/0/0"
            },
            grants: ["gold10"],
        }
    },

    whitehorse: {
        name: 'whitehorse',
        gltf: 'whitehorse.glb',
        image: 'whitehorse.png',
        description: 'Mystical steed',
        type: 'friendly',
        attributes: {
            shouldAnimate: true,
            mountable: true,
            moves: true,
            animates: true,
            height: 40,
            length: 50,
            width: 20,
            elevation: 0,
            equippedScale: 30,
            scale: 30,
            stats: {
                health: "4/4/0",
                mana: "0/0/0",
                strength: "0/0/0",
                agility: "1/1/0",
                defense: "5/5/0", // rock, weapon, arrow damage defense
                fire: "10/10/0",
                ice: "0/0/0",
                poison: "0/0/0",
                thunder: "0/0/0"
            },
            grants: ["gold10"],
        }
    },

    chestnuthorse: {
        name: 'chestnuthorse',
        gltf: 'chestnuthorse.glb',
        image: 'chestnuthorse.png',
        description: 'Mystical steed',
        type: 'friendly',
        attributes: {
            shouldAnimate: true,
            mountable: true,
            moves: true,
            animates: true,
            height: 40,
            length: 50,
            width: 20,
            elevation: 0,
            equippedScale: 30,
            scale: 30,
            stats: {
                health: "4/4/0",
                mana: "0/0/0",
                strength: "0/0/0",
                agility: "1/1/0",
                defense: "5/5/0", // rock, weapon, arrow damage defense
                fire: "10/10/0",
                ice: "0/0/0",
                poison: "0/0/0",
                thunder: "0/0/0"
            },
            grants: ["gold10"],
        }
    },

    blackhorse: {
        name: 'blackhorse',
        gltf: 'blackhorse.glb',
        image: 'blackhorse.png',
        description: 'Mystical steed',
        type: 'friendly',
        attributes: {
            shouldAnimate: true,
            mountable: true,
            moves: true,
            animates: true,
            height: 40,
            length: 50,
            width: 20,
            elevation: 0,
            equippedScale: 30,
            scale: 30,
            stats: {
                health: "4/4/0",
                mana: "0/0/0",
                strength: "0/0/0",
                agility: "1/1/0",
                defense: "5/5/0", // rock, weapon, arrow damage defense
                fire: "10/10/0",
                ice: "0/0/0",
                poison: "0/0/0",
                thunder: "0/0/0"
            },
            grants: ["gold10"],
        }
    },

    brownhorse: {
        name: 'brownhorse',
        gltf: 'brownhorse.glb',
        image: 'brownhorse.png',
        description: 'Mystical steed',
        type: 'friendly',
        attributes: {
            shouldAnimate: true,
            mountable: true,
            moves: true,
            animates: true,
            height: 40,
            length: 50,
            width: 20,
            elevation: 0,
            equippedScale: 30,
            scale: 30,
            stats: {
                health: "4/4/0",
                mana: "0/0/0",
                strength: "0/0/0",
                agility: "1/1/0",
                defense: "5/5/0", // rock, weapon, arrow damage defense
                fire: "10/10/0",
                ice: "0/0/0",
                poison: "0/0/0",
                thunder: "0/0/0"
            },
            grants: ["gold10"],
        }
    },

    chicken: {
        name: 'chicken',
        gltf: 'chicken.glb',
        image: 'chicken.png',
        description: 'Special chicken',
        type: 'friendly',
        attributes: {
            shouldAnimate: true,
            moves: true,
            animates: true,
            height: 40,
            length: 50,
            width: 20,
            elevation: 0,
            scale: 30,
            stats: {
                health: "4/4/0",
                mana: "0/0/0",
                strength: "0/0/0",
                agility: "1/1/0",
                defense: "5/5/0", // rock, weapon, arrow damage defense
                fire: "10/10/0",
                ice: "0/0/0",
                poison: "0/0/0",
                thunder: "0/0/0"
            },
            grants: ["gold10"],
        }
    },

    demonLord: {
        name: 'demonLord',
        gltf: 'demonLord.glb',
        description: 'A deadly demon Lord',
        type: 'beast',
        attributes: {
            moves: true,
            animates: true,
            height: 50,
            length: 80,
            width: 80,
            elevation: 0,
            scale: 20,
            stats: {
                health: "10/10/0",
                mana: "0/0/0",
                strength: "10/10/0",
                agility: "3/3/0",
                defense: "6/6/6", // rock, weapon, arrow damage defense
                fire: "6/6/6",
                ice: "0/0/0",
                poison: "6/6/6",
                thunder: "0/0/0"
            },
            grants: ["keyToChest2"],
            rangedSpell: 'fireProjectileSpell'
        }
    },
    john: {
        name: 'john',
        gltf: 'robot.glb',
        description: 'Another robot which seems different',
        type: 'friendly',
        inventory: [
            {itemName:"armor",quantity:1,price:"crystalBall/1"},
            {itemName:"bluepotion",quantity:1,price:"crystalBall/1"}
        ],
        attributes: {
            moves: true,
            animates: true,
            height: 30,
            dialogHeight: 30,
            length: 20,
            width: 20,
            elevation: 0,
            scale: 10,
            conversation: {
                conversationState: "intro",
                engagementState: 0,
                special: {
                    condition: ["crystalBall"],
                    speech: 'Ah, you have my crystal ball!  Please take what you will in exchange!',
                    action: "showWares",
                    jumpToState: "complete"
                },
                intro: {
                    speech: "Hello there, stranger.", 
                    responses: [convo.engage, convo.disengage]
                },
                engaged: [ // ordered to allow progression
                    {
                        speech: "These are terrible times here, so beware.  The place is overrun with horrors from the depths.", 
                        responses: [convo.engage, convo.disengage]
                    },
                    {
                        speech: "Yes, yes....  I'll tell you, the thieves running rampant have no regard for anyone or anything but themselves.  Recently they stole my crystal ball.", 
                        responses: [convo.empathize, convo.disengage]
                    },
                    {
                        speech: "Thank you for your concern, fellow man.  If you could find and return my crystal ball, I will reward your efforts.", 
                        responses: [convo.disengage, convo.wellwish],
                    }
                ],
                disengaged: {
                    speech: "Have a fine day, stranger.",
                    responses: [convo.engage, convo.disengage]
                },
                complete: {
                    speech: "Most esteemed greetings to you, my friend!",
                    responses: [convo.wellwish]
                }
            },
            stats: {
                health: "2/2/0",
                mana: "0/0/0",
                strength: "1/1/0",
                agility: "1/2/0",
                defense: "3/3/0", // rock, weapon, arrow damage defense
                fire: "0/0/0",
                ice: "0/0/0",
                poison: "0/0/0",
                thunder: "0/0/0"
            }
        }
    },

    joe: {
        name: 'joe',
        gltf: 'robot_blue.glb',
        description: 'Another robot which seems different',
        type: 'friendly',
        inventory: [
            {itemName:"armor",quantity:1,price:"crystalBall/1"},
            {itemName:"bluepotion",quantity:1,price:"crystalBall/1"}
        ],
        attributes: {
            moves: true,
            animates: true,
            height: 30,
            dialogHeight: 30,
            length: 20,
            width: 20,
            elevation: 0,
            scale: 10,
            conversation: {
                conversationState: "intro",
                engagementState: 0,
                special: {
                    condition: ["crystalBall"],
                    speech: 'Ah, you have my crystal ball!  Please take what you will in exchange!',
                    action: "showWares",
                    jumpToState: "complete"
                },
                intro: {
                    speech: "Hello there, stranger.", 
                    responses: [convo.engage, convo.disengage]
                },
                engaged: [ // ordered to allow progression
                    {
                        speech: "These are terrible times here, so beware.  The place is overrun with horrors from the depths.", 
                        responses: [convo.engage, convo.disengage]
                    },
                    {
                        speech: "Yes, yes....  I'll tell you, the thieves running rampant have no regard for anyone or anything but themselves.  Recently they stole my crystal ball.", 
                        responses: [convo.empathize, convo.disengage]
                    },
                    {
                        speech: "Thank you for your concern, fellow man.  If you could find and return my crystal ball, I will reward your efforts.", 
                        responses: [convo.disengage, convo.wellwish],
                    }
                ],
                disengaged: {
                    speech: "Have a fine day, stranger.",
                    responses: [convo.engage, convo.disengage]
                },
                complete: {
                    speech: "Most esteemed greetings to you, my friend!",
                    responses: [convo.wellwish]
                }
            },
            stats: {
                health: "2/2/0",
                mana: "0/0/0",
                strength: "1/1/0",
                agility: "1/2/0",
                defense: "3/3/0", // rock, weapon, arrow damage defense
                fire: "0/0/0",
                ice: "0/0/0",
                poison: "0/0/0",
                thunder: "0/0/0"
            }
        }
    },

    shopkeep: {
        name: 'shopkeep',
        gltf: 'shopkeep.glb',
        description: 'Robust shopkeeper',
        type: 'friendly',
        inventory: [
            {itemName:"armor",quantity:1,price:"gold/30,animalskin/1,aluminium/1"},
            {itemName:"bluepotion",quantity:3,price:"gold/10"},
            {itemName:"redpotion",quantity:3,price:"gold/10"}
        ],
        attributes: {
            moves: true,
            animates: true,
            height: 30,
            dialogHeight: 40,
            length: 20,
            width: 20,
            elevation: 0,
            scale: 25,
            goldValue: 1.1, // Slightly higher value of gold on exchanges
            conversation: {
                conversationState: "intro",
                engagementState: 0,
                special: {
                    condition: ["bagOfGems","gold"],
                    speech: 'Welcome to my shop, my friend.',
                    action: 'showWares'
                },
                intro: {
                    speech: "Hello there, stranger.  Come back when you have something to trade.", 
                    responses: [convo.wellwish]
                }
            },
            stats: {
                health: "2/2/0",
                mana: "0/0/0",
                strength: "1/1/0",
                agility: "1/2/0",
                defense: "3/3/0", // rock, weapon, arrow damage defense
                fire: "0/0/0",
                ice: "0/0/0",
                poison: "0/0/0",
                thunder: "0/0/0"
            }
        }
    },
    centurion: {
        name: 'centurion',
        gltf: 'soldier.glb',
        description: 'Robust Centurion',
        type: 'friendly',
        attributes: {
            moves: true,
            animates: true,
            height: 30,
            dialogHeight: 60,
            length: 20,
            width: 20,
            elevation: 0,
            scale: 45,
            rotateY: 180,
            conversation: {
                conversationState: "intro",
                engagementState: 0,
                challenge: {
                    condition: ["keyToKingdom"],
                    speech: 'Please provide the passphrase.',
                    challenge: 'shibboleth',
                    grants: 'keyToKingdom',
                    fail: 'That is not the pass.',
                    success: 'The pass is right.  Here is your key to operate the lever.'
                },
                intro: {
                    speech: "Hello there, fine sir.  Have a glorious day.", 
                    responses: [convo.wellwish]
                }
            },
            stats: {
                health: "7/7/7",
                mana: "0/0/0",
                strength: "7/7/7",
                agility: "0/0/0", // stands in place
                defense: "10/10/0", // rock, weapon, arrow damage defense
                fire: "2/2/0",
                ice: "2/2/0",
                poison: "2/2/0",
                thunder: "2/2/0"
            }
        }
    },
    blacksmith: {
        name: 'blacksmith',
        gltf: 'blacksmith.glb',
        description: 'Hearty blacksmith',
        type: 'friendly',
        inventory: [
            {itemName:"blackBlade",quantity:1,price:"gold/3,smallSword/1,aluminium/1"},
            {itemName:"blazingBlade",quantity:1,price:"gold/700"},
            {itemName:"natureBlade",quantity:1,price:"gold/900"},
            {itemName:"waterBlade",quantity:1,price:"gold/500"},
            {itemName:"axe",quantity:1,price:"gold/250"},
            {itemName:"blazingShield",quantity:1,price:"gold/300"},
            {itemName:"thunderShield",quantity:1,price:"gold/700"},
            {itemName:"waterShield",quantity:1,price:"gold/600"},
            {itemName:"supermanArmor",quantity:1,price:"gold/600"},
            {itemName:"legacyArmor",quantity:1,price:"gold/500"},
            {itemName:"chevyArmor",quantity:1,price:"gold/400"}
        ],
        attributes: {
            moves: true,
            animates: true,
            height: 20,
            dialogHeight: 60,
            length: 20,
            width: 20,
            elevation: 0,
            scale: 35,
            goldValue: 1.1, // Slightly higher value of gold on exchanges
            conversation: {
                conversationState: "intro",
                engagementState: 0,
                special: {
                    condition: ["bagOfGems","gold","aluminium","smallSword"],
                    speech: 'Welcome to my shop, my friend.',
                    action: 'showWares'
                },
                intro: {
                    speech: "Hello there, stranger.  Come back when you have something to trade.", 
                    responses: [convo.wellwish]
                }
            },
            cutScenes: {
                acceptDeal: "smithing.mkv"    
            },
            stats: {
                health: "2/2/0",
                mana: "0/0/0",
                strength: "1/1/0",
                agility: "0/0/0",
                defense: "5/5/0", // rock, weapon, arrow damage defense
                fire: "5/5/0",
                ice: "0/0/0",
                poison: "0/0/0",
                thunder: "5/5/0"
            }
        }
    },
    sunSeed: {
        name: 'sunSeed',
        gltf: '',
        image: 'sunSeed.png',
        description: 'Sun Tree Seed',
        type: 'friendly',
        subtype: 'tree',
        attributes: {
            moves: false,
            animates: false,
            plantable: true,
            throwable: true,
            throwableAttributes: {
                pitch: .7, // angle up (percentage of 90 degrees)
                weight: 4, // lbs
                distance: 700, // px
                speed: 1 // 1 = full walking speed
            },
            height: 30,
            dialogHeight: 60,
            length: 20,
            width: 20,
            elevation: 0,
            scale: 10,
            equippedScale: 0.01,
            stats: {
                health: "2/2/0",
                mana: "0/0/0",
                strength: "1/1/0",
                agility: "0/0/0", // stands in place
                defense: "0/0/0", // rock, weapon, arrow damage defense
                fire: "0/0/0",
                ice: "0/0/0",
                poison: "0/0/0",
                thunder: "0/0/0"
            },
            stage: 0,
            gltfs: ['sunSeed2.glb','sunTree1.glb','sunTree2.glb','sunTree3.glb','sunTree4.glb'],
            continuousSprites: true,
            sprites: [{ 
                name: "heal",
                regex: "",
                frames: 10,
                scale: 5,
                elevation: 10,
                flip: false,
                time: 2
            }]
        }
    },
}
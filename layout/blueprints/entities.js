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
                defense: "1/1/0"
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
                defense: "2/2/0"
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
                defense: "2/2/0"
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
                defense: "2/2/0"
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
                defense: "1/1/0"
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
                defense: "1/1/0"
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
                defense: "1/1/0"
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
                defense: "1/1/0"
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
                defense: "1/1/0"
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
            length: 40,
            width: 20,
            elevation: 0,
            scale: 60,
            stats: {
                health: "4/4/0",
                mana: "60/60/0",
                strength: "2/2/0",
                agility: "3/3/0",
                defense: "1/1/0"
            },
            grants: ["gold10"],
            rangedSpell: 'fireProjectileSpell'
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
            length: 40,
            width: 20,
            elevation: 0,
            scale: 50,
            stats: {
                health: "4/4/0",
                mana: "60/60/0",
                strength: "2/2/0",
                agility: "3/3/0",
                defense: "1/1/0"
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
                defense: "1/1/0"
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
                defense: "1/1/0"
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
                defense: "1/1/0"
            },
            handScaleFactor: 60,
            grants: ["gold10","axe2"]
        },
        // equipped: {"Middle2R":["axe2",false,null]}
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
                defense: "1/1/0"
            },
            grants: ["gold10"]
        },
    },
    ghoul: {
        name: 'ghoul',
        gltf: 'ghoul.glb',
        description: 'Menacing red lava ghoul',
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
                defense: "1/1/0"
            },
            grants: ["gold10"],
            rangedSpell: 'poisonProjectileSpell'
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
                defense: "1/1/0"
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
                defense: "1/1/0"
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
                defense: "1/1/0"
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
                defense: "1/1/0"
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
                defense: "1/1/0"
            },
            grants: ["gold10"],
            rangedSpell: 'poisonProjectileSpell'
        }
    },
    horse: {
        name: 'horse',
        gltf: 'horse.glb',
        description: 'Strong horse',
        type: 'friendly',
        attributes: {
            moves: true,
            animates: true,
            height: 30,
            length: 50,
            width: 20,
            elevation: -10,
            scale: .5,
            stats: {
                health: "4/4/0",
                mana: "0/0/0",
                strength: "0/0/0",
                agility: "7/7/0",
                defense: "1/1/0"
            },
            grants: ["gold10"]
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
                defense: "2/2/0"
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
                defense: "0/0/0"
            }
        }
    },
    elfgirl: {
        name: 'elfgirl',
        gltf: 'elfgirl.glb',
        description: 'Elvish girl',
        type: 'friendly',
        inventory: [
            {itemName:"armor",quantity:1,price:"crystalBall/1"},
            {itemName:"bluepotion",quantity:1,price:"crystalBall/1"}
        ],
        attributes: {
            moves: true,
            animates: true,
            height: 30,
            dialogHeight: 70,
            length: 20,
            width: 20,
            elevation: 0,
            scale: 30,
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
                defense: "0/0/0"
            }
        }
    },
    shopkeep: {
        name: 'shopkeep',
        gltf: 'shopkeep.glb',
        description: 'Robust shopkeeper',
        type: 'friendly',
        inventory: [
            {itemName:"armor",quantity:1,price:"gold/30"},
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
                defense: "0/0/0"
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
            rotateY: true,
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
                health: "2/2/0",
                mana: "0/0/0",
                strength: "1/1/0",
                agility: "0/0/0", // stands in place
                defense: "0/0/0"
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
                agility: "1/2/0",
                defense: "0/0/0"
            }
        }
    }
}
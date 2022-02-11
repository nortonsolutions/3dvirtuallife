import { Items } from './items.js'

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
    rosenBot: {
        name: 'rosenBot',
        gltf: 'robot2.glb',
        description: 'Flying tin can',
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
    spiderQueen: {
        name: 'spiderQueen',
        gltf: 'rat.glb',
        description: 'A deadly spider queen',
        type: 'beast',
        attributes: {
            moves: true,
            animates: true,
            height: 50,
            length: 80,
            width: 80,
            elevation: 0,
            scale: 100,
            stats: {
                health: "10/10/0",
                mana: "0/0/0",
                strength: "4/4/0",
                agility: "3/3/0",
                defense: "2/2/0"
            },
            grants: ["keyToChest2"]
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
                health: "2/2/0",
                mana: "0/0/0",
                strength: "1/1/0",
                agility: "1/2/0",
                defense: "0/0/0"
            }
        }
    }
}
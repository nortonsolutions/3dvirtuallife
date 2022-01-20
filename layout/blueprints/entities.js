import { Items } from './items.js'

let convo = {
    accept: { text: "Yes, I accept", type: "engage" },
    decline: { text: "No, thank you", type: "disengage" },
    engage: { text: "<Engage the conversation>", type: "engage" },
    disengage: { text: "<Disengage the conversation>", type: "disengage" },
    wellwish: { text: "Well wishes to you, my friend.", type: "neutral" },
    empathize: { text: "<Empathize and ask more>", type: "engage" }
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
                strength: "1/1/0",
                agility: "1/1/0",
                defense: "0/0/0"
            }
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
                health: "2/2/0",
                mana: "0/0/0",
                strength: "1/1/0",
                agility: "1/2/0",
                defense: "0/0/0"
            }
        }
    },
    john: {
        name: 'john',
        gltf: 'robot.glb',
        description: 'Another robot which seems different',
        type: 'friendly',
        inventory: [
            {itemName:"armor",quantity:1},
            {itemName:"bluepotion",quantity:1}
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
                        responses: [convo.disengage],
                        offers: [{
                            item: Items.armor,
                            price: Items.crystalBall
                        }]
                    }

                ],
                disengaged: {
                    speech: "Have a fine day, stranger.",
                    responses: [convo.engage, convo.disengage]
                },
                complete: {
                    speech: "Most esteemed greetings to you, ", // complete with hero name
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
export const Entities = {
    evilOne: {
        name: 'evilOne',
        gltf: 'robot.glb',
        description: 'An autonomous machine with no apparent motive',
        type: 'beast',
        attributes: {
            moves: true,
            animates: true,
            height: 30,
            length: 20,
            width: 20,
            elevation: 0,
            scale: 10,
            stats: {
                health: "2/2/0",
                mana: "0/0/0",
                strength: "1/1/0",
                agility: "1/1/0"
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
                agility: "1/2/0"
            }
        }
    },
    john: {
        name: 'john',
        gltf: 'boy.glb',
        description: 'Another robot which seems different',
        type: 'friendly',
        attributes: {
            moves: true,
            animates: true,
            height: 30,
            length: 20,
            width: 20,
            elevation: 0,
            scale: 20,
            conversation: [],
            offers: [],
            accepts: [],
            stats: {
                agility: "2/2/0"
            }
        }
    }
}
export const Entities = {
    evilOne: {
        name: 'evilOne',
        gltf: 'robot.glb',
        description: 'An autonomous machine with no apparent motive',
        type: 'beast',
        attributes: {
            moves: true,
            animates: true,
            height: 20,
            length: 20,
            width: 20,
            elevation: 0,
            scale: 10,
            stats: {
                health: "02/02",
                mana: "00/00",
                strength: "01/01",
                agility: "01/01"
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
            height: 20,
            length: 60,
            width: 20,
            elevation: 0,
            scale: 100,
            stats: {
                health: "02/02",
                mana: "00/00",
                strength: "01/01",
                agility: "01/01"
            }
        }
    },
    john: {
        name: 'john',
        gltf: 'robot.glb',
        description: 'Another robot which seems different',
        type: 'friendly',
        attributes: {
            moves: true,
            animates: true,
            height: 20,
            length: 20,
            width: 20,
            elevation: 0,
            scale: 10,
            conversation: [],
            offers: [],
            accepts: [],
            stats: {
                agility: "01/01"
            }
        }
    }
}
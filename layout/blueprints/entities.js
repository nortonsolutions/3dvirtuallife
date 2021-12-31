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
            elevation: 0,
            scale: 10,
            elevation: 0,
            strength: 0,
            agility: 1,
            wisdom: 0,
            life: 2
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
            elevation: 0,
            scale: 100,
            elevation: 0,
            strength: 0,
            agility: 1,
            wisdom: 0,
            life: 2
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
            elevation: 0,
            scale: 10,
            agility: 1,
            elevation: 0,
            conversation: [],
            offers: [],
            accepts: []
        }
    }
}
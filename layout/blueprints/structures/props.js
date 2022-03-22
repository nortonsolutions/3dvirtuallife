export const Props = {

    rock1: {
        name: 'rock1',
        gltf: 'rock1.gltf',
        description: 'Standard rock',
        type: 'structure',
        attributes: {
            animates: false,
            scale: 1,
            elevation: 0
        }
    },

    cart: {
        name: 'cart',
        gltf: 'cart.glb',
        description: 'Old Cart',
        type: 'structure',
        attributes: {
            animates: false,
            scale: 10,
            elevation: 0
        }
    },

    tree1: {
        name: 'tree1',
        gltf: 'tree.glb',
        description: 'Standard tree',
        type: 'structure',
        attributes: {
            animates: false,
            scale: 100,
            elevation: 0
        }
    },
    
    ancientChest: {
        name: 'ancientChest',
        gltf: 'chest.glb',
        description: 'An old but sturdy wooden chest',
        type: 'structure',
        attributes: {
            scale: 60,
            elevation: 0,
            animates: true,
            locked: true,
            position: "down"
        }
    },
}
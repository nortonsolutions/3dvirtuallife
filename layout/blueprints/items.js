export const Items = {
    keyToShed: {
        name: 'keyToShed',
        gltf: 'key.gltf',
        image: 'key.png',
        description: 'A rusty old key with faint engravings',
        type: 'item',
        attributes: {
            animates: false,
            scale: 100,
            elevation: 10
        }
    },
    keyToChest: {
        name: 'keyToChest',
        gltf: 'key.gltf',
        image: 'key.png',
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

            animates: false,
            scale: 100,
            elevation: 10
        }
    },
    smallSword: {
        name: 'smallSword',
        gltf: 'broadsword.glb',
        image: 'broadsword.png',
        description: 'A metallic blade, strong yet flexible',
        type: 'item',
        attributes: {
            equippable: ['handR', 'handL'],
            animates: false,
            scale: 100,
            elevation: 5
        } 
    },
    mace: {
        name: 'mace',
        gltf: 'mace.glb',
        image: 'mace.png',
        description: 'A metallic mace',
        type: 'item',
        attributes: {
            equippable: ['handR', 'handL'],
            animates: false,
            scale: 100,
            elevation: 0
        } 
    },
    crystalBall: {
        name: 'crystalBall',
        gltf: 'crystalBall.glb',
        image: 'crystalBall.png',
        description: 'A gleaming ball of crystal',
        type: 'item',
        attributes: {
            animates: false,
            scale: 40,
            elevation: 30
        }
    },



}
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
    bagOfGems: {
        name: 'bagOfGems',
        gltf: 'blueball.gltf',
        image: 'blueball.png',
        description: 'A small velvet bag full of gems',
        type: 'item',
        attributes: {

            animates: false,
            scale: .1,
            elevation: 0
        }
    },
    smallSword: {
        name: 'smallSword',
        gltf: 'broadsword.glb',
        image: 'broadsword.png',
        description: 'A metallic blade, strong yet flexible',
        type: 'item',
        attributes: {
            equippable: ['rHand', 'lHand'],
            animates: false,
            scale: 100,
            elevation: 5
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
            scale: 100,
            elevation: 30
        }
    },



}
export const Spells = {
    healSpell: {
        name: 'healSpell',
        gltf: 'redpotion.glb',
        image: 'healSpell.png',
        description: 'A spell to increase health',
        type: 'spell',
        attributes: {
            manaCost: 1,
            effect: "health/2",
            sprites: [{ 
                name: "Heal",
                regex: "",
                frames: 15,
                scale: 50,
                elevation: 30,
                flip: false,
                time: 1
            }]
        }
    },
    healAllSpell: {
        name: 'healAllSpell',
        gltf: 'redpotion.glb',
        image: 'healAllSpell.png',
        description: 'A spell to increase health of all surrounding friendlies',
        type: 'spell',
        attributes: {
            manaCost: 1,
            effect: "health/2",
            affectAllInParty: true,      
            range: 800,      
            sprites: [{ 
                name: "Heal",
                regex: "",
                frames: 15,
                scale: 50,
                elevation: 30,
                flip: false,
                time: 3
            }]
        }
    },
    poisonSpell: {
        name: 'poisonSpell',
        gltf: 'greenpotion.glb',
        image: 'poisonSpell.png',
        description: 'A spell to inflict poisonous damage',
        type: 'spell',
        attributes: {
            manaCost: 1,
            effect: "damage/3",
            range: 80,
            sprites: [{ 
                name: "greenExplosion",
                regex: "",
                frames: 10,
                scale: 300,
                elevation: 30,
                flip: false,
                time: 1
            }]
        }
    },
    poisonProjectileSpell: {
        name: 'poisonProjectileSpell',
        gltf: 'greenpotion.glb',
        image: 'poisonProjectileSpell.png',
        description: 'A projectile spell to inflict poisonous damage',
        type: 'spell',
        attributes: {
            manaCost: 1,
            effect: "damage/3",
            range: 80,
            animates: false,
            scale: .5,
            throwable: true,
            throwableAttributes: {
                pitch: .5, // angle up (percentage of 90 degrees)
                weight: .5, // lbs
                distance: 1200, // px
                speed: 3 // 1 = full walking speed
            },
            continuousSprites: true,
            sprites: [{ 
                name: "greenExplosion",
                regex: "",
                frames: 10,
                scale: 300,
                elevation: 20,
                flip: false,
                time: 1
            },
            { 
                name: "Heal",
                regex: "",
                frames: 15,
                scale: 50,
                elevation: 20,
                flip: false,
                time: 1
            }]
        }
    },
    fireProjectileSpell: {
        name: 'fireProjectileSpell',
        gltf: 'redpotion.glb',
        image: 'fireProjectileSpell.png',
        description: 'A projectile spell to inflict poisonous damage',
        type: 'spell',
        attributes: {
            manaCost: 1,
            effect: "damage/3",
            range: 80,
            animates: false,
            scale: .5,
            throwable: true,
            throwableAttributes: {
                pitch: .5, // angle up (percentage of 90 degrees)
                weight: .5, // lbs
                distance: 1200, // px
                speed: 3 // 1 = full walking speed
            },
            continuousSprites: true,
            sprites: [{ 
                name: "orangeExplosion",
                regex: "",
                frames: 10,
                scale: 300,
                elevation: 20,
                flip: false,
                time: 1
            },
            { 
                name: "Heal",
                regex: "",
                frames: 15,
                scale: 50,
                elevation: 20,
                flip: false,
                time: 1
            }]
        }
    },
    iceProjectileSpell: {
        name: 'iceProjectileSpell',
        gltf: 'bluepotion.glb',
        image: 'iceProjectileSpell.png',
        description: 'A projectile spell to inflict poisonous damage',
        type: 'spell',
        attributes: {
            manaCost: 1,
            effect: "damage/3",
            range: 80,
            animates: false,
            scale: .5,
            throwable: true,
            throwableAttributes: {
                pitch: .5, // angle up (percentage of 90 degrees)
                weight: .5, // lbs
                distance: 1200, // px
                speed: 3 // 1 = full walking speed
            },
            continuousSprites: true,
            sprites: [{ 
                name: "blueExplosion",
                regex: "",
                frames: 10,
                scale: 300,
                elevation: 20,
                flip: false,
                time: 1
            },
            { 
                name: "Heal",
                regex: "",
                frames: 15,
                scale: 50,
                elevation: 20,
                flip: false,
                time: 1
            }]
        }
    }
}